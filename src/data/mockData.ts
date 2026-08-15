
import type { Student, Course, Submission } from "../types/index";
import { CourseStatus } from "../types/index";

export const student: Student = {
  id: 1,
  name: "Juan dela Cruz",
  email: "juan@example.com",
  role: "student",
  enrolledCourseIds: [101],
};

export const allCourses: Course[] = [
  { id: 101, code: "ITELECT4", title: "IT Elective 4", units: 3, credits: 3, semester: "1st Semester 2026-2027", status: CourseStatus.Open },
  { id: 102, code: "ITELECT3", title: "IT Elective 3", units: 3, credits: 3, semester: "2nd Semester 2025-2026", status: CourseStatus.Open },
  { id: 103, code: "CSSWENG", title: "Software Engineering", units: 3, credits: 3, semester: "1st Semester 2026-2027", status: CourseStatus.Open },
];

export const allSubmissions: Submission[] = [
  { id: 1, studentId: 1, courseCode: "ITELECT4", repoUrl: "https://github.com/juan/itelect4-project", submittedAt: new Date(), score: 95 },
  { id: 2, studentId: 1, courseCode: "ITELECT3", repoUrl: "https://github.com/juan/itelect3-final", submittedAt: new Date() },
];
