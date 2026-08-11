import Link from 'next/link'
import { notFound } from 'next/navigation'
import { client } from '@/sanity/lib/client'
import {
  POSTS_BY_CATEGORY_QUERY,
  CATEGORIES_QUERY,
} from '@/sanity/lib/queries'
import type { Metadata } from 'next'
import { BlogGrid } from '../../BlogGrid'
import AppointmentButton from '@/components/AppointmentButton'

export const dynamicParams = true

export async function generateStaticParams() {
  const categories = await client.fetch(CATEGORIES_QUERY, {}, { perspective: 'published', useCdn: true })
  return (categories ?? [])
    .map((cat: { slug?: { current?: string } }) => ({ slug: cat.slug?.current }))
    .filter((p: { slug?: string }) => p.slug)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const categories = await client.fetch(CATEGORIES_QUERY, {}, { perspective: 'published', useCdn: true })
  const category = (categories ?? []).find(
    (cat: { slug?: { current?: string } }) => cat.slug?.current === slug
  )
  if (!category) return { title: 'Blog | Podomus' }
  return {
    title: `${category.title} | Blog Podomus`,
    description:
      category.description ||
      `Articles sur ${category.title} en podologie, par Sonda Affes au cabinet Podomus, La Soukra.`,
    alternates: {
      canonical: `https://podomus.tn/blog/category/${slug}`,
    },
  }
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [posts, categories] = await Promise.all([
    client.fetch(POSTS_BY_CATEGORY_QUERY, { categorySlug: slug }, { perspective: 'published', useCdn: true }),
    client.fetch(CATEGORIES_QUERY, {}, { perspective: 'published', useCdn: true }),
  ])
  const activeCategory = (categories ?? []).find(
    (cat: { slug?: { current?: string } }) => cat.slug?.current === slug
  )
  if (!activeCategory) notFound()

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-brand/5 to-transparent">
        <h1 className="text-4xl md:text-5xl font-bold text-brand mb-4">
          {activeCategory.title}
        </h1>
        <p className="text-lg text-textmain max-w-2xl mx-auto">
          {activeCategory.description ||
            `Articles sur ${activeCategory.title} : conseils pratiques et actualités en podologie.`}
        </p>
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 pb-8 max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              href="/blog"
              className="px-4 py-2 rounded-full bg-gray-100 text-textmain text-sm font-medium hover:bg-brand/10 transition"
            >
              Tous
            </Link>
            {categories.map((cat: { _id: string; title: string; slug?: { current?: string } }) => {
              const isActive = cat.slug?.current === slug
              return (
                <Link
                  key={cat._id}
                  href={`/blog/category/${cat.slug?.current}`}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    isActive
                      ? 'bg-brand text-white'
                      : 'bg-gray-100 text-textmain hover:bg-brand/10'
                  }`}
                >
                  {cat.title}
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20 max-w-7xl mx-auto">
        {!posts || posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-textmain text-lg">
              Aucun article dans cette catégorie pour le moment.
            </p>
          </div>
        ) : (
          <BlogGrid posts={posts} />
        )}
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-brand to-highlight rounded-2xl p-8 md:p-12 text-white text-center shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Prendre rendez-vous
          </h2>
          <p className="text-white/80 mb-6 max-w-md mx-auto">
            Sonda Affes Ben Mahmoud vous reçoit au cabinet Podomus à La Soukra, Ariana.
          </p>
          <AppointmentButton className="bg-white text-brand font-semibold px-8 py-3 rounded-full shadow-md hover:shadow-xl transition-all" />
        </div>
      </section>
    </main>
  )
}
