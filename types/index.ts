export interface Instructor {
  id: number;
  name: string;
  email: string;
  department: string;
}

export interface Course {
  id: number;
  title: string;
  credits: number;
  instructorId: number;
}

export interface Student {
  id: number;
  name: string;
  email: string;
  enrolledCourseIds: number[];
}
