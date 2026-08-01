import { useState, useEffect, useRef } from "react";
import type { Student, Course, CourseStatus } from "./types/index";
import StudentCard from "./components/StudentCard";
import CourseCard from "./components/CourseCard";
import useToggle from "./hooks/useToggle";
import usePrevious from "./hooks/usePrevious";

const student: Student = {
  id: 1,
  name: "Juan dela Cruz",
  email: "juan@example.com",
  role: "student",
  enrolledCourseIds: [101],
};

const course: Course = {
  id: 101,
  code: "ITELECT4",
  title: "IT Elective 4",
  units: 3,
  credits: 3,
  semester: "1st Semester 2026-2027",
  status: "open" as CourseStatus,
};

function App() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showDetails, toggleDetails] = useToggle(false);
  const [isDarkMode, toggleDarkMode] = useToggle(false);
  const previousSearch = usePrevious(searchTerm);

  useEffect(() => {
    setTimeout(() => {
      setCourses([course]);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => setSearchTerm(e.target.value);

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="animate-pulse p-6 text-gray-500">
        Loading courses...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="m-6 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900 dark:text-red-200">
        Could not load courses. Please try again.
      </div>
    );
  }

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900">
        <div className="mb-6 flex gap-2">
          <button onClick={toggleDarkMode}
            className="rounded bg-gray-800 px-3 py-1.5 text-sm text-white
              transition hover:bg-gray-700 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300">
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <button onClick={() => setIsError(!isError)}
            className="rounded bg-red-100 px-2 py-1 text-xs text-red-700
              transition hover:bg-red-200 dark:bg-red-900 dark:text-red-200">
            {isError ? "Clear Error" : "Simulate Error"}
          </button>
        </div>
        <input ref={searchInputRef} value={searchTerm} onChange={handleSearchChange}
          placeholder="Search courses..."
          className="w-full rounded border border-gray-300 bg-white px-3 py-2
            text-gray-900 placeholder-gray-500 transition
            dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
        {previousSearch !== undefined && previousSearch !== searchTerm && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Previous search: "{previousSearch}"
          </p>
        )}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StudentCard student={student} onSelect={setSelectedStudent} />
          {selectedStudent && (
            <div className="rounded-lg border border-gray-200 bg-white p-5
              shadow-sm dark:bg-gray-800 dark:border-gray-700">
              <p className="text-gray-900 dark:text-white">
                Selected: <strong>{selectedStudent.name}</strong>
              </p>
            </div>
          )}
          <button onClick={toggleDetails}
            className="rounded bg-blue-600 px-3 py-2 text-white
              transition hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600">
            {showDetails ? "Hide" : "Show"} Details
          </button>
          {filteredCourses.map((c) => (
            <CourseCard key={c.code} course={c} variant="compact" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
