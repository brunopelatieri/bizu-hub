import { NavLink } from "react-router";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/constants/navigation";

type SiteNavLinksProps = {
  onNavigate?: () => void;
  className?: string;
};

export function SiteNavLinks({ onNavigate, className }: SiteNavLinksProps) {
  return (
    <>
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.href === "/"}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "text-sm transition",
              isActive
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
