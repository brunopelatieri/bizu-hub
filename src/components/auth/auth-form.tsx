import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, type ReactNode } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { Loader2, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInputField } from "@/components/ui/phone-input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mobilePhoneSchema } from "@/lib/schemas/contact";
import { cn } from "@/lib/utils";
import { getSupabase } from "@/lib/supabase/client";

const loginSchema = z.object({
  email: z.string().trim().email("E-mail inválido."),
  password: z.string().min(6, "Mínimo de 6 caracteres."),
});

const signupSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome."),
  email: z.string().trim().email("E-mail inválido."),
  phone: mobilePhoneSchema,
  password: z.string().min(6, "Mínimo de 6 caracteres."),
});

type LoginValues = z.infer<typeof loginSchema>;
type SignupValues = z.infer<typeof signupSchema>;

const fieldInputClass =
  "h-11 w-full border-white/10 bg-white/5 pl-10 text-foreground placeholder:text-white/30 focus-visible:border-sky-400/50 focus-visible:ring-sky-400/20";

const authPhoneInputClass = "phone-input-field--auth";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-xs text-red-400" role="alert">
      {message}
    </p>
  );
}

type FieldProps = {
  id: string;
  label: string;
  icon?: ReactNode;
  error?: string;
  children: ReactNode;
};

function AuthField({ id, label, icon, error, children }: FieldProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-1.5">
      <Label htmlFor={id} className="text-sm font-medium text-white/70">
        {label}
      </Label>
      <div className="relative w-full">
        {icon ? (
          <span className="pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2 text-white/35">
            {icon}
          </span>
        ) : null}
        {children}
      </div>
      <FieldError message={error} />
    </div>
  );
}

function LoginForm({ nextPath }: { nextPath: string }) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginValues) {
    try {
      const { error } = await getSupabase().auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) throw error;
      navigate(nextPath);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Falha na autenticação.",
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid w-full grid-cols-1 gap-4"
      noValidate
    >
      <AuthField
        id="login-email"
        label="E-mail"
        icon={<Mail className="h-4 w-4" />}
        error={errors.email?.message}
      >
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="voce@email.com"
          aria-invalid={!!errors.email}
          className={fieldInputClass}
          {...register("email")}
        />
      </AuthField>

      <AuthField
        id="login-password"
        label="Senha"
        icon={<Lock className="h-4 w-4" />}
        error={errors.password?.message}
      >
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          aria-invalid={!!errors.password}
          className={fieldInputClass}
          {...register("password")}
        />
      </AuthField>

      <Button
        type="submit"
        className="mt-1 h-11 w-full bg-gradient-to-r from-sky-500 to-violet-500 font-medium text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-400 hover:to-violet-400"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Entrando…
          </>
        ) : (
          "Entrar"
        )}
      </Button>
    </form>
  );
}

function SignupForm({ nextPath }: { nextPath: string }) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  async function onSubmit(values: SignupValues) {
    try {
      const { data, error } = await getSupabase().auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: { name: values.name, phone: values.phone },
        },
      });
      if (error) throw error;

      if (data.session) {
        toast.success("Bem-vindo!");
        navigate(nextPath);
        return;
      }

      toast.success("Conta criada! Verifique seu e-mail para confirmar.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Falha no cadastro.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid w-full grid-cols-1 gap-4"
      noValidate
    >
      <AuthField
        id="signup-name"
        label="Nome"
        icon={<User className="h-4 w-4" />}
        error={errors.name?.message}
      >
        <Input
          id="signup-name"
          type="text"
          autoComplete="name"
          placeholder="Seu nome completo"
          aria-invalid={!!errors.name}
          className={fieldInputClass}
          {...register("name")}
        />
      </AuthField>

      <AuthField
        id="signup-email"
        label="E-mail"
        icon={<Mail className="h-4 w-4" />}
        error={errors.email?.message}
      >
        <Input
          id="signup-email"
          type="email"
          autoComplete="email"
          placeholder="voce@email.com"
          aria-invalid={!!errors.email}
          className={fieldInputClass}
          {...register("email")}
        />
      </AuthField>

      <AuthField
        id="signup-phone"
        label="Telefone Celular"
        error={errors.phone?.message}
      >
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <PhoneInputField
              id="signup-phone"
              value={field.value || undefined}
              onChange={(value) => field.onChange(value ?? "")}
              onBlur={field.onBlur}
              disabled={isSubmitting}
              aria-invalid={!!errors.phone}
              className={authPhoneInputClass}
            />
          )}
        />
      </AuthField>

      <AuthField
        id="signup-password"
        label="Senha"
        icon={<Lock className="h-4 w-4" />}
        error={errors.password?.message}
      >
        <Input
          id="signup-password"
          type="password"
          autoComplete="new-password"
          placeholder="Mínimo 6 caracteres"
          aria-invalid={!!errors.password}
          className={fieldInputClass}
          {...register("password")}
        />
      </AuthField>

      <Button
        type="submit"
        className="mt-1 h-11 w-full bg-gradient-to-r from-sky-500 to-violet-500 font-medium text-white shadow-lg shadow-sky-500/20 transition hover:from-sky-400 hover:to-violet-400"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Criando conta…
          </>
        ) : (
          "Criar conta"
        )}
      </Button>
    </form>
  );
}

export function AuthForm() {
  const [searchParams] = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/dashboard";
  const [tab, setTab] = useState<"login" | "signup">("login");

  return (
    <Tabs
      value={tab}
      onValueChange={(v) => setTab(v as typeof tab)}
      className="flex w-full flex-col"
    >
      <TabsList
        variant="line"
        className={cn(
          "mb-6 grid h-auto w-full grid-cols-2 gap-0 rounded-none border-b border-white/10 bg-transparent p-0",
        )}
      >
        <TabsTrigger
          value="login"
          className="h-11 rounded-none border-0 bg-transparent px-4 text-sm font-medium text-white/45 transition-all data-active:bg-transparent data-active:text-white after:bg-gradient-to-r after:from-sky-400 after:to-violet-400"
        >
          Entrar
        </TabsTrigger>
        <TabsTrigger
          value="signup"
          className="h-11 rounded-none border-0 bg-transparent px-4 text-sm font-medium text-white/45 transition-all data-active:bg-transparent data-active:text-white after:bg-gradient-to-r after:from-sky-400 after:to-violet-400"
        >
          Criar Conta
        </TabsTrigger>
      </TabsList>

      <TabsContent value="login" className="mt-0 w-full outline-none">
        <LoginForm nextPath={nextPath} />
      </TabsContent>

      <TabsContent value="signup" className="mt-0 w-full outline-none">
        <SignupForm nextPath={nextPath} />
      </TabsContent>
    </Tabs>
  );
}
