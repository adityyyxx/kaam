import { z } from "zod";

export const signInSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
})

export const signUpSchema = z.object({
    username: z.string().min(4, "Username must be at least 4 characters long"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    imgUrl: z.string().optional(),
})

export type SignInSchema = z.infer<typeof signInSchema>;
export type SignUpSchema = z.infer<typeof signUpSchema>;

