
import type { Student } from "../types/index";

// allCourses and allSubmissions are DELETED. They live in db.json now,
// and the app fetches them instead of importing them.
export const student: Student = {
  id: 1,
  name: "Juan dela Cruz",
  email: "juan@example.com",
  role: "student",
  enrolledCourseIds: [101],
};
