"use client";

export default function InvoiceButton({ orderId }: { orderId: number }) {
  async function download() {
    const res = await fetch(`/api/marketplace/order/${orderId}/invoice`);
    if (!res.ok) {
      alert("Erreur lors du téléchargement de la facture.");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `facture-${orderId}.pdf`;
    a.click();

    window.URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={download}
      className="px-4 py-2 bg-black text-white text-xs rounded-lg hover:bg-gray-900"
    >
      Télécharger facture PDF
    </button>
  );
}
