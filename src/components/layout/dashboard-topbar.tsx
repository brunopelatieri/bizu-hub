import { Link } from "react-router";
import { LogOut, Menu, PanelLeftClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/providers/auth-provider";

type TopbarProps = {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  title?: string;
};

export function DashboardTopbar({
  sidebarCollapsed,
  onToggleSidebar,
  title = "Dashboard",
}: TopbarProps) {
  const { user, signOut } = useAuth();

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : "??";

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4">
      {/* Left: toggle + breadcrumb */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? "Expandir menu" : "Recolher menu"}
          className="h-8 w-8"
        >
          {sidebarCollapsed ? (
            <Menu className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
        <span className="text-sm font-medium text-foreground">{title}</span>
      </div>

      {/* Right: user + actions */}
      <div className="flex items-center gap-3">
        {user?.email && (
          <span className="hidden text-xs text-muted-foreground sm:block">
            {user.email}
          </span>
        )}

        {/* Avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {initials}
        </div>

        {/* Back to site */}
        <Link
          to="/"
          className="hidden text-xs text-muted-foreground transition hover:text-foreground sm:block"
        >
          ← Site público
        </Link>

        <ThemeToggle />

        {/* Sign out */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => signOut()}
          aria-label="Sair"
          className="h-8 w-8"
          title="Sair"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
