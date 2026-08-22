import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import type { Course } from "../types/index";
import CourseCard from "../components/CourseCard";
import usePrevious from "../hooks/usePrevious";
import useUiStore from "../store/uiStore";
import { fetchCourses } from "../api/client";

function CoursesPage() {
  const { data, isPending, isError, error } = useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: fetchCourses,
  });

  const searchTerm = useUiStore((state) => state.searchTerm);
  const setSearchTerm = useUiStore((state) => state.setSearchTerm);
  const previousSearch = usePrevious(searchTerm);

  if (isPending) {
    return <div className="animate-pulse p-6">Loading courses...</div>;
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        {error.message} -- is json-server running on port 3001?
      </div>
    );
  }

  const filteredCourses = data.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Courses</h2>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search courses..."
        className="w-full rounded border border-gray-300 p-2"
      />
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
