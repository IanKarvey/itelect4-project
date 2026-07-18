import CourseCard from "./components/CourseCard";
import StatusSummary from "./components/StatusSummary";
import StudentCard from "./components/StudentCard";
import { CourseStatus, type Course, type CourseStatusCount, type Instructor, type Student } from "./types";

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
    enrolledCourseIds: [101],
    role: "student",
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
    instructorId: 2,
    status: CourseStatus.Planned,
  },
];

const statusCount: CourseStatusCount = {
  [CourseStatus.Planned]: 1,
  [CourseStatus.Open]: 1,
  [CourseStatus.InProgress]: 1,
  [CourseStatus.Completed]: 0,
};

function App() {
  const handleSelectStudent = (student: Student): void => {
    console.log("Selected student:", student.name);
  };

  return (
    <main className="app-shell">
      <header className="page-header">
        <p>GT2 Part 1</p>
        <h1>Course Enrollment Tracker</h1>
      </header>

      <section className="section-block">
        <h2>Students</h2>
        <div className="card-grid">
          {students.map((student: Student) => (
            <StudentCard key={student.id} student={student} onSelect={handleSelectStudent} />
          ))}
        </div>
      </section>

      <section className="section-block">
        <h2>Courses</h2>
        <div className="card-grid">
          {courses.map((course: Course) => (
            <CourseCard
              key={course.id}
              course={course}
              instructor={instructors.find((instructor: Instructor) => instructor.id === course.instructorId)}
            />
          ))}
        </div>
      </section>

      <StatusSummary title="Course Status Count" counts={statusCount}>
        <p className="summary-note">This uses the GT1 enum and Record utility type.</p>
      </StatusSummary>
    </main>
  );
}

export default App;
