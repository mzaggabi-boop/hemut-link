// frontend/app/maintenance/page.tsx
export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-neutral-50 px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-amber-400 text-center">
        Hemut-link est en maintenance 🚧
      </h1>
      <p className="mt-4 text-neutral-300 text-center max-w-xl">
        La plateforme est temporairement indisponible le temps de finaliser les
        derniers modules et la configuration de production.
      </p>
      <p className="mt-2 text-neutral-500 text-xs">
        Environnement interne – accès public désactivé.
      </p>
    </div>
  );
}
