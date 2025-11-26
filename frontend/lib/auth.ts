import { supabaseServer } from "./supabase-server";

/**
 * getCurrentUser
 *  - tente de récupérer l'utilisateur courant via Supabase (cookies)
 *  - retourne `null` si aucun utilisateur n'est connecté
 *
 * Cette implémentation est volontairement générique pour éviter de
 * casser le build si le schéma Prisma change.
 */
export type CurrentUser = any;

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = supabaseServer();

  try {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
      return null;
    }

    // On renvoie directement l'objet user Supabase typé en "any"
    // Les couches supérieures peuvent le mapper selon leurs besoins.
    return data.user as any;
  } catch {
    return null;
  }
}