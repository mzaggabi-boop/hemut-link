import { AppNotification } from "../store/notificationsStore";

const WS_URL =
  process.env.NEXT_PUBLIC_NOTIFICATIONS_WS_URL ??
  "ws://127.0.0.1:8081/ws/notifications";

export function initNotificationsWebSocket(
  token: string,
  onNotification: (notif: AppNotification) => void
): () => void {
  // Le backend déduit l'utilisateur depuis le token
  const url = `${WS_URL}?token=${encodeURIComponent(token)}`;
  const socket = new WebSocket(url);

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data && data.notification) {
        onNotification(data.notification as AppNotification);
      }
    } catch {
      // ignore parse error
    }
  };

  // Reconnexion simple si nécessaire
  socket.onclose = () => {
    // on laisse la reconnection gérée côté composant si besoin
  };

  return () => {
    socket.close();
  };
}
