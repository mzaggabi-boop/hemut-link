// CODE � COLLER
"use client";

export default function ExportPdfButton() {
  async function handleExport() {
    const res = await fetch("/api/transactions/export-pdf");
    if (!res.ok) {
      alert("Erreur lors de l'export PDF.");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.pdf";
    a.click();

    window.URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleExport}
      className="px-3 py-2 bg-black text-white text-xs rounded-lg hover:bg-gray-900"
    >
      Export PDF
    </button>
  );
}
