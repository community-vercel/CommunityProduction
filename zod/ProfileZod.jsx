import { z } from "zod"; // Add new import

export const ProfileZod = z
  .object({
    email: z.string().email({ message: "Please enter email address" }),
    fullname: z.string({ message: "Please enter full name" }), 
    password: z
      .string() 
      .max(20, { message: "Password is too long" }),
    confirmPassword: z.string(),

    phone: z.string({ message: "Please enter phone" }),
    address: z.string({ message: "Please enter address" }),

  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // path of error
  });
