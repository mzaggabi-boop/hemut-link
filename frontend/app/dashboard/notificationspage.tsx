import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { markAllAsRead } from "@/lib/notifications";

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  await markAllAsRead();

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 space-y-6">
      <h1 className="text-xl font-semibold">Notifications</h1>

      <div className="rounded-xl border bg-white p-4 shadow-sm space-y-4">
        {notifications.length === 0 ? (
          <p className="text-xs text-gray-500">Aucune notification.</p>
        ) : (
          <ul className="divide-y divide-gray-100 text-xs">
            {notifications.map((n) => (
              <li key={n.id} className="py-3">
                <p className="font-semibold text-gray-900">
                  Notification
                </p>

                <p className="text-gray-700">{n.message}</p>

                <p className="text-[10px] text-gray-400 mt-1">
                  {new Date(n.createdAt).toLocaleString("fr-FR")}
                </p>

                {n.url && (
                  <a
                    href={n.url}
                    className="text-[11px] text-blue-600 underline mt-1 block"
                  >
                    Voir la page
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
