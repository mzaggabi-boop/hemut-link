// app/marketplace/publish/page.tsx
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Input from "../../../components/Input";
import Button from "../../../components/Button";


const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8081";

export default function PublishListingPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    price: "",
    condition: "BON",
    location: "",
    description: "",
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

      const res = await fetch(`${API_URL}/marketplace/listings/new`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Impossible de publier.");

      router.push("/marketplace/my-listings");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <Button variant="secondary" onClick={() => router.back()}>
        ← Retour
      </Button>

      <h1 className="text-2xl font-semibold text-amber-400">
        Publier un article
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4"
      >
        {error && (
          <div className="rounded-md border border-red-500/40 bg-red-950/40 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}

        <Input
          label="Titre"
          value={form.title}
          onChange={handleChange("title")}
          placeholder="Perceuse Hilti, laser, etc."
          required
        />

        <Input
          label="Prix (€)"
          type="number"
          value={form.price}
          onChange={handleChange("price")}
          placeholder="100"
          required
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-neutral-200">État</label>
          <select
            value={form.condition}
            onChange={handleChange("condition")}
            className="bg-neutral-900 border border-neutral-700 text-neutral-100 px-3 py-2 rounded-md outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          >
            <option value="NEUF">Neuf</option>
            <option value="TRES_BON">Très bon</option>
            <option value="BON">Bon</option>
            <option value="USAGE">Usagé</option>
          </select>
        </div>

        <Input
          label="Localisation"
          value={form.location}
          onChange={handleChange("location")}
          placeholder="Ville, département…"
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-neutral-200">Description</label>
          <textarea
            value={form.description}
            onChange={handleChange("description")}
            className="min-h-[100px] bg-neutral-900 border border-neutral-700 text-neutral-100 px-3 py-2 rounded-md outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
            placeholder="Détails, état, accessoires, etc."
          />
        </div>

        <Button type="submit" variant="primary" loading={loading} className="w-full">
          Publier
        </Button>
      </form>
    </div>
  );
}
