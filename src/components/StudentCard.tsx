import type { Student } from "../types";

interface StudentCardProps {
  student: Student;
  onSelect: (student: Student) => void;
}

function StudentCard({ student, onSelect }: StudentCardProps) {
  const handleSelect = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.currentTarget.blur();
    onSelect(student);
  };

  const handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    // Future: Save note to state or backend
    event.target.value;
  };

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-5
      shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">{student.name}</h2>
      <p className="text-gray-600 dark:text-gray-300">{student.email}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">Role: {student.role}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">Enrolled courses: {student.enrolledCourseIds?.length ?? 0}</p>
      <button type="button" onClick={handleSelect}
        className="mt-3 rounded bg-blue-600 px-3 py-1.5 text-sm
          font-semibold text-white transition hover:bg-blue-700">
        Select
      </button>
      <input type="text" placeholder="Quick note" onChange={handleNoteChange}
        className="mt-2 w-full rounded border border-gray-300 px-2 py-1
          text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
    </article>
  );
}

export default StudentCard;
