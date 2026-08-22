import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router";
import type { Course } from "../types/index";
import CourseCard from "../components/CourseCard";
import { fetchCourseByCode } from "../api/client";

function CourseDetailPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  const { data, isPending, isError, error } = useQuery<Course>({
    queryKey: ["courses", code],
    queryFn: () => fetchCourseByCode(code!),
    enabled: code !== undefined,
  });

  if (isPending) {
    return <div className="animate-pulse p-6">Loading course...</div>;
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        {error.message}
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">{data.title}</h2>
      <div className="max-w-sm"><CourseCard course={data} /></div>
      <button onClick={() => navigate("/courses")}
        className="mt-4 rounded bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700">
        Back to Courses
      </button>
    </div>
  );
}

export default CourseDetailPage;
