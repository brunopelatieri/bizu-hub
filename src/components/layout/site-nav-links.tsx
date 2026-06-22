import { NavLink } from "react-router";
import { cn } from "@/lib/utils";
import { headerNavItems } from "@/lib/constants/navigation";

type NavItem = { href: string; label: string };

type SiteNavLinksProps = {
  items?: readonly NavItem[];
  onNavigate?: () => void;
  className?: string;
  variant?: "default" | "header";
};

export function SiteNavLinks({
  items = headerNavItems,
  onNavigate,
  className,
  variant = "default",
}: SiteNavLinksProps) {
  return (
    <>
      {items.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.href === "/"}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              variant === "header"
                ? "relative px-1 py-2 text-sm transition-colors duration-200"
                : "text-sm transition",
              variant === "header"
                ? isActive
                  ? "font-medium text-white after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-gradient-to-r after:from-brand-blue after:via-brand-indigo after:to-brand-teal"
                  : "text-slate-400 hover:text-white"
                : isActive
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              className,
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </>
  );
}
