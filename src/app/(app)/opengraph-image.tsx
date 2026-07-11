import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
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
        {/* Decorative blobs */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            right: '-5%',
            width: '40%',
            height: '60%',
            background: 'radial-gradient(circle, rgba(74,124,89,0.15) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-10%',
            left: '-5%',
            width: '35%',
            height: '50%',
            background: 'radial-gradient(circle, rgba(74,124,89,0.1) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            padding: '60px 80px',
            textAlign: 'center',
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 20px',
              borderRadius: 999,
              background: 'rgba(74,124,89,0.1)',
              color: '#3D6B4A',
              fontSize: 18,
              fontWeight: 500,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4A7C59' }} />
            Podologie de Précision
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: '#4A7C59',
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            Podomus
          </h1>
          <p
            style={{
              fontSize: 26,
              color: '#374151',
              fontWeight: 400,
              margin: 0,
              maxWidth: 700,
            }}
          >
            Cabine de podologie de précision à La Soukra, Ariana
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            color: '#6B8E7D',
            fontSize: 16,
          }}
        >
          <span>podomus.tn</span>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#6B8E7D' }} />
          <span>+216 51 617 044</span>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#6B8E7D' }} />
          <span>La Soukra, Tunisie</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
