import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiSubmission } from "../types/index";
import SubmissionBadge from "../components/SubmissionBadge";
import { fetchSubmissions, createSubmission } from "../api/client";
import { student } from "../data/mockData";

function SubmissionsPage() {
  // Local, because only this one form reads it. Not store material.
  const [repoUrl, setRepoUrl] = useState<string>("");
  const queryClient = useQueryClient();

  const { data, isPending, isError } = useQuery<ApiSubmission[]>({
    queryKey: ["submissions"],
    queryFn: fetchSubmissions,
  });

  const addSubmission = useMutation({
    mutationFn: createSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      setRepoUrl("");
    },
  });

  const handleAdd = (): void => {
    addSubmission.mutate({
      studentId: student.id,
      courseCode: "ITELECT4",
      repoUrl: repoUrl,
      submittedAt: new Date().toISOString(),
    });
  };

  if (isPending) {
    return <div className="animate-pulse p-6">Loading submissions...</div>;
  }
  if (isError) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        Could not load submissions.
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">My Submissions</h2>
      <div className="mb-6 flex gap-2">
        <input
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="github.com/you/your-repo"
          className="w-full rounded border border-gray-300 p-2"
        />
        <button
          onClick={handleAdd}
          disabled={repoUrl === "" || addSubmission.isPending}
          className="rounded bg-blue-600 px-3 py-1.5 text-sm font-semibold
                     text-white transition hover:bg-blue-700 disabled:bg-gray-400"
        >
          {addSubmission.isPending ? "Saving..." : "Add"}
        </button>
      </div>

      {addSubmission.isError && (
        <p className="mb-4 text-sm text-red-700">
          {addSubmission.error.message}
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {data.map((s) => (
          <SubmissionBadge key={s.id} submission={s}>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Course: {s.courseCode}
            </p>
          </SubmissionBadge>
        ))}
      </div>
    </div>
  );
}

export default SubmissionsPage;
