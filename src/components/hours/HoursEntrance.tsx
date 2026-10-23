"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export default function HoursEntrance({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.div initial={false} animate={{ y: reduced ? [0, 0] : [6, 0] }}
      transition={{ duration: reduced ? 0 : 0.2 }}>
      {children}
    </motion.div>
  );
}
