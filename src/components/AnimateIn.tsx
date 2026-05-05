/**
 * AnimateIn — reusable scroll-triggered reveal wrapper.
 * Uses Framer Motion with spring physics.
 * Taste skill: MOTION_INTENSITY 6 — fluid CSS spring, no gimmicks.
 */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

interface AnimateInProps {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
}

const getInitial = (direction: Direction) => {
  switch (direction) {
    case "up":    return { opacity: 0, y: 40 };
    case "down":  return { opacity: 0, y: -40 };
    case "left":  return { opacity: 0, x: 50 };
    case "right": return { opacity: 0, x: -50 };
    case "none":  return { opacity: 0 };
  }
};

const getAnimate = (direction: Direction) => {
  switch (direction) {
    case "up":
    case "down":  return { opacity: 1, y: 0 };
    case "left":
    case "right": return { opacity: 1, x: 0 };
    case "none":  return { opacity: 1 };
  }
};

export default function AnimateIn({
  children,
  className,
  direction = "up",
  delay = 0,
  once = true,
  threshold = 0.15,
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount: threshold });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={getInitial(direction)}
      animate={inView ? getAnimate(direction) : getInitial(direction)}
      transition={{
        type: "spring",
        stiffness: 60,
        damping: 20,
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
