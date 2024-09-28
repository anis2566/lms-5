"use client";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { Sidebar } from "./sidebar";
import { useSidebar } from "@/hooks/use-sidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const sidebar = useSidebar(useSidebarToggle, (state) => state);
  const pathname = usePathname();

  if (!sidebar) return null;

  const isChatPage = pathname === "/dashboard/chat";
  const isNoLayout = pathname.includes("/chapters");

  return (
    <>
      {!isChatPage && !isNoLayout && <Sidebar />}
      <main
        className={cn(
          "min-h-[calc(100vh_-_56px)] transition-[margin-left] duration-300 ease-in-out",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-64",
          isChatPage && "lg:ml-0",
          isNoLayout && "lg:ml-0",
        )}
      >
        {children}
      </main>
    </>
  );
}
