"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Expand, Film, X } from "lucide-react";

// Each photo is reserved for this gallery, rather than repeated in page sections.
const photos = [
  {
    src: "/images/salon-interior.webp",
    width: 1448, height: 1086,
    alt: "Warm wood floors, nail colour displays, and pedicure chairs at Shanzo Salon",
  },
  {
    src: "/images/moroccanoil.webp",
    width: 740, height: 740,
    alt: "Moroccanoil hair products displayed in the salon",
  },
  {
    src: "/images/manicure-station.webp",
    width: 740, height: 740,
    alt: "A neatly prepared manicure table and quilted salon chair",
  },
  {
    src: "/images/rainbow-nails.webp",
    width: 652, height: 648,
    alt: "Flowing rainbow nail art with a glossy finish",
  },
  {
    src: "/images/treatment-room.webp",
    width: 740, height: 740,
    alt: "A neatly prepared treatment bed in the private waxing room",
  },
  {
    src: "/images/wash-stations.webp",
    width: 740, height: 740,
    alt: "Comfortable chairs at the hair washing stations",
  },
  {
    src: "/images/bronze-manicure.webp",
    width: 522, height: 660,
    alt: "Nude and bronze glitter manicure",
  },
];
const videos = [
  { src: "/media/5B373F1C-7DB4-49FC-BC2B-4EA1F753CC13.mp4", poster: "/gallery/video-poster-3.jpg", width: 720, height: 1280, title: "A little look around", caption: "Behind the scenes at Shanzo Salon" },
  { src: "/gallery/gallery-video-1.mp4", width: 1280, height: 720, poster: "/gallery/video-poster-1.jpg", title: "Care in the details", caption: "A closer look at waxing preparation" },
  { src: "/gallery/gallery-video-2.mp4", width: 1280, height: 720, poster: "/gallery/video-poster-2.jpg", title: "A moment to unwind", caption: "Personal attention, from heel to toe" },
];
const titles = ["Come on in", "A little hair care", "Your seat is ready", "Colour outside the lines", "Room to relax", "A fresh start", "A touch of shimmer"];
const pins = [0, videos[0], 1, videos[1], 2, 3, 4, videos[2], 5, 6];

export default function Gallery() {
  const [filter, setFilter] = useState("All");
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
      <section className="gallery-board about-wrap pb-20" aria-label="Salon inspiration gallery">
        <div className="gallery-filters" role="group" aria-label="Filter gallery">
          {["All", "Photos", "Videos"].map((option) => (
            <button key={option} type="button" aria-pressed={filter === option} onClick={() => setFilter(option)}>{option}</button>
          ))}
          <span className="gallery-count" role="status">{filter === "Photos" ? photos.length : filter === "Videos" ? videos.length : pins.length} moments at Shanzo</span>
        </div>
        <div className="site-gallery gallery-pins" key={filter}>
          {pins.map((pin) => {
            if (typeof pin !== "number") {
              if (filter === "Photos") return null;
              return (
                <figure className="gallery-pin" key={pin.src}>
                  <div className="gallery-video-media">
                    <video width={pin.width} height={pin.height} autoPlay muted loop playsInline preload="metadata" poster={pin.poster} aria-label={pin.caption}>
                      <source src={pin.src} type="video/mp4" />
                      Your browser does not support video. <a href={pin.src}>Download the video</a>.
                    </video>
                  </div>
                  <figcaption><span className="gallery-pin-kind"><Film size={12} aria-hidden="true" /> Salon moments</span><h2>{pin.title}</h2><p>{pin.caption}</p></figcaption>
                </figure>
              );
            }
            if (filter === "Videos") return null;
            const photo = photos[pin];
            return (
              <figure className="gallery-pin" key={photo.src}>
                <button
                  type="button"
                  className="site-gallery-photo"
                  style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
                  aria-label={`View photo: ${photo.alt}`}
                  onClick={(event) => {
                    trigger.current = event.currentTarget;
                    setActive(pin);
                    dialog.current?.showModal();
                    document.body.style.overflow = "hidden";
                    close.current?.focus();
                  }}
                >
                  <Image src={photo.src} loading={pin < 2 ? "eager" : "lazy"} alt={photo.alt} fill sizes="(max-width:639px) 90vw,(max-width:1023px) 40vw,27vw" className="object-cover" />
                  <span><Expand size={18} aria-hidden="true" /></span>
                </button>
                <figcaption><span className="gallery-pin-kind">{pin === 3 || pin === 6 ? "Nail inspiration" : "Life at the salon"}</span><h2>{titles[pin]}</h2></figcaption>
              </figure>
            );
          })}
        </div>
      </section>
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
