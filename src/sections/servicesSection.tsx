"use client";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import React from "react";
import { IoCalendarOutline } from "react-icons/io5";

import { motion } from "framer-motion";
import { fadeIn } from "../lib/animation/variants";
import { useInView } from "react-intersection-observer";
import AppointmentModal from "../components/AppointmentModal";
import { TbTargetArrow } from "react-icons/tb";

const services: { title: string; text: string }[] = [
  {
    title: "Soins personnalisés",
    text: "Diagnostic précis et soins adaptés à chaque pied.",
  },
  {
    title: "Techniques de pointe",
    text: "Orthoplastie, orthonyxie, laser : l&apos;innovation au service de votre confort.",
  },
  {
    title: "Suivi & Conseils",
    text: "Un accompagnement régulier pour préserver la santé de vos pieds.",
  },
];

const ServicesSection = () => {
  const [ref, inView] = useInView({ triggerOnce: false });
  const [refQuote, inViewQuote] = useInView({ triggerOnce: false });
  const [openModal, setOpenModal] = useState(false);

  return (
    <section
      className="relative mx-auto flex w-full max-w-7xl flex-col items-center justify-center py-0 lg:flex-row lg:py-0 xl:max-w-[1380px] overflow-hidden"
      style={{
        background: '#F8FAFC'
      }}
      id="Services"
      ref={ref}
    >
      {/* Particules flottantes en arrière-plan */}
      {[
        { left: "10%", top: "20%" },
        { left: "85%", top: "15%" },
        { left: "25%", top: "60%" },
        { left: "70%", top: "45%" },
        { left: "45%", top: "80%" },
        { left: "90%", top: "70%" },
        { left: "15%", top: "85%" },
        { left: "60%", top: "25%" },
        { left: "35%", top: "40%" },
        { left: "80%", top: "90%" },
        { left: "5%", top: "50%" },
        { left: "75%", top: "35%" },
        { left: "50%", top: "10%" },
        { left: "20%", top: "75%" },
        { left: "65%", top: "65%" }
      ].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-softtail-400/20 rounded-full"
          style={{
            left: pos.left,
            top: pos.top,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + (i % 3),
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}

      {/* Formes organiques flottantes avec soft teal */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#E8E4D9]/35 rounded-full blur-2xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-softtail-400/8 rounded-full blur-xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute top-1/2 right-1/3 w-20 h-20 bg-softtail-400/6 rounded-full blur-lg"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <motion.div
        variants={fadeIn("down", 0)}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        exit="hidden"
        className="relative z-10 mx-auto flex w-full flex-col items-center justify-center py-4 sm:py-6 lg:flex-row lg:py-8 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F8FAFC' }}
      >
        <div className="flex w-full flex-col items-center justify-center gap-2 sm:gap-3 p-3 sm:p-5 md:items-start md:justify-start text-textmain">
          <div className="text-center md:text-start px-2 sm:px-0">
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

          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 w-full px-2 sm:px-0">
            {[
              { anchor: "soins" },
              { anchor: "orthoplastie" },
              { anchor: "conseils" }
            ].map((meta, index) => (
              <div key={`service-${index}`} className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-xl border border-softtail-400/10 hover:border-softtail-400/30 transition-all duration-300 group hover:shadow-2xl">
                <div className="w-16 h-16 bg-softtail-400/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-softtail-400/20 transition-colors duration-300">
                  <TbTargetArrow size={32} className="text-softtail-400" />
                </div>
                <h4 className="mb-2 font-bold text-softtail-400 group-hover:underline text-base sm:text-lg">{services[index].title}</h4>
                <p className="text-xs sm:text-sm font-light">{services[index].text}</p>
              </div>
            ))}
          </div>

          <Button
            className="h-10 sm:h-12 md:h-16 w-full sm:w-auto px-4 sm:px-6 lg:px-8 text-xs sm:text-sm md:text-base lg:text-lg font-semibold bg-brand text-white hover:bg-highlight hover:scale-105 hover:shadow-lg transition-transform duration-300 tracking-wide uppercase"
            endContent={<IoCalendarOutline size={16} className="ml-2 sm:ml-2 md:ml-2 sm:w-5 sm:h-5 md:text-2xl lg:text-3xl" />}
            onClick={() => setOpenModal(true)}
          >
            <span className="hidden sm:inline">Demander un rendez-vous privilégié</span>
            <span className="sm:hidden">Prendre RDV</span>
          </Button>
          <AppointmentModal open={openModal} onClose={() => setOpenModal(false)} />
        </div>
      </motion.div>
    </section>
  );
};

export default ServicesSection;
