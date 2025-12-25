import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255),
    email: z.string().min(1, 'Email is required').max(150),
    password: z.string().min(1, 'Password is required')
})

export const loginSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Email is not valid'),
    password: z.string().min(1, 'Password is required')
})

export const changePasswordSchema = z.object({
    new_password: z.string().min(1, 'New password is required'),
    old_password: z.string().min(1, 'Old password is required')
})