import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { SiteLogo } from "@/components/layout/site-logo";
import { navItems } from "@/lib/constants/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { useAuth } from "@/providers/auth-provider";

export function SiteHeader() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <SiteLogo size="md" />
        <div className="flex items-center gap-6">
          <nav aria-label="Principal" className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-sm text-muted-foreground transition hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/dashboard">
                <Button size="sm">Dashboard</Button>
              </Link>
              {isSupabaseConfigured() && (
                <Button variant="ghost" size="sm" onClick={() => signOut()}>
                  Sair
                </Button>
              )}
            </div>
          ) : (
            <Link to="/login">
              <Button size="sm">Entrar</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
