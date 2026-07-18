import type { CourseStatusCount } from "../types";

interface StatusSummaryProps {
  title: string;
  counts: CourseStatusCount;
  children?: React.ReactNode;
}

const StatusSummary: React.FC<StatusSummaryProps> = ({ title, counts, children }) => {
  return (
    <section className="summary">
      <h2>{title}</h2>
      <div className="status-grid">
        {Object.entries(counts).map(([status, count]) => (
          <div className="status-box" key={status}>
            <span>{status}</span>
            <strong>{count}</strong>
          </div>
        ))}
      </div>
      {children}
    </section>
  );
};

export default StatusSummary;
