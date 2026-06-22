import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactMessageSchema } from "@/lib/schemas/contact";

export function ContactForm() {
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setPending(true);

    const formData = new FormData(form);
    const payload = contactMessageSchema.safeParse({
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    });

    if (!payload.success) {
      toast.error(
        payload.error.issues[0]?.message ?? "Preencha todos os campos.",
      );
      setPending(false);
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload.data),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Falha ao enviar mensagem.");
      }

      toast.success("Mensagem enviada com sucesso! Retorno em breve.");
      form.reset();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Falha ao enviar mensagem.",
      );
    } finally {
      setPending(false);
    }
  }

  const fieldClass =
    "border-slate-700/60 bg-slate-950/40 text-slate-100 placeholder:text-slate-500 focus-visible:border-brand-blue/50 focus-visible:ring-brand-blue/20";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-slate-300">
            Nome
          </Label>
          <Input
            id="name"
            name="name"
            required
            autoComplete="name"
            placeholder="Seu nome"
            className={fieldClass}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-300">
            E-mail
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="voce@email.com"
            className={fieldClass}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message" className="text-slate-300">
          Mensagem
        </Label>
        <Textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="Descreva seu projeto ou desafio…"
          className={fieldClass}
        />
      </div>
      <Button
        type="submit"
        disabled={pending}
        className="w-full bg-brand-blue font-semibold text-white shadow-lg shadow-brand-blue/25 hover:bg-brand-blue/90 sm:w-auto"
      >
        {pending ? "Enviando..." : "Enviar mensagem"}
      </Button>
    </form>
  );
}
