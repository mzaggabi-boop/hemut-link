// C:\Projets\Hemut-link\frontend\app\auth\login\page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleLogin(e: any) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Email ou mot de passe invalide.");
        setLoading(false);
        return;
      }

      // Stocker le token
      localStorage.setItem("hemut_token", data.token);

      router.push("/dashboard");
    } catch (err) {
      setErrorMsg("Erreur serveur. Réessaie plus tard.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-black px-6">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow">
        <h1 className="text-3xl font-bold text-center mb-6">Connexion</h1>

        {errorMsg && (
          <p className="mb-4 text-red-500 text-center">{errorMsg}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
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

          <div>
            <label className="block mb-2 text-sm font-medium">
              Mot de passe
            </label>
            <Input
              type="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>

        <p className="text-center mt-6 text-gray-600 dark:text-gray-300">
          Mot de passe oublié ?{" "}
          <Link href="/auth/forgot-password" className="text-blue-600">
            Réinitialiser
          </Link>
        </p>

        <p className="text-center mt-3 text-gray-600 dark:text-gray-300">
          Pas encore de compte ?{" "}
          <Link href="/auth/register" className="text-blue-600">
            S’inscrire
          </Link>
        </p>
      </div>
    </main>
  );
}

