"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Input from "../../../components/Input";
import Button from "../../../components/Button";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8081";

export default function CreateMissionPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    type: "LIVRAISON",
    title: "",
    description: "",
    startAddress: "",
    endAddress: "",
    budget: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.replace("/auth/login");
        return;
      }

      const res = await fetch(`${API_URL}/go/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || "Impossible de créer la mission.");
      }

      router.push("/go");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-amber-400">
        Nouvelle mission – Hemut-link Go 🚚
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-6 max-w-2xl"
      >
        {error && (
          <div className="rounded-md border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* TYPE DE MISSION */}
        <div className="w-full flex flex-col gap-1">
          <label className="text-sm font-medium text-neutral-200">
            Type de mission
          </label>

          <select
            value={form.type}
            onChange={handleChange("type")}
            className="bg-neutral-900 border border-neutral-700 text-neutral-100 px-3 py-2 rounded-md outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          >
            <option value="LIVRAISON">Livraison</option>
            <option value="DEPANNAGE">Dépannage</option>
            <option value="ASSISTANCE">Assistance / Aide</option>
            <option value="TRANSPORT_MATERIEL">Transport de matériel</option>
          </select>
        </div>

        <Input
          label="Titre de la mission"
          value={form.title}
          onChange={handleChange("title")}
          placeholder="Ex: Livraison urgente de matériaux"
          required
        />

        {/* DESCRIPTION */}
        <div className="w-full flex flex-col gap-1">
          <label className="text-sm font-medium text-neutral-200">Description</label>
          <textarea
            value={form.description}
            onChange={handleChange("description")}
            placeholder="Décris ce qu’il faut faire…"
            className="min-h-[100px] bg-neutral-900 border border-neutral-700 text-neutral-100 px-3 py-2 rounded-md outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            required
          ></textarea>
        </div>

        <Input
          label="Adresse de départ"
          value={form.startAddress}
          onChange={handleChange("startAddress")}
          placeholder="Adresse / zone de départ"
          required
        />

        <Input
          label="Adresse d’arrivée"
          value={form.endAddress}
          onChange={handleChange("endAddress")}
          placeholder="Adresse / zone d’arrivée"
          required
        />

        <Input
          label="Budget (en €)"
          type="number"
          value={form.budget}
          onChange={handleChange("budget")}
          placeholder="Ex: 40"
          required
        />

        {/* GEOLOC (placeholder pour l'étape suivante) */}
        <div className="bg-neutral-800/40 rounded p-3 text-neutral-400 text-sm">
          La géolocalisation et la carte seront ajoutées à l’étape suivante.
        </div>

<div className="bg-neutral-800/40 rounded p-3 text-neutral-400 text-sm">
  La carte apparaîtra ici quand les coordonnées automatiques seront activées.
</div>

        <Button type="submit" loading={loading} variant="primary" className="w-full">
          Publier la mission
        </Button>
      </form>
    </div>
  );
}
