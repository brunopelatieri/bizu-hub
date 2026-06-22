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
import { SiteNavLinks } from "@/components/layout/site-nav-links";
import { SiteLogo } from "@/components/layout/site-logo";
import { headerNavItems } from "@/lib/constants/navigation";

function HeaderBrand() {
  return <SiteLogo size="md" />;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto grid h-16 max-w-5xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6">
        {/* Marca — esquerda */}
        <div className="shrink-0 justify-self-start">
          <HeaderBrand />
        </div>

        {/* Navegação — centro (desktop) */}
        <nav
          aria-label="Principal"
          className="hidden items-center gap-8 md:flex"
        >
          <SiteNavLinks variant="header" />
        </nav>

        {/* CTA — direita (desktop) */}
        <div className="hidden items-center gap-2 justify-self-end md:flex">
          <Link to="/login">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-700/60 bg-slate-900/40 text-slate-300 hover:border-brand-teal/40 hover:bg-slate-800/60 hover:text-brand-teal"
            >
              Acessar
            </Button>
          </Link>
          <Link to="/contato">
            <Button
              size="sm"
              className="bg-brand-blue font-semibold text-white shadow-md shadow-brand-blue/20 hover:bg-brand-blue/90"
            >
              Fale com o Especialista
            </Button>
          </Link>
        </div>

        {/* Mobile — hambúrguer + sheet */}
        <div className="col-start-3 justify-self-end md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Abrir menu"
                  className="h-9 w-9 text-slate-300 hover:bg-slate-800/60 hover:text-white"
                />
              }
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-72 flex-col gap-0 border-slate-800/50 bg-slate-950 p-0"
            >
              <SheetHeader className="border-b border-slate-800/50 p-4">
                <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
                <HeaderBrand />
              </SheetHeader>

              <nav
                aria-label="Mobile"
                className="flex flex-col gap-1 overflow-y-auto p-4"
              >
                <SiteNavLinks
                  items={headerNavItems}
                  variant="header"
                  onNavigate={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 hover:bg-slate-900/60"
                />
              </nav>

              <div className="mt-auto space-y-2 border-t border-slate-800/50 p-4">
                <Link to="/login" onClick={() => setOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full border-slate-700/60 bg-slate-900/40 text-slate-300 hover:border-brand-teal/40 hover:text-brand-teal"
                  >
                    Acessar
                  </Button>
                </Link>
                <Link to="/contato" onClick={() => setOpen(false)}>
                  <Button className="w-full bg-brand-blue font-semibold text-white hover:bg-brand-blue/90">
                    Fale com o Especialista
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
