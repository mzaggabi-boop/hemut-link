import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase-server";
import PDFDocument from "pdfkit";
import stream from "stream";

export async function GET() {
  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse("Non authentifié", { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
  });

  if (!dbUser) {
    return new NextResponse("Utilisateur inconnu", { status: 404 });
  }

  const payments = await prisma.payment.findMany({
    where: { receiverId: dbUser.id },
    include: {
      sender: true,
      order: {
        include: {
          items: {
            include: { product: true },
          },
        },
      },
      job: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Init PDF stream
  const pass = new stream.PassThrough();
  const chunks: Uint8Array[] = [];
  pass.on("data", (chunk) => chunks.push(chunk as Uint8Array));
  const doc = new PDFDocument({ margin: 40 });

  doc.pipe(pass);

  // Header
  doc.fontSize(20).text("Hemut-link — Rapport des transactions", {
    align: "center",
  });
  doc.moveDown();

  doc.fontSize(10).text(
    `Généré le : ${new Date().toLocaleString("fr-FR")}`,
    { align: "right" }
  );

  doc.moveDown(2);

  doc.fontSize(12).text(`Total des transactions : ${payments.length}`);
  doc.moveDown(2);

  // Contenu
  payments.forEach((p) => {
    const type = p.order ? "Commande" : p.job ? "Mission Go" : "Autre";
    const label =
      p.order?.items?.[0]?.product?.title ||
      p.job?.title ||
      "—";

    const net = p.amount - p.commission;

    doc.fontSize(12).text("─────────────────────────────────────────────");

    doc.fontSize(10)
      .text(`ID : ${p.id}`)
      .text(`Date : ${new Date(p.createdAt).toLocaleString("fr-FR")}`)
      .text(`Type : ${type}`)
      .text(`Objet : ${label}`)
      .text(`Client : ${p.sender?.email}`)
      .moveDown()
      .text(`Montant brut : ${p.amount} €`)
      .text(`Commission   : ${p.commission} €`)
      .text(`Net reçu     : ${net} €`)
      .moveDown();
  });

  doc.end();

  const pdfBuffer: Uint8Array = await new Promise((resolve) => {
    pass.on("end", () => resolve(Buffer.concat(chunks)));
  });

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=transactions.pdf",
    },
  });
}
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase-server";
import PDFDocument from "pdfkit";
import stream from "stream";

export async function GET() {
  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse("Non authentifié", { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id },
  });

  if (!dbUser) {
    return new NextResponse("Utilisateur inconnu", { status: 404 });
  }

  const payments = await prisma.payment.findMany({
    where: { receiverId: dbUser.id },
    include: {
      sender: true,
      order: {
        include: {
          items: {
            include: { product: true },
          },
        },
      },
      job: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Init PDF stream
  const pass = new stream.PassThrough();
  const chunks: Uint8Array[] = [];
  pass.on("data", (chunk) => chunks.push(chunk as Uint8Array));
  const doc = new PDFDocument({ margin: 40 });

  doc.pipe(pass);

  // Header
  doc.fontSize(20).text("Hemut-link — Rapport des transactions", {
    align: "center",
  });
  doc.moveDown();

  doc.fontSize(10).text(
    `Généré le : ${new Date().toLocaleString("fr-FR")}`,
    { align: "right" }
  );

  doc.moveDown(2);

  doc.fontSize(12).text(`Total des transactions : ${payments.length}`);
  doc.moveDown(2);

  // Contenu
  payments.forEach((p) => {
    const type = p.order ? "Commande" : p.job ? "Mission Go" : "Autre";
    const label =
      p.order?.items?.[0]?.product?.title ||
      p.job?.title ||
      "—";

    const net = p.amount - p.commission;

    doc.fontSize(12).text("─────────────────────────────────────────────");

    doc.fontSize(10)
      .text(`ID : ${p.id}`)
      .text(`Date : ${new Date(p.createdAt).toLocaleString("fr-FR")}`)
      .text(`Type : ${type}`)
      .text(`Objet : ${label}`)
      .text(`Client : ${p.sender?.email}`)
      .moveDown()
      .text(`Montant brut : ${p.amount} €`)
      .text(`Commission   : ${p.commission} €`)
      .text(`Net reçu     : ${net} €`)
      .moveDown();
  });

  doc.end();

  const pdfBuffer: Uint8Array = await new Promise((resolve) => {
    pass.on("end", () => resolve(Buffer.concat(chunks)));
  });

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=transactions.pdf",
    },
  });
}
