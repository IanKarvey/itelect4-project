import { useState } from "react";
import type { Student } from "../types/index";
import StudentCard from "../components/StudentCard";
import useToggle from "../hooks/useToggle";
import { student } from "../data/mockData";

function DashboardPage() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showDetails, toggleDetails] = useToggle(false);

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StudentCard student={student} onSelect={setSelectedStudent} />
      </div>
      <button onClick={toggleDetails}
        className="mt-4 rounded bg-gray-200 px-3 py-1.5 text-sm dark:bg-gray-700 dark:text-white">
        {showDetails ? "Hide" : "Show"} Details
      </button>
      {showDetails && selectedStudent !== null && (
        <p className="mt-2 text-gray-700 dark:text-gray-300">
          Selected: {selectedStudent.name} ({selectedStudent.role})
        </p>
      )}
    </div>
  );
}

export default DashboardPage;
