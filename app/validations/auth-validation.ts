import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255),
    email: z.string().min(1, 'Email is required').max(150),
    password: z.string().min(1, 'Password is required')
})