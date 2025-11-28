// lib/notifications.ts
"use server";

import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/**
 * Crée une notification simple pour un utilisateur.
 */
export async function notifyUser(params: {
  userId: number;
  message: string;
  url?: string;
}) {
  const { userId, message, url } = params;

  if (!message || !message.trim()) return null;

  const notif = await prisma.notification.create({
    data: {
      userId,
      message: message.trim(),
      url: url ?? null,
    },
  });

  return notif;
}

/**
 * Marque UNE notification comme lue pour l'utilisateur connecté.
 */
export async function markNotificationAsRead(notificationId: number) {
  const user = await getCurrentUser();
  if (!user) return;

  await prisma.notification.updateMany({
    where: {
      id: notificationId,
      userId: user.id,
      read: false,
    },
    data: {
      read: true,
    },
  });
}

/**
 * Marque TOUTES les notifications comme lues pour l'utilisateur connecté.
 * (Nouvel alias utilisé par notificationspage.tsx)
 */
export async function markAllAsRead() {
  return markAllNotificationsAsRead();
}

/**
 * Marque toutes les notifications comme lues.
 */
export async function markAllNotificationsAsRead() {
  const user = await getCurrentUser();
  if (!user) return;

  await prisma.notification.updateMany({
    where: {
      userId: user.id,
      read: false,
    },
    data: {
      read: true,
    },
  });
}

/* =======================================================================
 *  HEMUT-LINK GO – HELPERS NOTIFICATIONS
 * =======================================================================
 */

/**
 * Notifier le client qu'une étape de la mission GO a changé.
 */
export async function notifyGoClientStep(params: {
  clientId: number;
  jobId: number;
  stepLabel: string;
}) {
  const { clientId, jobId, stepLabel } = params;

  return notifyUser({
    userId: clientId,
    message: `Mise à jour de votre mission GO #${jobId} : ${stepLabel}.`,
    url: `/dashboard/go/${jobId}`,
  });
}

/**
 * Notifier un artisan qu'une mission GO lui est assignée.
 */
export async function notifyGoArtisanAssigned(params: {
  artisanId: number;
  jobId: number;
  title: string;
}) {
  const { artisanId, jobId, title } = params;

  return notifyUser({
    userId: artisanId,
    message: `Nouvelle mission GO #${jobId} assignée : "${title}".`,
    url: `/dashboard/go/${jobId}`,
  });
}

/**
 * Notifier le client que la mission GO a été terminée par l'artisan.
 */
export async function notifyGoClientCompleted(params: {
  clientId: number;
  jobId: number;
}) {
  const { clientId, jobId } = params;

  return notifyUser({
    userId: clientId,
    message: `La mission GO #${jobId} a été marquée comme terminée par l'artisan.`,
    url: `/dashboard/go/${jobId}`,
  });
}

/* =======================================================================
 *  MARKETPLACE – HELPERS NOTIFICATIONS
 * =======================================================================
 */

/**
 * Nouvelle commande créée (après création de session Checkout).
 */
export async function notifyMarketplaceOrderCreated(params: {
  orderId: number;
  buyerId: number;
  sellerId: number;
  productTitle: string;
}) {
  const { orderId, buyerId, sellerId, productTitle } = params;

  // Vendeur : nouvelle commande
  await notifyUser({
    userId: sellerId,
    message: `Nouvelle commande #${orderId} reçue pour "${productTitle}".`,
    url: `/dashboard/marketplace/sales`,
  });

  // Acheteur : confirmation
  await notifyUser({
    userId: buyerId,
    message: `Votre commande #${orderId} pour "${productTitle}" a bien été créée.`,
    url: `/dashboard/orders/${orderId}`,
  });
}

/**
 * Paiement confirmé pour une commande Marketplace.
 */
export async function notifyMarketplaceOrderPaid(params: {
  orderId: number;
  buyerId: number;
  sellerId: number;
}) {
  const { orderId, buyerId, sellerId } = params;

  await notifyUser({
    userId: buyerId,
    message: `Le paiement de votre commande #${orderId} est confirmé.`,
    url: `/dashboard/orders/${orderId}`,
  });

  await notifyUser({
    userId: sellerId,
    message: `Le paiement de la commande #${orderId} est confirmé. Préparez l'expédition.`,
    url: `/dashboard/marketplace/sales`,
  });
}

/**
 * Commande expédiée par le vendeur.
 */
export async function notifyMarketplaceOrderShipped(params: {
  orderId: number;
  buyerId: number;
}) {
  const { orderId, buyerId } = params;

  await notifyUser({
    userId: buyerId,
    message: `Votre commande #${orderId} a été expédiée.`,
    url: `/dashboard/orders/${orderId}/tracking`,
  });
}

/**
 * Commande livrée.
 */
export async function notifyMarketplaceOrderDelivered(params: {
  orderId: number;
  buyerId: number;
}) {
  const { orderId, buyerId } = params;

  await notifyUser({
    userId: buyerId,
    message: `Votre commande #${orderId} est indiquée comme livrée.`,
    url: `/dashboard/orders/${orderId}/tracking`,
  });
}

/**
 * Nouveau message dans le chat Marketplace.
 */
export async function notifyMarketplaceChatMessage(params: {
  orderId: number;
  fromUserId: number;
  toUserId: number;
}) {
  const { orderId, toUserId } = params;

  await notifyUser({
    userId: toUserId,
    message: `Nouveau message concernant la commande #${orderId}.`,
    url: `/dashboard/orders/${orderId}/chat`,
  });
}

/**
 * Litige ouvert.
 */
export async function notifyMarketplaceDisputeOpened(params: {
  orderId: number;
  buyerId: number;
  sellerId: number;
}) {
  const { orderId, buyerId, sellerId } = params;

  await notifyUser({
    userId: buyerId,
    message: `Vous avez ouvert un litige sur la commande #${orderId}.`,
    url: `/dashboard/m10/litige/${orderId}`,
  });

  await notifyUser({
    userId: sellerId,
    message: `Un litige a été ouvert sur la commande #${orderId}.`,
    url: `/dashboard/m10/litige/${orderId}`,
  });
}
