import {
  defineField,
  defineType,
  type ImageRule,
  type PortableTextBlock,
  type SlugRule,
  type StringRule,
} from "sanity";

export function wordCount(blocks: unknown): number {
  if (!Array.isArray(blocks)) return 0;
  return (blocks as PortableTextBlock[])
    .flatMap((block) => (Array.isArray(block.children) ? block.children : []))
    .map((span) => (typeof span.text === "string" ? span.text : ""))
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

const altField = defineField({
  name: "alt",
  title: "Alt text",
  type: "string",
  description: "Describe what the photo shows, for people who cannot see it and for Google.",
});

const requireAlt = (rule: ImageRule) =>
  rule.custom((value) =>
    value?.asset && !(value as { alt?: string }).alt?.trim()
      ? "Alt text is required for this image."
      : true,
  );

/** Every image on the site uses this type or heroSlide, so alt text is required everywhere. */
export const altImage = defineType({
  name: "altImage",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [altField],
  validation: requireAlt,
});

export const heroSlide = defineType({
  name: "heroSlide",
  title: "Hero image",
  type: "image",
  options: { hotspot: true },
  fields: [altField, defineField({ name: "caption", title: "Caption (optional)", type: "string" })],
  validation: requireAlt,
});

export const richText = {
  type: "array" as const,
  of: [
    {
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading", value: "h3" },
      ],
      lists: [
        { title: "Bullets", value: "bullet" },
        { title: "Numbers", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
        ],
        annotations: [],
      },
    },
  ],
};

export function slugField(source: string) {
  return defineField({
    name: "slug",
    title: "Web address",
    type: "slug",
    description: "Press Generate. Changing this later changes the page's web address.",
    options: { source, maxLength: 80 },
    validation: (rule: SlugRule) => rule.required(),
  });
}

export const statusField = defineField({
  name: "status",
  title: "Status",
  type: "string",
  description: "Hidden items stay here in the Studio but disappear from the website.",
  options: {
    list: [
      { title: "Published", value: "published" },
      { title: "Hidden", value: "hidden" },
    ],
    layout: "radio",
    direction: "horizontal",
  },
  initialValue: "published",
  validation: (rule: StringRule) => rule.required(),
});

export const seoFields = [
  defineField({
    name: "seoTitle",
    title: "SEO title (optional)",
    type: "string",
    group: "seo",
    description: "Shown in Google. Leave empty to use the automatic title.",
    validation: (rule) => rule.max(60).warning("Google usually cuts titles off after 60 characters."),
  }),
  defineField({
    name: "seoDescription",
    title: "SEO description (optional)",
    type: "text",
    rows: 3,
    group: "seo",
    description: "Shown under the title in Google. Leave empty to use the automatic description.",
    validation: (rule) =>
      rule.max(155).warning("Google usually cuts descriptions off after 155 characters."),
  }),
];
