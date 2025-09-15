import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { applyElo } from "@/lib/elo";

export async function POST(req: Request) {
  const { duelId, winnerId, ipHash, fp } = await req.json();
  if (!duelId || !winnerId) return NextResponse.json({ error: "bad request" }, { status: 400 });

  // fetch duel
  const { data: duel, error: dErr } = await supabaseAdmin.from("duels").select("*").eq("id", duelId).single();
  if (dErr || !duel) return NextResponse.json({ error: "duel not found" }, { status: 404 });

  const aId = duel.a, bId = duel.b;
  if (winnerId !== aId && winnerId !== bId) return NextResponse.json({ error: "winner not in duel" }, { status: 400 });
  const loserId = winnerId === aId ? bId : aId;

  // fetch ratings
  const { data: players, error: pErr } = await supabaseAdmin
    .from("creators").select("id, elo, wins, losses").in("id", [aId, bId]);
  if (pErr || !players || players.length !== 2) return NextResponse.json({ error: "players missing" }, { status: 500 });
  const A = players.find(p=>p.id===aId)!;
  const B = players.find(p=>p.id===bId)!;

  const [newA, newB] = applyElo(A.elo, B.elo, winnerId === aId);

  // perform updates and insert vote
  const tx = supabaseAdmin; // Supabase doesn't support multi-step txn in JS; do sequential with "at least once". Good enough for MVP.
  const { error: vErr } = await tx.from("votes").insert({ duel_id: duelId, winner: winnerId, loser: loserId, ip_hash: ipHash || null, fp: fp || null });
  if (vErr) return NextResponse.json({ error: vErr.message }, { status: 500 });

  const { error: uErr1 } = await tx.from("creators").update({ elo: newA, wins: A.wins + (winnerId === aId ? 1 : 0), losses: A.losses + (winnerId === aId ? 0 : 1) }).eq("id", aId);
  const { error: uErr2 } = await tx.from("creators").update({ elo: newB, wins: B.wins + (winnerId === bId ? 1 : 0), losses: B.losses + (winnerId === bId ? 0 : 1) }).eq("id", bId);
  if (uErr1 || uErr2) return NextResponse.json({ error: "update failed" }, { status: 500 });

  return NextResponse.json({ ok: true });
}
