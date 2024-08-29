import { z } from "zod"; // Add new import

export const UpdatePasswordZod = z
  .object({ 
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
