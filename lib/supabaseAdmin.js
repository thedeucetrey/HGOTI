// lib/supabaseAdmin.js
import { createClient } from "@supabase/supabase-js";

// Use ONLY on the server (API routes). Never import from client/browser code.
export function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY; // service role (server-only)
  if (!url || !key) {
    throw new Error("Missing envs: set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel");
  }
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}
