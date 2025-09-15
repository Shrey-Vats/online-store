
import z from "zod";



export const  reviewScheam = z.object({
    title: z.string().min(5, "Too short title"),
    description: z.string().min(5, "Too short description"),
    rating: z.number().min(0).max(5)
})