import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Stars from "@/components/Stars";

export default async function PublicProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const userId = Number(params.id);
  if (Number.isNaN(userId)) return notFound();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      businessProfile: true,
      reviewsReceived: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) return notFound();

  const profile = user.businessProfile;

  const reviews = user.reviewsReceived;
  const note =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-10">
      {/* HEADER */}
      <section className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {user.companyName || "Professionnel du bâtiment"}
            </h1>

            <p className="text-gray-600 text-sm">
              {user.firstname} {user.lastname}
            </p>

            {/* NOTE & AVIS */}
            <div className="mt-2 flex items-center gap-2">
              <Stars value={note} size={18} />
              <span className="text-sm text-gray-600">
                {note.toFixed(1)} / 5 • {reviews.length} avis
              </span>
            </div>
          </div>

          {/* BOUTON CONTACT */}
          <a
            href={`/dashboard/messages/create?to=${user.id}`}
            className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-900"
          >
            Contacter
          </a>
        </div>

        {/* DESCRIPTION */}
        {profile?.description ? (
          <p className="text-gray-700 text-sm leading-relaxed">
            {profile.description}
          </p>
        ) : (
          <p className="text-gray-500 text-sm italic">
            Aucune description fournie.
          </p>
        )}
      </section>

      {/* INFORMATIONS */}
      <section className="bg-white border rounded-xl p-6 shadow-sm space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Informations</h2>

        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <span className="font-medium">Email :</span> {user.email}
          </p>
          <p>
            <span className="font-medium">Téléphone :</span>{" "}
            {user.phone || "—"}
          </p>

          <p>
            <span className="font-medium">SIRET :</span>{" "}
            {profile?.siret || "Non renseigné"}
          </p>

          <p>
            <span className="font-medium">Adresse :</span>{" "}
            {profile?.address || "Non renseignée"}
          </p>

          <p>
            <span className="font-medium">Zones d’intervention :</span>{" "}
            {profile?.zones || "Non renseignées"}
          </p>
        </div>
      </section>

      {/* DOCUMENTS */}
      <section className="bg-white border rounded-xl p-6 shadow-sm space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Documents & certifications
        </h2>

        <div className="space-y-3 text-sm">
          {/* Certifications */}
          <div>
            <p className="font-medium">Certifications :</p>
            {profile?.certifications ? (
              <p className="text-gray-700">{profile.certifications}</p>
            ) : (
              <p className="text-gray-500 italic">
                Aucune certification renseignée.
              </p>
            )}
          </div>

          {/* Assurances */}
          <div>
            <p className="font-medium">Assurances :</p>
            {profile?.insuranceDocs ? (
              <a
                className="text-blue-600 underline"
                href={profile.insuranceDocs}
                target="_blank"
              >
                Voir le document
              </a>
            ) : (
              <p className="text-gray-500 italic">Non renseigné.</p>
            )}
          </div>
        </div>
      </section>

      {/* AVIS CLIENTS */}
      <section className="bg-white border rounded-xl p-6 shadow-sm space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">Avis clients</h2>

        {reviews.length === 0 ? (
          <p className="text-gray-500 text-sm italic">
            Aucun avis pour le moment.
          </p>
        ) : (
          <ul className="space-y-4">
            {reviews.map((r) => (
              <li
                key={r.id}
                className="border border-gray-200 rounded-lg p-4 space-y-1"
              >
                <div className="flex items-center gap-2">
                  <Stars value={r.rating} size={16} />
                  <span className="text-xs text-gray-500">
                    par {r.user?.firstname} {r.user?.lastname}
                  </span>
                </div>

                <p className="text-sm text-gray-700">{r.comment}</p>

                <p className="text-[11px] text-gray-400">
                  {new Date(r.createdAt).toLocaleDateString("fr-FR")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

