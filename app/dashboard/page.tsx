// C:\Projets\Hemut-link\frontend\app\dashboard\page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("hemut_token");

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    // Récupération du profil utilisateur
    async function fetchUser() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          localStorage.removeItem("hemut_token");
          router.replace("/auth/login");
          return;
        }

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("Erreur user:", err);
      }
    }

    fetchUser();
  }, [router]);

  return (
    <div className="min-h-screen p-8 space-y-8 bg-gray-100 dark:bg-black text-gray-900 dark:text-gray-100">

      <h1 className="text-3xl font-bold text-blue-500">
        Dashboard Hemut-link
      </h1>

      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl p-6 shadow">

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50 mb-2">
          Bienvenue {user ? `${user.firstname} ${user.lastname}` : "!"}
        </h2>

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Tu peux maintenant accéder à <strong>Hemut-link Go</strong>, parcourir la
          <strong> marketplace</strong> ou gérer ton <strong>profil</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* GO MISSIONS */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl p-6 shadow">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-2">
            Hemut-link GO
          </h3>

          <p className="text-gray-700 dark:text-gray-300 mb-3">
            Publie une mission express et trouve un artisan disponible rapidement.
          </p>

          <a
            href="/go"
            className="text-blue-600 hover:text-blue-400 underline"
          >
            Accéder à Hemut-link GO
          </a>
        </div>

        {/* MARKETPLACE */}
        <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl p-6 shadow">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-2">
            Marketplace
          </h3>

          <p className="text-gray-700 dark:text-gray-300 mb-3">
            Achète, vends ou échange du matériel professionnel entre artisans.
          </p>

          <a
            href="/marketplace"
            className="text-blue-600 hover:text-blue-400 underline"
          >
            Accéder à la marketplace
          </a>
        </div>

      </div>
    </div>
  );
}
