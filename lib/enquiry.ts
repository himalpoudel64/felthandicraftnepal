import type { Content } from "./types";

/** Settings every enquiry form needs, resolved at build time. */
export function enquirySettings({ settings }: Content) {
  return {
    web3formsKey: process.env.WEB3FORMS_KEY || undefined,
    whatsappNumber: settings.whatsappNumber || undefined,
    email: settings.email,
    businessName: settings.businessName,
  };
}

/** Options for the "product or category of interest" select. */
export function interestGroups({ categories }: Content) {
  return categories.map((category) => ({
    label: category.title,
    options: [`${category.title} (any)`, ...category.products.map((product) => product.name)],
  }));
}
