import { Router, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import type { TokenPayload } from "../middleware/auth";

export const authRouter = Router();

interface RegisterBody {
  name: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

// Request<Params, ResBody, ReqBody>. Filling the third makes req.body typed.
authRouter.post(
  "/register",
  async (
    req: Request<unknown, unknown, RegisterBody>,
    res: Response,
  ) => {
    const { name, email, password } = req.body;

    // Readable 409 for the common case. The unique index is the real guard.
    if (await User.findOne({ email })) {
      res.status(409).json({
        message: "That email is already registered",
      });
      return;
    }

    // Plain password in; pre("save") hashes it before it is stored.
    const user = await User.create({ name, email, password });

    res.status(201).json(user.toJSON());
  },
);

authRouter.post(
  "/login",
  async (
    req: Request<unknown, unknown, LoginBody>,
    res: Response,
  ) => {
    const { email, password } = req.body;

    // password is select:false, so it must be requested explicitly.
    const user = await User.findOne({ email }).select("+password");

    // One message for both failures, so a guesser learns nothing.
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({
        message: "Email or password is incorrect",
      });
      return;
    }

    const payload: TokenPayload = { userId: String(user._id) };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "2h",
    });

    res.json({ token, user: user.toJSON() });
  },
);
