import AboutSection from "@/sections/aboutSection";
import ContactSection from "@/sections/contactSection";
import HeroSection from "@/sections/heroSection";
import ValuesSection from "@/sections/valuesSection";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      {/* <Image src="/test/test-image.jpeg" alt="bg" width={1000} height={1000} className="opacity-40 absolute top-0 left-0 w-full object-cover z-50" /> */}
      <HeroSection />
      <AboutSection />
      <ContactSection />
    </main>
  );
}
