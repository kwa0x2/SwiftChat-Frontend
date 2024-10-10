import { z } from "zod";
import { toast } from "sonner";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const AddFriendSchemas = z.object({
  email: z
    .string({
      invalid_type_error: "Invalid characters detected.",
    })
    .min(3, { message: "Must be at least 3 characters long." })
    .refine((val) => emailRegex.test(val), {
      message: "Invalid email format.",
    }),
});
