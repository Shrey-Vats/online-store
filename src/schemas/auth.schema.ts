import {z} from "zod";

export const signUpSchema = z.object({
    name: z.string(),
    email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {message: "Invalid Email"}),
    phoneNum: z.string().regex(/^[0-9]{10}$/, {message: "Invalid Phone Number"}),
    password: z.string().min(6, {message: "Password should at least 6 cherecter long"})
})

export const signInSchema = z.object({
    email: z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {message: "Invalid Email"}),
    password: z.string().min(6, {message: "Password should at least 6 cherecter long"})
})

