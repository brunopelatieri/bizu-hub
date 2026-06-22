import { useState } from "react";
import { Link } from "react-router";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { SiteLogo } from "@/components/layout/site-logo";
import { SiteNavLinks } from "@/components/layout/site-nav-links";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { useAuth } from "@/providers/auth-provider";

function AuthButtons({ onNavigate }: { onNavigate?: () => void }) {
  const { user, signOut } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/dashboard" onClick={onNavigate}>
          <Button size="sm">Dashboard</Button>
        </Link>
        {isSupabaseConfigured() && (
          <Button
            variant="ghost"
            size="sm"
            onClick={async () => {
              onNavigate?.();
              await signOut();
            }}
          >
            Sair
          </Button>
        )}
      </div>
    );
  }

  return (
    <Link to="/login" onClick={onNavigate}>
      <Button size="sm">Entrar</Button>
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Logo — shrink-0 para não ser comprimido */}
        <div className="shrink-0">
          <SiteLogo size="md" />
        </div>

        {/* Desktop nav — oculto em mobile */}
        <div className="hidden min-w-0 items-center gap-6 md:flex">
          <nav aria-label="Principal" className="flex items-center gap-6">
            <SiteNavLinks />
          </nav>
          <ThemeToggle />
          <AuthButtons />
        </div>

        {/* Mobile: theme toggle + hambúrguer */}
        <div className="flex shrink-0 items-center gap-1 md:hidden">
          <ThemeToggle />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Abrir menu"
                className="h-9 w-9"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 flex flex-col gap-0 p-0">
              <SheetHeader className="border-b border-border p-4">
                <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
                <SiteLogo size="sm" asLink={false} />
              </SheetHeader>

              <nav
                aria-label="Mobile"
                className="flex flex-col gap-1 overflow-y-auto p-4"
              >
                <SiteNavLinks
                  onNavigate={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 hover:bg-muted"
                />
              </nav>

              <div className="mt-auto border-t border-border p-4">
                <AuthButtons onNavigate={() => setOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
