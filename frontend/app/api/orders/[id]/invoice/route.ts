// app/api/orders/[id]/invoice/route.ts

import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase-server";
import PDFDocument from "pdfkit";
import { Readable } from "stream";

async function pdfToArrayBuffer(doc: PDFDocument): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];

    const stream = new Readable({
      read() {}
    });

    const piped = doc.pipe(stream);

    piped.on("data", (chunk) => chunks.push(chunk));
    piped.on("end", () => {
      const buffer = Buffer.concat(chunks);
      const arrayBuffer = buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength
      );
      resolve(arrayBuffer);
    });
    piped.on("error", reject);

    doc.end();
  });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const orderId = Number(id);

    if (Number.isNaN(orderId)) {
      return new Response("ID de commande invalide", { status: 400 });
    }

    const supabase = supabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return new Response("Non authentifié", { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { supabaseId: user.id },
    });

    if (!dbUser) {
      return new Response("Utilisateur introuvable", { status: 404 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        buyer: true,
        items: {
          include: {
            product: {
              include: {
                seller: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return new Response("Commande introuvable", { status: 404 });
    }

    const firstProduct = order.items[0]?.product;
    const sellerUser = firstProduct?.seller || null;

    const isBuyer = order.buyerId === dbUser.id;
    const isSeller = sellerUser && sellerUser.id === dbUser.id;

    if (!isBuyer && !isSeller) {
      return new Response("Accès interdit à cette facture", { status: 403 });
    }

    // PDF DOCUMENT
    const doc = new PDFDocument({ size: "A4", margin: 40 });

    // HEADER
    doc.fontSize(20).text("Hemut-link");
    doc.moveDown(1);
    doc.fontSize(12).text(`Facture n° FACT-${order.id}`);
    doc.text(`Date : ${new Date(order.createdAt).toLocaleDateString("fr-FR")}`);
    doc.moveDown(2);

    // SELLER
    doc.fontSize(12).text("Vendeur :", { underline: true });
    if (sellerUser) {
      const sellerName =
        sellerUser.companyName ||
        `${sellerUser.firstname || ""} ${sellerUser.lastname || ""}`.trim() ||
        sellerUser.email;

      doc.text(sellerName);
      if (sellerUser.email) doc.text(sellerUser.email);
    } else {
      doc.text("—");
    }

    doc.moveDown();

    // BUYER
    doc.text("Client :", { underline: true });
    const buyerName =
      `${order.buyer.firstname || ""} ${order.buyer.lastname || ""}`.trim() ||
      order.buyer.email;

    doc.text(buyerName);
    if (order.buyer.email) doc.text(order.buyer.email);
    doc.moveDown(2);

    // TABLE
    doc.fontSize(11).text("Détail de la commande :", { underline: true });
    doc.moveDown();

    const tableTop = doc.y;
    const col1 = 40;
    const col2 = 120;
    const col3 = 360;
    const col4 = 430;
    const col5 = 500;

    doc.fontSize(10);
    doc.text("Réf", col1, tableTop);
    doc.text("Produit", col2, tableTop);
    doc.text("Qté", col3, tableTop, { width: 40, align: "right" });
    doc.text("PU TTC", col4, tableTop, { width: 60, align: "right" });
    doc.text("Total TTC", col5, tableTop, { width: 60, align: "right" });

    let y = tableTop + 18;

    order.items.forEach((item) => {
      const label = item.product?.title || `Produit #${item.productId}`;
      const lineTotal = item.unitPrice * item.quantity;

      doc.text(String(item.productId), col1, y, { width: 60 });
      doc.text(label, col2, y, { width: 220 });
      doc.text(String(item.quantity), col3, y, { width: 40, align: "right" });
      doc.text(`${item.unitPrice.toFixed(2)} €`, col4, y, {
        width: 60,
        align: "right",
      });
      doc.text(`${lineTotal.toFixed(2)} €`, col5, y, {
        width: 60,
        align: "right",
      });

      y += 16;
    });

    doc.moveDown(3);

    const totalTtc = order.totalAmount;
    const tvaRate = 0.2;
    const totalHt = totalTtc / (1 + tvaRate);
    const totalTva = totalTtc - totalHt;

    doc.fontSize(11);
    doc.text(`Total HT : ${totalHt.toFixed(2)} €`, { align: "right" });
    doc.text(`TVA (20%) : ${totalTva.toFixed(2)} €`, { align: "right" });
    doc.text(`Total TTC : ${totalTtc.toFixed(2)} €`, { align: "right" });

    doc.moveDown(2);
    doc.fontSize(9).fillColor("gray").text(
      "Document généré automatiquement par Hemut-link. Cette facture est valable sans signature."
    );

    // → CONVERSION PDF → ARRAYBUFFER
    const arrayBuffer = await pdfToArrayBuffer(doc);

    // → RESPONSE COMPATIBLE NEXT 16
    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=facture-${order.id}.pdf`,
      },
    });
  } catch (err) {
    console.error("INVOICE ERROR:", err);
    return new Response("Erreur serveur", { status: 500 });
  }
}
