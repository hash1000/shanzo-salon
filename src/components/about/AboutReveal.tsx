"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

export default function AboutReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (ref.current && ref.current.getBoundingClientRect().top > window.innerHeight) setReady(true);
  }, []);

  return (
    <motion.div ref={ref} className={className} initial={false}
      animate={ready && !reduceMotion ? { opacity: 0, y: 24 } : { opacity: 1, y: 0 }}
      whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduceMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}
