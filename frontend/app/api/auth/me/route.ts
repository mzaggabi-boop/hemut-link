import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const token = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.replace("token=", "");

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const decoded = JSON.parse(
      Buffer.from(token, "base64").toString("utf-8")
    );

    return NextResponse.json({ user: decoded }, { status: 200 });

  } catch (err) {
    console.error("❌ ERREUR /api/auth/me :", err);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
