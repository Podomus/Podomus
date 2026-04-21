import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de Confidentialité - Podomus | Cabinet de Podologie',
  description: 'Découvrez notre politique de confidentialité. Comment Podomus protège vos données personnelles et médicales conformément aux standards de confidentialité médicale.',
  keywords: 'politique confidentialité, protection données, confidentialité médicale, podomus, sonda affes ben mahmoud',
  openGraph: {
    title: 'Politique de Confidentialité - Podomus',
    description: 'Découvrez notre politique de confidentialité.',
    type: 'website',
  },
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 