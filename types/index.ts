export type UserRole = "student" | "instructor" | "admin";

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
  title: string;
  credits: number;
  instructorId: number;
  status: CourseStatus;
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
