"use client";

interface DistanceBadgeProps {
  distanceKm?: number | null;
  durationMinutes?: number | null;
  className?: string;
}

export default function DistanceBadge({
  distanceKm,
  durationMinutes,
  className = "",
}: DistanceBadgeProps) {
  if (!distanceKm && !durationMinutes) return null;

  const distanceLabel =
    typeof distanceKm === "number" ? `${distanceKm.toFixed(1)} km` : null;
  const durationLabel =
    typeof durationMinutes === "number"
      ? `${Math.round(durationMinutes)} min`
      : null;

  return (
    <div
      className={[
        "inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-medium text-amber-100",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {distanceLabel && <span>{distanceLabel}</span>}
      {durationLabel && (
        <>
          <span className="h-1 w-1 rounded-full bg-amber-400" />
          <span>{durationLabel}</span>
        </>
      )}
    </div>
  );
}