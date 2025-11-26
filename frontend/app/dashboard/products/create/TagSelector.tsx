// TAG SELECTOR - A REMPLACER
"use client";

import { useEffect, useState } from "react";

type TagItem = {
  id: number;
  name: string;
  parentName: string | null;
  usageCount: number;
};

export default function TagSelector({
  onChange,
  initialTags = [],
  categoryId,
}: {
  onChange: (tags: string[]) => void;
  initialTags?: string[];
  categoryId?: number | null;
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>(initialTags);
  const [suggestions, setSuggestions] = useState<TagItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onChange(selected);
  }, [selected, onChange]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      if (categoryId) params.set("categoryId", String(categoryId));

      const res = await fetch(`/api/tags/list?${params.toString()}`, {
        cache: "no-store",
      });
      const data = await res.json();
      setSuggestions(data.tags || []);
      setLoading(false);
    }

    load();
  }, [search, categoryId]);

  function toggleTag(name: string) {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]
    );
  }

  async function handleCreateTag() {
    const name = search.trim();
    if (!name) return;

    const res = await fetch("/api/tags/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Erreur création tag");
      return;
    }

    if (data.tag?.name && !selected.includes(data.tag.name)) {
      setSelected((prev) => [...prev, data.tag.name]);
    }
    setSearch("");
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Tags</label>

      {/* Champ de recherche / création */}
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded-lg p-2 text-sm"
          placeholder="Ex: électricité, peinture, échafaudage..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="button"
          onClick={handleCreateTag}
          className="px-3 py-2 text-xs rounded-lg border border-gray-300 hover:bg-gray-100"
        >
          Ajouter
        </button>
      </div>

      {/* Tags sélectionnés */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className="px-2 py-1 text-xs rounded-full bg-black text-white"
            >
              {tag} ✕
            </button>
          ))}
        </div>
      )}

      {/* Suggestions */}
      <div className="border rounded-lg p-2 max-h-40 overflow-y-auto space-y-1">
        {loading && (
          <p className="text-xs text-gray-500">Chargement des tags…</p>
        )}
        {!loading && suggestions.length === 0 && (
          <p className="text-xs text-gray-500">Aucun tag proposé.</p>
        )}
        {!loading &&
          suggestions.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => toggleTag(t.name)}
              className={`w-full text-left px-2 py-1 text-xs rounded ${
                selected.includes(t.name)
                  ? "bg-black text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <span className="font-medium">{t.name}</span>
              {t.parentName && (
                <span className="ml-1 text-[10px] text-gray-400">
                  ({t.parentName})
                </span>
              )}
              {t.usageCount > 0 && (
                <span className="ml-1 text-[10px] text-gray-400">
                  · {t.usageCount} produit(s)
                </span>
              )}
            </button>
          ))}
      </div>
    </div>
  );
}
