import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, password, phone, role } = body;

    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json(
        { error: "Champs manquants." },
        { status: 400 }
      );
    }

    // Fake user test
    const fakeUser = {
      id: Date.now(),
      firstName,
      lastName,
      email,
      phone: phone || null,
      role,
    };

    const tokenPayload = {
      id: fakeUser.id,
      email: fakeUser.email,
      role: fakeUser.role,
    };

    const token = Buffer.from(JSON.stringify(tokenPayload)).toString("base64");

    // Next.js 16: cookies() retourne une PROMISE
    const cookieStore = await cookies();
    cookieStore.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json(
      { user: fakeUser, token },
      { status: 201 }
    );
  } catch (err) {
    console.error("REGISTER ERROR =", err);
    return NextResponse.json(
      { error: "Erreur serveur lors de l'inscription." },
      { status: 500 }
    );
  }
}
