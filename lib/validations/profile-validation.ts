import z from "zod";

export const profileUpdateSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255),
    phone: z.string().optional()
})

