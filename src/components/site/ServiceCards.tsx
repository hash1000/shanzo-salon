"use client";

import Image from "next/image";
import { useRef, useState, useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Brush, Eye, Flower2, Leaf, Scissors, Sparkles } from "lucide-react";
import { services } from "@/data/services";
import { BOOKING_URL } from "@/lib/site";
import "./service-panels.css";

const icons = [Scissors, Sparkles, Leaf, Eye, Brush, Flower2, Sparkles];
const desktopQuery = "(min-width: 1024px)";
function subscribe(callback: () => void) {
  const media = window.matchMedia(desktopQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
const getDesktop = () => window.matchMedia(desktopQuery).matches;
const getServerDesktop = () => false;

export default function ServiceCards() {
  const desktop = useSyncExternalStore(subscribe, getDesktop, getServerDesktop);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [slide, setSlide] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ start: number; scroll: number; moved: boolean } | null>(null);
  const transition = reduced ? { duration: 0 } : { type: "spring" as const, stiffness: 160, damping: 26 };
  function updateSlide() {
    const element = track.current;
    if (!element || desktop) return;
    const panels = Array.from(element.children) as HTMLElement[];
    const position = element.scrollLeft;
    const origin = panels[0]?.offsetLeft ?? 0;
    let nearest = 0;
    panels.forEach((panel, index) => {
      if (Math.abs(panel.offsetLeft - origin - position) < Math.abs(panels[nearest].offsetLeft - origin - position)) nearest = index;
    });
    setSlide(nearest);
  }
  function scrollTo(index: number) {
    const element = track.current;
    if (!element) return;
    const target = Math.max(0, Math.min(services.length - 1, index));
    const first = element.children[0] as HTMLElement;
    const panel = element.children[target] as HTMLElement;
    element.scrollTo({ left: panel.offsetLeft - first.offsetLeft, behavior: reduced ? "instant" : "smooth" });
  }
  return <div className="service-experience">
    <div className="service-panel-track" ref={track} role="region" aria-label="Explore our services" onScroll={updateSlide}
      onPointerDown={event => {
        if (desktop || event.pointerType !== "mouse" || (event.target as HTMLElement).closest("a, button")) return;
        event.currentTarget.dataset.dragging = "true";
        drag.current = { start: event.clientX, scroll: event.currentTarget.scrollLeft, moved: false };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={event => {
        if (!drag.current) return;
        const distance = event.clientX - drag.current.start;
        if (Math.abs(distance) > 5) drag.current.moved = true;
        event.currentTarget.scrollLeft = drag.current.scroll - distance;
      }}
      onPointerUp={event => { drag.current = null; delete event.currentTarget.dataset.dragging; }} onPointerCancel={event => { drag.current = null; delete event.currentTarget.dataset.dragging; }}>
      {services.map((service, index) => {
        const expanded = !desktop || active === index;
        const Icon = icons[index];
        return <motion.article key={service.id} className={`service-panel${active === index ? " is-active" : ""}`}
          layout={desktop && !reduced} initial={false} animate={desktop ? { flexGrow: active === index ? 4 : 1 } : { flexGrow: 0 }} transition={transition}
          onMouseEnter={() => { if (desktop) setActive(index); }} onFocusCapture={() => { if (desktop) setActive(index); }}>
          <div className="service-panel-visual">
            {service.image ? <Image src={service.image} alt={`${service.title} care at Gold Coast Beauty`} fill sizes="(min-width:1024px) 42vw, (min-width:640px) 45vw, 80vw" loading={index === 0 ? undefined : "lazy"} preload={index === 0} draggable={false} /> : <div className="service-panel-fallback"><Icon size={140} strokeWidth={.75} aria-hidden="true" /></div>}
          </div>
          <div className="service-panel-shade" />
          <button type="button" className="service-panel-select" aria-label={`Explore ${service.title}`} aria-expanded={expanded} onClick={() => { if (desktop) setActive(index); }} tabIndex={desktop ? 0 : -1} />
          <span className="service-panel-number" aria-hidden="true">{service.id}</span>
          <span className="service-panel-vertical" aria-hidden="true">{service.title}</span>
          <motion.div className="service-panel-content" inert={!expanded} initial={false} animate={expanded ? "open" : "closed"}
            variants={{ open: { opacity: 1, transition: { staggerChildren: reduced ? 0 : .065, delayChildren: reduced ? 0 : .12 } }, closed: { opacity: 0, transition: { duration: reduced ? 0 : .1 } } }}>
            {[<h3 key="title">{service.title}</h3>, <p key="description" className="service-panel-description">{service.description}</p>, <p key="tagline" className="service-panel-tagline">{service.tagline}</p>, <a key="booking" href={service.url} target="_blank" rel="noopener noreferrer" className="service-panel-book" aria-label={`Book ${service.title.toLowerCase()} services`}>Book now <ArrowUpRight size={18} aria-hidden="true" /></a>].map(child =>
              <motion.div key={child.key} variants={{ open: { opacity: 1, y: 0, transition: { duration: reduced ? 0 : .25 } }, closed: { opacity: 0, y: reduced ? 0 : 12 } }}>{child}</motion.div>
            )}
          </motion.div>
        </motion.article>;
      })}
    </div>
    <div className="service-slider-controls">
      <div className="service-slider-progress" role="progressbar" aria-label="Service gallery position" aria-valuemin={1} aria-valuemax={services.length} aria-valuenow={slide + 1}><span style={{ width: `${((slide + 1) / services.length) * 100}%` }} /></div>
      <span className="service-slider-count" aria-live="polite">{String(slide + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}</span>
      <button type="button" aria-label="Previous service" disabled={slide === 0} onClick={() => scrollTo(slide - 1)}><ArrowLeft size={19} /></button>
      <button type="button" aria-label="Next service" disabled={slide === services.length - 1} onClick={() => scrollTo(slide + 1)}><ArrowRight size={19} /></button>
    </div>
    <div className="service-browse"><a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="member-button member-button-outline">Not sure? Browse all services <ArrowUpRight size={18} aria-hidden="true" /></a></div>
  </div>;
}
