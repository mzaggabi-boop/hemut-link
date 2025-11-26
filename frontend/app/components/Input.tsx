"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="w-full flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-neutral-200">
          {label}
        </label>
      )}
      <input
        {...props}
        className={[
          "w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm",
          "text-neutral-100 placeholder:text-neutral-500",
          "outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400",
          "disabled:cursor-not-allowed disabled:opacity-60",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      />
      {error && (
        <p className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;