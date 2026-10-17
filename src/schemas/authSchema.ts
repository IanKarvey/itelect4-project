import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("That is not an email address."),

  // Eight because the backend's User schema says minlength: 8. This only
  // moves the message to where it is typed; the API refuses it anyway.
  password: z.string().min(8, "At least 8 characters."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// Same email and password rules plus a name, written once.
export const registerSchema = loginSchema.extend({
  name: z.string().min(1, "Your name is required."),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
