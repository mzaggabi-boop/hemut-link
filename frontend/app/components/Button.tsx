"use client";

import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
}

function ButtonBase({
  children,
  variant = "primary",
  loading = false,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-60";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-amber-400 text-black hover:bg-amber-300 shadow-lg shadow-amber-500/30",
    secondary:
      "bg-neutral-900 text-neutral-100 border border-neutral-700 hover:border-neutral-500 hover:bg-neutral-800",
    ghost:
      "bg-transparent text-neutral-200 border border-transparent hover:border-neutral-700 hover:bg-neutral-900",
  };

  return (
    <button
      {...props}
      className={[base, variants[variant], className].filter(Boolean).join(" ")}
      disabled={loading || props.disabled}
    >
      {loading && (
        <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
      )}
      {children}
    </button>
  );
}

const Button = ButtonBase;
export { Button };
export default Button;