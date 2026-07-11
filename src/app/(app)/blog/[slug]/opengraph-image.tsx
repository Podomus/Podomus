import { ImageResponse } from 'next/og'
import { client } from '@/sanity/lib/client'
import { POST_QUERY } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await client.fetch(POST_QUERY, { slug }, { perspective: 'published' })

  // Use Sanity OG image if available, otherwise fall back to generated design
  if (post?.seo?.ogImage?.asset) {
    const imgUrl = urlFor(post.seo.ogImage).width(1200).height(630).url()
    return new ImageResponse(
      (
        <div style={{ width: 1200, height: 630, display: 'flex', position: 'relative', overflow: 'hidden' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imgUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.6))', padding: '40px 60px' }}>
            <div style={{ color: '#fff', fontSize: 14, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Podomus</div>
            <div style={{ color: '#fff', fontSize: 36, fontWeight: 700, lineHeight: 1.2 }}>{post.seo?.seoTitle || post.title}</div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 },
    )
  }

  // Fallback: generated design
  const title = post?.title || 'Blog Podomus'
  const clamped = title.length > 90 ? title.slice(0, 87) + '...' : title

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #F0F9F4 0%, #F8FAFC 50%, #F0F9F4 100%)',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '40%', height: '60%', background: 'radial-gradient(circle, rgba(74,124,89,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '35%', height: '50%', background: 'radial-gradient(circle, rgba(74,124,89,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '60px 80px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 20px', borderRadius: 999, background: 'rgba(74,124,89,0.1)', color: '#3D6B4A', fontSize: 16, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4A7C59' }} />
            Article
          </div>
          <h1 style={{ fontSize: clamped.length > 60 ? 32 : 42, fontWeight: 800, color: '#4A7C59', lineHeight: 1.2, margin: 0, maxWidth: 800 }}>{clamped}</h1>
        </div>
        <div style={{ position: 'absolute', bottom: 32, display: 'flex', alignItems: 'center', gap: 12, color: '#6B8E7D', fontSize: 16 }}>
          <span>podomus.tn/blog</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
