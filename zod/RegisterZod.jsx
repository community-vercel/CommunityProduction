import { z } from "zod"; // Add new import

export const RegisterZod = z
  .object({
    email: z.string().email({ message: "Please enter email address" }),
    fullname: z.string({ message: "Please enter full name" }),
    role: z
    .string()
    .min(1, { message: "Please select a value" })
    .max(260, { message: "The name is too long" }),
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .max(20, { message: "Password is too long" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // path of error
  });
