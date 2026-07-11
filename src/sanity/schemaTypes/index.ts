import { post } from './documents/post'
import { page } from './documents/page'
import { category } from './documents/category'
import { settings } from './singletons/settings'
import { homePage } from './documents/homePage'
import { blockContent } from './objects/blockContent'
import { callToAction } from './objects/callToAction'
import { heroSection } from './objects/heroSection'
import { infoSection } from './objects/infoSection'
import { testimonialSection } from './objects/testimonialSection'
import { seo } from './objects/seo'
import button from './objects/button'
import {
  aboutSection,
  serviceCard,
  servicesSection,
  testimonialItem,
  testimonialsSection,
  faqItem,
  faqSection,
  ctaSection,
  valuesSection,
} from './objects/sections'

export const schemaTypes = [
  // Singletons
  settings,
  homePage,
  // Documents
  page,
  post,
  category,
  // Objects — page builder blocks (leaf types first)
  button,
  blockContent,
  callToAction,
  seo,
  heroSection,
  infoSection,
  testimonialSection,
  // Home page builder section types
  serviceCard,
  testimonialItem,
  faqItem,
  aboutSection,
  servicesSection,
  testimonialsSection,
  faqSection,
  ctaSection,
  valuesSection,
]
