import { motion, Variants, useReducedMotion } from "framer-motion";
import { ReactNode, useRef } from "react";
import { useInView } from "framer-motion";

// Premium easing curve
const premiumEase = [0.22, 1, 0.36, 1] as const;

interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  as?: keyof JSX.IntrinsicElements;
}

// Detect if mobile for optimized animations
const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

// Base animation values
const mobileConfig = {
  duration: 0.5,
  translateY: 16,
};

const desktopConfig = {
  duration: 0.7,
  translateY: 24,
};

const config = isMobile ? mobileConfig : desktopConfig;

// Animation variants
const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: config.translateY,
  },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: config.duration,
      delay,
      ease: premiumEase,
    },
  }),
};

const fadeScaleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.97,
  },
  visible: (delay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: config.duration,
      delay,
      ease: premiumEase,
    },
  }),
};

const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Fade Up Animation Component
export const FadeUp = ({
  children,
  className = "",
  delay = 0,
  duration,
}: ScrollAnimationProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={delay}
      variants={{
        hidden: { opacity: 0, y: config.translateY },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: duration || config.duration,
            delay,
            ease: premiumEase,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Fade Scale Animation for Images
export const FadeScale = ({
  children,
  className = "",
  delay = 0,
  duration,
}: ScrollAnimationProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={delay}
      variants={{
        hidden: { opacity: 0, scale: 0.97 },
        visible: {
          opacity: 1,
          scale: 1,
          transition: {
            duration: duration || config.duration,
            delay,
            ease: premiumEase,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Section Animation Wrapper
export const AnimatedSection = ({
  children,
  className = "",
  delay = 0,
}: ScrollAnimationProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <section className={className}>{children}</section>;
  }

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={delay}
      variants={fadeUpVariants}
      className={className}
    >
      {children}
    </motion.section>
  );
};

// Staggered Children Container
interface StaggerContainerProps extends ScrollAnimationProps {
  staggerDelay?: number;
}

export const StaggerContainer = ({
  children,
  className = "",
  staggerDelay = 0.08,
}: StaggerContainerProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Stagger Item (child of StaggerContainer)
export const StaggerItem = ({
  children,
  className = "",
}: Omit<ScrollAnimationProps, "delay">) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: config.translateY },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: config.duration,
            ease: premiumEase,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Hero Animation with staggered content
interface HeroAnimationProps {
  children: ReactNode;
  className?: string;
}

export const HeroAnimation = ({ children, className = "" }: HeroAnimationProps) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: isMobile ? 0.5 : 0.7,
        ease: premiumEase,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Staggered Hero Content
export const HeroContent = ({ children, className = "" }: HeroAnimationProps) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Hero Item for staggered hero content
export const HeroItem = ({
  children,
  className = "",
  scale = false,
}: HeroAnimationProps & { scale?: boolean }) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
          y: 24,
          ...(scale && { scale: 0.96 }),
        },
        visible: {
          opacity: 1,
          y: 0,
          ...(scale && { scale: 1 }),
          transition: {
            duration: isMobile ? 0.5 : 0.7,
            ease: premiumEase,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Section Header Animation
export const SectionHeader = ({ children, className = "" }: ScrollAnimationProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: config.duration,
        delay: 0.1,
        ease: premiumEase,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
