import type { Course, Instructor } from "../types";

interface CourseCardProps {
  course: Course;
  instructor?: Instructor;
}

function CourseCard({ course, instructor }: CourseCardProps) {
  return (
    <article className="card">
      <p className="label">Course</p>
      <h2>{course.title}</h2>
      <p>{course.credits} credits</p>
      <p>Instructor: {instructor?.name ?? "TBA"}</p>
      <p>Status: {course.status}</p>
    </article>
  );
}

export default CourseCard;
