"use client";
import { Button } from "@nextui-org/react";
import { useState } from "react";
import React from "react";
import { IoCalendarOutline } from "react-icons/io5";

import { motion } from "framer-motion";
import { fadeIn } from "../lib/animation/variants";
import { useScrollReveal } from "@/lib/useScrollReveal";
import AppointmentModal from "../components/AppointmentModal";
import { TbTargetArrow } from "react-icons/tb";

const services: { title: string; text: string }[] = [
  {
    title: "Soins personnalisés",
    text: "Diagnostic précis et soins adaptés à chaque pied.",
  },
  {
    title: "Techniques de pointe",
    text: "Orthoplastie, orthonyxie, laser\u00A0: l&apos;innovation au service de votre confort.",
  },
  {
    title: "Suivi & Conseils",
    text: "Un accompagnement régulier pour préserver la santé de vos pieds.",
  },
];

const ServicesSection = () => {
  const revealRef = useScrollReveal();
  const [openModal, setOpenModal] = useState(false);

  return (
    <section
      className="relative mx-auto flex w-full max-w-7xl flex-col items-center justify-center py-0 lg:flex-row lg:py-0 xl:max-w-[1380px] overflow-hidden"
      style={{
        background: '#F8FAFC'
      }}
      id="Services"
      ref={revealRef}
    >

      <div
        className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#E8E4D9]/35 rounded-full blur-2xl"
        style={{ animation: "blob-pulse 4s ease-in-out infinite", willChange: "transform" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-softtail-400/8 rounded-full blur-xl"
        style={{ animation: "blob-pulse-b 5s ease-in-out 1s infinite", willChange: "transform" }}
      />
      <div
        className="absolute top-1/2 right-1/3 w-20 h-20 bg-softtail-400/6 rounded-full blur-lg"
        style={{ animation: "blob-pulse-c 3.5s ease-in-out 2s infinite", willChange: "transform" }}
      />

      <motion.div
        variants={fadeIn("down", 0)}
        initial="hidden"
        animate="show"
        exit="hidden"
        className="relative z-10 mx-auto flex w-full flex-col items-center justify-center py-4 sm:py-6 lg:flex-row lg:py-8 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F8FAFC' }}
      >
        <div className="flex w-full flex-col items-center justify-center gap-2 sm:gap-3 p-3 sm:p-5 md:items-start md:justify-start text-textmain">
          <div data-reveal className="text-center md:text-start px-2 sm:px-0">
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

          <div
            className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 w-full px-2 sm:px-0"
          >
            {[
              { anchor: "soins" },
              { anchor: "orthoplastie" },
              { anchor: "conseils" }
            ].map((meta, index) => (
              <div
                data-reveal
                key={`service-${index}`}
                className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-xl border border-softtail-400/10 hover:border-softtail-400/30 transition-[border-color,box-shadow] duration-200 group hover:shadow-2xl"
              >
                <div className="w-16 h-16 bg-softtail-400/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-softtail-400/20 transition-colors duration-300">
                  <TbTargetArrow size={32} className="text-softtail-400" />
                </div>
                <h4 className="mb-2 font-bold text-softtail-400 group-hover:underline text-base sm:text-lg">{services[index].title}</h4>
                <p className="text-xs sm:text-sm font-light">{services[index].text}</p>
              </div>
            ))}
          </div>

          <div data-reveal className="w-full sm:w-auto">
            <Button
              className="h-10 sm:h-12 md:h-16 w-full sm:w-auto px-4 sm:px-6 lg:px-8 text-xs sm:text-sm md:text-base lg:text-lg font-semibold bg-brand text-white hover:bg-highlight hover:shadow-lg transition-[transform,background-color,box-shadow] duration-150 active:scale-[0.97] tracking-wide uppercase"
              endContent={<IoCalendarOutline size={16} className="ml-2 sm:ml-2 md:ml-2 sm:w-5 sm:h-5 md:text-2xl lg:text-3xl" />}
              onClick={() => setOpenModal(true)}
            >
              <span className="hidden sm:inline">Demander un rendez-vous privilégié</span>
              <span className="sm:hidden">Prendre RDV</span>
            </Button>
          </div>
          <AppointmentModal open={openModal} onClose={() => setOpenModal(false)} />
        </div>
      </motion.div>
    </section>
  );
};

export default ServicesSection;
