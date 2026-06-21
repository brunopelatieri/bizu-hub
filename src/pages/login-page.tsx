import { Link, Navigate } from "react-router";
import { AuthForm } from "@/components/auth/auth-form";
import { SiteLogo } from "@/components/layout/site-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { useAuth } from "@/providers/auth-provider";

export function LoginPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-background px-4">
      <ThemeToggle className="absolute top-4 right-4" />
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:48px_48px] opacity-30"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,oklch(0.74_0.14_230/10%),transparent)]"
      />

      <div className="relative w-full max-w-md">
        {/* Brand */}
        <div className="mb-6 text-center">
          <div className="flex justify-center">
            <SiteLogo size="lg" />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Acesse seu dashboard de projetos
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="pb-0" />
          <CardContent className="pt-2">
            {!isSupabaseConfigured() ? (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
                <p className="font-medium text-amber-600 dark:text-amber-400">
                  Supabase não configurado
                </p>
                <p className="mt-1 text-muted-foreground">
                  Defina{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">
                    VITE_SUPABASE_URL
                  </code>{" "}
                  e{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">
                    VITE_SUPABASE_PUBLISHABLE_KEY
                  </code>{" "}
                  no{" "}
                  <code className="rounded bg-muted px-1 py-0.5 text-xs">
                    .env.local
                  </code>
                  .
                </p>
              </div>
            ) : (
              <AuthForm />
            )}
          </CardContent>
        </Card>

        {/* Back to landing */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link
            to="/"
            className="text-primary underline-offset-4 transition hover:underline"
          >
            ← Voltar para o site
          </Link>
        </p>
      </div>
    </div>
  );
}
