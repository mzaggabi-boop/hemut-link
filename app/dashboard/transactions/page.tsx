"use client";

import React, { useEffect, useState } from "react";
import ExportButton from "./export-button";
import ExportPdfButton from "./export-pdf-button";
import ExportXlsxButton from "./export-xlsx-button";

export default function TransactionsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/transactions/list", { cache: "no-store" });
      const data = await res.json();
      setPayments(data.payments || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <main className="p-6 max-w-6xl mx-auto">
        <p className="text-sm text-gray-600">Chargement...</p>
      </main>
    );
  }

  const totalBrut = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalCommission = payments.reduce((sum, p) => sum + p.commission, 0);
  const totalNet = totalBrut - totalCommission;

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Transactions & paiements reçus
          </h1>
          <p className="text-sm text-gray-600">
            Vue détaillée de vos encaissements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ExportButton />
          <ExportPdfButton />
          <ExportXlsxButton />
        </div>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Montant brut encaissé" value={totalBrut} variant="primary" />
        <StatCard label="Commissions prélevées" value={totalCommission} variant="muted" />
        <StatCard label="Montant net reçu" value={totalNet} variant="success" />
      </section>

      {/* Tableau */}
      <section className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Liste des transactions</h2>
          <p className="text-xs text-gray-500">{payments.length} transaction(s)</p>
        </div>

        {payments.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">
            Vous n'avez pas encore reçu de paiements.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Produit / Mission</th>
                  <th className="px-4 py-2 text-left">Client</th>
                  <th className="px-4 py-2 text-right">Montant brut</th>
                  <th className="px-4 py-2 text-right">Commission</th>
                  <th className="px-4 py-2 text-right">Net</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((p) => {
                  const net = p.amount - p.commission;

                  return (
                    <tr
                      key={p.id}
                      className="border-t border-gray-100 hover:bg-gray-50/50"
                    >
                      <td className="px-4 py-2 align-top text-xs text-gray-600 whitespace-nowrap">
                        {new Date(p.createdAt).toLocaleString("fr-FR")}
                      </td>

                      <td className="px-4 py-2 align-top text-xs font-medium text-gray-800">
                        {p.type}
                      </td>

                      <td className="px-4 py-2 align-top text-xs text-gray-700">
                        {p.label}
                      </td>

                      <td className="px-4 py-2 align-top text-xs text-gray-700">
                        {p.client}
                      </td>

                      <td className="px-4 py-2 align-top text-right text-xs text-gray-900 font-semibold">
                        {p.amount.toLocaleString("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </td>

                      <td className="px-4 py-2 align-top text-right text-xs text-gray-500">
                        {p.commission.toLocaleString("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </td>

                      <td className="px-4 py-2 align-top text-right text-xs font-semibold text-emerald-600">
                        {net.toLocaleString("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

function StatCard({ label, value, variant }: any) {
  const valueFormatted = value.toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
  });

  let valueClass = "text-xl font-semibold text-gray-900";
  if (variant === "muted") valueClass = "text-xl font-semibold text-gray-500";
  if (variant === "success") valueClass = "text-xl font-semibold text-emerald-600";

  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={valueClass + " mt-1"}>{valueFormatted}</p>
    </div>
  );
}
