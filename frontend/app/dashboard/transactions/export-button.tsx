// CODE � COLLER
"use client";

export default function ExportButton() {
  async function handleExport() {
    const res = await fetch("/api/transactions/export");
    if (!res.ok) {
      alert("Erreur lors de l'export CSV.");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();

    window.URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleExport}
      className="px-3 py-2 bg-black text-white text-xs rounded-lg hover:bg-gray-900"
    >
      Export CSV
    </button>
  );
}
