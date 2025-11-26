// lib/hooks/useRealtimeNotifications.ts

"use client";

import { useEffect } from "react";

export default function useRealtimeNotifications(onNew: () => void) {
  useEffect(() => {
    // 1) Event interne
    const handler = () => onNew();
    window.addEventListener("notification:new", handler);

    // 2) BroadcastChannel pour onglets
    const bc = new BroadcastChannel("hemut-realtime");
    bc.onmessage = (msg) => {
      if (msg.data?.eventName === "notification:new") {
        onNew();
      }
    };

    return () => {
      window.removeEventListener("notification:new", handler);
      bc.close();
    };
  }, [onNew]);
}
