"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Button from "../../../components/Button";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8081";

interface Mission {
  id: string;
  type: string;
  title: string;
  startAddress: string;
  endAddress: string;
  budget: number;
}

export default function MissionAcceptedPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMission = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    const res = await fetch(`${API_URL}/go/mission/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) return;

    setMission(data.mission);
    setLoading(false);
  };

  useEffect(() => {
    loadMission();
  }, []);

  if (loading || !mission) {
    return (
      <div className="p-6 text-neutral-300">Chargement…</div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <h1 className="text-2xl font-semibold text-amber-400">
        Mission acceptée 🎉
      </h1>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-3">
        <p className="text-neutral-300">
          Tu as accepté la mission :
          <span className="font-semibold text-amber-400"> {mission.title}</span>
        </p>

        <p className="text-neutral-400 text-sm">
          Type : {mission.type}
        </p>

        <p className="text-neutral-400 text-sm">
          Départ : {mission.startAddress}
        </p>

        <p className="text-neutral-400 text-sm">
          Arrivée : {mission.endAddress}
        </p>

        <p className="text-neutral-200 font-medium text-lg">
          Budget : {mission.budget} €
        </p>

        <Button
          variant="primary"
          className="w-full mt-4"
          onClick={() => router.push(`/go/${id}/tracking`)}
        >
          Démarrer la mission 🚀
        </Button>
      </div>
    </div>
  );
}
