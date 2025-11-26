// components/Stars.tsx
export default function Stars({
  value,
  size = 16,
}: {
  value: number;
  size?: number;
}) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <span className="flex gap-0.5">
      {stars.map((s) => (
        <svg
          key={s}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={s <= value ? "#facc15" : "#e5e7eb"}
        >
          <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.801L19.335 24 12 19.897 4.665 24l1.399-8.893L0 9.306l8.332-1.151z" />
        </svg>
      ))}
    </span>
  );
}
