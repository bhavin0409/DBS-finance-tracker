import z from "zod";

export const accountSchema = z.object({
    name: z.string().min(1, "Account name is required"),
    type: z.enum(["CURRENT" , "SAVINGS"]),
    balance: z.coerce.number().min(1 , "initial balance required"),
    isDefault: z.boolean().default(false),
});