// SEO HELPERS - A REMPLACER
// lib/seo.ts

export function getSiteUrl() {
  // Tu pourras mettre NEXT_PUBLIC_SITE_URL dans .env plus tard
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

type ProductSeoParams = {
  id: number;
  title: string;
  description?: string | null;
  price: number;
  currency?: string;
  imageUrl?: string | null;
};

export function buildProductStructuredData(p: ProductSeoParams) {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}/product/${p.id}`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    description: p.description || "",
    image: p.imageUrl ? [p.imageUrl] : [],
    offers: {
      "@type": "Offer",
      priceCurrency: p.currency || "EUR",
      price: p.price,
      availability: "https://schema.org/InStock",
      url,
    },
    url,
  };
}
