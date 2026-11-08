import type { StructureBuilder, StructureResolver } from "sanity/structure";

const singleton = (S: StructureBuilder, type: string, title: string) =>
  S.listItem()
    .id(type)
    .title(title)
    .child(S.document().schemaType(type).documentId(type).title(title));

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      singleton(S, "siteSettings", "Site Settings"),
      singleton(S, "homePage", "Home Page"),
      singleton(S, "aboutPage", "About Page"),
      S.divider(),
      S.documentTypeListItem("category")
        .title("Categories")
        .child(
          S.documentTypeList("category")
            .title("Categories")
            .defaultOrdering([{ field: "sortOrder", direction: "asc" }]),
        ),
      S.listItem()
        .id("products")
        .title("Products")
        .child(
          S.documentTypeList("category")
            .title("Products by category")
            .defaultOrdering([{ field: "sortOrder", direction: "asc" }])
            .child((categoryId) =>
              S.documentTypeList("product")
                .title("Products")
                .filter('_type == "product" && category._ref == $categoryId')
                .params({ categoryId })
                .defaultOrdering([{ field: "sortOrder", direction: "asc" }])
                .initialValueTemplates([
                  S.initialValueTemplateItem("product-in-category", { categoryId }),
                ]),
            ),
        ),
    ]);
