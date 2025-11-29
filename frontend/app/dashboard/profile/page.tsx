import prisma from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

function renderStars(value: number) {
  const full = Math.round(value);
  return "★★★★★☆☆☆☆☆".slice(5 - full, 10 - full);
}

export default async function DashboardProfilePage() {
  // AUTH
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
    include: {
      businessProfile: true,
      reviewsReceived: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!dbUser) redirect("/login");

  const profile = dbUser.businessProfile;
  const reviews = dbUser.reviewsReceived;
  const rating = profile?.rating || 0;

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-10">
      {/* HEADER */}
      <section className="bg-white border rounded-xl shadow-sm p-6 space-y-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Mon Profil Professionnel
        </h1>

        <p className="text-sm text-gray-600">Email : {dbUser.email}</p>

        {/* NOTE MOYENNE */}
        <div className="pt-4 border-t border-dashed space-y-1">
          <p className="text-sm font-medium text-gray-700">Note moyenne</p>

          {rating > 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-lg text-yellow-500">
                {renderStars(rating)}
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {rating.toFixed(1)} / 5
              </span>
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">
              Aucun avis pour le moment.
            </p>
          )}
        </div>
      </section>

      {/* INFORMATIONS ENTREPRISE */}
      <section className="bg-white border rounded-xl shadow-sm p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Informations professionnelles
        </h2>

        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <span className="font-medium">Entreprise :</span>{" "}
            {dbUser.companyName || "—"}
          </p>
          <p>
            <span className="font-medium">SIRET :</span>{" "}
            {profile?.siret || "—"}
          </p>
          <p>
            <span className="font-medium">Adresse :</span>{" "}
            {profile?.address || "—"}
          </p>
          <p>
            <span className="font-medium">Zones d’intervention :</span>{" "}
            {profile?.zones || "—"}
          </p>
        </div>

        {/* DESCRIPTION */}
        <div className="pt-4 border-t border-dashed">
          <h3 className="text-sm font-medium text-gray-900">Description</h3>
          {profile?.description ? (
            <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
              {profile.description}
            </p>
          ) : (
            <p className="text-sm text-gray-500 italic">
              Aucune description fournie.
            </p>
          )}
        </div>
      </section>

      {/* DOCUMENTS */}
      <section className="bg-white border rounded-xl shadow-sm p-6 space-y-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Documents & Certifications
        </h2>

        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium">Certifications :</p>
            {profile?.certifications ? (
              <p className="text-gray-700">{profile.certifications}</p>
            ) : (
              <p className="text-gray-500 italic">
                Aucune certification déclarée.
              </p>
            )}
          </div>

          <div>
            <p className="font-medium">Assurance RC Pro :</p>
            {profile?.insuranceDocs ? (
              <a
                href={profile.insuranceDocs}
                className="text-blue-600 underline"
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

      {/* AVIS REÇUS */}
      <section className="bg-white border rounded-xl shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Avis reçus</h2>

        {reviews.length === 0 ? (
          <p className="text-sm text-gray-500 italic">
            Aucun avis pour le moment.
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="border rounded-lg bg-gray-50 p-4 shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-yellow-500">
                    {"★".repeat(r.rating)}
                    <span className="text-gray-300">
                      {"☆".repeat(5 - r.rating)}
                    </span>
                  </span>

                  <span className="text-xs text-gray-500">
                    {new Date(r.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>

                {r.comment && (
                  <p className="text-xs text-gray-600">{r.comment}</p>
                )}

                <p className="text-[11px] text-gray-500">
                  Par :{" "}
                  <span className="font-medium text-gray-700">
                    {r.user.firstname} {r.user.lastname} ({r.user.email})
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
