# ITELECT4 Course Enrollment Tracker

This project is about a simple course enrollment system. It has students, instructors, and courses. A student can enroll in courses, and each course has an instructor and a status like planned, open, in progress, or completed.

## Types Made

- `Student` - stores student info and enrolled course IDs
- `Instructor` - stores instructor info and role
- `Course` - stores course info, credits, instructor ID, and status
- `UserRole` - allowed roles: student, instructor, admin
- `CourseStatus` - enum for the course status
- `ApiResponse<T>` - generic response type
- `StudentUpdate` - uses `Partial<Student>` for updating student info
- `StudentPreview` - uses `Pick` to show only some student fields
- `PublicStudent` - uses `Omit` to hide the email
- `CourseStatusCount` - uses `Record` for counting course statuses

## TypeScript Features Used

- Generic functions: `getFirst<T>()` and `getById<T>()`
- Generic interface: `ApiResponse<T>`
- Utility types: `Partial`, `Pick`, `Omit`, `Record`, and `ReturnType`
- Enum: `CourseStatus`

## How to Run

```bash
npm install
npx ts-node src/index.ts
```

## Check for Errors

```bash
npx tsc --noEmit
```
