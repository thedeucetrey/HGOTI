import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  // pick two random active creators
  const { data: list, error } = await supabaseAdmin
    .from("creators")
    .select("id, display_name, image_url, tags, bio, x_url, onlyfans_url, elo, wins, losses")
    .eq("active", true);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!list || list.length < 2) return NextResponse.json({ error: "need at least 2 creators" }, { status: 400 });

  // simple random pair
  const i = Math.floor(Math.random() * list.length);
  let j = i;
  while (j === i) j = Math.floor(Math.random() * list.length);
  const A = list[i], B = list[j];

  const { data: duel, error: dErr } = await supabaseAdmin
    .from("duels").insert({ a: A.id, b: B.id }).select("id").single();
  if (dErr) return NextResponse.json({ error: dErr.message }, { status: 500 });

  return NextResponse.json({ duelId: duel!.id, a: A, b: B });
}
