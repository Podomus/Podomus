"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import { TbTargetArrow } from "react-icons/tb";

import { motion } from "framer-motion";
import { fadeIn } from "../lib/animation/variants";
import { useScrollReveal } from "@/lib/useScrollReveal";

// Hook parallax pour images
function useParallaxImages() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return scrollY;
}

const AboutSection = () => {
  const revealRef = useScrollReveal();
  const scrollY = useParallaxImages();

  return (
    <section
      className="relative w-full py-16 md:py-24 overflow-hidden"
      style={{
        background: '#F8FAFC'
      }}
      id="About"
      ref={revealRef}
    >
      <div className="container mx-auto px-4 ">
      {/* Formes organiques flottantes avec soft teal */}
      <div
        className="absolute top-1/3 left-1/5 w-28 h-28 bg-[#E8E4D9]/40 rounded-full blur-2xl"
        style={{ animation: "blob-pulse 4.5s ease-in-out infinite", willChange: "transform" }}
      />
      <div
        className="absolute bottom-1/3 right-1/5 w-20 h-20 bg-[#40826D]/8 rounded-full blur-xl"
        style={{ animation: "blob-pulse-b 5.5s ease-in-out 1.5s infinite", willChange: "transform" }}
      />
      <div
        className="absolute top-1/2 left-1/2 w-16 h-16 bg-[#E8E4D9]/30 rounded-full blur-lg"
        style={{ animation: "blob-pulse-c 3.8s ease-in-out 2.5s infinite", willChange: "transform" }}
      />

      {/* Dégradé gauche */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-[#F5F5F5] to-transparent z-10" />
      {/* Dégradé droit */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-[#F5F5F5] to-transparent z-10" />
      <motion.div
        variants={fadeIn("up", 0)}
        initial="hidden"
        animate="show"
        exit="hidden"
        className="mx-auto flex w-full flex-col items-center justify-center py-0 sm:py-0 lg:flex-row lg:py-0 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F8FAFC' }}
      >
                  <div className="flex w-full min-w-[50%] flex-col items-center justify-center gap-2 sm:gap-3">
                      <motion.div
              data-reveal
              className="text-center px-2 sm:px-0 p-8 sm:p-12 lg:p-16"
            initial={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          >
            <span className="text-lg sm:text-xl font-light text-softtail-400 tracking-wide uppercase">
              À Propos de Podomus
            </span>
            <h2 className="section-title mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
              La rigueur des palaces, en cabinet.
            </h2>
          </motion.div>
          <motion.p
            data-reveal
            className="text-sm sm:text-lg md:text-xl font-medium text-textmain bg-white/90 rounded-xl px-4 sm:px-6 py-3 sm:py-4 shadow-lg mt-4"
            initial={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1], delay: 0.06 }}
          >
            Avant d'ouvrir Podomus, la Dre Sonda Affes Ben Mahmoud a exercé dans les studios Bastien Gonzalez — à Dubaï, puis aux Maldives — là où la podologie rencontre l'hôtellerie de luxe et où chaque détail du soin est traité avec la même exigence qu'une suite cinq étoiles.<br />
            Elle a ramené ce niveau d'exigence ici.
          </motion.p>

          {/* Bloc mission avec lueur animée */}
          <motion.div
            data-reveal
            className="flex flex-col items-center justify-center rounded-2xl bg-highlight p-4 sm:p-6 text-center xl:p-10 mt-4 sm:mt-6 shadow-lg relative overflow-visible"
            initial={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
          >
            {/* Lueur animée */}
            <div
              className="absolute -inset-4 z-0 rounded-2xl pointer-events-none"
              style={{ background: "radial-gradient(circle, #4A7C5933 0%, transparent 80%)", animation: "glow-pulse 6s ease-in-out infinite" }}
            />
            <span className="flex items-center justify-center gap-2 sm:gap-4 text-lg sm:text-2xl font-bold text-white xl:text-4xl relative z-10">
              <span
                className="inline-flex"
                style={{ animation: "icon-pulse 1.5s ease-in-out infinite" }}
              >
                <TbTargetArrow size={30} className="sm:w-12 sm:h-12 text-highlight" />
              </span>
              NOTRE MISSION
            </span>
            <motion.p
              className="mt-3 sm:mt-5 text-sm sm:text-lg font-medium text-white md:text-xl relative z-10"
              initial={{ y: 16, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1], delay: 0.15 }}
            >
              Soigner chaque pied avec la précision et la discrétion qu'on attend dans les meilleurs établissements — sans que vous ayez à traverser le monde pour ça.
            </motion.p>
            {/* Lien animé vers /service */}
            <motion.a
              href="/service"
              className="inline-block mt-6 sm:mt-8 bg-white text-brand font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-full shadow-lg hover:bg-highlight hover:text-white transition-[transform,background-color,color] duration-150 text-sm sm:text-lg"
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
            >
              Voir tous nos soins
            </motion.a>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 grid-rows-2 gap-2 aspect-square h-auto w-full min-w-[50%] p-3 sm:p-5">
          {[
            { src: "/7.jpg", alt: "Podomus 1" },
            { src: "/8.jpg", alt: "Podomus 2" },
            { src: "/9.jpg", alt: "Podomus 3" },
            { src: "/10.jpg", alt: "Podomus 4" },
          ].map((img, i) => {
            const parallaxFactors = [0.2, 0.1, -0.1, -0.2];
            return (
              <motion.div
                data-reveal
                key={img.src}
                initial={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05, ease: [0.23, 1, 0.32, 1] }}
                whileHover={{ scale: 1.03, boxShadow: "0 8px 32px 0 rgba(64, 130, 109, 0.18)" }}
                className="w-full h-full rounded-xl overflow-hidden cursor-pointer transition-transform"
                style={{
                  transform: `translateY(${scrollY * parallaxFactors[i]}px)`
                }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={400}
                  height={400}
                  className="object-cover w-full h-full rounded-xl transition-transform duration-200"
                />
              </motion.div>
            );
          })}
        </div>
      </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
