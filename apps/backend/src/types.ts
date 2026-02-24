import { z } from "zod";

const signUpSchema = z.object({
    username: z.string().min(3),
    email: z.string(),
    password: z.string().min(8),
})

const signInSchema = z.object({
    email: z.string(),
    password: z.string().min(8)
})

export { signInSchema, signUpSchema };