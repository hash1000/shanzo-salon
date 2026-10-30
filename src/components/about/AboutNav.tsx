"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { BOOKING_URL, NAV_LINKS } from "@/lib/site";

export default function AboutNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  return (
    <header
      className="about-nav"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          toggle.current?.focus();
        }
      }}
    >
      <div className="about-nav-inner">
        <Link
          href="/"
          className="about-wordmark"
          aria-label="Shanzo Salon home"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/images/logo.png"
            alt="Gold Coast Beauty"
            width={4500}
            height={1425}
            sizes="240px"
            loading="eager"
            className="site-logo"
          />
        </Link>
        <button
          ref={toggle}
          className="about-menu-button"
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="about-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
        <nav
          id="about-navigation"
          aria-label="Main navigation"
          className={`about-navigation ${open ? "is-open" : ""}`}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={link.href === pathname ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a href={BOOKING_URL} className="about-nav-book">
            Book a visit <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </nav>
      </div>
    </header>
  );
}
