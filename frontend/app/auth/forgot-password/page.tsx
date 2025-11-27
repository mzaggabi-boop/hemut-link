"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "../../components/Input";
import Button from "../../components/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-xl font-semibold text-amber-400">
        Mot de passe oublié
      </h1>

      <p className="text-neutral-400 text-sm">
        Entrez votre adresse email pour recevoir un lien de réinitialisation.
      </p>

      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Button className="w-full">Envoyer</Button>

      <Link href="/auth/login" className="text-sm text-neutral-400 underline">
        Retour à la connexion
      </Link>
    </div>
  );
}
