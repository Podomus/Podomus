import { Variants } from "framer-motion"

type direction = 'up' | 'left' | 'down' | 'right'

export const fadeIn = (direction: direction, delay: number): Variants => {
  return {
    hidden: {
      y: direction === 'up' ? 12 : direction === 'down' ? -12 : 0,
      opacity: 0,
      x: direction === 'left' ? 12 : direction === 'right' ? -12 : 0,
    },
    show: {
      y: 0,
      x: 0,
      opacity: 1,
      transition: {
        type: 'tween',
        duration: 0.3,
        delay,
        ease: [0.23, 1, 0.32, 1],
      },
    },
  }
}