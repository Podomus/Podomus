import HeroSection from '@/sections/heroSection'
import AboutSection from '@/sections/aboutSection'
import ServicesSection from '@/sections/servicesSection'
import ValuesSection from '@/sections/valuesSection'
import ContactSection from '@/sections/contactSection'

type Section = {
  _type: string
  _key: string
  heading?: string
  subheading?: string
  body?: string
  ctaLabel?: string
  ctaUrl?: string
  services?: { title: string; description?: string; icon?: string; link?: string }[]
  testimonials?: { quote: string; patientName: string; rating?: number }[]
  items?: { question: string; answer: string }[]
  values?: { title: string; description?: string; icon?: string }[]
}

export default function SectionRenderer({ section }: { section: Section }) {
  switch (section._type) {
    case 'heroSection':
      if (!section.heading) return <HeroSection />
      return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-mainbg px-4 py-24 text-center">
          <div className="relative z-10 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-brand mb-6 leading-tight">
              {section.heading}
            </h1>
            {section.subheading && (
              <p className="text-lg md:text-xl text-textmain mb-8 max-w-xl mx-auto">
                {section.subheading}
              </p>
            )}
            {section.ctaLabel && (
              <a
                href={section.ctaUrl || '/service/schedule'}
                className="inline-block bg-brand text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition"
              >
                {section.ctaLabel}
              </a>
            )}
          </div>
        </section>
      )

    case 'aboutSection':
      if (!section.heading) return <AboutSection />
      return (
        <section className="relative w-full py-16 md:py-24 overflow-hidden bg-[#F8FAFC]" id="About">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-brand mb-6">
              {section.heading}
            </h2>
            {section.subheading && (
              <p className="text-lg text-textmain mb-4">{section.subheading}</p>
            )}
            {section.body && (
              <p className="text-textmain leading-relaxed">{section.body}</p>
            )}
          </div>
        </section>
      )

    case 'servicesSection':
      if (!section.heading && (!section.services || section.services.length === 0)) {
        return <ServicesSection />
      }
      return (
        <section className="py-16 px-4 bg-mainbg" id="Services">
          <div className="max-w-5xl mx-auto">
            {section.heading && (
              <h2 className="text-3xl font-bold text-brand text-center mb-12">
                {section.heading}
              </h2>
            )}
            {section.services && section.services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {section.services.map((svc, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300">
                    <h3 className="text-lg font-bold text-brand mb-2">{svc.title}</h3>
                    {svc.description && (
                      <p className="text-textmain text-sm leading-relaxed">{svc.description}</p>
                    )}
                    {svc.link && (
                      <a
                        href={svc.link}
                        className="inline-block mt-4 text-brand text-sm font-medium hover:underline"
                      >
                        En savoir plus →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <ServicesSection />
            )}
          </div>
        </section>
      )

    case 'valuesSection':
      if (!section.heading && (!section.values || section.values.length === 0)) {
        return <ValuesSection />
      }
      return (
        <section className="py-16 px-4 bg-[#F8FAFC]" id="Values">
          <div className="max-w-5xl mx-auto">
            {section.heading && (
              <h2 className="text-3xl font-bold text-brand text-center mb-12">
                {section.heading}
              </h2>
            )}
            {section.values && section.values.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {section.values.map((val, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300">
                    <h3 className="text-lg font-bold text-brand mb-2">{val.title}</h3>
                    {val.description && (
                      <p className="text-textmain text-sm leading-relaxed">{val.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <ValuesSection />
            )}
          </div>
        </section>
      )

    case 'contactSection':
      return <ContactSection />

    case 'ctaSection':
      return (
        <section className="bg-brand text-white py-16 px-4 text-center">
          {section.heading && (
            <h2 className="text-3xl font-bold mb-4">{section.heading}</h2>
          )}
          {section.body && (
            <p className="mb-8 text-lg opacity-90 max-w-xl mx-auto">{section.body}</p>
          )}
          {section.ctaLabel && (
            <a
              href={section.ctaUrl || '/service/schedule'}
              className="inline-block bg-white text-brand px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
            >
              {section.ctaLabel}
            </a>
          )}
        </section>
      )

    case 'testimonialsSection':
      return (
        <section className="py-16 px-4 bg-[#F8FAFC]">
          <div className="max-w-5xl mx-auto">
            {section.heading && (
              <h2 className="text-3xl font-bold text-brand text-center mb-12">
                {section.heading}
              </h2>
            )}
            {section.testimonials && section.testimonials.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {section.testimonials.map((t, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300">
                    <p className="italic text-textmain leading-relaxed mb-4">&#8220;{t.quote}&#8221;</p>
                    <p className="font-semibold text-brand">{t.patientName}</p>
                    {t.rating && (
                      <p className="text-yellow-400 mt-1">{'★'.repeat(t.rating)}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )

    case 'faqSection':
      return (
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            {section.heading && (
              <h2 className="text-3xl font-bold text-brand mb-10">{section.heading}</h2>
            )}
            {section.items && section.items.length > 0 && (
              <div className="space-y-4">
                {section.items.map((item, i) => (
                  <div key={i} className="rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                    <h3 className="font-semibold text-brand mb-2">{item.question}</h3>
                    <p className="text-textmain text-sm leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )

    default:
      return null
  }
}
