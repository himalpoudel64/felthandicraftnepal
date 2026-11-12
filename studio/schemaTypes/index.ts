import { aboutPage } from "./aboutPage";
import { category } from "./category";
import { homePage } from "./homePage";
import { legalPage } from "./legalPage";
import { product } from "./product";
import { altImage, heroSlide } from "./shared";
import { siteSettings } from "./siteSettings";

export const schemaTypes = [altImage, heroSlide, category, product, siteSettings, homePage, aboutPage, legalPage];

/** One document each, edited from the sidebar. They cannot be created, duplicated or deleted. */
export const singletonTypes = new Set(["siteSettings", "homePage", "aboutPage", "legalPage"]);

/** Fixed document ids for the legal pages, and the web address of each. */
export const legalPages = {
  privacyPolicy: { title: "Privacy Policy", path: "/privacy-policy/" },
  termsAndConditions: { title: "Terms and Conditions", path: "/terms-and-conditions/" },
} as const;
