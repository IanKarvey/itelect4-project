import type { CourseStatusCount } from "../types";

interface StatusSummaryProps {
  title: string;
  counts: CourseStatusCount;
  children?: React.ReactNode;
}

const StatusSummary: React.FC<StatusSummaryProps> = ({ title, counts, children }) => {
  return (
    <section className="mt-6 rounded-lg border border-gray-200 bg-white p-5
      shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <h2 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(counts).map(([status, count]) => (
          <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900" key={status}>
            <span className="block text-sm text-gray-600 dark:text-gray-300">{status}</span>
            <strong className="block text-xl text-gray-900 dark:text-white">{count}</strong>
          </div>
        ))}
      </div>
      {children}
    </section>
  );
};

export default StatusSummary;
