import { NavLink } from "react-router";
import {
  BarChart3,
  FileStack,
  FolderKanban,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";
import { SiteLogo } from "@/components/layout/site-logo";
import { siteConfig } from "@/lib/constants/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { href: "/dashboard/projetos", label: "Projetos", icon: FolderKanban },
  { href: "/dashboard/clientes", label: "Clientes", icon: Users },
  { href: "/dashboard/arquivos", label: "Arquivos", icon: FileStack },
  { href: "/dashboard/relatorios", label: "Relatórios", icon: BarChart3 },
];

const bottomItems = [
  { href: "/dashboard/configuracoes", label: "Configurações", icon: Settings },
];

type SidebarProps = {
  collapsed?: boolean;
};

export function DashboardSidebar({ collapsed = false }: SidebarProps) {
  return (
    <aside
      className={`flex h-full flex-col border-r border-border bg-card transition-all duration-200 ${collapsed ? "w-16" : "w-60"}`}
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-border px-4">
        {collapsed ? (
          <img
            src={siteConfig.logo}
            alt={siteConfig.name}
            className="mx-auto h-7 w-auto object-contain"
          />
        ) : (
          <SiteLogo size="sm" asLink={false} />
        )}
      </div>

      {/* Main nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navItems.map(({ href, label, icon: Icon, end }) => (
          <NavLink
            key={href}
            to={href}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="space-y-1 border-t border-border p-3">
        {bottomItems.map(({ href, label, icon: Icon }) => (
          <NavLink
            key={href}
            to={href}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
