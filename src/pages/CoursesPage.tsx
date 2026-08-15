import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import type { Course } from "../types/index";
import CourseCard from "../components/CourseCard";
import usePrevious from "../hooks/usePrevious";
import { allCourses } from "../data/mockData";

function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const previousSearch = usePrevious(searchTerm);

  useEffect(() => {
    setTimeout(() => {
      setCourses(allCourses);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void =>
    setSearchTerm(e.target.value);

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="animate-pulse p-6">Loading courses...</div>;
  if (isError) return <div className="rounded-lg bg-red-50 p-4 text-red-700">Could not load courses.</div>;

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Courses</h2>
      <button onClick={() => setIsError(true)}
        className="mb-2 rounded bg-red-100 px-2 py-1 text-xs text-red-700">
        Simulate Error
      </button>
      <input ref={searchInputRef} value={searchTerm} onChange={handleSearchChange}
        placeholder="Search courses..." className="w-full rounded border border-gray-300 p-2" />
      {previousSearch !== undefined && previousSearch !== searchTerm && (
        <p className="mt-1 text-sm text-gray-500">Previous search: "{previousSearch}"</p>
      )}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCourses.map((c) => (
          <Link key={c.code} to={`/courses/${c.code}`}>
            <CourseCard course={c} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CoursesPage;
