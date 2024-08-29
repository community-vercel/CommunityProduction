import { z } from "zod"; // Add new import

export const LoginZod = z.object({
  email: z.string().email({ message: "Please enter email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .max(20, { message: "Password is too long" }),
}) 
