import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import { dashboardTitleFromPath } from "@/lib/constants/dashboard-nav";

export function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();
  const title = dashboardTitleFromPath(pathname);

  return (
    <div className="flex h-svh overflow-hidden bg-background">
      {/* Sidebar */}
      <DashboardSidebar collapsed={collapsed} />

      {/* Main panel */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardTopbar
          sidebarCollapsed={collapsed}
          onToggleSidebar={() => setCollapsed((v) => !v)}
          title={title}
        />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
