import { z } from "zod"; // Add new import

export const ForgetPasswordZod = z.object({
  email: z.string().email({ message: "Please enter email address" }),
});
