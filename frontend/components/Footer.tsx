"use client";

export default function Footer() {
  return (
    <footer className="w-full p-4 mt-10 bg-neutral-900 text-neutral-400 border-t border-neutral-800 text-center">
      © {new Date().getFullYear()} Hemut-link — Tous droits réservés.
    </footer>
  );
}
