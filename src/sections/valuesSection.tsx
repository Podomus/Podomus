"use client";
import Image from "next/image";

import { BsFillPatchCheckFill } from "react-icons/bs";

import { motion } from "framer-motion";
import { fadeIn } from "../lib/animation/variants";
import { useInView } from "react-intersection-observer";

const values: { title: string; text: string }[] = [
  {
    title: "Excellence & Signature",
    text: "La Docteure Sonda Affes Ben Mahmoud garantit un accompagnement d'exception, dans la plus grande discrétion.",
  },
  {
    title: "Sur-mesure & Confort",
    text: "Chaque soin est adapté à vos besoins, pour un confort absolu.",
  },
  {
    title: "Prestige & Confiance",
    text: "Podomus s’adresse à une clientèle exigeante, en quête de résultats irréprochables.",
  },
];

const ValuesSection = () => {
  const [ref, inView] = useInView({ triggerOnce: false });
  const [refQuote, inViewQuote] = useInView({ triggerOnce: false });

  return (
    <section
      className="relative mx-auto flex  w-full flex-col items-center justify-center gap-10 bg-cover bg-center bg-no-repeat py-5 md:py-16 3xl:max-w-[1580px] 3xl:rounded-2xl"
      style={{
        background: '#F8FAFC'
      }}
      ref={ref}
    >
      {/* Formes organiques avec soft teal */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-40 h-40 bg-[#E8E4D9]/25 rounded-full blur-3xl"
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
        className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-softtail-400/10 rounded-full blur-2xl"
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
        className="absolute top-1/2 left-1/2 w-24 h-24 bg-[#E8E4D9]/20 rounded-full blur-xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 3.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.8,
        }}
      />

      <motion.div
        variants={fadeIn("right", 0)}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        exit="hidden"
        className="relative mx-auto flex w-full flex-col items-center justify-center gap-6 bg-cover bg-center bg-no-repeat py-0 md:py-0 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F8FAFC' }}
      >
        <motion.h2
          className="flex items-center justify-center gap-5 text-2xl md:text-3xl font-bold text-brand "
          id="Values"
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          L’ESPRIT PODOMUS <BsFillPatchCheckFill size={50} className="text-highlight" />
        </motion.h2>

                 <div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-3 gap-8 w-full max-w-5xl mx-auto items-stretch p-8 sm:p-12 lg:p-16">
          {/* Ligne 1 : image 1 + valeur 1 */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
            whileHover={{ scale: 1.05, boxShadow: "0 8px 32px 0 rgba(199,21,133,0.15)" }}
            className="w-full rounded-xl overflow-hidden shadow-md flex-1 row-span-1"
          >
            <Image
              src="/a.jpg"
              alt="Podomus podologie 1"
              className="aspect-auto h-full w-full object-cover transition-all duration-300"
              sizes="100vw"
              width={0}
              height={0}
            />
          </motion.div>
          <motion.div
            key={0}
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
            whileHover={{ scale: 1.04, boxShadow: "0 8px 32px 0 rgba(64,130,109,0.15)" }}
            className="w-full max-w-3xl rounded-2xl overflow-hidden transition-all flex-1 row-span-1"
          >
            <p className="mx-auto w-[80%] rounded-t-2xl bg-brand p-2 font-bold text-white md:w-[60%]">
              {values[0].title}
            </p>
            <p className="rounded-2xl bg-white p-2 text-sm font-light text-textmain md:text-base xl:text-lg">
              {values[0].text}
            </p>
          </motion.div>
          {/* Ligne 2 : image 2 + valeur 2 */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
            whileHover={{ scale: 1.05, boxShadow: "0 8px 32px 0 rgba(199,21,133,0.15)" }}
            className="w-full rounded-xl overflow-hidden shadow-md flex-1 row-span-1"
          >
            <Image
              src="/c.jpg"
              alt="Podomus podologie 2"
              className="aspect-auto h-full w-full object-cover transition-all duration-300"
              sizes="100vw"
              width={0}
              height={0}
            />
          </motion.div>
          <motion.div
            key={1}
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.65, ease: "easeOut" }}
            whileHover={{ scale: 1.04, boxShadow: "0 8px 32px 0 rgba(64,130,109,0.15)" }}
            className="w-full max-w-3xl rounded-2xl overflow-hidden transition-all flex-1 row-span-1"
          >
            <p className="mx-auto w-[80%] rounded-t-2xl bg-brand p-2 font-bold text-white md:w-[60%]">
              {values[1].title}
            </p>
            <p className="rounded-2xl bg-white p-2 text-sm font-light text-textmain md:text-base xl:text-lg">
              {values[1].text}
            </p>
          </motion.div>
          {/* Ligne 3 : cellule vide + valeur 3 centrée */}
          <div className="hidden lg:block" />
          <motion.div
            key={2}
            initial={{ y: 40, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, delay: 0.8, ease: "easeOut" }}
            whileHover={{ scale: 1.04, boxShadow: "0 8px 32px 0 rgba(64,130,109,0.15)" }}
            className="w-full max-w-3xl rounded-2xl overflow-hidden transition-all flex-1 row-span-1 mx-auto mt-[80px]"
          >
            <p className="mx-auto w-[80%] rounded-t-2xl bg-brand p-2 font-bold text-white md:w-[60%]">
              {values[2].title}
            </p>
            <p className="rounded-2xl bg-white p-2 text-sm font-light text-textmain md:text-base xl:text-lg">
              {values[2].text}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default ValuesSection;
