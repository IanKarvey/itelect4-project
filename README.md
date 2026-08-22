# ITELECT4 Submission Tracker

This project tracks student submissions for courses. It has students, courses, and submissions -- a student submits a repo URL for a course, which can later be scored.

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

## GT2 Components

- `StudentCard` - shows student info and has typed click/change events
- `CourseCard` - shows course info using the `Course` type
- `StatusSummary` - shows course status counts using props and children

## How to Run

```bash
npm install
npm run dev
```

## Check for Errors

```bash
npm run build
```
