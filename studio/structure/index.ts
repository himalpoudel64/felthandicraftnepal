import type { StructureBuilder, StructureResolver } from "sanity/structure";
import { legalPages } from "../schemaTypes";

const singleton = (S: StructureBuilder, type: string, title: string, id = type) =>
  S.listItem()
    .id(id)
    .title(title)
    .child(S.document().schemaType(type).documentId(id).title(title));

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Website")
    .items([
      S.listItem()
        .id("products")
        .title("Products by category")
        .child(
          S.documentTypeList("category")
            .title("Pick a category")
            .defaultOrdering([{ field: "sortOrder", direction: "asc" }])
            .child((categoryId) =>
              S.documentTypeList("product")
                .title("Products")
                .filter('_type == "product" && (category._ref == $categoryId || $categoryId in additionalCategories[]._ref)')
                .params({ categoryId })
                .defaultOrdering([{ field: "sortOrder", direction: "asc" }])
                .initialValueTemplates([
                  S.initialValueTemplateItem("product-in-category", { categoryId }),
                ]),
            ),
        ),
      S.documentTypeListItem("product")
        .title("All products")
        .child(
          S.documentTypeList("product")
            .title("All products")
            .defaultOrdering([{ field: "name", direction: "asc" }]),
        ),
      S.listItem()
        .id("hidden-products")
        .title("Hidden products")
        .child(
          S.documentTypeList("product")
            .title("Hidden products")
            .filter('_type == "product" && status == "hidden"'),
        ),
      S.documentTypeListItem("category")
        .title("Categories")
        .child(
          S.documentTypeList("category")
            .title("Categories")
            .defaultOrdering([{ field: "sortOrder", direction: "asc" }]),
        ),
      S.divider(),
      singleton(S, "homePage", "Home Page"),
      singleton(S, "aboutPage", "About Page"),
      singleton(S, "siteSettings", "Site Settings"),
      S.divider(),
      ...Object.entries(legalPages).map(([id, page]) => singleton(S, "legalPage", page.title, id)),
    ]);
