import { Router, type Request, type Response } from "express";
import { Submission } from "../models/Submission";
import { requireAuth } from "../middleware/auth";
import type { NewSubmissionBody } from "../types/index";

export const submissionRouter = Router();

// Every route BELOW this line requires a valid token.
submissionRouter.use(requireAuth);

interface IdParam {
  id: string;
}

// GET /api/submissions -- only this token's rows, newest first
submissionRouter.get("/", async (req: Request, res: Response) => {
  const submissions = await Submission.find({
    studentId: req.userId,
  }).sort({ submittedAt: -1 });
  res.json(submissions);
});

// GET /api/submissions/:id
submissionRouter.get(
  "/:id",
  async (req: Request<IdParam>, res: Response) => {
    // Right row AND right owner. Without studentId, changing the id in
    // the URL would read someone else's row.
    const submission = await Submission.findOne({
      _id: req.params.id,
      studentId: req.userId,
    });

    if (!submission) {
      res.status(404).json({ message: "No submission with that id" });
      return;
    }

    res.json(submission);
  },
);

// POST /api/submissions
submissionRouter.post(
  "/",
  async (
    req: Request<unknown, unknown, NewSubmissionBody>,
    res: Response,
  ) => {
    const submission = await Submission.create({
      ...req.body,
      // MUST come after the spread: the owner comes from the verified
      // token, so a request cannot claim to be someone else.
      studentId: req.userId,
    });

    res.status(201).json(submission);
  },
);

// PATCH /api/submissions/:id
submissionRouter.patch(
  "/:id",
  async (
    req: Request<IdParam, unknown, Partial<NewSubmissionBody>>,
    res: Response,
  ) => {
    const submission = await Submission.findOneAndUpdate(
      { _id: req.params.id, studentId: req.userId },
      req.body,
      // new: return the row AFTER the change.
      // runValidators: schema rules are skipped on updates otherwise.
      { new: true, runValidators: true },
    );

    if (!submission) {
      res.status(404).json({ message: "No submission with that id" });
      return;
    }

    res.json(submission);
  },
);

// DELETE /api/submissions/:id
submissionRouter.delete(
  "/:id",
  async (req: Request<IdParam>, res: Response) => {
    const submission = await Submission.findOneAndDelete({
      _id: req.params.id,
      studentId: req.userId,
    });

    if (!submission) {
      res.status(404).json({ message: "No submission with that id" });
      return;
    }

    // 204: done, deliberately no body.
    res.status(204).send();
  },
);
