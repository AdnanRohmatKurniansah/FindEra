import z from "zod";

export const reportCreateSchema = z.object({
    title: z.string().min(1, "Title is required").max(255),
    description: z.string().min(1, "Description is required"),
    id_category: z.string().min(1, "Id category is required"),
    location_text: z.string().min(1, "Location text is required"),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    status: z.string().min(1, "Status is required"),
    image_url: z.any().refine((files) => files?.length != 0, "Image is required"),
    report_date: z.string().min(1, "Report date is required"),
})

export const reportEditSchema = z.object({
    title: z.string().min(1, "Title is required").max(255),
    description: z.string().min(1, "Description is required"),
    id_category: z.string().min(1, "Id category is required"),
    location_text: z.string().min(1, "Location text is required"),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    status: z.string().min(1, "Status is required"),
    image_url: z.any().nullable(),
    report_date: z.string().min(1, "Report date is required"),
})