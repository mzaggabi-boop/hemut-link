"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function DashboardGoPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/dashboard/go/list", { cache: "no-store" });
      const json = await res.json();

      setData(json);
      setLoading(false);
    }
    load();
  }, []);

  if (loading || !data) {
    return (
      <main className="p-6">
        <p className="text-sm text-gray-600">Chargement du tableau de bord…</p>
      </main>
    );
  }

  const { jobs, stats, graph } = data;

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-10">
      <header>
        <h1 className="text-2xl font-semibold">Hemut-link Go — Tableau de bord</h1>
        <p className="text-sm text-gray-600">Suivi des missions et revenus.</p>
      </header>

      {/* STATS */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Revenus totaux"
          value={`${stats.totalEarned.toFixed(2)} €`}
          color="green"
        />
        <StatCard
          label="Missions terminées"
          value={stats.completedCount}
          color="blue"
        />
        <StatCard
          label="Missions en cours"
          value={stats.inProgressCount}
          color="purple"
        />
      </section>

      {/* GRAPH REVENUS */}
      <section className="bg-white border rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Revenus mensuels</h2>

        {graph.length === 0 ? (
          <p className="text-sm text-gray-500">Pas encore de données.</p>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graph}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#16a34a"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      {/* GRAPH MISSIONS */}
      <section className="bg-white border rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Volume de missions</h2>

        {graph.length === 0 ? (
          <p className="text-sm text-gray-500">Aucune mission terminée pour l’instant.</p>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={graph}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="missions" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      {/* SECTIONS MISSIONS */}
      <section className="space-y-10">
        <MissionSection
          title="En attente de paiement"
          missions={jobs.waiting}
          color="orange"
        />

        <MissionSection
          title="En cours"
          missions={jobs.inProgress}
          color="purple"
        />

        <MissionSection
          title="Terminées"
          missions={jobs.completed}
          color="green"
        />
      </section>
    </main>
  );
}

/* --- COMPONENTS --- */

function StatCard({ label, value, color }: any) {
  const colors: any = {
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
  };

  return (
    <div className={`p-4 rounded-xl border bg-white shadow-sm`}>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}

function MissionSection({ title, missions, color }: any) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title}</h3>

      {missions.length === 0 ? (
        <p className="text-sm text-gray-500">Aucune mission.</p>
      ) : (
        <div className="space-y-3">
          {missions.map((m: any) => (
            <a
              key={m.id}
              href={`/dashboard/go/${m.id}`}
              className="block border rounded-xl bg-white p-4 hover:shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{m.title}</p>
                  <p className="text-xs text-gray-500">{m.address}</p>
                </div>
                <p className="text-sm font-semibold">
                  {m.price ? `${m.price} €` : "—"}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
