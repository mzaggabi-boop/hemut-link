"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className=\"w-full flex flex-col gap-1\">
      {label && (
        <label className=\"text-sm font-medium text-neutral-200\">
          {label}
        </label>
      )}

      <input
        {...props}
        className={
          \"w-full rounded-md bg-neutral-900 border border-neutral-700 text-neutral-100 px-3 py-2 outline-none transition focus:border-amber-400 focus:ring-1 focus:ring-amber-400 \" +
          className
        }
      />

      {error && (
        <p className=\"text-sm text-red-400\">
          {error}
        </p>
      )}
    </div>
  );
}
