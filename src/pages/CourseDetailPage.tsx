import { useParams, useNavigate } from "react-router";
import CourseCard from "../components/CourseCard";
import { allCourses } from "../data/mockData";

function CourseDetailPage() {
  const params = useParams();
  const code = params.code as string | undefined;
  const navigate = useNavigate();
  const course = allCourses.find((c) => c.code === code);

  if (course === undefined) {
    return <div className="rounded-lg bg-red-50 p-4 text-red-700">No course found with code "{code}".</div>;
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">{course.title}</h2>
      <div className="max-w-sm"><CourseCard course={course} /></div>
      <button onClick={() => navigate("/courses")}
        className="mt-4 rounded bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700">
        Back to Courses
      </button>
    </div>
  );
}

export default CourseDetailPage;
