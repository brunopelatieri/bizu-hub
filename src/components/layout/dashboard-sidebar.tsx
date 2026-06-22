import { Link } from "react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SiteLogo } from "@/components/layout/site-logo";
import { DashboardNavItems } from "@/components/layout/dashboard-nav";
import { useAuth } from "@/providers/auth-provider";
import { siteConfig } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

type SidebarProps = {
  collapsed?: boolean;
};

export function DashboardSidebar({ collapsed = false }: SidebarProps) {
  const { user } = useAuth();
  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "??";

  return (
    <aside
      className={cn(
        "hidden md:flex h-full flex-col border-r border-border bg-card transition-all duration-200",
        collapsed ? "w-16" : "w-60",
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-border px-4">
        {collapsed ? (
          <Link to="/" className="mx-auto">
            <img
              src={siteConfig.logo}
              alt={siteConfig.name}
              className="h-7 w-auto object-contain"
            />
          </Link>
        ) : (
          <SiteLogo size="sm" asLink={false} />
        )}
      </div>

      {/* Nav */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardNavItems collapsed={collapsed} />
      </div>

      {/* Avatar do usuário na base */}
      <div
        className={cn(
          "flex items-center gap-3 border-t border-border p-3",
          collapsed && "justify-center",
        )}
      >
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-foreground">
              {user?.email ?? "—"}
            </p>
            <p className="text-[10px] text-muted-foreground">Cliente</p>
          </div>
        )}
      </div>
    </aside>
  );
}
