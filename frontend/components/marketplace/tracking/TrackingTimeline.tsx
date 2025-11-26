export default function TrackingTimeline({
  order,
}: {
  order: any;
}) {
  return (
    <div className="space-y-4">
      {order.shippedAt && (
        <div className="text-sm">
          📦 <b>Colis expédié</b> le{" "}
          {new Date(order.shippedAt).toLocaleString("fr-FR")}
        </div>
      )}

      {order.trackingNumber && (
        <div className="text-sm">
          🔎 <b>Suivi :</b> {order.trackingNumber}
        </div>
      )}

      {order.trackingUrl && (
        <a
          href={order.trackingUrl}
          target="_blank"
          className="text-blue-600 underline text-sm"
        >
          Lien de suivi transporteur →
        </a>
      )}

      {order.deliveredAt && (
        <div className="text-sm text-emerald-600 font-semibold">
          ✔ Livré le{" "}
          {new Date(order.deliveredAt).toLocaleString("fr-FR")}
        </div>
      )}
    </div>
  );
}
