// app/dashboard/go/[id]/client-page.tsx
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Map from "./map";
import ValidateButton from "./complete-button";  // ✔ CORRIGÉ


function formatDate(date: Date) {
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function stepLabel(step: string | null) {
  switch (step) {
    case "ARTISAN_EN_ROUTE":
      return "Artisan en route";
    case "ARTISAN_ARRIVE":
      return "Artisan arrivé";
    case "TRAVAIL_EN_COURS":
      return "Travail en cours";
    case "TRAVAIL_TERMINE":
      return "Travail terminé";
    case "EN_ATTENTE_VALIDATION_CLIENT":
      return "En attente de votre validation";
    default:
      return "Non commencée";
  }
}

export default async function ClientGoJobPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (Number.isNaN(id)) notFound();

  const job = await prisma.goJob.findUnique({
    where: { id },
    include: {
      artisan: true,
      client: true,
      photos: true,
      progress: {
        include: { actor: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!job) notFound();

  const hasGeo = job.latitude !== null && job.longitude !== null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
      {/* HEADER */}
      <header className="border-b border-gray-100 pb-4 space-y-1">
        <h1 className="text-xl font-semibold text-gray-900">
          Suivi de la mission #{job.id}
        </h1>
        <p className="text-xs text-gray-600">
          créée le {formatDate(job.createdAt)}
        </p>
        <p className="text-xs text-gray-500">
          Artisan assigné :{" "}
          {job.artisan ? (
            <span className="font-medium text-gray-900">
              {job.artisan.firstname} {job.artisan.lastname} (
              {job.artisan.email})
            </span>
          ) : (
            "Aucun artisan pour l'instant"
          )}
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
        {/* COLONNE GAUCHE */}
        <section className="space-y-6">
          {/* INFO */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-2">
            <h2 className="text-sm font-semibold text-gray-900">Détails</h2>

            <dl className="text-xs space-y-2">
              <div>
                <dt className="text-gray-500">Adresse</dt>
                <dd className="font-medium text-gray-900">{job.address}</dd>
              </div>

              <div>
                <dt className="text-gray-500">Budget</dt>
                <dd className="font-medium text-gray-900">
                  {job.price
                    ? job.price.toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      })
                    : "Non précisé"}
                </dd>
              </div>

              <div>
                <dt className="text-gray-500">Étape actuelle</dt>
                <dd className="font-medium text-gray-900">
                  {stepLabel(job.currentStep)}
                </dd>
              </div>
            </dl>

            {job.description && (
              <div className="border-t border-dashed border-gray-200 pt-3">
                <h3 className="text-xs font-semibold text-gray-900">
                  Description
                </h3>
                <p className="mt-1 text-xs text-gray-700 whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>
            )}

            {job.photos.length > 0 && (
              <div className="border-t border-dashed border-gray-200 pt-3">
                <h3 className="text-xs font-semibold text-gray-900">
                  Photos envoyées
                </h3>
                <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3">
                  {job.photos.map((photo) => (
                    <div
                      key={photo.id}
                      className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                    >
                      <img
                        src={photo.url}
                        alt="photo mission"
                        className="h-28 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* TIMELINE */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Suivi en temps réel
              </h2>
              <p className="text-xs text-gray-600">
                Historique des actions de l&apos;artisan.
              </p>
            </div>

            {job.progress.length === 0 ? (
              <p className="text-xs text-gray-500">
                Aucun événement pour le moment.
              </p>
            ) : (
              <ol className="space-y-3">
                {job.progress.map((entry) => (
                  <li key={entry.id} className="flex gap-3">
                    <div className="mt-1">
                      <span className="block h-2 w-2 rounded-full bg-blue-500" />
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <p className="text-xs font-semibold text-gray-900">
                        {stepLabel(entry.step)}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Le {formatDate(entry.createdAt)}
                        {entry.actor && (
                          <>
                            {" "}
                            • par{" "}
                            <span className="font-medium">
                              {entry.actor.firstname} {entry.actor.lastname} (
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

        {/* COLONNE DROITE */}
        <aside className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
            <h2 className="mb-2 text-sm font-semibold text-gray-900">
              Localisation
            </h2>
            {hasGeo ? (
              <div className="h-64 overflow-hidden rounded-lg">
                <Map
                  latitude={job.latitude as number}
                  longitude={job.longitude as number}
                  title={job.title}
                />
              </div>
            ) : (
              <p className="text-xs text-gray-500">
                Adresse non géocodée pour cette mission.
              </p>
            )}
          </div>

          {/* AVIS + VALIDATION CLIENT (prochain module) */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm space-y-3">
  <p className="text-xs text-gray-600">
    Si la mission est bien terminée, vous pouvez maintenant la valider.
  </p>

  {job.status !== "COMPLETED" ? (
    <ValidateButton jobId={job.id} />
  ) : (
    <p className="text-[11px] text-emerald-700">
      ✔ Mission déjà validée
    </p>
  )}
</div>
{/* LIEN POUR LAISSER UN AVIS */}
{job.status === "COMPLETED" && (
  <a
    href={`/dashboard/go/${job.id}/review`}
    className="block text-center text-xs font-medium text-blue-600 underline"
  >
    Laisser un avis sur l’artisan
  </a>
)}


        </aside>
      </div>
    </main>
  );
}
