// app/notifications/page.tsx
"use client";

import { useEffect, useState } from "react";
import Button from "../../components/Button";

import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8081";

interface NotificationItem {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export default function NotificationsPage() {
  const router = useRouter();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    const res = await fetch(`${API_URL}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok) setItems(data.notifications || []);
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <Button variant="secondary" onClick={() => router.back()}>
        ← Retour
      </Button>

      <h1 className="text-2xl font-semibold text-amber-400">
        Notifications
      </h1>

      {loading ? (
        <div className="text-neutral-300">Chargement…</div>
      ) : items.length === 0 ? (
        <div className="text-neutral-400">Aucune notification.</div>
      ) : (
        <div className="space-y-3">
          {items.map((n) => (
            <div
              key={n.id}
              className={`bg-neutral-900 border rounded-xl p-4 space-y-1 ${
                n.read ? "border-neutral-800" : "border-amber-400/50"
              }`}
            >
              <p className="text-neutral-100 text-sm">{n.message}</p>
              <p className="text-neutral-500 text-xs">
                {new Date(n.createdAt).toLocaleString()}
              </p>
              <p className="text-neutral-500 text-xs">
                Type : {n.type}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
