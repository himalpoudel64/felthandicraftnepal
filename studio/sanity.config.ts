import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes, singletonTypes } from "./schemas";
import { structure } from "./structure";

export default defineConfig({
  name: "default",
  title: "Bishnu Laxmi Felt Handicraft",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? "",
  dataset: process.env.SANITY_STUDIO_DATASET ?? "production",
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
    templates: (previous) => [
      ...previous.filter((template) => !singletonTypes.has(template.schemaType)),
      {
        id: "product-in-category",
        title: "Product in this category",
        schemaType: "product",
        parameters: [{ name: "categoryId", type: "string" }],
        value: ({ categoryId }: { categoryId: string }) => ({
          category: { _type: "reference", _ref: categoryId },
          status: "published",
          featured: false,
        }),
      },
    ],
  },
  document: {
    // Singletons can be edited and published, but never duplicated or deleted.
    actions: (previous, { schemaType }) =>
      singletonTypes.has(schemaType)
        ? previous.filter(({ action }) => action === "publish" || action === "discardChanges" || action === "restore")
        : previous,
  },
});
