import { NextResponse } from "next/server";
export const runtime = "nodejs"; // (safe default on Vercel)
export function GET() {
  return NextResponse.json({ ok: true, time: new Date().toISOString() });
}
