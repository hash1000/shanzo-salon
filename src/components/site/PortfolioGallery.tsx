'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Expand, X } from 'lucide-react';
import type { PortfolioItem } from '@/lib/portfolio';

export default function PortfolioGallery({ items, name }: { items: PortfolioItem[]; name: string }) {
  const [filter, setFilter] = useState('All');
  const [active, setActive] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const photos = items.filter(item => item.kind === 'photo');
  const visible = items.filter(item => filter === 'All' || item.kind === (filter === 'Photos' ? 'photo' : 'video'));
  const move = (offset: number) => setActive(index => (index + offset + photos.length) % photos.length);
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    let previousOverflow = '';
    const lock = () => { previousOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; };
    const restore = () => { document.body.style.overflow = previousOverflow; trigger.current?.focus(); };
    element.addEventListener('close', restore);
    element.addEventListener('portfolio-open', lock);
    return () => { element.removeEventListener('close', restore); element.removeEventListener('portfolio-open', lock); if (element.open) document.body.style.overflow = previousOverflow; };
  }, []);
  return <>
    <div className="gallery-board about-wrap pb-20">
      <div className="gallery-filters" role="group" aria-label={`Filter ${name}'s work`}>
        {['All', 'Photos', 'Videos'].map(option => <button type="button" key={option} aria-pressed={filter === option} onClick={() => setFilter(option)}>{option}</button>)}
        <span className="gallery-count" role="status">{visible.length} {visible.length === 1 ? 'moment' : 'moments'}</span>
      </div>
      {!visible.length && <p className="about-body pb-12">More work is coming soon. Explore the other tabs in the meantime.</p>}
      <div className="site-gallery gallery-pins">
        {visible.map(item => <figure className="gallery-pin" key={item.src}>
          {item.kind === 'video' ? <div className="gallery-video-media"><video src={item.src} autoPlay muted controls playsInline loop preload="metadata" aria-label={item.caption}>Your browser cannot play this video. <a href={item.src}>Download video</a>.</video></div> :
            <button type="button" className="site-gallery-photo" aria-label={`View ${item.caption}`} onClick={event => {
              trigger.current = event.currentTarget; setActive(photos.findIndex(photo => photo.src === item.src)); dialog.current?.showModal(); dialog.current?.dispatchEvent(new Event('portfolio-open'));
            }}><Image src={item.src} alt={`${item.caption} by ${name}`} fill sizes="(max-width:639px) 90vw,(max-width:1023px) 40vw,27vw" className="object-cover" /><span><Expand size={18} aria-hidden="true" /></span></button>}
          <figcaption><span className="gallery-pin-kind">{item.category}</span><h2>{item.caption}</h2>{item.description && <p className="portfolio-card-description line-clamp-2">{item.description}</p>}</figcaption>
        </figure>)}
      </div>
    </div>
    {!!photos.length && <dialog ref={dialog} className="site-lightbox" aria-label={`${name}'s photo viewer`} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }} onKeyDown={event => { if (event.key === 'ArrowLeft') move(-1); if (event.key === 'ArrowRight') move(1); }}>
      <button type="button" className="site-lightbox-close" aria-label="Close photo viewer" onClick={() => dialog.current?.close()}><X /></button>
      <div className="site-lightbox-image"><Image src={photos[active].src} alt={`${photos[active].caption} by ${name}`} fill sizes="90vw" className="object-contain" /></div>
      <div className="site-lightbox-controls"><button type="button" aria-label="Previous photo" onClick={() => move(-1)}><ArrowLeft /></button><p aria-live="polite">{active + 1} / {photos.length} · {photos[active].caption}</p><button type="button" aria-label="Next photo" onClick={() => move(1)}><ArrowRight /></button></div>
    </dialog>}
  </>;
}
