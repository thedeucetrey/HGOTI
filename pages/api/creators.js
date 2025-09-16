// pages/api/creators.js
import { getAdminClient } from "../../lib/supabaseAdmin";

export default async function handler(req, res) {
  const supabase = getAdminClient();

  if (req.method === "GET") {
    // List creators ordered by ELO
    const { data, error } = await supabase
      .from("creators")
      .select("id, display_name, image_url, tags, bio, x_url, onlyfans_url, elo, wins, losses, created_at")
      .order("elo", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ creators: data ?? [] });
  }

  if (req.method === "POST") {
    // Simple admin guard (we can harden later)
    if (req.headers["x-admin-token"] !== process.env.ADMIN_TOKEN) {
      return res.status(401).json({ error: "unauthorized" });
    }

    const { display_name, image_url, tags, bio, x_url, onlyfans_url } = req.body || {};
    if (!display_name || !image_url) {
      return res.status(400).json({ error: "name & image required" });
    }

    const { error } = await supabase.from("creators").insert({
      display_name,
      image_url,
      tags: Array.isArray(tags) ? tags : [],
      bio: bio ?? null,
      x_url: x_url ?? null,
      onlyfans_url: onlyfans_url ?? null,
    });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true });
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).end("Method Not Allowed");
}
