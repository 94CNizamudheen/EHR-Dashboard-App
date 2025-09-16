import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  if (action === "login") {
    const authorizeUrl = `https://authorization.cerner.com/tenants/default/authorize?response_type=code&client_id=${process.env.ORACLE_CLIENT_ID}&redirect_uri=${process.env.ORACLE_REDIRECT_URI}&scope=openid+profile+launch+patient.read+offline_access`;
    return NextResponse.redirect(authorizeUrl);
  }

  return NextResponse.json({ message: "Use ?action=login to start OAuth2 flow" });
}
