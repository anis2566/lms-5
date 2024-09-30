"use client";

import { cn } from "@/lib/utils";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { useSidebar } from "@/hooks/use-sidebar";
import { Menu } from "./menu";
import { SidebarToggle } from "./sidebar-toggle";
import { Logo } from "@/components/logo";

export function Sidebar() {
  const sidebar = useSidebar(useSidebarToggle, (state) => state);

  if (!sidebar) return null;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-20 h-screen -translate-x-full bg-muted/40 transition-[width] duration-300 ease-in-out lg:translate-x-0",
        sidebar?.isOpen === false ? "w-[90px]" : "w-64",
      )}
    >
      <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
      <div className="relative flex h-full flex-col overflow-y-auto px-3 py-4 shadow-md dark:shadow-zinc-800">
        <Logo callbackUrl="/dashboard" className={!sidebar?.isOpen ? "hidden" : "block"} />
        <Menu isOpen={sidebar?.isOpen} />
      </div>
    </aside>
  );
}
