import { Link } from "react-router";
import { siteConfig } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

type SiteLogoProps = {
  subtitle?: string;
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
  subtitle,
  size = "md",
  className,
  asLink = true,
}: SiteLogoProps) {
  const content = (
    <>
      <img
        src={siteConfig.logo}
        alt={siteConfig.name}
        width={160}
        height={40}
        className={cn("w-auto object-contain", sizeClasses[size])}
      />
      {subtitle ? (
        <p className="mt-2 text-sm text-gradient-brand">{subtitle}</p>
      ) : null}
    </>
  );

  const wrapperClass = cn(
    "inline-flex flex-col items-start transition hover:opacity-90",
    className,
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
