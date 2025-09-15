import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function auth(req: Request) {
  const token = req.headers.get("x-admin-token");
  return token === process.env.ADMIN_TOKEN;
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!auth(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json();
  const patch: any = {};
  ["display_name","image_url","tags","bio","x_url","onlyfans_url","active"].forEach(k=>{
    if (k in body) patch[k] = body[k];
  });
  const { error } = await supabaseAdmin.from("creators").update(patch).eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!auth(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { error } = await supabaseAdmin.from("creators").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
