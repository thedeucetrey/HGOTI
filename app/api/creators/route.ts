import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("creators")
    .select("id, display_name, slug, image_url, tags, bio, x_url, onlyfans_url, elo, wins, losses, active")
    .order("elo", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ creators: data });
}

export async function POST(req: Request) {
  const token = req.headers.get("x-admin-token");
  if (token !== process.env.ADMIN_TOKEN) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { display_name, image_url, tags, bio, x_url, onlyfans_url } = await req.json();
  if (!display_name || !image_url) return NextResponse.json({ error: "name & image required" }, { status: 400 });

  const { data, error } = await supabaseAdmin.from("creators").insert({
    display_name, image_url, tags: tags || [], bio: bio || null, x_url: x_url || null, onlyfans_url: onlyfans_url || null
  }).select("id, slug").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, creator: data });
}
