import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Le frontend envoie firstname / lastname
    const {
      firstname,
      lastname,
      email,
      password,
      phone = null,
      role = "USER",   // valeur par défaut
    } = body;

    if (!firstname || !lastname || !email || !password) {
      return NextResponse.json(
        { error: "Champs manquants." },
        { status: 400 }
      );
    }

    // Fake user
    const fakeUser = {
      id: Date.now(),
      firstName: firstname,
      lastName: lastname,
      email,
      phone,
      role,
    };

    const tokenPayload = {
      id: fakeUser.id,
      email: fakeUser.email,
      role: fakeUser.role,
    };

    const token = Buffer.from(JSON.stringify(tokenPayload)).toString("base64");

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

