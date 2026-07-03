import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  View,
} from "react-native";

import CourseHeader from "../../components/CourseHeader";
import CoursePlayer from "../../components/CoursePlayer";
import LessonList, {
  Lesson,
} from "../../components/LessonList";
import ProgressCard from "../../components/ProgressCard";
import PurchaseCard from "../../components/PurchaseCard";

import { useAuth } from "../../context/AuthContext";

import { hasAccess } from "../../services/accessService";
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

export default function CourseDetail() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();

  const [access, setAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [courseCompleted, setCourseCompleted] = useState(false);

  // ✅ FIX: Optimized dependency loop prevention
  useEffect(() => {
    if (!id) return;

    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      if (user) {
        await saveRecentlyViewed(user.uid, id as string);
      }

      const purchased = await hasAccess(id as string);
      setAccess(purchased);

      const data = await getLessons(id as string);
      setLessons(data);

      // ✅ FIX: Strict length verification for safer evaluation
      if (data.length > 0) {
        let lessonToOpen: Lesson | null = data.length ? data[0] : null;

        if (user) {
          const recent = await getContinueLearning(user.uid, id as string);

          if (recent) {
            const found = data.find(
              (lesson) => lesson.id === recent.lessonId
            );

            if (found) {
              lessonToOpen = found;
            } else {
              lessonToOpen = data.length ? data[0] : null;
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

  const buyCourse = async () => {
    try {
      await payForCourse(499, id as string, "teacher_123");
      Alert.alert("Success", "Course Purchased Successfully!");
      setAccess(true);
    } catch (e) {
      console.log(e);
      Alert.alert("Payment Failed", "Unable to complete payment.");
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
      const updated = await completeLesson(user.uid, id as string, lessonId);

      const safeUpdated = updated || [];

      setCompletedLessons(safeUpdated);

      const percent = progressPercent(
        safeUpdated.length,
        lessons.length || 0
      );

      setProgress(percent);

      setCourseCompleted(
        lessons.length > 0 &&
        safeUpdated.length === lessons.length
      );
    } catch (e) {
      console.log(e);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0B1220",
        }}
      >
        <Text style={{ color: "white", fontSize: 18 }}>
          Loading Course...
        </Text>
      </View>
    );
  }

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
      style={{ flex: 1, backgroundColor: "#0B1220" }}
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
    >
      <CourseHeader
        title="🎓 Course Lessons"
        description="Continue learning where you left off."
      />

      <ProgressCard
        progress={progress}
        courseCompleted={courseCompleted}
      />

      {selectedLesson && (
        <>
          <CoursePlayer
            title={selectedLesson.title}
            description={selectedLesson.description}
            videoUrl={selectedLesson.videoUrl}
            pdfUrl={selectedLesson.pdfUrl}
          />

          <Text
            style={{
              color: "white",
              fontSize: 22,
              fontWeight: "bold",
              marginBottom: 15,
            }}
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
    </ScrollView>
  );
}
