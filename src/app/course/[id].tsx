import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
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
import ReviewCard from "../../components/ReviewCard";

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
  addReview,
  getAverageRating,
  getCourseReviews,
  Review,
} from "../../services/reviewService";
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

  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [averageRating, setAverageRating] = useState(0);

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

      if (data.length > 0) {
        let lessonToOpen: Lesson | null = data[0];

        if (user) {
          const recent = await getContinueLearning(user.uid, id as string);

          if (recent) {
            const found = data.find(
              (lesson) => lesson.id === recent.lessonId
            );

            if (found) {
              lessonToOpen = found;
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

      const reviewData = await getCourseReviews(id as string);
      setReviews(reviewData);
      setAverageRating(getAverageRating(reviewData));

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

  const submitReview = async () => {
    if (!user) return;

    if (!reviewText.trim()) {
      Alert.alert(
        "Review Required",
        "Please write a review."
      );
      return;
    }

    try {
      setLoading(true);
      await addReview({
        courseId: id as string,
        userId: user.uid,
        userName: user.displayName || "Student",
        rating,
        review: reviewText.trim(),
      });

      Alert.alert("Success", "Review submitted.");
      setReviewText("");
      await loadCourse();
    } catch (error) {
      console.log(error);
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
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 17 }}>
              📝 Open Lesson Notes
            </Text>
          </TouchableOpacity>
        </>
      )}

      <Text
        style={[
          Theme.text, 
          {
            fontSize: 22,
            fontWeight: "bold",
            marginBottom: 15,
            marginTop: 10,
          },
        ]}
      >
        Lessons
      </Text>

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
          marginBottom: 10,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          📄 View Assignments
        </Text>
      </TouchableOpacity>

      {/* Ratings & Reviews */}
      <View
        style={{
          marginTop: 30,
          backgroundColor: "#111827",
          borderRadius: 15,
          padding: 18,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 22,
            fontWeight: "bold",
            marginBottom: 20,
          }}
        >
          ⭐ Ratings & Reviews
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
            >
              <Text
                style={{
                  fontSize: 34,
                  color: star <= rating ? "#FACC15" : "#6B7280",
                }}
              >
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          value={reviewText}
          onChangeText={setReviewText}
          placeholder="Write your review..."
          placeholderTextColor="#9CA3AF"
          multiline
          style={{
            backgroundColor: "#1F2937",
            color: "white",
            borderRadius: 10,
            padding: 14,
            minHeight: 110,
            textAlignVertical: "top",
          }}
        />

        <TouchableOpacity
          onPress={submitReview}
          style={{
            marginTop: 18,
            backgroundColor: "#2563EB",
            padding: 14,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
            }}
          >
            Submit Review
          </Text>
        </TouchableOpacity>

        <View style={{ marginTop: 25 }}>
          {reviews.length === 0 ? (
            <Text
              style={{
                color: "#9CA3AF",
                textAlign: "center",
              }}
            >
              No reviews yet.
            </Text>
          ) : (
            reviews.map((item) => (
              <ReviewCard
                key={item.id || Math.random().toString()}
                review={item}
              />
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}