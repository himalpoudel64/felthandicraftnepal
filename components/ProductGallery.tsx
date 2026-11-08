import type { ImageData } from "@/lib/types";
import { SanityImage } from "./SanityImage";

/** Swipeable strip on phones, editorial stack on desktop. CSS only. */
export function ProductGallery({ images, name }: { images: ImageData[] | undefined; name: string }) {
  const photos = images?.length ? images : [undefined];
  const scrolls = photos.length > 1;
  return (
    <div
      {...(scrolls ? { role: "group", tabIndex: 0, "aria-label": `Photographs of ${name}` } : {})}
      className="-mx-(--gutter) flex snap-x snap-mandatory gap-3 overflow-x-auto px-(--gutter) lg:mx-0 lg:grid lg:grid-cols-2 lg:gap-6 lg:overflow-visible lg:px-0"
    >
      {photos.map((image, i) => (
        <div
          key={i}
          className={`shrink-0 snap-center ${scrolls ? "w-[84vw]" : "w-full"} lg:w-auto ${i === 0 ? "lg:col-span-2" : ""}`}
        >
          <SanityImage
            image={image}
            priority={i === 0}
            aspect={4 / 5}
            tone={i}
            sizes={i === 0 ? "(min-width: 1024px) 55vw, 84vw" : "(min-width: 1024px) 27vw, 84vw"}
          />
        </div>
      ))}
    </div>
  );
}
