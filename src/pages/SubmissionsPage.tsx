import SubmissionBadge from "../components/SubmissionBadge";
import { allSubmissions } from "../data/mockData";

function SubmissionsPage() {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">My Submissions</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {allSubmissions.map((s) => (
          <SubmissionBadge key={s.id} submission={s}>
            <p className="text-sm text-gray-500 dark:text-gray-400">Course: {s.courseCode}</p>
          </SubmissionBadge>
        ))}
      </div>
    </div>
  );
}

export default SubmissionsPage;
