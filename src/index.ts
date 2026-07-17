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
} from "../types";

export function getFirst<T>(items: T[]): T | undefined {
  return items[0];
}

export function getById<T extends { id: number }>(items: T[], id: number): T | undefined {
  return items.find((item: T) => item.id === id);
}

export function runApp(): void {
  const projectName: string = "ITELECT4 Course Enrollment Tracker";
  const currentYear: number = 2026;
  const isFullStack: boolean = true;
  const programType: string = isFullStack ? "Full Stack" : "Frontend";
  const noStudent: null = null;
  const unassigned: undefined = undefined;

  const instructors: Instructor[] = [
    {
      id: 1,
      name: "Aileen Cruz",
      email: "aileen.cruz@itelect.edu",
      department: "Computer Science",
      role: "instructor",
    },
    {
      id: 2,
      name: "Bren Tan",
      email: "bren.tan@itelect.edu",
      department: "Information Technology",
      role: "instructor",
    },
    {
      id: 3,
      name: "Clara Reyes",
      email: "clara.reyes@itelect.edu",
      department: "Network Systems",
      role: "admin",
    },
  ];

  const courses: Course[] = [
    {
      id: 101,
      title: "TypeScript Basics",
      credits: 3,
      instructorId: 1,
      status: CourseStatus.Open,
    },
    {
      id: 102,
      title: "Web Development",
      credits: 4,
      instructorId: 2,
      status: CourseStatus.InProgress,
    },
    {
      id: 103,
      title: "Network Fundamentals",
      credits: 3,
      instructorId: 3,
      status: CourseStatus.Planned,
    },
  ];

  const students: Student[] = [
    {
      id: 201,
      name: "Jamie Santos",
      email: "jamie.santos@student.itelect.edu",
      enrolledCourseIds: [101, 102],
      role: "student",
    },
    {
      id: 202,
      name: "Mika Ramos",
      email: "mika.ramos@student.itelect.edu",
      enrolledCourseIds: [101, 103],
      role: "student",
    },
  ];

  const studentPatch: StudentUpdate = { name: "Jamie S. Santos" };
  const studentPreview: StudentPreview = { id: 201, name: "Jamie Santos", role: "student" };
  const publicStudent: PublicStudent = {
    id: 201,
    name: "Jamie Santos",
    enrolledCourseIds: [101, 102],
    role: "student",
  };
  const courseStatusCount: CourseStatusCount = {
    [CourseStatus.Planned]: 1,
    [CourseStatus.Open]: 1,
    [CourseStatus.InProgress]: 1,
    [CourseStatus.Completed]: 0,
  };

  function getCourseInstructor(course: Course, allInstructors: Instructor[]): Instructor | null {
    const instructor: Instructor | undefined = getById<Instructor>(allInstructors, course.instructorId);
    return instructor === undefined ? null : instructor;
  }

  function getStudentCourses(student: Student, allCourses: Course[]): Course[] {
    return allCourses.filter((course: Course) => student.enrolledCourseIds.includes(course.id));
  }

  function summarizeStudent(student: Student, allCourses: Course[], allInstructors: Instructor[]): string {
    const enrolledCourses: Course[] = getStudentCourses(student, allCourses);
    const enrolledCourseTitles: string = enrolledCourses.map((course: Course) => course.title).join(", ");
    const instructorNames: string = enrolledCourses
      .map((course: Course) => getCourseInstructor(course, allInstructors)?.name ?? "TBA")
      .join(", ");
    const totalCredits: number = enrolledCourses.reduce((sum: number, course: Course) => sum + course.credits, 0);

    return `Student ${student.name} is enrolled in ${enrolledCourses.length} courses (${enrolledCourseTitles}) with ${instructorNames} for a total of ${totalCredits} credits.`;
  }

  function courseDetails(course: Course, allInstructors: Instructor[]): string {
    const instructor: Instructor | null = getCourseInstructor(course, allInstructors);
    const instructorName: string = instructor ? instructor.name : "TBA";
    return `${course.title} (${course.credits} credits) - Instructor: ${instructorName} - Status: ${course.status}`;
  }

  function makeCourseResponse(courseList: Course[]): ApiResponse<Course[]> {
    return {
      success: true,
      data: courseList,
      message: "Courses loaded successfully.",
    };
  }

  type CourseResponse = ReturnType<typeof makeCourseResponse>;
  const courseResponse: CourseResponse = makeCourseResponse(courses);
  const firstStudent: Student | undefined = getFirst<Student>(students);
  const foundCourse: Course | undefined = getById<Course>(courses, 102);

  function logMessage(message: string): void {
    console.log(message);
  }

  logMessage(`Project: ${projectName}`);
  logMessage(`Year: ${currentYear}`);
  logMessage(`Program Type: ${programType}`);
  logMessage(`No student example: ${noStudent}`);
  logMessage(`Unassigned value: ${unassigned}`);
  logMessage(`First student from generic getFirst: ${firstStudent?.name ?? "None"}`);
  logMessage(`Found course from generic getById: ${foundCourse?.title ?? "None"}`);
  logMessage(`Student update payload: ${JSON.stringify(studentPatch)}`);
  logMessage(`Student preview: ${JSON.stringify(studentPreview)}`);
  logMessage(`Public student profile: ${JSON.stringify(publicStudent)}`);
  logMessage(`Course status counts: ${JSON.stringify(courseStatusCount)}`);
  logMessage(courseResponse.message ?? "No response message.");

  students.forEach((student: Student) => {
    logMessage(summarizeStudent(student, courses, instructors));
  });

  courses.forEach((course: Course) => {
    logMessage(courseDetails(course, instructors));
  });
}

runApp();
