// app/dashboard/entreprise/page.tsx
export default function EntrepriseDashboard() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Espace Entreprise</h2>
      <p className="text-gray-600">
        Suivi de vos chantiers, fournisseurs et prestataires.
      </p>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <ul className="list-disc pl-5 text-sm">
          <li>Demandes de travaux</li>
          <li>Suivi des chantiers</li>
          <li>Commandes fournisseurs</li>
        </ul>
      </div>
    </div>
  );
}
