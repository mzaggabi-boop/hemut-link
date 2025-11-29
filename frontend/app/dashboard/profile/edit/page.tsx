// PROFILE EDIT - CODE À COLLER
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 🔥 IMPORT MANQUANT — obligatoire !
import DocUploader from "./../components/DocUploader";


export default function EditProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    companyName: "",
    siret: "",
    address: "",
    zones: "",
    certifications: "",
    insuranceDocs: "",
    description: "",
    phone: "",
  });

  // Charger les données existantes
  useEffect(() => {
    async function loadProfile() {
      const res = await fetch("/api/profile/get", { cache: "no-store" });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        return;
      }

      setForm({
        companyName: data.companyName || "",
        siret: data.siret || "",
        address: data.address || "",
        zones: data.zones || "",
        certifications: data.certifications || "",
        insuranceDocs: data.insuranceDocs || "",
        description: data.description || "",
        phone: data.phone || "",
      });

      setLoading(false);
    }

    loadProfile();
  }, []);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError(null);

    const res = await fetch("/api/profile/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Erreur lors de la sauvegarde.");
      setSaving(false);
      return;
    }

    router.push("/dashboard/profile");
  }

  if (loading) {
    return (
      <main className="p-6 max-w-5xl mx-auto">
        <p className="text-sm text-gray-600">Chargement…</p>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-gray-900">
          Modifier mon profil
        </h1>
        <p className="text-gray-600 text-sm">
          Mettez à jour vos informations professionnelles.
        </p>
      </header>

      <section className="bg-white border rounded-xl p-6 shadow-sm space-y-6">
        {/* ENTREPRISE */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Nom de l’entreprise</label>
          <input
            className="w-full border rounded-lg p-2 text-sm"
            value={form.companyName}
            onChange={(e) => updateField("companyName", e.target.value)}
          />
        </div>

        {/* SIRET */}
        <div className="space-y-2">
          <label className="text-sm font-medium">SIRET</label>
          <input
            className="w-full border rounded-lg p-2 text-sm"
            value={form.siret}
            onChange={(e) => updateField("siret", e.target.value)}
          />
        </div>

        {/* ADRESSE */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Adresse</label>
          <input
            className="w-full border rounded-lg p-2 text-sm"
            value={form.address}
            onChange={(e) => updateField("address", e.target.value)}
          />
        </div>

        {/* PHONE */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Téléphone</label>
          <input
            className="w-full border rounded-lg p-2 text-sm"
            value={form.phone}
            onChange={(e) => updateField("phone", e.target.value)}
          />
        </div>

        {/* ZONES */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Zones d’intervention</label>
          <input
            className="w-full border rounded-lg p-2 text-sm"
            placeholder="Exemple : Paris, 93, 94…"
            value={form.zones}
            onChange={(e) => updateField("zones", e.target.value)}
          />
        </div>

        {/* CERTIFICATIONS */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Certifications</label>
          <textarea
            className="w-full border rounded-lg p-2 text-sm"
            rows={3}
            value={form.certifications}
            onChange={(e) => updateField("certifications", e.target.value)}
          />
        </div>

        {/* ASSURANCES */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Assurances</label>
          <textarea
            className="w-full border rounded-lg p-2 text-sm"
            rows={3}
            value={form.insuranceDocs}
            onChange={(e) => updateField("insuranceDocs", e.target.value)}
          />
        </div>

        {/* DESCRIPTION */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            className="w-full border rounded-lg p-2 text-sm"
            rows={5}
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
          />
        </div>

        {/* UPLOAD DOCUMENTS */}
        <div className="space-y-4">
          <DocUploader label="Assurance RC Pro" type="insurance" />
          <DocUploader label="Certifications / Qualibat" type="certification" />
          <DocUploader label="Document Administratif" type="document" />
        </div>

        {/* ERREUR */}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {/* BOUTON */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-900 disabled:opacity-40"
        >
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
      </section>
    </main>
  );
}
