import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import type { UserDoc } from "../types/index";

const userSchema = new Schema<UserDoc>(
  {
    name:  { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["student", "admin", "instructor"],
      default: "student",
    },
    isActive: { type: Boolean, default: true },

    // The one field the frontend User interface does not have.
    // select: false hides it from every query unless asked for by name.
    password: { type: String, required: true, minlength: 8, select: false },
  },
  { timestamps: true },
);

// Runs on every .save() (User.create calls save). Replaces the plain
// password with its bcrypt hash so the plain one is never stored.
// Must be a `function`, not an arrow, so `this` is the document.
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Shape sent to clients: rename _id -> id, drop __v and password.
userSchema.set("toJSON", {
  transform(_doc, ret: Record<string, unknown>) {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

export const User = model<UserDoc>("User", userSchema);
