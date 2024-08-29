import { z } from "zod"; // Add new import

export const UserZod = z
  .object({
    email: z.string().email({ message: "Please enter email address" }),
    fullname: z.string({ message: "Please enter full name" }), 
    role: z
    .string()
    .min(1, { message: "Please select a value" })
    .max(260, { message: "The name is too long" }),
    phone: z.string({ message: "Please enter phone" }),
    address: z.string({ message: "Please enter address" }),
    pre_approved: z.boolean()
  }) 
