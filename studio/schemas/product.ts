import { defineArrayMember, defineField, defineType } from "sanity";
import { richText, seoFields, slugField, statusField, wordCount } from "./shared";

const MIN_DESCRIPTION_WORDS = 40;

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  orderings: [
    { title: "Display order", name: "sortOrder", by: [{ field: "sortOrder", direction: "asc" }] },
    { title: "Name", name: "name", by: [{ field: "name", direction: "asc" }] },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    { ...slugField("name"), group: "content" },
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      group: "content",
      to: [{ type: "category" }],
      validation: (rule) => rule.required(),
    }),
    { ...statusField, group: "content" },
    defineField({
      name: "sortOrder",
      title: "Display order (optional)",
      type: "number",
      group: "content",
      description: "Lower numbers appear first in the category. Empty ones appear last, by name.",
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: "images",
      title: "Photos",
      type: "array",
      group: "content",
      description: "The first photo is the main one. Drag to reorder.",
      of: [defineArrayMember({ type: "altImage" })],
      options: { layout: "grid" },
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "shortDescription",
      title: "Short description",
      type: "text",
      rows: 2,
      group: "content",
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: "description",
      title: "Full description",
      group: "content",
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
      name: "specifications",
      title: "Specifications",
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
      name: "sizes",
      title: "Sizes and prices",
      type: "array",
      group: "content",
      description: "At least one. The first size is selected when the page opens.",
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
            defineField({
              name: "price",
              title: "Price (NPR)",
              type: "number",
              validation: (rule) => rule.required().integer().positive(),
            }),
          ],
          preview: {
            select: { title: "label", price: "price" },
            prepare: ({ title, price }) => ({ title, subtitle: `NPR ${price ?? "not set"}` }),
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      group: "content",
      description: "Show on the home page, unless the Home Page has its own list of featured products.",
      initialValue: false,
    }),
    ...seoFields,
  ],
  preview: {
    select: { title: "name", status: "status", price: "sizes.0.price", media: "images.0" },
    prepare: ({ title, status, price, media }) => ({
      title,
      subtitle: `${status === "hidden" ? "Hidden · " : ""}${price ? `From NPR ${price}` : "No price yet"}`,
      media,
    }),
  },
});
