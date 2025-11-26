"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import NotificationList from "./NotificationList";

export default function NotificationBell({ notifications }) {
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-full p-2 hover:bg-gray-100"
      >
        <Bell className="h-5 w-5 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute right-0 top-0 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl border bg-white py-2 shadow-lg z-50">
          <NotificationList notifications={notifications} />
        </div>
      )}
    </div>
  );
}
