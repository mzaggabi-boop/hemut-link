// CODE CREATE FORM - A REMPLACER
// app/dashboard/products/create/ProductCreateForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import TagSelector from "./TagSelector";

type Category = {
  id: number;
  name: string;
};

export default function ProductCreateForm({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
const [tags, setTags] = useState<string[]>([]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    const newUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);

        const res = await fetch("/api/products/upload-image", {
          method: "POST",
          body: form,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Erreur upload image");
        }

        if (data.url) {
          newUrls.push(data.url);
        }
      }

      setPhotoUrls((prev) => [...prev, ...newUrls]);
    } catch (e: any) {
      setError(e.message || "Erreur lors de l'upload des images");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const numericPrice = parseFloat(price.replace(",", "."));
    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      setError("Prix invalide.");
      setSaving(false);
      return;
    }

    if (!title.trim()) {
      setError("Le titre est obligatoire.");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/products/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          price: numericPrice,
          condition: condition || null,
          description: description || null,
          categoryId: categoryId || null,
          photos: photoUrls,
          tags,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la création du produit");
      }

      // Redirection vers la liste des annonces
      router.push("/dashboard/products");
      router.refresh();
    } catch (e: any) {
      setError(e.message);
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white border rounded-xl p-5 shadow-sm">
      {/* Titre */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Titre de l'annonce</label>
        <input
          className="w-full border rounded-lg p-2 text-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex : Echelle alu 3m, échafaudage, perforateur..."
          required
        />
      </div>

      {/* Prix + Etat */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Prix (EUR)</label>
          <input
            className="w-full border rounded-lg p-2 text-sm"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Ex : 120"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">État</label>
          <input
            className="w-full border rounded-lg p-2 text-sm"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            placeholder="Ex : Neuf, Très bon état..."
          />
        </div>
      </div>

      {/* Catégorie */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Catégorie</label>
        <select
          className="w-full border rounded-lg p-2 text-sm"
          value={categoryId}
          onChange={(e) =>
            setCategoryId(e.target.value ? Number(e.target.value) : "")
          }
        >
          <option value="">Sélectionner une catégorie</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      {/* Tags */}
<TagSelector
  onChange={setTags}
  categoryId={categoryId && typeof categoryId === "number" ? categoryId : null}
/>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea
          className="w-full border rounded-lg p-2 text-sm"
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Donnez un maximum de détails utiles aux autres pros..."
        />
      </div>

      {/* Photos */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Photos</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleUpload}
          className="w-full text-sm"
        />
        {uploading && (
          <p className="text-xs text-gray-600">Téléversement des images…</p>
        )}
        {photoUrls.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {photoUrls.map((url) => (
              <div
                key={url}
                className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Erreur */}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Bouton */}
      <button
        type="submit"
        disabled={saving}
        className="px-4 py-2 bg-black text-white text-sm rounded-lg font-semibold hover:bg-gray-900 disabled:opacity-40"
      >
        {saving ? "Publication en cours…" : "Publier l'annonce"}
      </button>
    </form>
  );
}
