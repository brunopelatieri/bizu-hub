import { ImageOff } from "lucide-react";
import { useMemo, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import type { PostImage } from "@/db/schema";
import { cn } from "@/lib/utils";
import "yet-another-react-lightbox/styles.css";

type PostGalleryLightboxProps = {
  images: PostImage[];
};

type GalleryThumbnailProps = {
  image: PostImage;
  index: number;
  onOpen: (index: number) => void;
};

function GalleryThumbnail({ image, index, onOpen }: GalleryThumbnailProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      className="group relative min-h-11 min-w-11 overflow-hidden rounded-lg border border-border/60 bg-slate-900/40 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/60"
      aria-label={hasError ? "Imagem indisponível" : `Abrir imagem: ${image.alt}`}
    >
      {hasError ? (
        <span className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-2 px-3 text-center text-slate-400">
          <ImageOff className="h-6 w-6 shrink-0 opacity-60" aria-hidden />
          <span className="text-xs leading-snug">Imagem indisponível</span>
        </span>
      ) : (
        <img
          src={image.url}
          alt={image.alt}
          loading="lazy"
          onError={() => setHasError(true)}
          className="aspect-[4/5] w-full object-cover transition duration-200 group-hover:scale-[1.02] group-focus-visible:scale-[1.02]"
        />
      )}
    </button>
  );
}

function LightboxSlideImage({
  slide,
}: {
  slide: { src: string; alt?: string };
}) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex max-h-[85dvh] max-w-[100vw] flex-col items-center justify-center gap-3 px-6 py-12 text-slate-400">
        <ImageOff className="h-10 w-10 opacity-60" aria-hidden />
        <p className="text-sm">Imagem indisponível</p>
        {slide.alt ? (
          <p className="max-w-sm text-center text-xs text-slate-500">{slide.alt}</p>
        ) : null}
      </div>
    );
  }

  return (
    <img
      src={slide.src}
      alt={slide.alt ?? ""}
      onError={() => setHasError(true)}
      className="yarl-post-gallery-slide-image max-h-[85dvh] max-w-[100vw] object-contain"
      draggable={false}
    />
  );
}

export function PostGalleryLightbox({ images }: PostGalleryLightboxProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const sortedImages = useMemo(
    () => [...images].sort((a, b) => a.position - b.position),
    [images],
  );

  const slides = useMemo(
    () =>
      sortedImages.map((image) => ({
        src: image.url,
        alt: image.alt,
      })),
    [sortedImages],
  );

  if (sortedImages.length === 0) return null;

  function openAt(nextIndex: number) {
    setIndex(nextIndex);
    setOpen(true);
  }

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-lg font-semibold text-foreground">Galeria</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {sortedImages.map((image, imageIndex) => (
          <GalleryThumbnail
            key={image.id}
            image={image}
            index={imageIndex}
            onOpen={openAt}
          />
        ))}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        on={{
          view: ({ index: nextIndex }) => setIndex(nextIndex),
        }}
        carousel={{ finite: sortedImages.length <= 1 }}
        controller={{ closeOnBackdropClick: true }}
        render={{
          slide: ({ slide }) => <LightboxSlideImage slide={slide} />,
        }}
        className={cn("post-gallery-lightbox")}
        styles={{
          root: {
            "--yarl__color_backdrop": "rgba(2, 6, 23, 0.94)",
          },
          container: {
            backgroundColor: "rgba(2, 6, 23, 0.94)",
          },
          button: {
            filter: "none",
            background: "transparent",
          },
          navigationPrev: {
            background: "transparent",
          },
          navigationNext: {
            background: "transparent",
          },
        }}
      />
    </section>
  );
}
