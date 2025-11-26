// C:\Projets\Hemut-link\frontend\app\auth\forgot-password\page.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset(e: any) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Impossible d'envoyer l'email.");
        setLoading(false);
        return;
      }

      setSent(true);
    } catch (err) {
      setErrorMsg("Erreur serveur.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black px-6">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow">

        {!sent ? (
          <>
            <h1 className="text-3xl font-bold text-center mb-6">
              Mot de passe oublié
            </h1>

            {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}

            <form onSubmit={handleReset} className="space-y-5">

              <div>
                <label className="block mb-2 text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="exemple@mail.com"
                  value={email}
                  onChange={(e: any) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Envoi..." : "Envoyer le lien"}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">
              Email envoyé !
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Vérifie ta boîte mail pour réinitialiser ton mot de passe.
            </p>
          </div>
        )}

        <p className="text-center mt-6 text-gray-600 dark:text-gray-300">
          <Link href="/auth/login" className="text-blue-600">
            Retour à la connexion
          </Link>
        </p>

      </div>
    </main>
  );
}
