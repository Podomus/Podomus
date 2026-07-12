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

function H2({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mb-8 mt-12">
      <div className="absolute -left-4 top-0 bottom-0 w-1 bg-brand rounded-full" />
      <h2 className="text-2xl md:text-3xl font-bold text-foreground">{children}</h2>
    </div>
  )
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xl md:text-2xl font-semibold text-foreground mt-10 mb-4">
      {children}
    </h3>
  )
}

function Ul({ children }: { children: React.ReactNode }) {
  return <ul className="space-y-3 my-6">{children}</ul>
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 leading-relaxed">
      <span className="mt-1.5 w-2 h-2 rounded-full bg-brand shrink-0" />
      <span className="text-textmain">{children}</span>
    </li>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-textmain leading-relaxed mb-5">{children}</p>
}

function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="font-bold text-foreground">{children}</strong>
}

function A({ children, value }: { children: React.ReactNode; value: { href: string } }) {
  return (
    <a
      href={value.href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-brand font-medium underline decoration-brand/30 hover:decoration-brand transition-all underline-offset-2"
    >
      {children} →
    </a>
  )
}

const portableTextComponents = {
  block: {
    h2: ({ children }: any) => <H2>{children}</H2>,
    h3: ({ children }: any) => <H3>{children}</H3>,
    normal: ({ children }: any) => <P>{children}</P>,
  },
  list: {
    bullet: ({ children }: any) => <Ul>{children}</Ul>,
  },
  listItem: {
    bullet: ({ children }: any) => <Li>{children}</Li>,
  },
  marks: {
    strong: ({ children }: any) => <Strong>{children}</Strong>,
    link: ({ children, value }: any) => <A value={value}>{children}</A>,
  },
  types: {
    image: ({ value }: any) => {
      if (!value?.asset) return null
      return (
        <figure className="my-10">
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={urlFor(value).width(800).url()}
              alt={value.alt || ''}
              fill
              className="object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-sm text-gray-500 mt-3 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await client.fetch(POST_QUERY, { slug }, { perspective: 'published', useCdn: true })

  if (!post) notFound()

  return (
    <main className="min-h-screen bg-mainbg">
      {/* Hero header */}
      <div className="bg-gradient-to-b from-brand/5 to-transparent border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 pt-16 pb-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm text-highlight hover:text-brand transition-colors mb-8"
          >
            ← Retour au blog
          </Link>

          <PostHeader>
            {post.category && (
              <span className="inline-block px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-semibold uppercase tracking-wider mb-4">
                {post.category.title}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              {post.title}
            </h1>
            {post.date && (
              <time className="block mt-4 text-sm text-gray-500">
                {format(parseISO(post.date), 'd MMMM yyyy', { locale: fr })}
              </time>
            )}
          </PostHeader>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Cover */}
        {post.coverImage?.asset && (
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-12 shadow-lg">
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
        <PostBody>
          {post.content && (
            <PortableText
              value={post.content}
              components={portableTextComponents}
            />
          )}
        </PostBody>

        {/* CTA Card */}
        <div className="mt-16 bg-gradient-to-br from-brand to-highlight rounded-2xl p-8 md:p-10 text-white text-center shadow-lg">
          <h3 className="text-xl md:text-2xl font-bold mb-3">
            Prenez rendez-vous
          </h3>
          <p className="text-white/80 mb-6 max-w-md mx-auto">
            Sonda Affes Ben Mahmoud vous reçoit au cabinet Podomus à La Soukra, Ariana.
          </p>
          <a
            href="tel:+21628451433"
            className="inline-block bg-white text-brand font-semibold px-8 py-3 rounded-full shadow-md hover:shadow-xl transition-all"
          >
            Appeler le +216 28 451 433
          </a>
          <div className="mt-3 text-sm text-white/60">
            ou{' '}
            <a href="/contact" className="underline hover:text-white transition-colors">
              envoyez-nous un message
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
