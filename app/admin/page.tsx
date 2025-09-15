"use client";
import { useEffect, useState } from "react";

export default function Admin() {
  const [token, setToken] = useState<string>("");

  useEffect(()=>{ setToken(localStorage.getItem("ADMIN_TOKEN")||""); }, []);
  function saveToken(){ localStorage.setItem("ADMIN_TOKEN", token||""); alert("Token saved locally."); }

  async function create(e: any){
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const body = {
      display_name: String(fd.get("name")||"").trim(),
      image_url: String(fd.get("image")||"").trim(),
      tags: String(fd.get("tags")||"").split(",").map(s=>s.trim()).filter(Boolean),
      bio: String(fd.get("bio")||"").trim() || null,
      x_url: String(fd.get("x")||"").trim() || null,
      onlyfans_url: String(fd.get("onlyfans")||"").trim() || null,
    };
    const res = await fetch("/api/creators", {
      method: "POST",
      headers: { "content-type":"application/json", "x-admin-token": localStorage.getItem("ADMIN_TOKEN")||"" },
      body: JSON.stringify(body)
    });
    const j = await res.json();
    if (!res.ok) return alert(j.error || "failed");
    alert("Creator added.");
    e.currentTarget.reset();
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin</h1>

      <section className="rounded-2xl border bg-white p-4 space-y-2">
        <h2 className="font-semibold">Token</h2>
        <input className="w-full rounded-xl border px-3 py-2" placeholder="ADMIN_TOKEN" value={token} onChange={e=>setToken(e.target.value)} />
        <button className="rounded-xl px-4 py-2 bg-zinc-900 text-white" onClick={saveToken}>Save Token</button>
        <p className="text-xs text-zinc-500">Set <code>ADMIN_TOKEN</code> in Vercel/Supabase env, and paste it here to authenticate admin calls.</p>
      </section>

      <form onSubmit={create} className="rounded-2xl border bg-white p-4 grid gap-3">
        <h2 className="font-semibold">Add Creator (18+ & consented)</h2>
        <input name="name" required placeholder="Display name" className="w-full rounded-xl border px-3 py-2" />
        <input name="image" required placeholder="Image URL (portrait)" className="w-full rounded-xl border px-3 py-2" />
        <input name="tags" placeholder="Tags (comma-separated)" className="w-full rounded-xl border px-3 py-2" />
        <textarea name="bio" placeholder="Bio" className="w-full rounded-xl border px-3 py-2"></textarea>
        <input name="x" placeholder="X (Twitter) URL" className="w-full rounded-xl border px-3 py-2" />
        <input name="onlyfans" placeholder="OnlyFans URL" className="w-full rounded-xl border px-3 py-2" />
        <button className="rounded-xl px-4 py-2 bg-pink-600 text-white">Create</button>
      </form>
    </main>
  );
}
