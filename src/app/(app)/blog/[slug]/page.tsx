import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { PortableText } from '@portabletext/react'
import { client } from '@/sanity/lib/client'
import { POST_QUERY, POST_SLUGS_QUERY } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import type { Metadata } from 'next'
import { PostHeader, PostBody } from './PostContent'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const data = await client.fetch(POST_SLUGS_QUERY, {}, { perspective: 'published', useCdn: true })
  return data || []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await client.fetch(POST_QUERY, { slug }, { perspective: 'published', useCdn: true })

  if (!post) return { title: 'Post Not Found' }

  const seoTitle = post.seo?.seoTitle || post.title
  const seoDesc = post.seo?.seoDescription || post.excerpt || undefined
  const ogImage = post.seo?.ogImage?.asset
    ? { url: urlFor(post.seo.ogImage).width(1200).height(630).url(), width: 1200, height: 630 }
    : post.coverImage?.asset
      ? { url: urlFor(post.coverImage).width(1200).height(630).url(), width: 1200, height: 630 }
      : undefined

  return {
    title: `${seoTitle} | Blog Podomus`,
    description: seoDesc,
    alternates: { canonical: `https://podomus.tn/blog/${slug}` },
    openGraph: {
      title: seoTitle,
      description: seoDesc,
      url: `https://podomus.tn/blog/${slug}`,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset) return null
      return (
        <figure className="my-8">
          <Image
            src={urlFor(value).width(800).url()}
            alt={value.alt || ''}
            width={800}
            height={450}
            className="rounded-xl w-full"
          />
          {value.caption && (
            <figcaption className="text-center text-sm text-gray-500 mt-2">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  marks: {
    link: ({ children, value }: any) => (
      <a
        href={value.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brand underline hover:opacity-80"
      >
        {children}
      </a>
    ),
  },
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await client.fetch(POST_QUERY, { slug }, { perspective: 'published', useCdn: true })

  if (!post) notFound()

  return (
    <main className="min-h-screen bg-background">
      <article className="max-w-3xl mx-auto px-4 py-16">
        {/* Back link */}
        <Link
          href="/blog"
          className="text-sm text-brand hover:underline mb-8 inline-block"
        >
          ← Retour au blog
        </Link>

        {/* Header */}
        <PostHeader className="mb-10">
          {post.category && (
            <span className="text-sm font-semibold text-brand uppercase tracking-wider">
              {post.category.title}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-2 mb-4">
            {post.title}
          </h1>
          {post.date && (
            <time className="text-gray-500">
              {format(parseISO(post.date), 'd MMMM yyyy', { locale: fr })}
            </time>
          )}
        </PostHeader>

        {/* Cover */}
        {post.coverImage?.asset && (
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-10">
            <Image
              src={urlFor(post.coverImage).width(1200).height(675).url()}
              alt={post.coverImage.alt || post.title || ''}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <PostBody className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-textmain prose-a:text-brand">
          {post.content && (
            <PortableText
              value={post.content}
              components={portableTextComponents}
            />
          )}
        </PostBody>
      </article>
    </main>
  )
}
