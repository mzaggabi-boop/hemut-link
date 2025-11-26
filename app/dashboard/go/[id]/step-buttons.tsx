// app/dashboard/go/[id]/step-buttons.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type GoJobStep =
  | "ARTISAN_EN_ROUTE"
  | "ARTISAN_ARRIVE"
  | "TRAVAIL_EN_COURS"
  | "TRAVAIL_TERMINE"
  | "EN_ATTENTE_VALIDATION_CLIENT";

const STEP_ORDER: Record<GoJobStep, number> = {
  ARTISAN_EN_ROUTE: 1,
  ARTISAN_ARRIVE: 2,
  TRAVAIL_EN_COURS: 3,
  TRAVAIL_TERMINE: 4,
  EN_ATTENTE_VALIDATION_CLIENT: 5,
};

const STEP_LABELS: Record<GoJobStep, string> = {
  ARTISAN_EN_ROUTE: "Je suis en route",
  ARTISAN_ARRIVE: "Je suis arrivé",
  TRAVAIL_EN_COURS: "Travail en cours",
  TRAVAIL_TERMINE: "Travail terminé",
  EN_ATTENTE_VALIDATION_CLIENT: "En attente validation client",
};

interface StepButtonsProps {
  jobId: number;
  currentStep: GoJobStep | null;
}

export default function StepButtons({ jobId, currentStep }: StepButtonsProps) {
  const router = useRouter();
  const [loadingStep, setLoadingStep] = useState<GoJobStep | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleClick(step: GoJobStep) {
    setError(null);
    setLoadingStep(step);

    try {
      const res = await fetch(`/api/go/${jobId}/step`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ step }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erreur lors de la mise à jour de l'étape.");
        setLoadingStep(null);
        return;
      }

      // Rafraîchir la page pour mettre à jour la timeline + currentStep
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Erreur réseau.");
      setLoadingStep(null);
    }
  }

  function getStatus(step: GoJobStep) {
    if (!currentStep) return "pending";

    const currentOrder = STEP_ORDER[currentStep];
    const thisOrder = STEP_ORDER[step];

    if (thisOrder < currentOrder) return "done";
    if (thisOrder === currentOrder) return "current";
    return "next";
  }

  const steps: GoJobStep[] = [
    "ARTISAN_EN_ROUTE",
    "ARTISAN_ARRIVE",
    "TRAVAIL_EN_COURS",
    "TRAVAIL_TERMINE",
    "EN_ATTENTE_VALIDATION_CLIENT",
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">
        Suivi de mission (artisan)
      </h3>

      <div className="space-y-2">
        {steps.map((step) => {
          const status = getStatus(step);
          const isDisabled =
            status === "done" ||
            status === "current" ||
            loadingStep !== null;

          let borderClass = "border-gray-200";
          let dotClass = "bg-gray-200";
          let textClass = "text-gray-700";
          let badge = "";

          if (status === "done") {
            borderClass = "border-emerald-500";
            dotClass = "bg-emerald-500";
            textClass = "text-emerald-700";
            badge = "Terminé";
          } else if (status === "current") {
            borderClass = "border-blue-500";
            dotClass = "bg-blue-500";
            textClass = "text-blue-700";
            badge = "En cours";
          }

          return (
            <button
              key={step}
              type="button"
              onClick={() => handleClick(step)}
              disabled={isDisabled}
              className={`w-full flex items-center justify-between rounded-lg border px-3 py-2 text-left text-xs transition ${
                isDisabled && status !== "next"
                  ? "bg-gray-50 cursor-default"
                  : "bg-white hover:bg-gray-50"
              } ${borderClass}`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${dotClass}`}
                  aria-hidden
                />
                <span className={`font-medium ${textClass}`}>
                  {STEP_LABELS[step]}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {badge && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] uppercase tracking-wide text-gray-600">
                    {badge}
                  </span>
                )}
                {status === "next" && !loadingStep && (
                  <span className="text-[10px] text-gray-400">
                    Prochaine étape
                  </span>
                )}
                {loadingStep === step && (
                  <span className="text-[10px] text-gray-400">
                    Mise à jour…
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {error && <p className="text-[11px] text-red-600">{error}</p>}
      {loadingStep && (
        <p className="text-[11px] text-gray-500">
          Mise à jour de l&apos;étape{" "}
          <span className="font-semibold">
            {STEP_LABELS[loadingStep]}
          </span>
          …
        </p>
      )}
    </div>
  );
}

