// CODE XLSX � COLLER
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { supabaseServer } from "@/lib/supabase-server";
import ExcelJS from "exceljs";

export async function GET() {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

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

  // 📘 Création du document Excel
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Hemut-link";
  workbook.created = new Date();

  // ================================
  // FEUILLE 1 — TRANSACTIONS
  // ================================
  const sheet = workbook.addWorksheet("Transactions");

  sheet.columns = [
    { header: "ID", key: "id", width: 10 },
    { header: "Date", key: "date", width: 20 },
    { header: "Type", key: "type", width: 15 },
    { header: "Produit / Mission", key: "label", width: 40 },
    { header: "Client", key: "client", width: 25 },
    { header: "Montant brut", key: "brut", width: 15 },
    { header: "Commission", key: "commission", width: 15 },
    { header: "Net", key: "net", width: 15 },
    { header: "Statut", key: "status", width: 10 },
  ];

  payments.forEach((p) => {
    const type = p.order ? "Commande" : p.job ? "Mission Go" : "Autre";
    const label = p.order?.items?.[0]?.product?.title || p.job?.title || "—";
    const net = p.amount - p.commission;

    sheet.addRow({
      id: p.id,
      date: new Date(p.createdAt).toLocaleString("fr-FR"),
      type,
      label,
      client: p.sender?.email || "",
      brut: `${p.amount} €`,
      commission: `${p.commission} €`,
      net: `${net} €`,
      status: p.status,
    });
  });

  // ================================
  // FEUILLE 2 — STATISTIQUES
  // ================================
  const stats = workbook.addWorksheet("Statistiques");

  const totalBrut = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalCommission = payments.reduce((sum, p) => sum + p.commission, 0);
  const totalNet = totalBrut - totalCommission;

  stats.addRow(["Statistique", "Valeur"]);
  stats.addRow(["Total brut encaissé", `${totalBrut} €`]);
  stats.addRow(["Total commissions", `${totalCommission} €`]);
  stats.addRow(["Total net reçu", `${totalNet} €`]);
  stats.addRow(["Nombre de transactions", payments.length]);

  // ================================
  // EXPORT BUFFER
  // ================================
  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=transactions.xlsx",
    },
  });
}

