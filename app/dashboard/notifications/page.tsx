// app/dashboard/notifications/page.tsx

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { markAllNotificationsAsRead } from "@/lib/notifications";
import { redirect } from "next/navigation";

function formatDate(date: Date) {
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function markAllReadAction() {
  "use server";
  await markAllNotificationsAsRead();
  redirect("/dashboard/notifications");
}

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 space-y-6">
      <header className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Notifications
          </h1>
          <p className="text-xs text-gray-600">
            Dernières notifications liées à vos commandes, missions GO et
            litiges sur Hemut-link.
          </p>
        </div>

        {notifications.some((n) => !n.read) && (
          <form action={markAllReadAction}>
            <button
              type="submit"
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              Tout marquer comme lu
            </button>
          </form>
        )}
      </header>

      {notifications.length === 0 ? (
        <p className="text-sm text-gray-500">
          Vous n&apos;avez encore aucune notification.
        </p>
      ) : (
        <ul className="divide-y divide-gray-100 text-sm">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`py-3 flex flex-col gap-1 ${
                n.read ? "bg-white" : "bg-indigo-50"
              }`}
            >
              <p className="text-xs text-gray-800">{n.message}</p>
              <p className="text-[11px] text-gray-500">
                {formatDate(n.createdAt)}
              </p>
              {n.url && (
                <a
                  href={n.url}
                  className="text-[11px] text-indigo-600 hover:underline"
                >
                  Ouvrir →
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}