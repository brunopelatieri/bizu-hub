export const dashboardTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/projetos": "Projetos",
  "/dashboard/clientes": "Clientes",
  "/dashboard/arquivos": "Arquivos",
  "/dashboard/relatorios": "Relatórios",
  "/dashboard/configuracoes": "Configurações",
};

export function dashboardTitleFromPath(pathname: string): string {
  return dashboardTitles[pathname] ?? "Dashboard";
}
