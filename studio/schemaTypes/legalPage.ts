import { defineField, defineType } from "sanity";
import { richText } from "./shared";

/** Used by two fixed documents: privacyPolicy and termsAndConditions. */
export const legalPage = defineType({
  name: "legalPage",
  title: "Legal page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "lastUpdated",
      title: "Last updated",
      type: "date",
      description: "Change this whenever you change the text.",
      options: { dateFormat: "D MMMM YYYY" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Text",
      description: "Use Heading for each section. Please have important changes checked by someone qualified.",
      ...richText,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description (optional)",
      type: "text",
      rows: 2,
      validation: (rule) =>
        rule.max(155).warning("Google usually cuts descriptions off after 155 characters."),
    }),
  ],
  preview: {
    select: { title: "title", date: "lastUpdated" },
    prepare: ({ title, date }) => ({ title, subtitle: date ? `Last updated ${date}` : undefined }),
  },
});
