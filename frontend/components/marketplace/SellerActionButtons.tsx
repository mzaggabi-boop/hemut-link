"use client";

export default function SellerActionButtons({
  orderId,
  currentStatus,
}: {
  orderId: number;
  currentStatus: string;
}) {
  async function update(status: string) {
    const res = await fetch(`/api/marketplace/order/${orderId}/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      alert("Erreur modification du statut.");
      return;
    }

    window.location.reload();
  }

  return (
    <div className="space-y-2">
      {currentStatus === "paid" && (
        <button
          onClick={() => update("preparing")}
          className="px-3 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full"
        >
          Marquer “En préparation”
        </button>
      )}

      {currentStatus === "preparing" && (
        <button
          onClick={() => update("shipped")}
          className="px-3 py-2 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 w-full"
        >
          Marquer “Expédié”
        </button>
      )}

      {currentStatus === "shipped" && (
        <button
          onClick={() => update("delivered")}
          className="px-3 py-2 text-xs bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 w-full"
        >
          Marquer “Livré”
        </button>
      )}

      {(currentStatus === "pending" || currentStatus === "paid") && (
        <button
          onClick={() => update("canceled")}
          className="px-3 py-2 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 w-full"
        >
          Annuler commande
        </button>
      )}
    </div>
  );
}
