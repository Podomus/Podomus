import Link from 'next/link'
import Image from 'next/image'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { sanityFetch } from '@/sanity/lib/live'
import { POSTS_QUERY, CATEGORIES_QUERY } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Podomus',
  description:
    'Conseils podologiques, actualités et articles sur la santé des pieds par Sonda Affes, fondatrice de Podomus.',
}

export default async function BlogPage() {
  const [{ data: posts }, { data: categories }] = await Promise.all([
    sanityFetch({ query: POSTS_QUERY }),
    sanityFetch({ query: CATEGORIES_QUERY }),
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug?.current}`}
                className="group"
              >
                <article className="rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                  {post.coverImage?.asset && (
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={urlFor(post.coverImage).width(600).height(375).url()}
                        alt={post.coverImage.alt || post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    {post.category && (
                      <span className="text-xs font-semibold text-brand uppercase tracking-wider">
                        {post.category.title}
                      </span>
                    )}
                    <h2 className="text-xl font-bold text-foreground mt-1 mb-2 group-hover:text-brand transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-textmain text-sm line-clamp-3 mb-3">
                        {post.excerpt}
                      </p>
                    )}
                    {post.date && (
                      <time className="text-xs text-gray-400">
                        {format(parseISO(post.date), 'd MMMM yyyy', {
                          locale: fr,
                        })}
                      </time>
                    )}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
