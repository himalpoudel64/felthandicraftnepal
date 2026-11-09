import { defineArrayMember, defineField, defineType } from "sanity";
import { richText } from "./shared";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  groups: [
    { name: "story", title: "Story", default: true },
    { name: "purpose", title: "Mission and impact" },
    { name: "process", title: "How it is made" },
    { name: "photos", title: "Photos" },
  ],
  fields: [
    defineField({
      name: "heading",
      title: "Page heading",
      type: "string",
      group: "story",
      initialValue: "Made by women who know their craft",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Introduction",
      type: "text",
      rows: 4,
      group: "story",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "story", title: "Business story", group: "story", ...richText }),
    defineField({ name: "mission", title: "Mission", type: "text", rows: 4, group: "purpose" }),
    defineField({ name: "vision", title: "Vision", type: "text", rows: 4, group: "purpose" }),
    defineField({
      name: "socialImpact",
      title: "Social impact",
      type: "text",
      rows: 5,
      group: "purpose",
      description: "How the work supports women. Only include what you can stand behind.",
    }),
    defineField({
      name: "processSteps",
      title: "Production steps",
      type: "array",
      group: "process",
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
      title: "Supporting photos",
      type: "array",
      group: "photos",
      description: "Three or more work best. The first is the largest.",
      of: [defineArrayMember({ type: "altImage" })],
      options: { layout: "grid" },
    }),
  ],
  preview: { prepare: () => ({ title: "About Page" }) },
});
