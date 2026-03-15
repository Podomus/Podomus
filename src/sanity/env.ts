export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-03-15'

// Used by the embedded Studio
export const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || '/studio'
