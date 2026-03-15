 "use client";
import Image from "next/image";
import { Button } from "@nextui-org/react";
import { IoCalendarOutline, IoPlay, IoAdd } from "react-icons/io5";
import { TbTargetArrow } from "react-icons/tb";
import { motion } from "framer-motion";
import { fadeIn } from "../../animation/variants";
import { useInView } from "react-intersection-observer";
import React, { useEffect, useRef, useState } from "react";
import AppointmentModal from "../../components/AppointmentModal";

const services: { title: string; text: string }[] = [
  {
    title: "Soins personnalisés",
    text: "Diagnostic précis et soins adaptés à chaque pied.",
  },
  {
    title: "Techniques de pointe",
    text: "Orthoplastie, orthonyxie, laser : l'innovation au service de votre confort.",
  },
  {
    title: "Suivi & Conseils",
    text: "Un accompagnement régulier pour préserver la santé de vos pieds.",
  },
];

// Typing effect
function TypingTitle({ text, className }: { text: string; className?: string }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;  
      if (i >= text.length) {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className={className}>
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  );
}

// Hook utilitaire pour détecter le mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

// Composant pour les formes organiques floues
function OrganicShapes() {
  const isMobile = useIsMobile();
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Forme principale - couleur brand Podomus */}
      <motion.div
        className={isMobile ? "absolute top-20 right-10 w-40 h-40 bg-softtail-500/30 rounded-full blur" : "absolute top-20 right-10 w-96 h-96 bg-softtail-500/40 rounded-full blur-3xl"}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      
      {/* Forme secondaire - couleur highlight Podomus */}
      {!isMobile && (
        <motion.div
          className="absolute bottom-20 left-10 w-80 h-80 bg-softtail-400/35 rounded-full blur-3xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
        />
      )}
      
      {/* Forme tertiaire - couleur neutralbg Podomus */}
      {!isMobile && (
        <motion.div
          className="absolute top-1/2 left-1/3 w-72 h-72 bg-[#E8E4D9]/50 rounded-full blur-3xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 1, ease: "easeOut" }}
        />
      )}

      {/* Formes de fusion avec la section suivante - partie haute */}
      <motion.div
        className="absolute top-32 left-16 w-64 h-64 bg-softtail-500/25 rounded-full blur-3xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.5, delay: 0.3, ease: "easeOut" }}
      />

      {/* Forme de transition vers la section suivante */}
      <motion.div
        className="absolute bottom-32 right-20 w-56 h-56 bg-softtail-400/30 rounded-full blur-3xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.2, delay: 0.7, ease: "easeOut" }}
      />

      {/* Forme centrale - fusion des couleurs */}
      <motion.div
        className="absolute top-1/3 right-1/4 w-48 h-48 bg-gradient-to-br from-softtail-500/25 to-softtail-400/25 rounded-full blur-3xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.8, delay: 1.2, ease: "easeOut" }}
      />

      {/* Forme de transition haute */}
      <motion.div
        className="absolute top-16 left-1/2 w-40 h-40 bg-neutralbg/40 rounded-full blur-3xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.3, delay: 0.9, ease: "easeOut" }}
      />

      {/* Forme de fusion basse - prépare la transition */}
      <motion.div
        className="absolute bottom-16 left-1/2 w-52 h-52 bg-gradient-to-tr from-softtail-400/20 to-softtail-500/20 rounded-full blur-3xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.6, delay: 1.5, ease: "easeOut" }}
      />

      {/* Formes géométriques de transition */}
      <motion.div
        className="absolute top-1/4 right-1/3 w-32 h-32 bg-gradient-to-br from-softtail-500/35 to-softtail-400/35 rounded-lg blur-2xl rotate-12"
        initial={{ scale: 0, opacity: 0, rotate: 0 }}
        animate={{ scale: 1, opacity: 1, rotate: 12 }}
        transition={{ duration: 3, delay: 0.4, ease: "easeOut" }}
      />

      <motion.div
        className="absolute bottom-1/4 left-1/4 w-28 h-28 bg-gradient-to-tr from-neutralbg/45 to-softtail-500/30 rounded-lg blur-2xl -rotate-12"
        initial={{ scale: 0, opacity: 0, rotate: 0 }}
        animate={{ scale: 1, opacity: 1, rotate: -12 }}
        transition={{ duration: 2.7, delay: 1.1, ease: "easeOut" }}
      />

      {/* Formes de fusion supplémentaires */}
      <motion.div
        className="absolute top-40 right-1/3 w-36 h-36 bg-softtail-500/20 rounded-full blur-2xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.4, delay: 0.6, ease: "easeOut" }}
      />

      <motion.div
        className="absolute bottom-40 left-1/3 w-44 h-44 bg-softtail-400/25 rounded-full blur-2xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.9, delay: 1.3, ease: "easeOut" }}
      />

      {/* Forme centrale de fusion */}
      <motion.div
        className="absolute top-1/2 right-1/2 w-60 h-60 bg-gradient-to-br from-neutralbg/35 to-softtail-400/20 rounded-full blur-3xl"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 3.2, delay: 0.8, ease: "easeOut" }}
      />

      {/* Formes de transition vers la section suivante - partie basse */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-softtail-400/20 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1.8, ease: "easeOut" }}
      />

      <motion.div
        className="absolute bottom-0 right-0 w-64 h-48 bg-gradient-to-tl from-softtail-500/15 to-transparent rounded-tl-full"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.5, delay: 2, ease: "easeOut" }}
      />

      <motion.div
        className="absolute bottom-0 left-1/3 w-48 h-40 bg-gradient-to-tr from-[#E8E4D9]/25 to-transparent rounded-tr-full"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.3, delay: 2.2, ease: "easeOut" }}
      />

      {/* Formes de test très visibles pour vérifier */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-softtail-500/60 rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-16 h-16 bg-softtail-400/60 rounded-full"></div>
      <div className="absolute top-1/2 left-10 w-16 h-16 bg-neutralbg/70 rounded-full"></div>
    </div>
  );
}

// Composant pour les particules flottantes
function FloatingParticles() {
  const isMobile = useIsMobile();
  const [positions, setPositions] = useState<{x: number, y: number}[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && typeof window !== "undefined" && !isMobile) {
      setPositions(
        Array.from({ length: 20 }, () => ({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        }))
      );
    } else if (isMobile) {
      setPositions([]);
    }
  }, [mounted, isMobile]);

  if (!mounted || positions.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {positions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-softtail-500/20 rounded-full"
          initial={{
            x: pos.x,
            y: pos.y,
            opacity: 0,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 10 + Math.random() * 5,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  );
}

export default function HeroSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [openModal, setOpenModal] = useState(false);

  return (
    <section 
      ref={ref}
      className="relative min-h-screen overflow-hidden"
      style={{
        background: '#F8FAFC'
      }}
    >
      {/* Formes organiques et particules */}
      <OrganicShapes />
      <FloatingParticles />
      
      {/* Effet de fusion avec la section suivante */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#F5F5F5] via-[#E8E4D9]/50 to-transparent"></div>
      
      <div className="mx-auto flex w-full flex-col items-center justify-center py-0 lg:py-0 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F8FAFC' }}>
                  <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[50vh] w-full">
          
          {/* Contenu de gauche - style exact de l'image */}
          <motion.div 
            className="lg:pr-8 p-8 sm:p-12 lg:p-16"
            variants={fadeIn}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {/* Badge "Podologie" */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/50 mb-8"
            >
              <div className="w-2 h-2 bg-softtail-500 rounded-full"></div>
              <span className="text-lg sm:text-xl font-light text-softtail-400 tracking-wide uppercase">
                Podologie
              </span>
            </motion.div>

            {/* Titre principal - style exact de l'image */}
            <motion.h1
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-5xl lg:text-7xl font-bold leading-tight mb-6"
            >
              <span className="text-softtail-500 block">Podomus</span>
              <span className="text-gray-800 block">L&apos;Art du Soin</span>
            </motion.h1>

            {/* Description - style exact de l'image */}
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg lg:text-xl text-gray-600 leading-relaxed mb-8 max-w-lg"
            >
              Des soins sur-mesure, innovants et confidentiels, orchestrés par la Docteure Sonda Affes Ben Mahmoud.
              L’excellence podologique, tout simplement.
            </motion.p>

            {/* Boutons principaux - style uniforme */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6 w-full">
              {/* Bouton principal - Prendre rendez-vous */}
              <Button
                className="w-full sm:w-auto min-w-0 bg-softtail-400 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold shadow-lg hover:bg-softtail-400/90 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 group text-base sm:text-lg"
                onPress={() => setOpenModal(true)}
              >
                <IoCalendarOutline size={20} className="group-hover:rotate-12 transition-transform duration-300" />
                <span>Prendre rendez-vous</span>
              </Button>

              {/* Bouton secondaire - Découvrir nos services */}
              <Button
                className="w-full sm:w-auto min-w-0 bg-white text-softtail-500 border-2 border-softtail-500 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold shadow-lg hover:bg-softtail-500 hover:text-white hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 group text-base sm:text-lg"
                onPress={() => document.getElementById('Services')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <IoPlay size={20} className="group-hover:scale-110 transition-transform duration-300" />
                <span>Découvrir nos services</span>
              </Button>
            </div>

            {/* Statistiques - style exact de l'image */}
            <div className="flex justify-between items-center gap-4 sm:gap-6 mt-4 sm:mt-6">
              <div className="text-center">
                              <div className="text-2xl sm:text-3xl font-bold text-softtail-400">500+</div>
              <div className="text-sm text-gray-600">Patients satisfaits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-softtail-400">10+</div>
              <div className="text-sm text-gray-600">Années d&apos;expérience</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-softtail-400">100%</div>
                <div className="text-sm text-gray-600">Taux de réussite</div>
              </div>
            </div>
          </motion.div>

          {/* Image de droite - forme exacte de l'image de référence */}
          <motion.div
            className="relative flex items-center justify-center w-full"
            initial={{ x: 40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          >
            {/* Conteneur principal avec cadre arrondi */}
            <div className="relative w-full max-w-lg">
              {/* Cadre central avec partie supérieure ronde et inférieure droite */}
              <div className="relative bg-white rounded-t-full rounded-b-3xl shadow-2xl overflow-hidden">
                {/* Image principale */}
                <div className="relative">
                  <Image
                    src="/5.jpg"
                    alt="Podologue professionnel"
                    sizes="100vw"
                    width={0}
                    height={0}
                    className="w-full h-auto object-cover"
                  />
                  
                  {/* Effet de profondeur de champ - flou d'arrière-plan */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                </div>
              </div>

              {/* Formes organiques en arrière-plan (style exact de l'image) */}
              <div className="absolute inset-0 -z-10">
                {/* Forme beige en haut à droite */}
                <motion.div
                  className="absolute -top-8 -right-8 w-32 h-32 bg-[#F5F5DC]/30 rounded-full blur-xl"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.5, delay: 0.8 }}
                />
                
                {/* Forme sombre en bas à gauche */}
                <motion.div
                  className="absolute -bottom-8 -left-8 w-24 h-24 bg-gray-800/20 rounded-full blur-xl"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1.5, delay: 1.0 }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>



      {/* Section Services intégrée */}
      <div className="relative z-10 mx-auto flex w-full flex-col items-center justify-center py-0 sm:py-0 lg:py-0 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F8FAFC' }}>
                  <div className="flex w-full flex-col items-center justify-center gap-6 sm:gap-8 md:items-start md:justify-start text-textmain">
                      <div className="text-center md:text-start px-2 sm:px-0 p-8 sm:p-12 lg:p-16">
            <span className="text-lg sm:text-xl font-light text-softtail-400 tracking-wide uppercase">
              Nos Services
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold xl:text-5xl text-brand mt-2">
              Une approche moderne et personnalisée de la podologie
            </h2>
            <p className="mt-2 text-sm sm:text-base md:text-lg text-textmain font-medium">
              Préparez-vous à redécouvrir la podologie avec l&apos;expertise de la Docteure Sonda Affes Ben Mahmoud et des soins pensés pour votre bien-être.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 w-full px-2 sm:px-0">
            {[
              { anchor: "soins" },
              { anchor: "orthoplastie" },
              { anchor: "conseils" }
            ].map((meta, index) => (
              <motion.div
                key={`service-${index}`}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.7, delay: index * 0.2, ease: "easeOut" }}
                className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-xl border border-softtail-400/10 hover:border-softtail-400/30 transition-all duration-300 group hover:shadow-2xl hover:scale-105"
              >
                <div className="w-16 h-16 bg-softtail-400/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-softtail-400/20 transition-colors duration-300">
                  <TbTargetArrow size={32} className="text-softtail-400" />
                </div>
                <h4 className="mb-2 font-bold text-softtail-400 group-hover:underline text-base sm:text-lg">{services[index].title}</h4>
                <p className="text-xs sm:text-sm font-light">{services[index].text}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.8, ease: "easeOut" }}
            className="w-full flex justify-center"
          >
            <Button
              className="h-12 sm:h-14 md:h-16 px-6 sm:px-8 lg:px-10 text-sm sm:text-base md:text-lg font-semibold bg-softtail-500 text-white hover:bg-softtail-600 hover:scale-105 hover:shadow-lg transition-all duration-300 tracking-wide uppercase"
              endContent={<IoCalendarOutline size={20} className="ml-2" />}
              onPress={() => setOpenModal(true)}
            >
              <span className="hidden sm:inline">Demander un rendez-vous privilégié</span>
              <span className="sm:hidden">Prendre RDV</span>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Modal de rendez-vous */}
      <AppointmentModal open={openModal} onClose={() => setOpenModal(false)} />
    </section>
  );
}
