import type { Course, Instructor } from "../types";

interface CourseCardProps {
  course: Course;
  instructor?: Instructor;
  variant?: "default" | "compact";
}

function CourseCard({ course, instructor, variant = "default" }: CourseCardProps) {
  const isCompact = variant === "compact";

  return (
    <article className={`rounded-lg border border-gray-200 bg-white shadow-sm
      dark:bg-gray-800 dark:border-gray-700 ${isCompact ? "p-3" : "p-5"}`}>
      <h2 className={`font-bold text-gray-900 dark:text-white
        ${isCompact ? "text-sm" : "text-lg"}`}>
        {course.title}
      </h2>
      {!isCompact && (
        <p className="text-gray-600 dark:text-gray-300">{course.credits} credits</p>
      )}
      <p className="text-sm text-gray-500 dark:text-gray-400">Instructor: {instructor?.name ?? "TBA"}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">Status: {course.status}</p>
    </article>
  );
}

export default CourseCard;
