import { Schema, model } from "mongoose";
import type { SubmissionDoc } from "../types/index";

const submissionSchema = new Schema<SubmissionDoc>({
  // Holds the _id of a User document. ref enables .populate() later.
  studentId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  courseCode: {
    type: String,
    required: [true, "courseCode is required"],
    uppercase: true,
    trim: true,
  },

  // Same rule Session 8's Zod .refine() enforced in the browser.
  // The browser check is a courtesy; this one is the rule.
  repoUrl: {
    type: String,
    required: [true, "repoUrl is required"],
    match: [/^https:\/\/github\.com\/.+/, "repoUrl must start with https://github.com/"],
  },

  // Date.now WITHOUT brackets: Mongoose calls it per document.
  submittedAt: { type: Date, default: Date.now },

  // Optional in the interface, so no `required`. The range is something
  // only a schema can express.
  score: { type: Number, min: 0, max: 100 },
});

// Keeps the frontend reading .id exactly as it has since Session 1.
submissionSchema.set("toJSON", {
  transform(_doc, ret: Record<string, unknown>) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const Submission = model<SubmissionDoc>("Submission", submissionSchema);
