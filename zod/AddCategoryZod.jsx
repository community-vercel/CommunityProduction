import { z } from "zod"; // Add new import

export const AddCategoryZod = z.object({
    category: z.string().min(1, "Please add category"), 
});
