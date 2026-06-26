import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInputField } from "@/components/ui/phone-input";
import { Textarea } from "@/components/ui/textarea";
import {
  contactMessageSchema,
  type ContactMessageInput,
} from "@/lib/schemas/contact";
import {
  trackContactFormSubmission,
  trackContactFormError,
} from "@/lib/gtm/events";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ContactMessageInput>({
    resolver: zodResolver(contactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  async function onSubmit(values: ContactMessageInput) {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error ?? "Falha ao enviar mensagem.");
      }

      toast.success("Mensagem enviada com sucesso! Retorno em breve.");
      trackContactFormSubmission({
        name: values.name,
        email: values.email,
      });
      reset();
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Falha ao enviar mensagem.";
      toast.error(errorMsg);
      trackContactFormError(errorMsg);
    }
  }

  const fieldClass =
    "border-slate-700/60 bg-slate-950/40 text-slate-100 placeholder:text-slate-500 focus-visible:border-brand-blue/50 focus-visible:ring-brand-blue/20";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="space-y-2">
        <Label htmlFor="name" className="text-slate-300">
          Nome
        </Label>
        <Input
          id="name"
          autoComplete="name"
          placeholder="Seu nome"
          aria-invalid={!!errors.name}
          className={fieldClass}
          {...register("name")}
        />
        {errors.name ? (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-300">
          E-mail
        </Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="voce@email.com"
          aria-invalid={!!errors.email}
          className={fieldClass}
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-slate-300">
          Telefone Celular
        </Label>
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <PhoneInputField
              id="phone"
              value={field.value || undefined}
              onChange={(value) => field.onChange(value ?? "")}
              onBlur={field.onBlur}
              disabled={isSubmitting}
              aria-invalid={!!errors.phone}
              className={fieldClass}
            />
          )}
        />
        {errors.phone ? (
          <p className="text-sm text-destructive">{errors.phone.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-slate-300">
          Mensagem
        </Label>
        <Textarea
          id="message"
          rows={5}
          placeholder="Descreva seu projeto ou desafio…"
          aria-invalid={!!errors.message}
          className={fieldClass}
          {...register("message")}
        />
        {errors.message ? (
          <p className="text-sm text-destructive">{errors.message.message}</p>
        ) : null}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-brand-blue font-semibold text-white shadow-lg shadow-brand-blue/25 hover:bg-brand-blue/90 sm:w-auto"
      >
        {isSubmitting ? "Enviando..." : "Enviar mensagem"}
      </Button>
    </form>
  );
}
