// components/orders/VendorStatusButtons.tsx
"use client";

import { useState } from "react";

type OrderStatus =
  | "PENDING"        // commande passée, en attente de traitement
  | "CONFIRMED"      // acceptée par le vendeur
  | "PREPARING"      // en préparation
  | "SHIPPED"        // expédiée
  | "DELIVERED"      // livrée
  | "CANCELLED";     // annulée

interface VendorStatusButtonsProps {
  orderId: string;
  currentStatus: OrderStatus;
}

const LABELS: Record<OrderStatus, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  PREPARING: "En préparation",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

// Statuts que le vendeur peut déclencher manuellement
const NEXT_STATUSES: OrderStatus[] = [
  "CONFIRMED",
  "PREPARING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export function VendorStatusButtons({
  orderId,
  currentStatus,
}: VendorStatusButtonsProps) {
  const [optimisticStatus, setOptimisticStatus] =
    useState<OrderStatus>(currentStatus);
  const [loadingStatus, setLoadingStatus] = useState<OrderStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChangeStatus = async (nextStatus: OrderStatus) => {
    setError(null);
    setSuccessMessage(null);
    setLoadingStatus(nextStatus);

    // Optimistic UI
    const previousStatus = optimisticStatus;
    setOptimisticStatus(nextStatus);

    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const message =
          data?.error ||
          data?.message ||
          "Impossible de mettre à jour le statut.";
        throw new Error(message);
      }

      setSuccessMessage(`Statut mis à jour : ${LABELS[nextStatus]}`);
    } catch (err: any) {
      // Rollback optimistic UI
      setOptimisticStatus(previousStatus);
      setError(err.message || "Erreur inattendue lors de la mise à jour.");
    } finally {
      setLoadingStatus(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">
          Statut actuel (vendeur)
        </span>
        <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold">
          {LABELS[optimisticStatus]}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {NEXT_STATUSES.map((status) => {
          const isActive = optimisticStatus === status;
          const isLoading = loadingStatus === status;

          return (
            <button
              key={status}
              type="button"
              onClick={() => handleChangeStatus(status)}
              disabled={isLoading}
              className={[
                "rounded-full px-3 py-1 text-xs font-medium border transition",
                "disabled:opacity-60 disabled:cursor-not-allowed",
                isActive
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-800 hover:bg-gray-100",
              ].join(" ")}
            >
              {isLoading ? "Mise à jour..." : LABELS[status]}
            </button>
          );
        })}
      </div>

      {error && (
        <p className="text-xs text-red-600">
          {error}
        </p>
      )}

      {successMessage && (
        <p className="text-xs text-emerald-600">
          {successMessage}
        </p>
      )}
    </div>
  );
}
