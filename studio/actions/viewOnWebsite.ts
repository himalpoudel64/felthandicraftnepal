import { useCallback, useEffect, useState } from "react";
import { useClient, type DocumentActionComponent, type DocumentActionProps } from "sanity";

const SITE = process.env.SANITY_STUDIO_SITE_URL ?? "https://felthandicraftnepal.com";

type Published = {
  _type?: string;
  slug?: { current?: string };
  status?: string;
  category?: { _ref?: string };
};

/** Opens the published page. The site is static, so only published content has a page. */
export const viewOnWebsite: DocumentActionComponent = ({ published, type }: DocumentActionProps) => {
  const client = useClient({ apiVersion: "2025-02-19" });
  const doc = published as Published | null;
  const [categorySlug, setCategorySlug] = useState<string>();
  const categoryRef = doc?.category?._ref;

  useEffect(() => {
    if (!categoryRef) return;
    let active = true;
    void client
      .fetch<string | null>("*[_id == $id][0].slug.current", { id: categoryRef })
      .then((slug) => {
        if (active && slug) setCategorySlug(slug);
      });
    return () => {
      active = false;
    };
  }, [categoryRef, client]);

  const slug = doc?.slug?.current;
  const path =
    type === "category" && slug
      ? `/products/${slug}/`
      : type === "product" && slug && categorySlug
        ? `/products/${categorySlug}/${slug}/`
        : type === "homePage"
          ? "/"
          : type === "aboutPage"
            ? "/about/"
            : undefined;

  const open = useCallback(() => {
    if (path) window.open(`${SITE}${path}`, "_blank", "noopener");
  }, [path]);

  if (!path || (doc?.status && doc.status !== "published")) return null;
  return { label: "View on website", onHandle: open };
};
