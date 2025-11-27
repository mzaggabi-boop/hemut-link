"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/Button";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8081";

interface GoJob {
  id: number;
  title: string;
  description?: string;
  address?: string;
  price?: number;
  status: string;
  createdAt: string;
}

export default function GoJobPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [job, setJob] = useState<GoJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadJob() {
    try {
      const res = await fetch(`${API_URL}/go/${id}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erreur lors du chargement");

      setJob(data.job);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!id) return;
    loadJob();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-neutral-300">Chargement…</div>;
  }

  if (error || !job) {
    return <div className="p-6 text-red-400">{error || "Mission introuvable"}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <Button variant="secondary" onClick={() => router.back()}>
        ← Retour
      </Button>

      <h1 className="text-2xl font-semibold text-amber-400">
        {job.title}
      </h1>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">

        <p className="text-neutral-400 text-sm">
          Adresse : {job.address || "—"}
        </p>

        <p className="text-neutral-300 whitespace-pre-line">
          {job.description || "—"}
        </p>

        <p className="text-neutral-200 font-medium text-xl">
          Prix : {job.price ? `${job.price} €` : "Non précisé"}
        </p>

        <p className="text-neutral-300">
          Statut : <span className="font-semibold">{job.status}</span>
        </p>

        <Button
          variant="primary"
          className="w-full mt-4"
          onClick={() => router.push(`/go/${id}/tracking`)}
        >
          Suivre la mission 🔍
        </Button>
      </div>
    </div>
  );
}
