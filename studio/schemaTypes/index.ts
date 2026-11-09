import { aboutPage } from "./aboutPage";
import { category } from "./category";
import { homePage } from "./homePage";
import { product } from "./product";
import { altImage, heroSlide } from "./shared";
import { siteSettings } from "./siteSettings";

export const schemaTypes = [altImage, heroSlide, category, product, siteSettings, homePage, aboutPage];

export const singletonTypes = new Set(["siteSettings", "homePage", "aboutPage"]);
