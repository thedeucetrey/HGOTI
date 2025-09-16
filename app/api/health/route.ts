import { NextResponse } from "next/server";
export const runtime = "nodejs";
export function GET() {
  return NextResponse.json({ ok: true, time: new Date().toISOString() });
}
