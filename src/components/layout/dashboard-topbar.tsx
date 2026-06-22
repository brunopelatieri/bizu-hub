import { Link } from "react-router";
import { LogOut, Menu, PanelLeftClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { SiteLogo } from "@/components/layout/site-logo";
import { DashboardNavItems } from "@/components/layout/dashboard-nav";
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
  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "??";

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4">
      {/* Left */}
      <div className="flex items-center gap-2">
        {/* Mobile: hambúrguer + Sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 md:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-60 p-0 flex flex-col">
            <SheetHeader className="flex h-16 items-center border-b border-border px-4">
              <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
              <SiteLogo size="sm" asLink={false} />
            </SheetHeader>
            <div className="flex flex-1 flex-col overflow-hidden">
              <DashboardNavItems />
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop: colapsar sidebar */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? "Expandir menu" : "Recolher menu"}
          className="hidden h-8 w-8 md:flex"
        >
          {sidebarCollapsed ? (
            <Menu className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>

        <span className="text-sm font-medium text-foreground">{title}</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              aria-label="Menu do usuário"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="text-xs text-muted-foreground truncate">
              {user?.email ?? "—"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/" className="cursor-pointer">
                ← Site público
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut()}
              className="text-destructive cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
