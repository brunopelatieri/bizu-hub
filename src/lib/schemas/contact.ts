import { z } from "zod";

export const contactMessageSchema = z.object({
  name: z.string().trim().min(1, "Informe seu nome."),
  email: z.string().trim().email("Informe um e-mail válido."),
  message: z.string().trim().min(1, "Informe sua mensagem."),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
