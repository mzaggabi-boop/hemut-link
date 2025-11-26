// app/go/create/page.tsx
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

type FormState = {
  title: string;
  description: string;
  address: string;
  budget: string;
};

export default function GoCreatePage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    address: "",
    budget: "",
  });
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.title.trim()) {
      setError("Le titre est obligatoire.");
      return;
    }
    if (!form.address.trim()) {
      setError("L'adresse est obligatoire.");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", form.title.trim());
      data.append("description", form.description.trim());
      data.append("address", form.address.trim());
      data.append("budget", form.budget.trim());

      if (files && files.length > 0) {
        Array.from(files).forEach((file) => {
          data.append("photos", file);
        });
      }

      const res = await fetch("/api/go/create", {
        method: "POST",
        body: data,
      });

      if (!res.ok) {
        let msg = "Erreur lors de la création de la mission.";
        try {
          const json = await res.json();
          if (json?.error) msg = json.error;
        } catch {
          // ignore
        }
        throw new Error(msg);
      }

      const json = await res.json();
      const jobId = json?.id;

      if (jobId) {
        router.push(`/go/${jobId}`);
      } else {
        router.push("/go");
      }
    } catch (err: any) {
      setError(err.message || "Erreur inconnue.");
      setLoading(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-gray-900">
          Créer une mission Hemut-link Go
        </h1>
        <p className="text-sm text-gray-600">
          Publiez une mission urgente ou ponctuelle pour trouver un artisan disponible rapidement.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-6"
      >
        {/* TITRE */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Titre de la mission <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            placeholder="Ex : Urgent - Recherche électricien pour panne compteur"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
          />
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Description détaillée</label>
          <textarea
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            rows={5}
            placeholder="Décrivez la mission, le contexte, les contraintes d'accès, l'urgence, etc."
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
          />
        </div>

        {/* ADRESSE */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Adresse d&apos;intervention <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            placeholder="Adresse complète de l’intervention"
            value={form.address}
            onChange={(e) => updateField("address", e.target.value)}
          />
          <p className="text-xs text-gray-500">
            La géolocalisation précise (latitude/longitude) sera calculée côté serveur à partir de cette adresse.
          </p>
        </div>

        {/* BUDGET */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Budget indicatif (en €)</label>
          <input
            type="number"
            min={0}
            step={10}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            placeholder="Ex : 150"
            value={form.budget}
            onChange={(e) => updateField("budget", e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Ce montant est indicatif. Le montant final pourra être ajusté avec l&apos;artisan.
          </p>
        </div>

        {/* PHOTOS */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Photos (optionnel)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            className="block w-full text-xs text-gray-600"
            onChange={(e) => setFiles(e.target.files)}
          />
          <p className="text-xs text-gray-500">
            Ajoutez quelques photos du problème ou du chantier pour aider les artisans à comprendre la mission.
          </p>
        </div>

        {/* ERREUR */}
        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        {/* BOUTON */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-black text-white text-sm font-semibold hover:bg-gray-900 disabled:opacity-50"
          >
            {loading ? "Publication en cours..." : "Publier la mission"}
          </button>
        </div>
      </form>
    </main>
  );
}
// HEMUT-LINK GO CREATE PAGE - A REMPLACER
