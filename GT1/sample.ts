// sample.ts -- converted from provided JS for GT1 Part 1

export interface User {
  id: number;
  name: string;
  email: string;
  role: "student" | "instructor" | "admin";
  isActive: boolean;
  score: number;
}

export function getUser(id: number): User {
  const user: User = {
    id: id,
    name: "Juan dela Cruz",
    email: "juan@example.com",
    role: "student",
    isActive: true,
    score: 95.5,
  };

  return user;
}

export function calculateGrade(score: number, maxScore: number): string {
  const percentage: number = (score / maxScore) * 100;

  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B";
  if (percentage >= 70) return "C";
  return "F";
}

export function formatCourse(name: string, units: number, semester: string): string {
  return `${name} (${units} units) - ${semester}`;
}

const user: User = getUser(1);
console.log(user);
console.log(calculateGrade(85, 100));
console.log(formatCourse("IT Elective 4", 3, "1st Semester"));
