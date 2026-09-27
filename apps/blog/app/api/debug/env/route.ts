import { NextResponse } from "next/server";

export async function GET() {
  const env = {
    VERCEL_ENV: process.env.VERCEL_ENV || "not set",
    NODE_ENV: process.env.NODE_ENV || "not set",
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "not set",
  };

  return NextResponse.json(env);
}
