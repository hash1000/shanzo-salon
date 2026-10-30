"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Progressive enhancement: content stays visible without JavaScript or motion. */
export default function SiteMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || !("IntersectionObserver" in window)) return;

    const animations = new Set<Animation>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        observer.unobserve(target);
        if (preference.matches) return;
        const animation = target.animate(
          [{ opacity: 0.35, translate: "0 14px" }, { opacity: 1, translate: "0 0" }],
          { duration: 550, easing: "cubic-bezier(.22, 1, .36, 1)" },
        );
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      });
    }, { threshold: 0.08 });

    document.querySelectorAll(
      ".about-luxury .team-member, .about-luxury .gallery-pin, .about-luxury .site-page-heading, .about-luxury .contact-details, .about-luxury .about-reason",
    ).forEach((element) => observer.observe(element));

    const stop = () => {
      if (!preference.matches) return;
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      animations.clear();
    };
    preference.addEventListener("change", stop);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      preference.removeEventListener("change", stop);
    };
  }, [pathname]);

  return null;
}
