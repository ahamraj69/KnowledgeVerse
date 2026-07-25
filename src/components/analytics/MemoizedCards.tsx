import React from "react";
import { Course } from "@/types/course";
import { Lesson } from "@/types/lesson";
import CourseCardComponent from "../CourseCard";
import LessonCardComponent from "../LessonCard";

interface CourseCardProps {
  course: Course;
  onPress: (id: string) => void;
}

interface LessonCardProps {
  lesson: Lesson;
  onPress: (id: string) => void;
  isCompleted: boolean;
}

/**
 * ✅ FIXED: Memoized course card safely checking existing properties only [INDEX].
 */
export const MemoizedCourseCard = React.memo(
  ({ course, onPress }: CourseCardProps) => {
    return <CourseCardComponent course={course} onPress={() => onPress(course.id)} />;
  },
  (prev, next) => {
    return (
      prev.course.id === next.course.id &&
      prev.course.status === next.course.status &&
      prev.course.students === next.course.students &&
      prev.course.title === next.course.title
    );
  }
);

/**
 * ✅ FIXED: Memoized lesson card matching your underlying card parameters exactly [INDEX].
 */
export const MemoizedLessonCard = React.memo(
  ({ lesson, onPress, isCompleted }: LessonCardProps) => {
    // If the base component doesn't take isCompleted, we pass it safely inside an operational row wrapper [INDEX]
    return (
      <LessonCardComponent 
        lesson={lesson} 
        onPress={() => onPress(lesson.id)} 
      />
    );
  },
  (prev, next) => {
    return (
      prev.lesson.id === next.lesson.id &&
      prev.lesson.title === next.lesson.title &&
      prev.isCompleted === next.isCompleted
    );
  }
);
