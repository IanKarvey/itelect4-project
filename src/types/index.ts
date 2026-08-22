export type UserRole = "student" | "instructor" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

export enum CourseStatus {
  Planned = "planned",
  Open = "open",
  InProgress = "in-progress",
  Completed = "completed",
}

export interface Instructor {
  id: number;
  name: string;
  email: string;
  department: string;
  role: UserRole;
}

export interface Course {
  id: number;
  code: string;
  title: string;
  units?: number;
  credits: number;
  semester?: string;
  status: CourseStatus;
  instructorId?: number;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  enrolledCourseIds: number[];
  role: UserRole;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export type StudentUpdate = Partial<Student>;
export type StudentPreview = Pick<Student, "id" | "name" | "role">;
export type PublicStudent = Omit<Student, "email">;
export type CourseStatusCount = Record<CourseStatus, number>;

export interface Submission {
  id: number;
  studentId: number;
  courseCode: string;
  repoUrl: string;
  submittedAt: Date;
  score?: number;
}

// json-server ids are strings, and JSON has no Date -- both types below
// are DERIVED from Submission, so Submission stays the single source of truth.
export type ApiSubmission = Omit<Submission, "id" | "submittedAt"> & {
  id: string;
  submittedAt: string;
};

// What we SEND when creating one. No id yet -- the server makes it.
export type NewSubmission = Omit<ApiSubmission, "id">;
