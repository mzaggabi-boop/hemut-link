import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import PDFDocument from "pdfkit";
import stream from "stream";

export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  const orderId = Number(context.params.id);

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

  const pdfStream = new stream.PassThrough();
  const doc = new PDFDocument({ margin: 40 });

  doc.pipe(pdfStream);

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

  return new NextResponse(pdfStream, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=facture-${orderId}.pdf`,
    },
  });
}
