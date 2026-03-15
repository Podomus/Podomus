import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termes et Conditions - Podomus | Cabinet de Podologie',
  description: 'Consultez les termes et conditions du Cabinet Podomus. Informations sur nos services, prise de rendez-vous, confidentialité médicale et responsabilités.',
  keywords: 'termes conditions, podologie, cabinet podomus, sonda affes ben mahmoud, conditions d\'utilisation',
  openGraph: {
    title: 'Termes et Conditions - Podomus',
    description: 'Consultez les termes et conditions du Cabinet Podomus.',
    type: 'website',
  },
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 