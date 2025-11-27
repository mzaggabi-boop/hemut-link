"use client";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, className = "", ...props }: InputProps) {
  return (
    <div className="w-full space-y-1">
      {label && (
        <label className="text-sm text-neutral-600 font-medium">{label}</label>
      )}

      <input
        {...props}
        className={`
          w-full px-3 py-2 rounded-lg border border-neutral-300 
          focus:outline-none focus:ring-2 focus:ring-amber-400 
          text-sm bg-white text-neutral-900
          ${className}
        `}
      />
    </div>
  );
}
