import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import mongoose from "mongoose";
import { authRouter } from "./routes/auth";
import { submissionRouter } from "./routes/submissions";

// Builds the app and stops. Never opens a port, never touches the DB.
export const app = express();

// Lets the Vite app on :5173 read replies from :4000. Postman never needs it.
app.use(cors());

// Creates req.body from JSON bodies (only when Content-Type: application/json).
app.use(express.json());

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 });
});

app.use("/api/auth", authRouter);
app.use("/api/submissions", submissionRouter);

// 404 for unknown paths, as JSON. MUST be after all routers.
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: `No route for ${req.method} ${req.originalUrl}`,
  });
});

// Error handler. FOUR parameters is what tells Express this is the error
// handler, so _next must stay even though it is never called.
// Express 5 forwards rejected promises from async routes here automatically.
app.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).json({
        message: "Validation failed",
        errors: Object.values(err.errors).map((e) => e.message),
      });
      return;
    }

    // Thrown when a URL id is not a valid ObjectId.
    if (err instanceof mongoose.Error.CastError) {
      res.status(400).json({
        message: `"${err.value}" is not a valid id`,
      });
      return;
    }

    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  },
);
