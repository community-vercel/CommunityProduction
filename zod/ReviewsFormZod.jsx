import { z } from "zod"; // Add new import

export const ReviewsFormZod = z
  .object({ 
    title: z.string({ message: "Please enter title" }).min(1, { message: "Please enter title" }), 
    review: z.string({ message: "Please enter review" }).min(1, { message: "Please enter review" }), 
    rating:z.number({message:"Please enter rating"}).int().min(1,{message:"Please enter rating"}).max(5,{message:"Please enter rating"})
  })
  
