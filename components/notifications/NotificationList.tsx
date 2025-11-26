"use client";

import Link from "next/link";

export default function NotificationList({ notifications }) {
  if (notifications.length === 0) {
    return (
      <p className="text-xs text-center text-gray-500 py-4">
        Aucune notification.
      </p>
    );
  }

  return (
    <ul className="max-h-80 overflow-y-auto">
      {notifications.map((notif) => (
        <li key={notif.id} className="px-3 py-2 hover:bg-gray-50">
          <Link href={notif.link ?? "#"} className="block">
            <p className="text-xs font-semibold">{notif.title}</p>
            <p className="text-[11px] text-gray-600">{notif.message}</p>
            <p className="text-[10px] text-gray-400 mt-1">
              {new Date(notif.createdAt).toLocaleString("fr-FR")}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
