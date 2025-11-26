// components/marketplace/StatusBadge.tsx

type Props = {
  status: string;
};

function getLabel(status: string) {
  const s = status.toLowerCase();

  switch (s) {
    case "pending":
      return "En attente de paiement";
    case "paid":
      return "Payée";
    case "shipped":
      return "Expédiée";
    case "delivered":
      return "Livrée";
    case "cancelled":
      return "Annulée";
    default:
      return status;
  }
}

function getClasses(status: string) {
  const s = status.toLowerCase();

  switch (s) {
    case "pending":
      return "bg-amber-50 text-amber-800 border-amber-200";
    case "paid":
      return "bg-blue-50 text-blue-800 border-blue-200";
    case "shipped":
      return "bg-sky-50 text-sky-800 border-sky-200";
    case "delivered":
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
    case "cancelled":
      return "bg-rose-50 text-rose-800 border-rose-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

export default function StatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${getClasses(
        status
      )}`}
    >
      Statut : {getLabel(status)}
    </span>
  );
}
