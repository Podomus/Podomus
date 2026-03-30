// Custom easing curves (Emil Kowalski)
// Strong ease-out for UI entrances — starts fast, settles naturally
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export const fadeIn = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: EASE_OUT,
    },
  },
};

export const slideInFromLeft = {
  hidden: {
    opacity: 0,
    x: -24,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: EASE_OUT,
    },
  },
};

export const slideInFromRight = {
  hidden: {
    opacity: 0,
    x: 24,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: EASE_OUT,
    },
  },
};

// Nothing appears from nothing — start at 0.95, not 0
export const scaleIn = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: EASE_OUT,
    },
  },
};

// 50ms stagger keeps the cascade snappy without feeling slow
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
}; 
export const cardItem = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] as const },
  },
};
