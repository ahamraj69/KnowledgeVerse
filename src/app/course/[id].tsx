import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import BookmarkButton from "../../components/BookmarkButton";
import CourseHeader from "../../components/CourseHeader";
import CoursePlayer from "../../components/CoursePlayer";
import DownloadButton from "../../components/DownloadButton";
import LessonList, {
  Lesson,
} from "../../components/LessonList";
import ProgressCard from "../../components/ProgressCard";
import PurchaseCard from "../../components/PurchaseCard";
import QuizCard from "../../components/QuizCard";

import { useAuth } from "../../context/AuthContext";
import { useLoading } from "../../context/LoadingContext";

import { hasAccess } from "../../services/accessService";
import {
  generateCertificate,
  getCertificate,
} from "../../services/certificateService";
import {
  getContinueLearning,
  saveContinueLearning,
} from "../../services/continueLearningService";
import {
  getLessons,
} from "../../services/lessonService";
import {
  completeLesson,
  getProgress,
  progressPercent,
} from "../../services/progressService";
import {
  payForCourse,
} from "../../services/razorpayService";
import {
  saveRecentlyViewed,
} from "../../services/recentlyViewedService";
import {
  addToWishlist,
} from "../../services/wishlistService";

import { Colors } from "../../theme/colors";
import { Theme } from "../../theme/theme";

export default function CourseDetail() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  
  const { setLoading } = useLoading();

  const [access, setAccess] = useState(false);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [courseCompleted, setCourseCompleted] = useState(false);

  // ✅ Optimised dependency loop prevention
  useEffect(() => {
    if (!id) return;

    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      
      if (user) {
        await saveRecentlyViewed(user.uid, id as string);
      }

      const purchased = await hasAccess(id as string);
      setAccess(purchased);

      const data = await getLessons(id as string);
      setLessons(data);

      // ✅ Fix 1: Exact index targeting to avoid array-to-object type assignment errors
      if (data.length > 0) {
        let lessonToOpen: Lesson | null = data.length > 0 ? data[0] : null;

        if (user) {
          const recent = await getContinueLearning(user.uid, id as string);

          if (recent) {
            const found = data.find(
              (lesson) => lesson.id === recent.lessonId
            );

            if (found) {
              lessonToOpen = found;
            } else {
              // ✅ Fix 2: Explicit element assignment fallback match
              lessonToOpen = data.length > 0 ? data[0] : null;
            }
          }
        }

        setSelectedLesson(lessonToOpen);
      } else {
        setSelectedLesson(null);
      }

      if (user) {
        const saved = await getProgress(user.uid, id as string);

        setCompletedLessons(saved?.completedLessons || []);

        const totalLessons = data.length || 0;

        const percent = progressPercent(
          saved?.completedLessons?.length || 0,
          totalLessons
        );

        setProgress(percent);

        setCourseCompleted(
          totalLessons > 0 &&
          (saved?.completedLessons?.length || 0) === totalLessons
        );
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const openLesson = async (lesson: Lesson) => {
    setSelectedLesson(lesson);

    if (!user) return;

    try {
      await saveContinueLearning(user.uid, id as string, lesson.id);
    } catch (e) {
      console.log(e);
    }
  };

  const openNotes = () => {
    if (!selectedLesson) return;

    router.push({
      pathname: "/notes/[lessonId]",
      params: {
        lessonId: selectedLesson.id,
      },
    });
  };

  const startQuiz = (lessonId: string) => {
    router.push(`/quiz/${lessonId}`);
  };

  const openAssignments = () => {
    router.push(`/assignment/${id}`);
  };

  const buyCourse = async () => {
    try {
      setLoading(true);
      await payForCourse(499, id as string, "teacher_123");
      Alert.alert("Success", "Course Purchased Successfully!");
      setAccess(true);
    } catch (e) {
      console.log(e);
      Alert.alert("Payment Failed", "Unable to complete payment.");
    } finally {
      setLoading(false);
    }
  };

  const wishlist = async () => {
    try {
      await addToWishlist(id as string);
      Alert.alert("Wishlist", "Course added successfully ❤️");
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Could not add course.");
    }
  };

  const markCompleted = async (lessonId: string) => {
    if (!user) return;

    try {
      setLoading(true);
      
      // ✅ Fix 3: Solved completeLesson return void by fetching fresh progress values downstream (TS1345)
      await completeLesson(
        user.uid,
        id as string,
        lessonId
      );

      const saved = await getProgress(
        user.uid,
        id as string
      );

      const safeUpdated = saved?.completedLessons ?? [];

      setCompletedLessons(safeUpdated);

      const percent = progressPercent(
        safeUpdated.length,
        lessons.length || 0
      );

      setProgress(percent);

      const completed =
        lessons.length > 0 &&
        safeUpdated.length === lessons.length;

      setCourseCompleted(completed);

      // ✅ Automatically generate certificate
      if (completed) {
        const existing = await getCertificate(
          user.uid,
          id as string
        );

        if (!existing) {
          await generateCertificate(
            user.uid,
            id as string,
            user.displayName || "Student",
            "KnowledgeVerse Course"
          );

          Alert.alert(
            "🎉 Congratulations!",
            "Your course certificate has been generated."
          );
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  if (!access) {
    return (
      <PurchaseCard
        price={499}
        onWishlist={wishlist}
        onBuy={buyCourse}
      />
    );
  }

  return (
    <ScrollView
      style={Theme.screen} 
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
    >
      <CourseHeader
        title="🎓 Course Lessons"
        description="Continue learning where you left off."
      />

      {/* ✅ Fix 4: Remapped parameters to perfectly fit your upgraded unified ProgressCard contract */}
      <ProgressCard
        title="📉 Course Progress"
        value={progress}
        subtitle={courseCompleted ? "🎉 Course Completed!" : `${progress}% Completed`}
        color={Colors.primary}
      />

      {selectedLesson && (
        <>
          <View style={{ marginBottom: 10 }}>
            <CoursePlayer
              title={selectedLesson.title}
              description={selectedLesson.description}
              videoUrl={selectedLesson.videoUrl}
              pdfUrl={selectedLesson.pdfUrl}
            />

            <BookmarkButton
              courseId={id as string}
              lessonId={selectedLesson.id}
              lessonTitle={selectedLesson.title}
            />

            <DownloadButton
              courseId={id as string}
              lessonId={selectedLesson.id}
              lessonTitle={selectedLesson.title}
              videoUrl={selectedLesson.videoUrl}
            />
          </View>

          <QuizCard
            lessonId={selectedLesson.id}
            onStart={startQuiz}
          />

          <TouchableOpacity
            onPress={openNotes}
            style={{
              backgroundColor: Colors.primary, 
              paddingVertical: 14,
              borderRadius: 12,
              marginTop: 15,
              marginBottom: 20,
              alignItems: "center",
            }}
          >
            <Text
              style={[
                Theme.text, 
                {
                  fontWeight: "bold",
                  fontSize: 17,
                },
              ]}
            >
              📝 Open Lesson Notes
            </Text>
          </TouchableOpacity>

          <Text
            style={[
              Theme.text, 
              {
                fontSize: 22,
                fontWeight: "bold",
                marginBottom: 15,
              },
            ]}
          >
            Lessons
          </Text>
        </>
      )}

      <LessonList
        lessons={lessons}
        selectedLesson={selectedLesson}
        completedLessons={completedLessons}
        onSelectLesson={openLesson}
        onCompleteLesson={markCompleted}
      />

      <TouchableOpacity
        onPress={openAssignments}
        style={{
          backgroundColor: Colors.success, 
          paddingVertical: 14,
          borderRadius: 12,
          marginTop: 25,
          alignItems: "center",
        }}
      >
        <Text
          style={[
            Theme.text, 
            {
              fontWeight: "bold",
              fontSize: 16,
            },
          ]}
        >
          📝 View Assignments
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
