import { NextResponse } from "next/server";
export const runtime = "nodejs"; // safe default

export function GET() {
  const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasService = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  return NextResponse.json({
    ok: true,
    hasUrl,
    hasService
  });
}
