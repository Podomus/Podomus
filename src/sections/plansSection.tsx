"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { TbCalendar, TbShieldCheck, TbMapPin } from "react-icons/tb";
import { motion } from "framer-motion";
import { fadeIn } from "../lib/animation/variants";
import { useInView } from "react-intersection-observer";
import AppointmentModal from "../components/AppointmentModal";

const trustPoints = [
  {
    icon: <TbCalendar size={28} />,
    title: "Rendez-vous rapide",
    text: "Disponible du lundi au vendredi, 9h30 à 16h30",
  },
  {
    icon: <TbShieldCheck size={28} />,
    title: "Soins certifiés",
    text: "Par une pédicure-podologue diplômée d'État",
  },
  {
    icon: <TbMapPin size={28} />,
    title: "Cabinet à La Soukra",
    text: "Bureau A2.7, 2eme Etage, Le Doyen Medical, La Soukra",
  },
];

const EASE = [0.23, 1, 0.32, 1] as const;

const PlansSection = () => {
  const [openModal, setOpenModal] = useState(false);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <>
      <section
        id="Plans"
        ref={ref}
        className="relative w-full overflow-hidden bg-mainbg py-16 md:py-24"
      >
        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 sm:px-6 lg:px-8">
          {/* Headline */}
          <motion.h2
            variants={fadeIn("up", 0)}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="text-center text-3xl font-bold leading-tight text-textmain sm:text-4xl md:text-5xl"
          >
            Prenez soin de vos pieds dès aujourd&apos;hui
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            variants={fadeIn("up", 0.07)}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="mt-5 max-w-2xl text-center text-sm font-light leading-relaxed text-textmain/70 sm:text-base md:text-lg"
          >
            Consultez Sonda Affes Ben Mahmoud au cabinet Podomus à La Soukra.
            Un bilan complet, des soins personnalisés, et un suivi professionnel —
            tout commence par un rendez-vous.
          </motion.p>

          {/* Trust points */}
          <motion.div
            variants={fadeIn("up", 0.14)}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="mt-10 grid w-full grid-cols-1 gap-5 sm:grid-cols-3"
          >
            {trustPoints.map((point, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center gap-4 rounded-2xl bg-white p-8 text-center shadow-sm hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ duration: 0.3, ease: EASE, delay: 0.18 + i * 0.07 }}
                whileHover={{ y: -4 }}
              >
                <span className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand/10 text-brand">
                  {point.icon}
                </span>
                <h3 className="text-base font-bold text-textmain">{point.title}</h3>
                <p className="text-sm font-light text-textmain/60">{point.text}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            variants={fadeIn("up", 0.28)}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="mt-10 flex flex-col items-center gap-4"
          >
            <Button
              onPress={() => setOpenModal(true)}
              className="h-14 min-w-[220px] rounded-full bg-softtail-600 px-8 text-base font-semibold text-white shadow-md transition-all duration-200 hover:bg-softtail-700 hover:shadow-lg active:scale-[0.97]"
            >
              Prendre rendez-vous
            </Button>

            <p className="text-sm font-medium text-textmain/50 transition-colors duration-150 hover:text-brand">
              Ou appelez le <a href="tel:+21628451433" className="hover:underline text-brand">+216 28 451 433</a>
            </p>
          </motion.div>
        </div>
      </section>

      <AppointmentModal open={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
};

export default PlansSection;
