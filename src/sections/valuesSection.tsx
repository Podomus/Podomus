"use client";
import Image from "next/image";

import { BsFillPatchCheckFill } from "react-icons/bs";

import { motion } from "framer-motion";
import { fadeIn } from "../lib/animation/variants";
import { useScrollReveal } from "@/lib/useScrollReveal";

const values: { title: string; text: string }[] = [
  {
    title: "Formée chez Bastien Gonzalez",
    text: "Dix ans de pratique dans les studios Bastien Gonzalez — aux Maldives, puis à Dubaï — forment une main, un regard, une façon de soigner qui ne ressemble à rien d'autre. La Docteure Sonda Affes Ben Mahmoud l'exerce aujourd'hui à Ariana.",
  },
  {
    title: "Votre cas, votre soin",
    text: "Vos pieds ont une histoire — une posture, une douleur que vous portez depuis des années, une chaussure qui a tout aggravé. Le Dr. Sonda évalue avant de toucher. Ensuite, et seulement ensuite, elle soigne.",
  },
  {
    title: "Vous revenez parce que ça marche",
    text: "Ce n'est pas un soin qu'on fait une fois et qu'on oublie — c'est un protocole qui s'adapte avec vous dans le temps. Podomus ne traite pas une douleur. Elle suit ce qui la cause.",
  },
];

const ValuesSection = () => {
  const revealRef = useScrollReveal();

  return (
    <section
      className="relative mx-auto flex  w-full flex-col items-center justify-center gap-10 bg-cover bg-center bg-no-repeat py-5 md:py-16 3xl:max-w-[1580px] 3xl:rounded-2xl"
      style={{
        background: '#F8FAFC'
      }}
      ref={revealRef}
    >
      {/* Formes organiques avec soft teal */}
      <div
        className="absolute top-1/4 left-1/4 w-40 h-40 bg-[#E8E4D9]/25 rounded-full blur-3xl"
        style={{ animation: "blob-pulse 4.5s ease-in-out infinite", willChange: "transform" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-softtail-400/10 rounded-full blur-2xl"
        style={{ animation: "blob-pulse-b 5.5s ease-in-out 1.5s infinite", willChange: "transform" }}
      />
      <div
        className="absolute top-1/2 left-1/2 w-24 h-24 bg-[#E8E4D9]/20 rounded-full blur-xl"
        style={{ animation: "blob-pulse-c 3.8s ease-in-out 0.8s infinite", willChange: "transform" }}
      />

      <motion.div
        variants={fadeIn("right", 0)}
        initial="hidden"
        animate="show"
        exit="hidden"
        className="relative mx-auto flex w-full flex-col items-center justify-center gap-6 bg-cover bg-center bg-no-repeat py-0 md:py-0 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#F8FAFC' }}
      >
        <motion.h2
          data-reveal
          className="flex items-center justify-center gap-5 text-2xl md:text-3xl font-bold text-brand "
          id="Values"
          initial={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        >
          L’ESPRIT PODOMUS <BsFillPatchCheckFill size={50} className="text-highlight" />
        </motion.h2>

                 <div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-3 gap-8 w-full max-w-5xl mx-auto items-stretch p-8 sm:p-12 lg:p-16">
          {/* Ligne 1 : image 1 + valeur 1 */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1], delay: 0.05 }}
            whileHover={{ scale: 1.05, boxShadow: "0 8px 32px 0 rgba(199,21,133,0.15)" }}
            className="w-full rounded-xl overflow-hidden shadow-md flex-1 row-span-1"
          >
            <Image
              src="/a.jpg"
              alt="Podomus podologie 1"
              className="aspect-auto h-full w-full object-cover transition-transform duration-200"
              sizes="100vw"
              width={0}
              height={0}
            />
          </motion.div>
          <motion.div
            data-reveal
            key={0}
            initial={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.05, ease: [0.23, 1, 0.32, 1] }}
            whileHover={{ scale: 1.02, boxShadow: "0 8px 32px 0 rgba(64,130,109,0.12)" }}
            className="w-full max-w-3xl rounded-2xl overflow-hidden transition-transform flex-1 row-span-1"
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
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1], delay: 0.05 }}
            whileHover={{ scale: 1.05, boxShadow: "0 8px 32px 0 rgba(199,21,133,0.15)" }}
            className="w-full rounded-xl overflow-hidden shadow-md flex-1 row-span-1"
          >
            <Image
              src="/c.jpg"
              alt="Podomus podologie 2"
              className="aspect-auto h-full w-full object-cover transition-transform duration-200"
              sizes="100vw"
              width={0}
              height={0}
            />
          </motion.div>
          <motion.div
            data-reveal
            key={1}
            initial={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            whileHover={{ scale: 1.02, boxShadow: "0 8px 32px 0 rgba(64,130,109,0.12)" }}
            className="w-full max-w-3xl rounded-2xl overflow-hidden transition-transform flex-1 row-span-1"
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
            data-reveal
            key={2}
            initial={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
            whileHover={{ scale: 1.02, boxShadow: "0 8px 32px 0 rgba(64,130,109,0.12)" }}
            className="w-full max-w-3xl rounded-2xl overflow-hidden transition-transform flex-1 row-span-1 mx-auto mt-[80px]"
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
