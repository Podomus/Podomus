import AboutSection from "@/sections/aboutSection";
import ContactSection from "@/sections/contactSection";
import HeroSection from "@/sections/heroSection";
import ValuesSection from "@/sections/valuesSection";
import { sanityFetch } from "@/sanity/lib/live";
import { HOME_PAGE_QUERY } from "@/sanity/lib/queries";
import SectionRenderer from "@/components/SectionRenderer";

export default async function Home() {
  const { data: homePage } = await sanityFetch({ query: HOME_PAGE_QUERY });

  if (homePage?.sections?.length) {
    return (
      <main>
        {homePage.sections.map((section: any) => (
          <SectionRenderer key={section._key} section={section} />
        ))}
      </main>
    );
  }

  return (
    <main>
      <HeroSection />
      <AboutSection />
      <ContactSection />
    </main>
  );
}
