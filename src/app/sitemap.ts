import { client } from '@/sanity/lib/client'
import { POST_SLUGS_QUERY, CATEGORIES_QUERY } from '@/sanity/lib/queries'

const BASE_URL = 'https://podomus.tn'

const staticPages = [
  { url: '/', priority: 1.0, changeFreq: 'weekly' as const },
  { url: '/a_propos', priority: 0.8, changeFreq: 'monthly' as const },
  { url: '/service', priority: 0.9, changeFreq: 'monthly' as const },
  { url: '/service/children', priority: 0.6, changeFreq: 'monthly' as const },
  { url: '/service/sportif', priority: 0.6, changeFreq: 'monthly' as const },
  { url: '/service/old-people', priority: 0.6, changeFreq: 'monthly' as const },
  { url: '/service/schedule', priority: 0.7, changeFreq: 'monthly' as const },
  { url: '/blog', priority: 0.9, changeFreq: 'weekly' as const },
  { url: '/contact', priority: 0.7, changeFreq: 'monthly' as const },
  { url: '/privacy', priority: 0.3, changeFreq: 'yearly' as const },
  { url: '/terms', priority: 0.3, changeFreq: 'yearly' as const },
]

export default async function sitemap() {
  const [slugs, categories] = await Promise.all([
    client.fetch(POST_SLUGS_QUERY, {}, { perspective: 'published', useCdn: true }),
    client.fetch(CATEGORIES_QUERY, {}, { perspective: 'published', useCdn: true }),
  ])

  const blogEntries = (slugs || []).map((entry: { slug: string }) => ({
    url: `${BASE_URL}/blog/${entry.slug}`,
    priority: 0.7,
    changeFreq: 'monthly' as const,
    lastModified: new Date(),
  }))

  const categoryEntries = (categories || [])
    .filter((cat: { slug?: { current?: string } }) => cat.slug?.current)
    .map((cat: { slug?: { current?: string } }) => ({
      url: `${BASE_URL}/blog/category/${cat.slug?.current}`,
      priority: 0.5,
      changeFreq: 'monthly' as const,
      lastModified: new Date(),
    }))

  return [
    ...staticPages.map((p) => ({
      url: `${BASE_URL}${p.url}`,
      lastModified: new Date(),
      changeFrequency: p.changeFreq,
      priority: p.priority,
    })),
    ...blogEntries,
    ...categoryEntries,
  ]
}
