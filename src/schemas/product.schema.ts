/*
id          String   @id @default(cuid())
  title       String
  description String
  images      String[]
  price       Float
  quantity    Int

}
*/

import { title } from "process";
import z from "zod";

export const productSchema = z.object({
    title:  z.string().min(8, {message: "title must be atleast 9 cherecter long"}),
    description: z.string(),
    images: z.string().array(),
    price: z.string(),
    quantity: z.string()
})
