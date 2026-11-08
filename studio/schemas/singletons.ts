import { defineArrayMember, defineField, defineType } from "sanity";
import { richText } from "./shared";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "businessName",
      title: "Business name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({ name: "phone", title: "Phone", type: "string" }),
    defineField({
      name: "whatsappNumber",
      title: "WhatsApp number",
      type: "string",
      description:
        "International format, digits only: country code first, no + and no spaces. Leave empty to hide the WhatsApp buttons.",
      validation: (rule) =>
        rule.regex(/^\d{8,15}$/, { name: "digits only, 8 to 15 long" }),
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "object",
      description: "All optional. Filling in a street address also marks you as a local business for Google.",
      options: { collapsible: true },
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
      title: "Social links",
      type: "array",
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
      name: "logo",
      title: "Logo",
      type: "altImage",
      description: "Shown in the header and given to Google. Without it, the business name is set in type.",
    }),
    defineField({
      name: "defaultOgImage",
      title: "Default sharing image",
      type: "altImage",
      description: "Used when a page with no photo of its own is shared on social media.",
    }),
    defineField({
      name: "googleVerification",
      title: "Google Search Console verification token",
      type: "string",
      description: "Only the content value of the HTML tag Google gives you.",
    }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "heroSlides",
      title: "Hero images",
      type: "array",
      description: "The large images at the top of the home page. Drag to reorder. The first loads fastest.",
      of: [defineArrayMember({ type: "heroSlide" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "featuredProducts",
      title: "Featured products",
      type: "array",
      description: "Up to 8. If empty, products ticked Featured are shown instead.",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "product" }],
          options: { filter: 'status == "published"' },
        }),
      ],
      validation: (rule) => rule.max(8).unique(),
    }),
    defineField({
      name: "impactItems",
      title: "Impact items",
      type: "array",
      description: "Only use claims you can stand behind.",
      of: [
        defineArrayMember({
          type: "object",
          name: "impactItem",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "text",
              title: "Text",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "title", subtitle: "text" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Home Page" }) },
});

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    defineField({
      name: "intro",
      title: "Introduction",
      type: "text",
      rows: 4,
      description: "Also shown on the home page.",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "story", title: "Our story", ...richText }),
    defineField({ name: "mission", title: "Mission", type: "text", rows: 4 }),
    defineField({ name: "vision", title: "Vision", type: "text", rows: 4 }),
    defineField({ name: "commitment", title: "Commitment", type: "text", rows: 4 }),
    defineField({
      name: "processSteps",
      title: "How it is made",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "processStep",
          fields: [
            defineField({
              name: "title",
              title: "Step",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "text",
              title: "Text",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "title", subtitle: "text" } },
        }),
      ],
    }),
    defineField({
      name: "images",
      title: "Photos",
      type: "array",
      description: "The first also appears on the home page. Three or more work best.",
      of: [defineArrayMember({ type: "altImage" })],
      options: { layout: "grid" },
    }),
  ],
  preview: { prepare: () => ({ title: "About Page" }) },
});
