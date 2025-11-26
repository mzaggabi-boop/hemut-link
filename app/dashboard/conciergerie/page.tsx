// app/dashboard/conciergerie/page.tsx
export default function ConciergerieDashboard() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Espace Conciergerie</h2>
      <p className="text-gray-600">
        Gestion des interventions pour les locations courte durée.
      </p>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <ul className="list-disc pl-5 text-sm">
          <li>Planification des interventions</li>
          <li>Suivi des partenaires artisans</li>
          <li>Suivi des états des lieux</li>
        </ul>
      </div>
    </div>
  );
}
