import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email ou mot de passe manquant." },
        { status: 400 }
      );
    }

    // Fake user pour test
    const fakeUser = {
      id: 1,
      email,
      role: "ARTISAN",
    };

    const tokenPayload = {
      id: fakeUser.id,
      email: fakeUser.email,
      role: fakeUser.role,
    };

    const token = Buffer.from(JSON.stringify(tokenPayload)).toString("base64");

    const res = NextResponse.json({ user: fakeUser, token });

    res.cookies.set("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err) {
    return NextResponse.json(
      { error: "Erreur serveur lors de la connexion." },
      { status: 500 }
    );
  }
}

