import { imageProps } from "@/lib/image-loader";
import type { ImageData } from "@/lib/types";

const TONES = ["bg-burgundy", "bg-forest", "bg-terracotta", "bg-mustard", "bg-sand"];

export function Placeholder({
  aspect,
  tone = 0,
  className = "",
  labelClassName = "top-2",
}: {
  aspect?: number;
  tone?: number;
  className?: string;
  labelClassName?: string;
}) {
  return (
    <div className={`relative ${TONES[tone % TONES.length]} ${className}`} style={aspect ? { aspectRatio: aspect } : undefined}>
      <span className={`absolute left-2 bg-ivory px-1.5 text-xs leading-5 text-ink ${labelClassName}`}>Placeholder</span>
    </div>
  );
}

export function SanityImage({
  image,
  sizes,
  aspect,
  priority = false,
  tone,
  className = "",
}: {
  image: ImageData | undefined;
  sizes: string;
  aspect?: number;
  priority?: boolean;
  tone?: number;
  className?: string;
}) {
  const props = imageProps(image, { sizes, aspect });
  if (!props) return <Placeholder aspect={aspect ?? 4 / 3} tone={tone} className={className} />;
  return (
    <img
      {...props}
      alt={props.alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      style={aspect ? { aspectRatio: aspect } : undefined}
      className={`block h-auto w-full bg-sand object-cover ${className}`}
    />
  );
}
