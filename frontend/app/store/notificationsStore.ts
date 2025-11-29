export type AppNotification = {
  id: string;
  title: string;
  message: string;
  type?: "info" | "success" | "warning" | "error";
  read?: boolean;
  createdAt?: string;
};
