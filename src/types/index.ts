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

// Ids are strings (MongoDB sends 24 hex characters) and JSON has no Date.
// These types are DERIVED from Submission, so Submission stays the single
// source of truth.
export type ApiSubmission = Omit<
  Submission,
  "id" | "studentId" | "submittedAt"
> & {
  id: string;          // from MongoDB's _id
  studentId: string;   // the owner's _id
  submittedAt: string; // an ISO string, never a Date object
};

// What we SEND when creating one. The server fills in studentId from the
// token and submittedAt from the schema default, so these two fields are
// the whole request body (same Pick as the backend's NewSubmissionBody).
export type NewSubmission = Pick<Submission, "courseCode" | "repoUrl">;

// What /api/auth/register sends back, and what sits inside the login reply.
export type ApiUser = Omit<User, "id"> & {
  id: string;
};

// What /api/auth/login sends back. The token goes in the Authorization
// header on every request after this one.
export interface AuthReply {
  token: string;
  user: ApiUser;
}

// What POST /api/ai sends back. The backend's Review type comes from a
// Zod schema in src/schemas/review.ts, and this has to say the same
// thing. Nothing checks that they agree -- you do.
export interface AiReview {
  summary: string;
  strengths: string[];
  improvements: string[];
  readiness: "ready" | "almost" | "not-yet";
}
