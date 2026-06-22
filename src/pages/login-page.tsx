import { Link, Navigate } from "react-router";
import { Sparkles } from "lucide-react";
import { AuthForm } from "@/components/auth/auth-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { useAuth } from "@/providers/auth-provider";

export function LoginPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-[oklch(0.07_0.025_264)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-sky-400" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-[oklch(0.07_0.025_264)] px-4 py-10">
      <ThemeToggle className="absolute top-4 right-4 z-10 text-white/50 hover:text-white" />

      {/* Grid cibernético */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage: `
            linear-gradient(oklch(1 0 0 / 2.5%) 1px, transparent 1px),
            linear-gradient(90deg, oklch(1 0 0 / 2.5%) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Glow superior */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, oklch(0.55 0.2 230 / 14%), transparent 70%)",
        }}
      />

      {/* Glow inferior */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-[700px] -translate-x-1/2 blur-3xl"
        style={{ background: "oklch(0.45 0.18 280 / 10%)" }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand — acima do card */}
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/50 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-sky-400" />
            Engineering AI Design
          </div>
          <h1 className="bg-gradient-to-br from-white via-white to-white/60 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
            Bizu
          </h1>
          <p className="mt-2 text-sm text-white/40">
            Área restrita — clientes e projetos
          </p>
        </div>

        {/* Card único centralizado */}
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[oklch(0.11_0.03_264/75%)] p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
          {/* Border beam superior */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent 10%, oklch(0.7 0.15 230 / 50%) 50%, transparent 90%)",
            }}
          />

          {/* Glow interno sutil */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full blur-3xl"
            style={{ background: "oklch(0.55 0.2 230 / 8%)" }}
          />

          <div className="relative w-full">
            {!isSupabaseConfigured() ? (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm">
                <p className="font-medium text-amber-400">
                  Supabase não configurado
                </p>
                <p className="mt-1 text-white/50">
                  Defina{" "}
                  <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-xs">
                    VITE_SUPABASE_URL
                  </code>{" "}
                  e{" "}
                  <code className="rounded bg-white/10 px-1 py-0.5 font-mono text-xs">
                    VITE_SUPABASE_PUBLISHABLE_KEY
                  </code>
                  .
                </p>
              </div>
            ) : (
              <AuthForm />
            )}
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-white/30">
          <Link to="/" className="transition hover:text-white/60">
            ← Voltar para o site
          </Link>
        </p>
      </div>
    </div>
  );
}
