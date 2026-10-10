import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Adds userId to Express's Request type for this whole project.
// The namespace MUST be spelled exactly `Express` so it merges with
// @types/express. Optional because most middleware runs before it is set.
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

// What is signed into the token at login, and read back on verify.
export interface TokenPayload {
  userId: string;
}

// Session 6's ProtectedRoute guards the SCREEN. This guards the DATA,
// and it is the one that matters: anyone can call this API without the app.
export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Expected: Authorization: Bearer <token>
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({
      message: "No token. Send Authorization: Bearer <token>",
    });
    return;
  }

  const token = header.slice("Bearer ".length);

  try {
    // Verifies the signature against our secret AND checks exp.
    // Either failure throws.
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!,
    ) as TokenPayload;
    req.userId = payload.userId;
    next();
  } catch {
    res.status(401).json({
      message: "Token is invalid or has expired",
    });
  }
}
