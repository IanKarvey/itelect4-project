import { Course, Instructor, Student } from "../types";

const projectName: string = "itelect4-project";
const currentYear: number = 2026;
const isFullStack: boolean = true;
const programType: string = isFullStack ? "Full Stack" : "Frontend";
const noStudent: null = null;
const unassigned: undefined = undefined;

const instructors: Instructor[] = [
  { id: 1, name: "Aileen Cruz", email: "aileen.cruz@itelect.edu", department: "Computer Science" },
  { id: 2, name: "Bren Tan", email: "bren.tan@itelect.edu", department: "Information Technology" },
  { id: 3, name: "Clara Reyes", email: "clara.reyes@itelect.edu", department: "Network Systems" }
];

const courses: Course[] = [
  { id: 101, title: "TypeScript Basics", credits: 3, instructorId: 1 },
  { id: 102, title: "Web Development", credits: 4, instructorId: 2 },
  { id: 103, title: "Network Fundamentals", credits: 3, instructorId: 3 }
];

const students: Student[] = [
  { id: 201, name: "Jamie Santos", email: "jamie.santos@student.itelect.edu", enrolledCourseIds: [101, 102] },
  { id: 202, name: "Mika Ramos", email: "mika.ramos@student.itelect.edu", enrolledCourseIds: [101, 103] }
];

function getCourseInstructor(course: Course, allInstructors: Instructor[]): Instructor | null {
  const instructor: Instructor | undefined = allInstructors.find((item: Instructor) => item.id === course.instructorId);
  return instructor === undefined ? null : instructor;
}

function getStudentCourses(student: Student, allCourses: Course[]): Course[] {
  return allCourses.filter((course: Course) => student.enrolledCourseIds.includes(course.id));
}

function summarizeStudent(student: Student, allCourses: Course[], allInstructors: Instructor[]): string {
  const enrolledCourses: Course[] = getStudentCourses(student, allCourses);
  const enrolledCourseTitles: string = enrolledCourses.map((course: Course) => course.title).join(", ");
  const totalCredits: number = enrolledCourses.reduce((sum: number, course: Course) => sum + course.credits, 0);

  return `Student ${student.name} is enrolled in ${enrolledCourses.length} courses (${enrolledCourseTitles}) for a total of ${totalCredits} credits.`;
}

function courseDetails(course: Course, allInstructors: Instructor[]): string {
  const instructor: Instructor | null = getCourseInstructor(course, allInstructors);
  const instructorName: string = instructor ? instructor.name : "TBA";
  return `${course.title} (${course.credits} credits) - Instructor: ${instructorName}`;
}

function logMessage(message: string): void {
  console.log(message);
}

logMessage(`Project: ${projectName}`);
logMessage(`Year: ${currentYear}`);
logMessage(`Program Type: ${programType}`);
logMessage(`No student example: ${noStudent}`);
logMessage(`Unassigned value: ${unassigned}`);

students.forEach((student: Student) => {
  logMessage(summarizeStudent(student, courses, instructors));
});

courses.forEach((course: Course) => {
  logMessage(courseDetails(course, instructors));
});
