import { defineArrayMember, defineField, defineType } from "sanity";
import { richText, seoFields, slugField, statusField, wordCount } from "./shared";

const MIN_DESCRIPTION_WORDS = 40;

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  groups: [
    { name: "content", title: "Details", default: true },
    { name: "photos", title: "Photos" },
    { name: "sizes", title: "Sizes" },
    { name: "display", title: "Where it appears" },
    { name: "seo", title: "Google and sharing" },
  ],
  orderings: [
    { title: "Display order", name: "sortOrder", by: [{ field: "sortOrder", direction: "asc" }] },
    { title: "Name", name: "name", by: [{ field: "name", direction: "asc" }] },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Product name",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    { ...slugField("name"), group: "content" },
    defineField({
      name: "category",
      title: "Main category",
      type: "reference",
      group: "content",
      description: "Decides the product's web address.",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "additionalCategories",
      title: "Also show in these categories (optional)",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "reference", to: [{ type: "category" }] })],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: "shortDescription",
      title: "Short description",
      type: "text",
      rows: 2,
      group: "content",
      description: "One sentence, shown on product cards.",
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: "description",
      title: "Full description",
      group: "content",
      description: "What it is, how it is made and who it suits.",
      ...richText,
      validation: (rule) =>
        rule
          .custom((value) => {
            const words = wordCount(value);
            return words >= MIN_DESCRIPTION_WORDS
              ? true
              : `This is ${words} words. Very short pages rarely appear in Google. Aim for ${MIN_DESCRIPTION_WORDS} or more.`;
          })
          .warning(),
    }),
    defineField({
      name: "tags",
      title: "Tags (optional)",
      type: "array",
      group: "content",
      description: "Short words visitors can filter by, such as Christmas or Felt balls. Press Enter after each one.",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "specifications",
      title: "Specifications (optional)",
      type: "array",
      group: "content",
      description: "For example, Material: wool felt.",
      of: [
        defineArrayMember({
          type: "object",
          name: "specification",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        }),
      ],
    }),
    defineField({
      name: "images",
      title: "Product photos",
      type: "array",
      group: "photos",
      description: "The first photo is the main one. Drag to reorder.",
      of: [defineArrayMember({ type: "altImage" })],
      options: { layout: "grid" },
      validation: (rule) => rule.required().min(1).error("Please add at least one photo."),
    }),
    defineField({
      name: "sizes",
      title: "Sizes (optional)",
      type: "array",
      group: "sizes",
      description:
        "Visitors pick one when they enquire. The first is selected when the page opens. Prices are never shown on the website: they are agreed after contact.",
      of: [
        defineArrayMember({
          type: "object",
          name: "size",
          fields: [
            defineField({
              name: "label",
              title: "Size",
              type: "string",
              description: "For example, Small.",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "label" } },
        }),
      ],
    }),
    { ...statusField, group: "display" },
    defineField({
      name: "featured",
      title: "Featured on the home page",
      type: "boolean",
      group: "display",
      description: "Used unless the Home Page has its own list of featured products.",
      initialValue: false,
    }),
    defineField({
      name: "sortOrder",
      title: "Display order",
      type: "number",
      group: "display",
      description: "Lower numbers appear first. Empty ones appear last, by name.",
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: "relatedProducts",
      title: "Related products (optional)",
      type: "array",
      group: "display",
      description: "Up to 4. If empty, other products from the same category are shown.",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "product" }],
          options: {
            filter: ({ document }) => ({
              filter: 'status == "published" && !(_id in [$id, "drafts." + $id])',
              params: { id: document._id.replace(/^drafts\./, "") },
            }),
          },
        }),
      ],
      validation: (rule) => rule.max(4).unique(),
    }),
    ...seoFields,
  ],
  preview: {
    select: {
      title: "name",
      status: "status",
      category: "category.title",
      media: "images.0",
    },
    prepare: ({ title, status, category, media }) => ({
      title,
      subtitle: [status === "hidden" ? "Hidden" : null, category]
        .filter(Boolean)
        .join(" · "),
      media,
    }),
  },
});
