// frontend/lib/supabase-server.ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function supabaseServer() {
  // IMPORTANT : cookies() doit être await pour Next.js 13+ / 16
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set(name, value, options);
          } catch {
            // Survercel serverless fallback
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.delete(name, options);
          } catch {
            // Survercel serverless fallback
          }
        },
      },
    }
  );
}
