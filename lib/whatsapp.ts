export type EnquiryDetails = {
  product?: string;
  size?: string;
  price?: string;
  interest?: string;
  pageUrl?: string;
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
};

/** The enquiry as labelled lines, shared by WhatsApp and the mailto fallback. */
export function enquiryText(details: EnquiryDetails): string {
  const lines: [string, string | undefined][] = [
    ["Product", details.product],
    ["Size", details.size],
    ["Price", details.price],
    ["Interested in", details.interest],
    ["Page", details.pageUrl],
    ["Name", details.name],
    ["Phone", details.phone],
    ["Email", details.email],
    ["Message", details.message],
  ];
  return lines
    .filter(([, value]) => value?.trim())
    .map(([label, value]) => `${label}: ${value?.trim()}`)
    .join("\n");
}

export function whatsappUrl(number: string, details: EnquiryDetails): string {
  const text = `Hello, I would like to make an enquiry.\n\n${enquiryText(details)}`;
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}
