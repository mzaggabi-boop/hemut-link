"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Briefcase,
  Car,
  BarChart,
  Wrench,
  Menu,
  X,
} from "lucide-react";

interface MenuItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface Props {
  role: string;
  pathname: string;
  isCollapsed: boolean;
  setIsCollapsed: (v: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (v: boolean) => void;
}

export default function DashboardSidebar({
  role,
  pathname,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}: Props) {
  const base = "/dashboard";

  // MENU PAR RÔLE (PRISMA UserRole)
  const menusByRole: Record<string, MenuItem[]> = {
    ARTISAN: [
      { label: "Accueil", href: `${base}/artisan`, icon: LayoutDashboard },
      { label: "Missions GO", href: `${base}/artisan/missions`, icon: Car },
      { label: "Interventions", href: `${base}/artisan/interventions`, icon: Wrench },
      { label: "Devis", href: `${base}/artisan/devis`, icon: Briefcase },
    ],
    FOURNISSEUR: [
      { label: "Tableau de bord", href: `${base}/vendor`, icon: LayoutDashboard },
      { label: "Produits", href: `${base}/vendor/products`, icon: Package },
      { label: "Commandes", href: `${base}/vendor/orders`, icon: ShoppingCart },
      { label: "Statistiques", href: `${base}/vendor/stats`, icon: BarChart },
    ],
    CLIENT: [
      { label: "Accueil", href: `${base}/entreprise`, icon: LayoutDashboard },
      { label: "Missions", href: `${base}/entreprise/missions`, icon: Briefcase },
      { label: "Prestataires", href: `${base}/entreprise/prestataires`, icon: Users },
    ],
    ADMIN: [
      { label: "Dashboard admin", href: `${base}/admin`, icon: LayoutDashboard },
      { label: "Utilisateurs", href: `${base}/admin/users`, icon: Users },
      { label: "Vendeurs", href: `${base}/admin/vendors`, icon: Briefcase },
      { label: "Statistiques", href: `${base}/admin/stats`, icon: BarChart },
    ],
  };

  const items = menusByRole[role] ?? [];

  const isActive = (href: string) => pathname === href;

  const renderItem = (item: MenuItem) => {
    const Icon = item.icon;

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
          isActive(item.href)
            ? "bg-black text-white"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        <Icon className="h-4 w-4" />
        {!isCollapsed && <span>{item.label}</span>}
      </Link>
    );
  };

  // Fermer le menu mobile à chaque navigation
  useEffect(() => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  }, [pathname]);

  return (
    <>
      {/* SIDEBAR DESKTOP */}
      <aside
        className={`hidden md:block h-full bg-white rounded-xl border p-3 shadow-sm sticky top-24 transition-all ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        <button
          className="mb-3 flex items-center justify-between w-full text-xs text-gray-500"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {!isCollapsed && <span>Navigation</span>}
          <span className="px-2 py-1 rounded-full border">
            {isCollapsed ? "»" : "«"}
          </span>
        </button>

        <nav className="space-y-1">{items.map(renderItem)}</nav>
      </aside>

      {/* Bouton mobile */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden inline-flex items-center gap-2 px-3 py-2 rounded-lg border bg-white shadow-sm"
      >
        <Menu className="h-4 w-4" />
        <span className="text-sm">Menu</span>
      </button>

      {/* Drawer mobile */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">

          <div
            className="flex-1 bg-black/40"
            onClick={() => setIsMobileOpen(false)}
          />

          <div className="w-72 bg-white h-full shadow-xl p-4 flex flex-col">

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold">Navigation</span>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="space-y-1">
              {items.map(renderItem)}
            </nav>

          </div>
        </div>
      )}
    </>
  );
}
