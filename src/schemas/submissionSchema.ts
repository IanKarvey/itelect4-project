import { z } from "zod";

export const submissionSchema = z.object({
  courseCode: z.string().min(1, "Choose a course."),

  // z.url() checks the whole shape of a URL, scheme included.
  // .refine() adds any rule Zod does not ship: yours, as a function.
  repoUrl: z
    .url("That is not a valid URL -- include https://")
    .refine((url) => url.includes("github.com"),
            "It has to be a GitHub URL."),
});

// z.infer reads the schema and hands back the TypeScript type,
// so the rules and the type can never drift apart.
export type SubmissionFormValues = z.infer<typeof submissionSchema>;
