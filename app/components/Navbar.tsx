"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between py-4 px-6 bg-white dark:bg-zinc-900 shadow-md">
      <Link
        href="/"
        className="text-xl font-bold text-blue-600 dark:text-blue-400"
      >
        Hemut-link
      </Link>

      <div className="flex items-center gap-4">
        <Link
          href="/auth/login"
          className="text-sm text-gray-700 dark:text-gray-300 hover:underline"
        >
          Se connecter
        </Link>
        <Link
          href="/auth/register"
          className="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          S’inscrire
        </Link>
      </div>
    </nav>
  );
}
