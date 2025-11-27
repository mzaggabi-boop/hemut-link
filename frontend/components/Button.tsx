"use client";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  loading?: boolean;
}

export default function Button({
  variant = "primary",
  loading = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const base =
    "px-4 py-2 rounded-lg text-sm font-semibold transition active:scale-95";

  const style =
    variant === "primary"
      ? "bg-amber-400 text-black hover:bg-amber-300"
      : "bg-neutral-800 text-white hover:bg-neutral-700";

  return (
    <button
      className={`${base} ${style} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? "Chargement..." : children}
    </button>
  );
}
