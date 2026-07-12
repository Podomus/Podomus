"use client";
import Image from "next/image";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/lib/useScrollReveal";

const values: { title: string; text: string; image: string }[] = [
  {
    title: "Formée chez Bastien Gonzalez",
    text: "Dix ans de pratique dans les studios Bastien Gonzalez — aux Maldives, puis à Dubaï — forment une main, un regard, une façon de soigner qui ne ressemble à rien d'autre. La Sonda Affes Ben Mahmoud l'exerce aujourd'hui à Ariana.",
    image: "/a.jpg",
  },
  {
    title: "Votre cas, votre soin",
    text: "Vos pieds ont une histoire — une posture, une douleur que vous portez depuis des années, une chaussure qui a tout aggravé. Le Sonda évalue avant de toucher. Ensuite, et seulement ensuite, elle soigne.",
    image: "/c.jpg",
  },
  {
    title: "Vous revenez parce que ça marche",
    text: "Ce n'est pas un soin qu'on fait une fois et qu'on oublie — c'est un protocole qui s'adapte avec vous dans le temps. Podomus ne traite pas une douleur. Elle suit ce qui la cause.",
    image: "/b.jpg",
  },
];

const ValuesSection = () => {
  const revealRef = useScrollReveal();

  return (
    <section
      className="relative w-full py-16 md:py-24 overflow-hidden"
      style={{ background: '#F8FAFC' }}
      ref={revealRef}
    >
      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-[#E8E4D9]/25 rounded-full blur-3xl pointer-events-none"
        style={{ animation: "blob-pulse 4.5s ease-in-out infinite", willChange: "transform" }} />
      <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-softtail-400/10 rounded-full blur-2xl pointer-events-none"
        style={{ animation: "blob-pulse-b 5.5s ease-in-out 1.5s infinite", willChange: "transform" }} />
      <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-[#E8E4D9]/20 rounded-full blur-xl pointer-events-none"
        style={{ animation: "blob-pulse-c 3.8s ease-in-out 0.8s infinite", willChange: "transform" }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="text-center mb-12"
        >
          <h2 className="inline-flex items-center gap-3 text-2xl md:text-3xl font-bold text-brand" id="Values">
            L'ESPRIT PODOMUS
            <BsFillPatchCheckFill size={36} className="text-highlight" />
          </h2>
        </motion.div>

        {/* Value cards — 3-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {values.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: i * 0.1, ease: [0.23, 1, 0.32, 1] }}
              whileHover={{ y: -4 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={v.image}
                  alt={v.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col p-6">
                <h3 className="text-lg font-bold text-brand mb-2">{v.title}</h3>
                <p className="text-sm text-textmain leading-relaxed flex-1">{v.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
