import {
  CourseStatus,
  type ApiResponse,
  type Course,
  type CourseStatusCount,
  type Instructor,
  type PublicStudent,
  type Student,
  type StudentPreview,
  type StudentUpdate,
} from "./types";

export function getFirst<T>(items: T[]): T | undefined {
  return items[0];
}

export function getById<T extends { id: number }>(items: T[], id: number): T | undefined {
  return items.find((item: T) => item.id === id);
}

