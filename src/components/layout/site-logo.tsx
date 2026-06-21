import { Link } from "react-router";
import { siteConfig } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

type SiteLogoProps = {
  showName?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  asLink?: boolean;
};

const sizeClasses = {
  sm: "h-7",
  md: "h-8",
  lg: "h-10",
};

export function SiteLogo({
  showName = false,
  size = "md",
  className,
  asLink = true,
}: SiteLogoProps) {
  const content = (
    <>
      <img
        src={siteConfig.logo}
        alt={siteConfig.name}
        className={cn("w-auto object-contain", sizeClasses[size])}
      />
      {showName ? (
        <span className="text-sm font-semibold tracking-wide text-primary">
          {siteConfig.name}
        </span>
      ) : null}
    </>
  );

  const wrapperClass = cn(
    "inline-flex items-center gap-2 transition hover:opacity-80",
    className
  );

  if (asLink) {
    return (
      <Link to="/" className={wrapperClass}>
        {content}
      </Link>
    );
  }

  return <div className={wrapperClass}>{content}</div>;
}
