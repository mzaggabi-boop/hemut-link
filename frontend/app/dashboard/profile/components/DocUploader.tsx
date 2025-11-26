"use client";

import { useState } from "react";

export default function DocUploader({ label, type }: { label: string; type: string }) {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const form = new FormData();
    form.append("file", file);
    form.append("type", type);

    const res = await fetch("/api/profile/upload", {
      method: "POST",
      body: form,
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Erreur upload");
      setUploading(false);
      return;
    }

    setUploadedUrl(data.url);
    setUploading(false);
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      <input
        type="file"
        onChange={handleUpload}
        className="border rounded-lg p-2 text-sm w-full"
      />

      {uploading && (
        <p className="text-xs text-gray-600">Téléversement…</p>
      )}

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}

      {uploadedUrl && (
        <a
          href={uploadedUrl}
          target="_blank"
          className="text-xs text-blue-600 underline"
        >
          Voir le document
        </a>
      )}
    </div>
  );
}

