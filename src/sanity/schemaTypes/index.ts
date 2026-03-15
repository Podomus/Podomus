import { post } from './documents/post'
import { page } from './documents/page'
import { category } from './documents/category'
import { settings } from './singletons/settings'
import { blockContent } from './objects/blockContent'
import { callToAction } from './objects/callToAction'
import { heroSection } from './objects/heroSection'
import { infoSection } from './objects/infoSection'
import { testimonialSection } from './objects/testimonialSection'
import button from './objects/button'

export const schemaTypes = [
  // Singletons
  settings,
  // Documents
  page,
  post,
  category,
  // Objects
  button,
  blockContent,
  callToAction,
  heroSection,
  infoSection,
  testimonialSection,
]
