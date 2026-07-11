"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";

import Location from "../../public/location.png";
import { TbMapPin, TbPhone, TbCalendar } from "react-icons/tb";
import { Button } from "@nextui-org/react";
import { IoCalendarOutline } from "react-icons/io5";
import { TbMapStar } from "react-icons/tb";

import { motion } from "framer-motion";
import { fadeIn } from "../lib/animation/variants";
import { useInView } from "react-intersection-observer";
import AppointmentModal from "../components/AppointmentModal";

const ContactSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true });
  const [refQuote, inViewQuote] = useInView({ triggerOnce: true });
  const [openModal, setOpenModal] = useState(false);

  return (
    <section
      className="relative w-full py-16 md:py-24 overflow-hidden"
      style={{
        background: '#F8FAFC'
      }}
      ref={ref}
    >
      <div className="container mx-auto px-4 ">
      {/* Formes organiques flottantes avec soft teal */}
      <div
        className="absolute top-1/4 right-1/4 w-32 h-32 bg-[#E8E4D9]/30 rounded-full blur-2xl"
        style={{ animation: "blob-pulse 4s ease-in-out infinite", willChange: "transform" }}
      />
      <div
        className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-brand/8 rounded-full blur-xl"
        style={{ animation: "blob-pulse-b 5s ease-in-out 1s infinite", willChange: "transform" }}
      />
      <div
        className="absolute top-1/2 left-1/3 w-20 h-20 bg-[#E8E4D9]/25 rounded-full blur-lg"
        style={{ animation: "blob-pulse-c 3.5s ease-in-out 2s infinite", willChange: "transform" }}
      />
      <motion.div
        variants={fadeIn("left", 0)}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        exit="hidden"
        className="mx-auto flex w-full flex-col items-center justify-center py-0 sm:py-0 lg:flex-row lg:py-0 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F8FAFC' }}
      >
        <motion.div
                      className="flex w-full min-w-[50%] flex-col items-start justify-center gap-2 sm:gap-3 text-left text-textmain p-8 sm:p-12 lg:p-16"
          initial={{ x: -40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="flex flex-col items-center justify-center gap-1 px-2 sm:px-0">
            <span className="text-lg sm:text-xl font-light text-softtail-600 tracking-wide uppercase">
              Ariana · La Soukra
            </span>
            <h2 className="section-title text-2xl sm:text-3xl md:text-4xl lg:text-5xl">Cabinet Podomus</h2>
          </div>

          <div className="mt-3 sm:mt-4 flex flex-col items-start justify-start gap-2 sm:gap-3 w-full px-2 sm:px-0">
            <motion.button
              type="button"
              className="flex items-center gap-2 sm:gap-3 text-sm sm:text-lg font-semibold text-softtail-600 hover:text-softtail-600/80 transition-colors duration-300 self-start w-full"
              onClick={() => setOpenModal(true)}
              whileHover={{ scale: 1.05, x: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <span
                className="inline-flex"
                style={{ animation: "icon-pulse-md 1.5s ease-in-out infinite" }}
              >
                <TbCalendar size={20} className="sm:w-6 sm:h-6 text-softtail-400" />
              </span>
              Réservez votre consultation
            </motion.button>
            <AppointmentModal open={openModal} onClose={() => setOpenModal(false)} />
            <motion.div
              onClick={() => window.open('https://maps.app.goo.gl/XGuLd9WbkAQvmSpu6', '_blank', 'noopener,noreferrer')}
              className="flex items-center gap-2 sm:gap-3 text-sm sm:text-lg font-semibold text-softtail-600 hover:underline self-start w-full cursor-pointer"
              whileHover={{ scale: 1.05, x: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <span
                className="inline-flex"
                style={{ animation: "icon-pulse-md 1.5s ease-in-out 0.5s infinite" }}
              >
                <TbMapPin size={20} className="sm:w-6 sm:h-6 text-softtail-400" />
              </span>
              <span className="break-words text-xs sm:text-sm md:text-base">
                Bureau A2.7, 2eme Etage, Le Doyen Medical,<br />
                Av. Fattouma Bourguiba, La Soukra 2036
              </span>
            </motion.div>
            <motion.div
              className="flex items-center gap-2 sm:gap-3 text-sm sm:text-lg font-semibold text-softtail-600 self-start w-full"
              whileHover={{ scale: 1.05, x: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <span
                className="inline-flex"
                style={{ animation: "icon-pulse-md 1.5s ease-in-out 1s infinite" }}
              >
                <TbPhone size={20} className="sm:w-6 sm:h-6 text-softtail-400" />
              </span>
              <a href="tel:+21628451433" className="hover:underline">+216 28 451 433</a>
            </motion.div>
          </div>
        </motion.div>
        <motion.div
          className="flex items-center justify-center w-full"
          initial={{ x: 40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1], delay: 0.06 }}
        >
          <Image
            src="/6.jpg"
            alt="Le cabinet Podomus à La Soukra, Ariana"
            sizes="100vw"
            width={0}
            height={0}
            className="h-auto max-w-xs md:max-w-md w-full object-cover p-3 sm:p-5 rounded-2xl shadow-lg"
          />
        </motion.div>
      </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
