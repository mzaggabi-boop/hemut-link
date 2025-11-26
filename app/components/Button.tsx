"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  loading?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  loading = false,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "px-4 py-2 rounded-md text-sm font-medium transition focus:outline-none flex items-center justify-center gap-2";

  const variants = {
    primary:
      "bg-amber-400 hover:bg-amber-500 text-black shadow-[0_0_10px_rgba(251,191,36,0.3)]",
    secondary:
      "bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-neutral-100",
  };

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={[
        base,
        variants[variant],
        loading ? "opacity-70 cursor-not-allowed" : "",
        className,
      ].join(" ")}
    >
      {loading && (
        <span className="animate-spin border-2 border-black border-t-transparent rounded-full w-4 h-4"></span>
      )}
      {children}
    </button>
  );
}

