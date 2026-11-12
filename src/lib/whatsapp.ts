/** Also encodes the characters encodeURIComponent leaves alone, such as "!". */
const encode = (text: string) =>
  encodeURIComponent(text).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);

export const whatsappUrl = (number: string, message: string) =>
  `https://wa.me/${number}?text=${encode(message)}`;

export const GENERAL_MESSAGE = "Namaste! I would like to know more about your felt handicraft products.";

export type ProductEnquiry = {
  businessName: string;
  product: string;
  category: string;
  /** Empty when the product has no sizes listed. */
  size: string;
  url: string;
};

export function productMessage({ businessName, product, category, size, url }: ProductEnquiry): string {
  return [
    `Namaste! I am interested in the following product from ${businessName}.`,
    "",
    `Product: ${product}`,
    `Category: ${category}`,
    ...(size ? [`Selected Size: ${size}`] : []),
    "",
    `Product Link: ${url}`,
    "",
    "Could you please provide more information about this product?",
  ].join("\n");
}
