"use client";

import Link from "next/link";
import { Bell, Menu } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import useRealtimeNotifications from "@/lib/hooks/useRealtimeNotifications";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [countUnread, setCountUnread] = useState(0);

  const loadNotifs = useCallback(async () => {
    const r = await fetch("/api/notifications");
    const d = await r.json();

    setNotifications(d.notifications);
    setCountUnread(d.notifications.filter((n) => !n.read).length);
  }, []);

  // Charger au montage
  useEffect(() => {
    loadNotifs();
  }, [loadNotifs]);

  // Charger en temps réel
  useRealtimeNotifications(() => {
    loadNotifs();
  });

  return (
    <nav className="fixed top-0 left-0 w-full bg-white border-b shadow-sm z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

        <Link href="/dashboard" className="text-xl font-bold text-indigo-600">
          Hemut-link
        </Link>

        <div className="flex items-center gap-4">

          {/* Cloche */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="relative p-2 rounded-full hover:bg-gray-100"
            >
              <Bell className="w-6 h-6 text-gray-700" />

              {countUnread > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white text-[11px] px-1 rounded-full">
                  {countUnread}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-xl z-50">
                <div className="p-3 border-b text-sm font-semibold">
                  Notifications
                </div>

                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-3 text-xs text-gray-500">
                      Aucune notification.
                    </p>
                  ) : (
                    notifications.map((n) => (
                      <Link
                        key={n.id}
                        href={n.url || "#"}
                        className="block px-3 py-2 border-b hover:bg-gray-50"
                      >
                        <p className="text-xs font-medium">{n.message}</p>
                        <p className="text-[10px] text-gray-500">
                          {new Date(n.createdAt).toLocaleString("fr-FR")}
                        </p>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
    </nav>
  );
}
