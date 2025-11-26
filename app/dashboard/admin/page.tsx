// app/auth/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    role: "ARTISAN",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur inconnue.");

      const role = form.role;

      const rolePath: Record<string, string> = {
        ARTISAN: "/dashboard/artisan",
        FOURNISSEUR: "/dashboard/vendor",
        ADMIN: "/dashboard/admin",
        CLIENT: "/dashboard/entreprise",
        PARTICULIER: "/dashboard/entreprise",
        DONNEUR_ORDRE: "/dashboard/entreprise",
        ASSUREUR: "/dashboard/entreprise",
        ARCHITECTE: "/dashboard/entreprise",
        DECORATEUR: "/dashboard/entreprise",
        SYNDIC: "/dashboard/entreprise",
        AGENCE_IMMO: "/dashboard/entreprise",
      };

      router.push(rolePath[role] || "/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-sm space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center">Créer un compte</h1>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <div className="flex gap-2">
          <input
            required
            name="firstName"
            placeholder="Prénom"
            onChange={handleChange}
            className="w-1/2 rounded border px-3 py-2"
          />
          <input
            required
            name="lastName"
            placeholder="Nom"
            onChange={handleChange}
            className="w-1/2 rounded border px-3 py-2"
          />
        </div>

        <input
          required
          type="email"
          name="email"
          placeholder="Adresse email"
          onChange={handleChange}
          className="w-full rounded border px-3 py-2"
        />

        <input
          required
          type="password"
          name="password"
          placeholder="Mot de passe"
          onChange={handleChange}
          className="w-full rounded border px-3 py-2"
        />

        <input
          name="phone"
          placeholder="Téléphone (optionnel)"
          onChange={handleChange}
          className="w-full rounded border px-3 py-2"
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full rounded border px-3 py-2"
        >
          <option value="ARTISAN">Artisan</option>
          <option value="FOURNISSEUR">Fournisseur</option>
          <option value="CLIENT">Client / Entreprise</option>
          <option value="PARTICULIER">Particulier</option>
          <option value="DONNEUR_ORDRE">Donneur d’ordre</option>
          <option value="ASSUREUR">Assureur</option>
          <option value="ARCHITECTE">Architecte</option>
          <option value="DECORATEUR">Décorateur</option>
          <option value="SYNDIC">Syndic</option>
          <option value="AGENCE_IMMO">Agence immo</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-black py-2 text-white font-medium disabled:opacity-60"
        >
          {loading ? "Création..." : "Créer mon compte"}
        </button>
      </form>
    </div>
  );
}
