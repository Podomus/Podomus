import Link from 'next/link'
import { client } from '@/sanity/lib/client'
import { POSTS_QUERY, CATEGORIES_QUERY } from '@/sanity/lib/queries'
import type { Metadata } from 'next'
import { BlogGrid } from './BlogGrid'

export const metadata: Metadata = {
  title: 'Blog | Podomus',
  description:
    'Conseils podologiques, actualités et articles sur la santé des pieds par Sonda Affes, fondatrice de Podomus.',
  alternates: {
    canonical: 'https://podomus.tn/blog',
  },
  openGraph: {
    url: 'https://podomus.tn/blog',
  },
}

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    client.fetch(POSTS_QUERY, {}, { perspective: 'published', useCdn: true }),
    client.fetch(CATEGORIES_QUERY, {}, { perspective: 'published', useCdn: true }),
  ])

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-brand/5 to-transparent">
        <h1 className="text-4xl md:text-5xl font-bold text-brand mb-4">
          Blog Podomus
        </h1>
        <p className="text-lg text-textmain max-w-2xl mx-auto">
          Conseils pratiques, dernières actualités en podologie et astuces pour
          prendre soin de vos pieds au quotidien.
        </p>
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="px-4 pb-8 max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              href="/blog"
              className="px-4 py-2 rounded-full bg-brand text-white text-sm font-medium"
            >
              Tous
            </Link>
            {categories.map((cat: any) => (
              <Link
                key={cat._id}
                href={`/blog/category/${cat.slug?.current}`}
                className="px-4 py-2 rounded-full bg-gray-100 text-textmain text-sm font-medium hover:bg-brand/10 transition"
              >
                {cat.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="px-4 pb-20 max-w-6xl mx-auto">
        {!posts || posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-textmain text-lg">
              Aucun article pour le moment. Revenez bientôt !
            </p>
          </div>
        ) : (
          <BlogGrid posts={posts} />
        )}
      </section>
    </main>
  )
}
