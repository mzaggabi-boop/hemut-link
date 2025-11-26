// app/dashboard/vendor/page.tsx
export default function VendorDashboard() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Espace Fournisseur</h2>
      <p className="text-gray-600">Gérez vos produits, commandes et ventes.</p>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <ul className="list-disc pl-5 text-sm">
          <li>Catalogue produits</li>
          <li>Gestion des commandes</li>
          <li>Suivi des expéditions</li>
          <li>Solde Stripe Connect</li>
        </ul>
      </div>
    </div>
  );
}
