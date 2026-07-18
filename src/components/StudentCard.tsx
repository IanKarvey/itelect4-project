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
    console.log("Student note:", event.target.value);
  };

  return (
    <article className="card">
      <p className="label">Student</p>
      <h2>{student.name}</h2>
      <p>{student.email}</p>
      <p>Role: {student.role}</p>
      <p>Enrolled courses: {student.enrolledCourseIds.length}</p>
      <div className="card-actions">
        <button type="button" onClick={handleSelect}>Select</button>
        <input type="text" placeholder="Quick note" onChange={handleNoteChange} />
      </div>
    </article>
  );
}

export default StudentCard;
