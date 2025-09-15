import Image from "next/image";
import "./globals.css";

type Creator = {
  id: string; display_name: string; image_url: string; tags: string[]; bio: string|null;
  x_url: string|null; onlyfans_url: string|null; elo: number; wins: number; losses: number;
};

export default async function Page() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/creators`, { cache: "no-store" });
  const { creators } = await res.json();

  return (
    <main className="max-w-6xl mx-auto px-4 pb-20">
      <header className="py-6 flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Hottest Woman on the Internet</h1>
        <a className="text-sm underline" href="/admin">Admin</a>
      </header>

      <VoteArena />

      <section className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Leaderboard</h2>
          <div className="text-xs text-zinc-500">Women creators • Click a card for links</div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {creators.map((c: Creator, i: number) => (
            <article key={c.id} className="rounded-2xl overflow-hidden border bg-white">
              <div className="relative aspect-[4/5]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image_url} alt={c.display_name} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{i+1}. {c.display_name}</h3>
                  <div className="text-right text-sm font-semibold">{c.elo}</div>
                </div>
                <div className="text-xs text-zinc-500">{(c.tags||[]).join(", ")}</div>
                <div className="text-xs text-zinc-500">{c.wins}-{c.losses}</div>
                <div className="mt-2 flex gap-2">
                  {c.x_url && <a className="text-xs px-2 py-1 border rounded-lg" target="_blank" href={c.x_url}>X</a>}
                  {c.onlyfans_url && <a className="text-xs px-2 py-1 border rounded-lg" target="_blank" href={c.onlyfans_url}>OnlyFans</a>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function VoteArena() {
  async function getDuel() {
    const res = await fetch("/api/duel", { cache: "no-store" });
    return res.json();
  }
  async function sendVote(duelId: number, winnerId: string) {
    await fetch("/api/vote", {
      method: "POST",
      headers: {"content-type":"application/json"},
      body: JSON.stringify({ duelId, winnerId })
    });
  }

  return (
    <section aria-label="vote arena" className="mt-4">
      <DuelClient getDuel={getDuel} sendVote={sendVote} />
    </section>
  );
}

// Client component
"use client";
import { useEffect, useState } from "react";

function DuelClient({ getDuel, sendVote }: { getDuel: ()=>Promise<any>, sendVote: (id:number,w:string)=>Promise<void> }) {
  const [duel, setDuel] = useState<any>(null);
  async function refresh(){ setDuel(await getDuel()); }
  useEffect(()=>{ refresh(); }, []);

  if (!duel || !duel.a || !duel.b) return <div className="h-64 rounded-2xl border bg-white grid place-items-center">Loading…</div>;

  const A = duel.a, B = duel.b;
  async function vote(which: "A"|"B"){
    await sendVote(duel.duelId, which==="A" ? A.id : B.id);
    await refresh();
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[["A",A],["B",B]].map(([key, c]: any)=> (
        <article key={key} className="rounded-2xl overflow-hidden bg-white border">
          <div className="aspect-[4/5] bg-zinc-100 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt={c.display_name} src={c.image_url} className="w-full h-full object-cover" />
          </div>
          <div className="p-4 flex items-center justify-between gap-2">
            <div>
              <div className="text-lg font-semibold">{c.display_name}</div>
              <div className="text-xs text-zinc-500">{(c.tags||[]).slice(0,2).join(" · ")}</div>
            </div>
            <button onClick={()=>vote(key as any)} className="rounded-xl px-5 py-2.5 bg-pink-600 text-white hover:bg-pink-700">Vote</button>
          </div>
        </article>
      ))}
    </div>
  );
}
