// app/api/marketplace/order/[id]/invoice/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import PDFDocument from "pdfkit";
import stream from "stream";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const orderId = Number(id);

  if (Number.isNaN(orderId)) {
    return NextResponse.json(
      { error: "Commande introuvable." },
      { status: 400 }
    );
  }

  const order = await prisma.marketplaceOrder.findUnique({
    where: { id: orderId },
    include: {
      buyer: true,
      seller: true,
      product: true,
    },
  });

  if (!order) {
    return NextResponse.json(
      { error: "Commande introuvable." },
      { status: 404 }
    );
  }

  // STREAM FIX COMPATIBLE NEXT 16
  const pass = new stream.PassThrough();
  const chunks: Uint8Array[] = [];
  pass.on("data", (chunk) => chunks.push(chunk as Uint8Array));

  const doc = new PDFDocument({ margin: 40 });
  doc.pipe(pass);

  doc.fontSize(22).text("Facture Marketplace", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Facture pour commande #${order.id}`);
  doc.text(`Date : ${order.createdAt.toLocaleString("fr-FR")}`);

  doc.moveDown();

  doc.text(`Produit : ${order.product?.title}`);
  doc.text(
    `Montant : ${order.total.toLocaleString("fr-FR", {
      style: "currency",
      currency: "EUR",
    })}`
  );

  doc.moveDown();

  doc.text("Client :");
  doc.text(`${order.buyer.firstname} ${order.buyer.lastname}`);
  doc.text(order.buyer.email);

  doc.moveDown();

  doc.text("Vendeur :");
  doc.text(`${order.seller.firstname} ${order.seller.lastname}`);
  doc.text(order.seller.email);

  doc.end();

  // Convert PassThrough → Buffer
  const pdfBuffer: Buffer = await new Promise((resolve) => {
    pass.on("end", () => resolve(Buffer.concat(chunks)));
  });

  // Convert Buffer → ArrayBuffer (100% Blob compatible)
  const arrayBuffer = pdfBuffer.buffer.slice(
    pdfBuffer.byteOffset,
    pdfBuffer.byteOffset + pdfBuffer.byteLength
  );

  // Create Blob for Next.js 16 / Vercel compatibility
  const blob = new Blob([arrayBuffer], { type: "application/pdf" });

  return new NextResponse(blob, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=facture-${order.id}.pdf`,
    },
  });
}


