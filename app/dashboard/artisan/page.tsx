// app/dashboard/artisan/page.tsx
export default function ArtisanDashboard() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Espace Artisan</h2>
      <p className="text-gray-600">Bienvenue sur votre espace Hemut-link.</p>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <p>Fonctionnalités artisan à venir :</p>
        <ul className="list-disc pl-5 text-sm">
          <li>Missions express Hemut-link GO</li>
          <li>Marketplace outils & matériaux</li>
          <li>Demandes de prestations clients</li>
          <li>Historique de vos interventions</li>
        </ul>
      </div>
    </div>
  );
}
