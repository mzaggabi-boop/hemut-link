// app/dashboard/layout.tsx
"use client";

export const dynamic = "force-dynamic";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search, ChevronDown } from "lucide-react";
import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const getCurrentLabel = () => {
    if (pathname.startsWith("/dashboard/artisan")) return "Tableau de bord artisan";
    if (pathname.startsWith("/dashboard/vendor")) return "Tableau de bord vendeur";
    if (pathname.startsWith("/dashboard/admin")) return "Administration Hemut-link";
    if (pathname.startsWith("/dashboard/entreprise")) return "Espace entreprise";
    return "Tableau de bord";
  };

  const currentLabel = getCurrentLabel();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">

          <div className="flex items-center gap-2">
            <Link href="/" className="text-sm font-semibold text-gray-900">
              Hemut-link
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-sm text-gray-600 truncate max-w-[200px] sm:max-w-none">
              {currentLabel}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Rechercher…"
                className="pl-9 pr-3 py-2 rounded-lg border border-gray-300 text-sm bg-gray-50 focus:bg-white focus:border-black focus:outline-none transition"
              />
            </div>

            <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition">
              <Bell className="h-4 w-4 text-gray-600" />
            </button>

            <button className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition">
              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold text-gray-700">
                HL
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-sm font-medium text-gray-900">
                  Mon entreprise
                </span>
                <span className="text-xs text-gray-500">
                  artisan@hemut-link.pro
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex gap-4 items-start">
          <DashboardSidebar
            role={"ARTISAN"}
            pathname={pathname}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
          />

          <div className="flex-1">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
