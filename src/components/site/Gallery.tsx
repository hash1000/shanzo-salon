"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";

// Each photo is reserved for this gallery, rather than repeated in page sections.
const photos = [
  {
    src: "/images/salon-interior.webp",
    alt: "Warm wood floors, nail colour displays, and pedicure chairs at Shanzo Salon",
  },
  {
    src: "/images/moroccanoil.webp",
    alt: "Moroccanoil hair products displayed in the salon",
  },
  {
    src: "/images/manicure-station.webp",
    alt: "A neatly prepared manicure table and quilted salon chair",
  },
  {
    src: "/images/rainbow-nails.webp",
    alt: "Flowing rainbow nail art with a glossy finish",
  },
  {
    src: "/images/treatment-room.webp",
    alt: "A neatly prepared treatment bed in the private waxing room",
  },
  {
    src: "/images/wash-stations.webp",
    alt: "Comfortable chairs at the hair washing stations",
  },
  {
    src: "/images/bronze-manicure.webp",
    alt: "Nude and bronze glitter manicure",
  },
];
export default function Gallery() {
  const [active, setActive] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const restore = () => {
      document.body.style.overflow = "";
      trigger.current?.focus();
    };
    element.addEventListener("close", restore);
    return () => {
      element.removeEventListener("close", restore);
      document.body.style.overflow = "";
    };
  }, []);
  function move(offset: number) {
    setActive((index) => (index + offset + photos.length) % photos.length);
  }
  return (
    <>
      <div className="site-gallery about-wrap pb-20">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            className="site-gallery-photo"
            aria-label={`View photo: ${photo.alt}`}
            onClick={(event) => {
              trigger.current = event.currentTarget;
              setActive(i);
              dialog.current?.showModal();
              document.body.style.overflow = "hidden";
              close.current?.focus();
            }}
          >
            <Image
              src={photo.src}
              loading={i < 2 ? "eager" : "lazy"}
              alt={photo.alt}
              fill
              sizes="(max-width:639px) 90vw,(max-width:1023px) 45vw,33vw"
              className="object-cover"
            />
            <span>
              <Expand size={18} aria-hidden="true" />
            </span>
          </button>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="site-lightbox"
        aria-label="Salon photo viewer"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") move(-1);
          if (event.key === "ArrowRight") move(1);
          if (event.key === "Tab") {
            const buttons = Array.from(
              event.currentTarget.querySelectorAll("button"),
            );
            const first = buttons[0],
              last = buttons[buttons.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first.focus();
            }
          }
        }}
      >
        <button
          ref={close}
          type="button"
          className="site-lightbox-close"
          aria-label="Close photo viewer"
          onClick={() => dialog.current?.close()}
        >
          <X />
        </button>
        <div className="site-lightbox-image">
          <Image
            src={photos[active].src}
            alt={photos[active].alt}
            fill
            sizes="90vw"
            className="object-contain"
          />
        </div>
        <div className="site-lightbox-controls">
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => move(-1)}
          >
            <ArrowLeft />
          </button>
          <p aria-live="polite">
            {active + 1} / {photos.length} · {photos[active].alt}
          </p>
          <button type="button" aria-label="Next photo" onClick={() => move(1)}>
            <ArrowRight />
          </button>
        </div>
      </dialog>
    </>
  );
}
