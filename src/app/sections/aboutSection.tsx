"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import { TbTargetArrow } from "react-icons/tb";

import { motion } from "framer-motion";
import { fadeIn } from "../../animation/variants";
import { useInView } from "react-intersection-observer";
import { useIsMobile } from "../../hooks/useIsMobile";

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
  const [ref, inView] = useInView({ triggerOnce: false });
  const [refQuote, inViewQuote] = useInView({ triggerOnce: false });
  const scrollY = useParallaxImages();
  const isMobile = useIsMobile();

  return (
    <section
      className="relative mx-auto flex w-full max-w-full flex-col items-center justify-center py-0 sm:py-0 lg:flex-row lg:py-0 xl:max-w-[1380px] overflow-x-hidden overflow-hidden"
      style={{
        background: '#F8FAFC'
      }}
      id="About"
      ref={ref}
    >
      {/* Particules flottantes en arrière-plan */}
      {[
        { left: "15%", top: "25%" },
        { left: "80%", top: "20%" },
        { left: "30%", top: "65%" },
        { left: "75%", top: "50%" },
        { left: "50%", top: "85%" },
        { left: "85%", top: "75%" },
        { left: "20%", top: "80%" },
        { left: "65%", top: "30%" },
        { left: "40%", top: "45%" },
        { left: "90%", top: "95%" },
        { left: "10%", top: "55%" },
        { left: "70%", top: "40%" }
      ].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-[#40826D]/20 rounded-full"
          style={{
            left: pos.left,
            top: pos.top,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 4 + (i % 2),
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Formes organiques flottantes avec soft teal */}
      <motion.div
        className="absolute top-1/3 left-1/5 w-28 h-28 bg-[#E8E4D9]/40 rounded-full blur-2xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/5 w-20 h-20 bg-[#40826D]/8 rounded-full blur-xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-16 h-16 bg-[#E8E4D9]/30 rounded-full blur-lg"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 3.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2.5,
        }}
      />

      {/* Dégradé gauche */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-[#F5F5F5] to-transparent z-10" />
      {/* Dégradé droit */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-[#F5F5F5] to-transparent z-10" />
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        exit="hidden"
        className="mx-auto flex w-full flex-col items-center justify-center py-0 sm:py-0 lg:flex-row lg:py-0 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F8FAFC' }}
      >
                  <div className="flex w-full min-w-[50%] flex-col items-center justify-center gap-2 sm:gap-3">
                      <motion.div
              className="text-center px-2 sm:px-0 p-8 sm:p-12 lg:p-16"
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="text-lg sm:text-xl font-light text-softtail-400 tracking-wide uppercase">
              À Propos de Podomus
            </span>
            <h2 className="section-title mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
              Découvrez Podomus
            </h2>
          </motion.div>
          <motion.p
            className="text-sm sm:text-lg md:text-xl font-medium text-textmain bg-white/90 rounded-xl px-4 sm:px-6 py-3 sm:py-4 shadow-lg mt-4"
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          >
            Podomus, c&apos;est l&apos;expertise de la Docteure Sonda Affes Ben Mahmoud pour la santé et la beauté de vos pieds.<br />
            Un accompagnement personnalisé, dans un cadre élégant.
          </motion.p>

          {/* Bloc mission avec lueur animée */}
          <motion.div
            className="flex flex-col items-center justify-center rounded-2xl bg-highlight p-4 sm:p-6 text-center xl:p-10 mt-4 sm:mt-6 shadow-lg relative overflow-visible"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
          >
            {/* Lueur animée */}
            <motion.div
              className="absolute -inset-4 z-0 rounded-2xl pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.25, 0.1, 0.25, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{ background: "radial-gradient(circle, #4A7C5933 0%, transparent 80%)" }}
            />
            <span className="flex items-center justify-center gap-2 sm:gap-4 text-lg sm:text-2xl font-bold text-white xl:text-4xl relative z-10">
              <motion.span
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="inline-flex"
              >
                <TbTargetArrow size={30} className="sm:w-12 sm:h-12 text-highlight" />
              </motion.span>
              NOTRE MISSION
            </span>
            <motion.p
              className="mt-3 sm:mt-5 text-sm sm:text-lg font-medium text-white md:text-xl relative z-10"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.55 }}
            >
              Offrir des soins podologiques d&apos;exception, alliant innovation, confort et discrétion.
            </motion.p>
            {/* Lien animé vers /service */}
            <motion.a
              href="/service"
              className="inline-block mt-6 sm:mt-8 bg-white text-brand font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-full shadow-lg hover:bg-highlight hover:text-white transition-all duration-300 text-sm sm:text-lg"
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              Découvrir tous nos services
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
                key={img.src}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.15, ease: "easeOut" }}
                whileHover={{ scale: 1.07, boxShadow: "0 8px 32px 0 rgba(64, 130, 109, 0.25)" }}
                className="w-full h-full rounded-xl overflow-hidden cursor-pointer transition-all"
                style={{
                  transform: `translateY(${scrollY * parallaxFactors[i]}px)`
                }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={400}
                  height={400}
                  className="object-cover w-full h-full rounded-xl transition-all duration-300"
                />
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

export default AboutSection;
