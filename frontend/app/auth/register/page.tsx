// C:\Projets\Hemut-link\frontend\app\auth\register\page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleRegister(e: any) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Erreur lors de l'inscription.");
        setLoading(false);
        return;
      }

      // Login direct après register
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

        <h1 className="text-3xl font-bold text-center mb-6">
          Créer un compte
        </h1>

        {errorMsg && (
          <p className="mb-4 text-red-500 text-center">{errorMsg}</p>
        )}

        <form onSubmit={handleRegister} className="space-y-5">

          <div>
            <label className="block mb-2 text-sm font-medium">Nom</label>
            <Input
              name="firstname"
              type="text"
              placeholder="Votre prénom"
              value={form.firstname}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Prénom</label>
            <Input
              name="lastname"
              type="text"
              placeholder="Votre nom"
              value={form.lastname}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Email</label>
            <Input
              name="email"
              type="email"
              placeholder="exemple@mail.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Mot de passe</label>
            <Input
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Création..." : "Créer un compte"}
          </Button>
        </form>

        <p className="text-center mt-6 text-gray-600 dark:text-gray-300">
          Déjà un compte ?{" "}
          <Link href="/auth/login" className="text-blue-600">
            Se connecter
          </Link>
        </p>

      </div>
    </main>
  );
}
