import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  groups: [
    { name: "business", title: "Business", default: true },
    { name: "seo", title: "Google and sharing" },
  ],
  fields: [
    defineField({
      name: "businessName",
      title: "Business name",
      type: "string",
      group: "business",
      initialValue: "Bishnu Laxmi Felt Handicraft",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "altImage",
      group: "business",
      description: "Without a logo, the business name is set in type in the header.",
    }),
    defineField({
      name: "email",
      title: "Business email",
      type: "string",
      group: "business",
      description:
        "Shown on the website. Website enquiries go to the inbox linked to the Web3Forms key, so change that too if this changes.",
      initialValue: "felthandicraftnepal@gmail.com",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "whatsappNumber",
      title: "WhatsApp number",
      type: "string",
      group: "business",
      description: "International format, digits only: country code first, no + and no spaces.",
      initialValue: "9779851041305",
      validation: (rule) =>
        rule.required().regex(/^\d{8,15}$/, { name: "digits only, 8 to 15 long" }),
    }),
    defineField({
      name: "phone",
      title: "Phone number (optional)",
      type: "string",
      group: "business",
      initialValue: "+977 985-1041305",
    }),
    defineField({
      name: "address",
      title: "Address (optional)",
      type: "object",
      group: "business",
      description: "Only shown if you fill it in. A street address also marks you as a local business for Google.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: "street", title: "Street", type: "string" }),
        defineField({ name: "city", title: "City", type: "string" }),
        defineField({ name: "region", title: "Province or region", type: "string" }),
        defineField({ name: "postalCode", title: "Postal code", type: "string" }),
        defineField({ name: "country", title: "Country", type: "string" }),
      ],
    }),
    defineField({
      name: "socialLinks",
      title: "Social media links (optional)",
      type: "array",
      group: "business",
      of: [
        defineArrayMember({
          type: "object",
          name: "socialLink",
          fields: [
            defineField({
              name: "label",
              title: "Name",
              type: "string",
              description: "For example, Instagram.",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "Link",
              type: "url",
              validation: (rule) => rule.required().uri({ scheme: ["https", "http"] }),
            }),
          ],
          preview: { select: { title: "label", subtitle: "url" } },
        }),
      ],
    }),
    defineField({
      name: "footerDescription",
      title: "Footer description",
      type: "text",
      rows: 3,
      group: "business",
      description: "A sentence or two about the business, shown at the bottom of every page.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "seoTitle",
      title: "Default SEO title",
      type: "string",
      group: "seo",
      description: "Used for the home page and for pages with no title of their own.",
      validation: (rule) => rule.max(60).warning("Google usually cuts titles off after 60 characters."),
    }),
    defineField({
      name: "seoDescription",
      title: "Default SEO description",
      type: "text",
      rows: 3,
      group: "seo",
      validation: (rule) =>
        rule.max(155).warning("Google usually cuts descriptions off after 155 characters."),
    }),
    defineField({
      name: "defaultOgImage",
      title: "Default sharing image",
      type: "altImage",
      group: "seo",
      description: "Used when a page with no photo of its own is shared on social media.",
    }),
    defineField({
      name: "googleVerification",
      title: "Google Search Console verification token (optional)",
      type: "string",
      group: "seo",
      description: "Only the content value of the HTML tag Google gives you.",
    }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});
