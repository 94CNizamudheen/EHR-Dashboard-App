import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  const tokenRes = await fetch(process.env.ORACLE_TOKEN_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: process.env.ORACLE_REDIRECT_URI!,
      client_id: process.env.ORACLE_CLIENT_ID!,
      client_secret: process.env.ORACLE_CLIENT_SECRET!,
    }),
  });

  const data = await tokenRes.json();
  return NextResponse.json(data);
}
