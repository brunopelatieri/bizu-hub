import { z } from "zod";
import {
  isValidMobileE164,
  MOBILE_PHONE_ERROR,
} from "@/lib/validation/mobile-phone";

/** Reusable E.164 mobile validator — contact form, auth signup, etc. */
export const mobilePhoneSchema = z
  .string()
  .trim()
  .min(1, MOBILE_PHONE_ERROR)
  .refine(isValidMobileE164, { message: MOBILE_PHONE_ERROR });

export const contactMessageSchema = z.object({
  name: z.string().trim().min(1, "Informe seu nome."),
  email: z.string().trim().email("Informe um e-mail válido."),
  phone: mobilePhoneSchema,
  message: z.string().trim().min(1, "Informe sua mensagem."),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
