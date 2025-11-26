export default function ErrorPage() {
  return (
    <main className="max-w-lg mx-auto p-6 text-center space-y-4">
      <h1 className="text-2xl font-semibold text-red-600">
        Paiement échoué ❌
      </h1>
      <p className="text-gray-700 text-sm">
        Le paiement n’a pas pu être effectué. Veuillez réessayer.
      </p>
    </main>
  );
}
