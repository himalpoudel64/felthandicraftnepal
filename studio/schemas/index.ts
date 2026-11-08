import { category } from "./category";
import { product } from "./product";
import { altImage, heroSlide } from "./shared";
import { aboutPage, homePage, siteSettings } from "./singletons";

export const schemaTypes = [altImage, heroSlide, category, product, siteSettings, homePage, aboutPage];
export const singletonTypes = new Set(["siteSettings", "homePage", "aboutPage"]);
