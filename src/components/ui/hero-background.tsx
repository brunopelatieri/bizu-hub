import { cn } from "@/lib/utils";

type HeroBackgroundProps = {
  className?: string;
};

/** Fundo imersivo compartilhado: grid cibernético + auroras da marca. */
export function HeroBackground({ className }: HeroBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      {/* Cybernetic Grid — malha com máscara radial para fade nas bordas */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(148, 163, 184, 0.12) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148, 163, 184, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse 85% 75% at 50% 35%, black 15%, transparent 72%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 75% at 50% 35%, black 15%, transparent 72%)",
        }}
      />

      {/* Aurora Azul — topo-esquerdo */}
      <div
        className="absolute -left-24 -top-24 h-[480px] w-[480px] rounded-full opacity-25 blur-[120px]"
        style={{ background: "#1096E6" }}
      />

      {/* Aurora Teal — centro-direita */}
      <div
        className="absolute -right-16 top-1/4 h-[440px] w-[440px] rounded-full opacity-25 blur-[120px]"
        style={{ background: "#00CDBA" }}
      />
    </div>
  );
}
