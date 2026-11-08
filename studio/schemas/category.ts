import { defineField, defineType } from "sanity";
import { richText, seoFields, slugField, statusField, wordCount } from "./shared";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  orderings: [
    { title: "Display order", name: "sortOrder", by: [{ field: "sortOrder", direction: "asc" }] },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    { ...slugField("title"), group: "content" },
    { ...statusField, group: "content" },
    defineField({
      name: "sortOrder",
      title: "Display order",
      type: "number",
      group: "content",
      description: "Lower numbers appear first.",
      initialValue: 10,
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: "intro",
      title: "Introduction",
      group: "content",
      description: "80 to 150 words, different for every category. Shown at the top of the page.",
      ...richText,
      validation: (rule) =>
        rule
          .custom((value) => {
            const words = wordCount(value);
            if (words < 80) return `This is ${words} words. Aim for at least 80.`;
            if (words > 150) return `This is ${words} words. Aim for 150 or fewer.`;
            return true;
          })
          .warning(),
    }),
    defineField({ name: "image", title: "Image", type: "altImage", group: "content" }),
    ...seoFields,
  ],
  preview: {
    select: { title: "title", status: "status", order: "sortOrder", media: "image" },
    prepare: ({ title, status, order, media }) => ({
      title,
      subtitle: `${status === "hidden" ? "Hidden · " : ""}Order ${order ?? "not set"}`,
      media,
    }),
  },
});
