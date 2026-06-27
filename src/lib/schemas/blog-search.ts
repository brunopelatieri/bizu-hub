import { z } from "zod";
import { ALL_FILTER_SLUG } from "@/lib/content/category-constants";

export const blogSearchQuerySchema = z.object({
  q: z
    .string()
    .trim()
    .min(3, "Informe pelo menos 3 caracteres.")
    .max(200, "Busca muito longa."),
  category: z.string().trim().default(ALL_FILTER_SLUG),
});

export type BlogSearchQuery = z.infer<typeof blogSearchQuerySchema>;
