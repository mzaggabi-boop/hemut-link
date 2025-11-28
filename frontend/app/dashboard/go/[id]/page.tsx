// app/dashboard/go/[id]/page.tsx
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Map from "./map";
import CompleteButton from "./complete-button";
import StepButtons from "./step-buttons";

function formatDateTime(date: Date) {
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusLabel(status: string) {
  switch (status) {
    case "PENDING":
      return "En attente";
    case "ACCEPTED":
      return "Acceptée";
    case "IN_PROGRESS":
      return "En cours";
    case "COMPLETED":
      return "Terminée";
    case "CANCELLED":
      return "Annulée";
    default:
      return status;
  }
}

function getStatusClass(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-amber-50 text-amber-800 border-amber-200";
    case "ACCEPTED":
      return "bg-blue-50 text-blue-800 border-blue-200";
    case "IN_PROGRESS":
      return "bg-sky-50 text-sky-800 border-sky-200";
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
    case "CANCELLED":
      return "bg-rose-50 text-rose-800 border-rose-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

function formatStepLabel(step: string | null) {
  switch (step) {
    case "ARTISAN_EN_ROUTE":
      return "Artisan en route";
    case "ARTISAN_ARRIVE":
      return "Artisan arrivé sur place";
    case "TRAVAIL_EN_COURS":
      return "Travail en cours";
    case "TRAVAIL_TERMINE":
      return "Travail terminé";
    case "EN_ATTENTE_VALIDATION_CLIENT":
      return "En attente de validation client";
    default:
      return "Aucune étape enregistrée";
  }
}

export default async function GoJobDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    notFound();
  }

  const job = await prisma.goJob.findUnique({
    where: { id },
    include: {
      client: true,
      artisan: true,
      photos: true,
      progress: {
        orderBy: { createdAt: "asc" },
        include: {
          actor: true,
        },
      },
    },
  });

  if (!job) {
    notFound();
  }

  const hasGeo = job.latitude !== null && job.longitude !== null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      <header className="flex flex-col gap-3 border-b border-gray-100 pb-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-gray-900">
            Mission GO #{job.id} — {job.title}
          </h1>
          <p className="text-xs text-gray-500">
            Créée le {formatDateTime(job.createdAt)} • Client{" "}
            <span className="font-medium">
              {job.client?.firstname} {job.client?.lastname} (
              {job.client?.email})
            </span>
          </p>
        </div>

        <div className="flex flex-col items-start gap-2 md:items-end">
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${getStatusClass(
              job.status
            )}`}
          >
            Statut : {getStatusLabel(job.status)}
          </span>
          <span className="text-[11px] text-gray-500">
            Étape actuelle :{" "}
            <span className="font-medium text-gray-800">
              {formatStepLabel(job.currentStep)}
            </span>
          </span>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
        <section className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Détails de la mission
              </h2>
              <p className="mt-1 text-xs text-gray-600">
                Description, adresse et budget indicatif.
              </p>
            </div>

            <dl className="grid gap-3 text-xs md:grid-cols-2">
              <div className="space-y-1">
                <dt className="text-gray-500">Adresse</dt>
                <dd className="font-medium text-gray-900">
                  {job.address || "Non renseignée"}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-gray-500">Budget indicatif</dt>
                <dd className="font-medium text-gray-900">
                  {job.price
                    ? job.price.toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      })
                    : "Non renseigné"}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-gray-500">Artisan assigné</dt>
                <dd className="font-medium text-gray-900">
                  {job.artisan
                    ? `${job.artisan.firstname || ""} ${
                        job.artisan.lastname || ""
                      } (${job.artisan.email})`
                    : "Aucun pour le moment"}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-gray-500">Client</dt>
                <dd className="font-medium text-gray-900">
                  {job.client
                    ? `${job.client.firstname || ""} ${
                        job.client.lastname || ""
                      } (${job.client.email})`
                    : "—"}
                </dd>
              </div>
            </dl>

            {job.description && (
              <div className="border-t border-dashed border-gray-200 pt-3">
                <h3 className="text-xs font-semibold text-gray-900">
                  Description
                </h3>
                <p className="mt-1 whitespace-pre-wrap text-xs text-gray-700">
                  {job.description}
                </p>
              </div>
            )}

            {job.photos.length > 0 && (
              <div className="border-t border-dashed border-gray-200 pt-3">
                <h3 className="text-xs font-semibold text-gray-900">
                  Photos envoyées par le client
                </h3>
                <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3">
                  {job.photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                    >
                      <img
                        src={photo.url}
                        alt={`Photo mission ${job.id}`}
                        className="h-28 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  Timeline de la mission
                </h2>
                <p className="mt-1 text-xs text-gray-600">
                  Historique des étapes déclarées par l&apos;artisan.
                </p>
              </div>
              <span className="text-[11px] text-gray-400">
                {job.progress.length} étape(s)
              </span>
            </div>

            {job.progress.length === 0 ? (
              <p className="text-xs text-gray-500">
                Aucune étape enregistrée pour le moment.
              </p>
            ) : (
              <ol className="space-y-3">
                {job.progress.map((entry) => (
                  <li key={entry.id} className="flex gap-3">
                    <div className="mt-1">
                      <span className="block h-2 w-2 rounded-full bg-emerald-500" />
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <p className="text-xs font-semibold text-gray-900">
                        {formatStepLabel(entry.step)}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Le {formatDateTime(entry.createdAt)}{" "}
                        {entry.actor && (
                          <>
                            • par{" "}
                            <span className="font-medium">
                              {entry.actor.firstname || ""}{" "}
                              {entry.actor.lastname || ""} (
                              {entry.actor.email})
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
            <h2 className="mb-2 text-sm font-semibold text-gray-900">
              Localisation de la mission
            </h2>
            {hasGeo ? (
              <div className="h-64 overflow-hidden rounded-lg">
                <Map
                  lat={job.latitude as number}
                  lon={job.longitude as number}
                />
              </div>
            ) : (
              <p className="text-xs text-gray-500">
                Aucune coordonnée géographique disponible pour cette mission.
              </p>
            )}
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-4">
            <StepButtons
              jobId={job.id}
              currentStep={job.currentStep as any}
            />

            {(job.status === "IN_PROGRESS" || job.status === "ACCEPTED") && (
              <div className="border-t border-dashed border-gray-200 pt-4">
                <p className="mb-2 text-[11px] text-gray-600">
                  Une fois le travail réellement terminé, vous pouvez marquer la
                  mission comme complétée.
                </p>
                <CompleteButton jobId={job.id} />
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
