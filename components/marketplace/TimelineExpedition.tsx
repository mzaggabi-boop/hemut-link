// components/marketplace/TimelineExpedition.tsx

type Props = {
  current: string; // ex: "pending" | "paid" | "shipped" | "delivered" | "cancelled"
};

const steps = [
  {
    key: "paid",
    label: "Paiement confirmé",
    description: "La commande a été payée par l’acheteur.",
  },
  {
    key: "shipped",
    label: "Commande expédiée",
    description: "Le vendeur a remis le colis au transporteur.",
  },
  {
    key: "delivered",
    label: "Commande livrée",
    description: "Le colis est arrivé chez le client.",
  },
];

function statusIndex(status: string) {
  const s = status.toLowerCase();
  switch (s) {
    case "paid":
      return 0;
    case "shipped":
      return 1;
    case "delivered":
      return 2;
    default:
      return -1;
  }
}

export default function TimelineExpedition({ current }: Props) {
  const currentIndex = statusIndex(current);

  if (current.toLowerCase() === "cancelled") {
    return (
      <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
        <p className="font-semibold">Commande annulée</p>
        <p className="mt-1">
          Cette commande a été annulée. Aucun suivi d&apos;expédition
          n&apos;est disponible.
        </p>
      </div>
    );
  }

  return (
    <ol className="space-y-3 text-xs">
      {steps.map((step, index) => {
        const isDone = currentIndex >= index && currentIndex !== -1;
        const isCurrent = currentIndex === index;

        return (
          <li key={step.key} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full border text-[9px] ${
                  isDone || isCurrent
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : "border-gray-300 bg-white text-gray-400"
                }`}
              >
                {isDone ? "✓" : index + 1}
              </span>
              {index < steps.length - 1 && (
                <span
                  className={`mt-1 h-8 w-px ${
                    isDone ? "bg-emerald-400" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
            <div>
              <p
                className={`font-medium ${
                  isDone || isCurrent ? "text-gray-900" : "text-gray-500"
                }`}
              >
                {step.label}
              </p>
              <p className="text-[11px] text-gray-500">{step.description}</p>
              {isCurrent && (
                <p className="mt-1 text-[11px] font-semibold text-emerald-600">
                  Étape actuelle
                </p>
              )}
            </div>
          </li>
        );
      })}

      {currentIndex === -1 && (
        <li className="mt-2 text-[11px] text-gray-500">
          Le paiement n&apos;est pas encore confirmé. Le suivi d&apos;expédition
          commencera une fois la commande payée.
        </li>
      )}
    </ol>
  );
}
