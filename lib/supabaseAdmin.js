// lib/supabaseAdmin.js
import { createClient } from "@supabase/supabase-js";

// Call this *inside* API handlers so missing envs don't blow up at build time.
export function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY; // server-only (set in Vercel)
  if (!url || !key) {
    throw new Error("Missing envs: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel");
  }
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}
