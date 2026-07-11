export function LocalBusinessJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    '@id': 'https://podomus.tn/#business',
    name: 'Podomus — Cabinet de Podologie',
    description:
      'Cabinet de podologie de précision dirigé par la Dre Sonda Affes Ben Mahmoud, formée chez Bastien Gonzalez.',
    url: 'https://podomus.tn',
    telephone: '+21651617044',
    email: 'contact@podomus.tn',
    image: 'https://podomus.tn/5.jpg',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Imm. Golf Center 2, Bureau BM2',
      addressLocality: 'La Soukra',
      addressRegion: 'Ariana',
      addressCountry: 'TN',
    },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Monday', opens: '09:00', closes: '18:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Tuesday', opens: '09:00', closes: '18:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Wednesday', opens: '09:00', closes: '18:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Thursday', opens: '09:00', closes: '18:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '09:00', closes: '18:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '13:00' },
    ],
    priceRange: '$$',
    medicalSpecialty: 'Podiatry',
    founder: {
      '@type': 'Person',
      name: 'Sonda Affes Ben Mahmoud',
      jobTitle: 'Docteure en Podologie',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
