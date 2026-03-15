"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animation/variants";
import { useEffect, useState } from "react";
import { 
  FaHeart, 
  FaAward, 
  FaUsers, 
  FaClock, 
  FaMapMarkerAlt, 
  FaPhone,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaLinkedin
} from "react-icons/fa";
import { 
  TbTargetArrow, 
  TbStethoscope, 
  TbShieldCheck,
  TbStar,
  TbCertificate,
  TbCalendarTime
} from "react-icons/tb";
import { useIsMobile } from "@/hooks/use-mobile";

// Particules flottantes décoratives
function FloatingParticles() {
  const isMobile = useIsMobile();
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => { setMounted(true); }, []);
  
  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      setPositions(Array.from({ length: 15 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * 1200,
      })));
    }
  }, [mounted]);
  
  if (!mounted || positions.length === 0 || isMobile) return null;
  
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {positions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-brand/20 rounded-full blur-sm"
          initial={{ x: pos.x, y: pos.y, opacity: 0 }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * 1200,
            opacity: [0, 0.8, 0.3, 0.8, 0],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  );
}

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState(0);

  const stats = [
    { icon: <FaUsers className="text-3xl" />, number: "500+", label: "Patients Satisfaits" },
    { icon: <FaAward className="text-3xl" />, number: "10+", label: "Années d'Expérience" },
    { icon: <TbCertificate className="text-3xl" />, number: "3", label: "Pays d'Exercice" },
    { icon: <FaHeart className="text-3xl" />, number: "5★", label: "Établissements de Luxe" },
  ];

  const values = [
    {
      icon: <TbStethoscope className="text-4xl" />,
      title: "Expertise Médicale",
      description: "Formation continue et techniques de pointe pour des soins d'excellence.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <FaHeart className="text-4xl" />,
      title: "Bienveillance",
      description: "Accueil chaleureux et accompagnement personnalisé pour chaque patient.",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: <TbShieldCheck className="text-4xl" />,
      title: "Sécurité",
      description: "Hygiène irréprochable et protocoles stricts pour votre sécurité.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <TbTargetArrow className="text-4xl" />,
      title: "Innovation",
      description: "Équipements modernes et techniques innovantes pour des résultats optimaux.",
      color: "from-purple-500 to-purple-600"
    }
  ];

  const timeline = [
    {
      year: "2015",
      title: "Diplôme en Pédicurie-Podologie",
      description: "Diplômée de l'École Supérieure des Sciences et Techniques de la Santé de Sousse, avec une recherche en oncologie au CHU Farhat Hached sur les effets de la chimiothérapie sur les pieds."
    },
    {
      year: "2016",
      title: "Ouverture du Cabinet à Sfax",
      description: "Fondation de son premier cabinet de pédicurie médicale et podologie à Sfax, avec plus de 4 ans de pratique dédiée aux soins podologiques pour tous les âges."
    },
    {
      year: "2021",
      title: "Bastien Gonzalez Studio — Maldives",
      description: "Recrutée comme Podologue et Studio Manager au One&Only Reethi Rah, l'un des resorts les plus exclusifs au monde. Soins d'exception pour une clientèle VIP internationale."
    },
    {
      year: "2023",
      title: "Bastien Gonzalez Studio — Dubaï",
      description: "Nommée Studio Manager au One&Only Royal Mirage à Dubaï. Leadership d'équipe, mentorat et standards cinq étoiles dans un cadre cosmopolite."
    },
    {
      year: "2025",
      title: "Lancement de Podomus",
      description: "Retour en Tunisie avec une vision renouvelée : la création de Podomus, un espace d'excellence en podologie alliant expertise médicale internationale et un savoir-faire hôtelier de luxe."
    }
  ];

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-neutralbg via-white to-neutralbg overflow-x-hidden">
      <FloatingParticles />
      
      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            variants={fadeIn("up", 0)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.span
              className="inline-block px-4 py-2 bg-brand/10 text-brand font-semibold rounded-full text-sm mb-4"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              À PROPOS DE NOUS
            </motion.span>
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-brand mb-4 sm:mb-6"
              variants={fadeIn("up", 0.2)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              Podomus
            </motion.h1>
            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-textmain max-w-3xl mx-auto leading-relaxed px-4"
              variants={fadeIn("up", 0.4)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              Excellence podologique, forgée entre la Tunisie, les Maldives et Dubaï
            </motion.p>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16 px-4"
            variants={fadeIn("up", 0.6)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-4 sm:p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-brand mb-2 sm:mb-3 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-brand mb-1">{stat.number}</div>
                <div className="text-xs sm:text-sm text-textmain">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="relative z-10 py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid md:grid-cols-2 gap-12 items-center"
            variants={fadeIn("up", 0)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div
              variants={fadeIn("right", 0.2)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-brand mb-6">
                Notre Mission
              </h2>
              <p className="text-lg text-textmain mb-6 leading-relaxed">
                Plus qu&apos;un cabinet, Podomus est un espace d&apos;excellence et d&apos;éducation en podologie. 
                Nous combinons expertise médicale, savoir-faire hôtelier de luxe et une approche 
                holistique et préventive de la santé du pied — parce que des pieds sains 
                méritent plus qu&apos;un traitement clinique, ils méritent un soin avec intention.
              </p>
              <div className="flex items-center gap-4">
                <TbTargetArrow className="text-4xl text-brand" />
                <span className="text-lg font-semibold text-brand">Excellence Médicale & Hospitalité</span>
              </div>
            </motion.div>

            <motion.div
              variants={fadeIn("left", 0.4)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-brand to-highlight rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Notre Vision</h3>
                <p className="text-lg mb-6">
                  Apporter en Tunisie le même niveau de soin podologique que celui proposé 
                  dans les meilleurs établissements cinq étoiles au monde — accessible, humain 
                  et centré sur le patient.
                </p>
                <div className="flex items-center gap-2">
                  <TbStar className="text-2xl" />
                  <span className="font-semibold">Qualité & Reconnaissance</span>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-highlight/20 rounded-full blur-xl"></div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Notre Histoire */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            variants={fadeIn("up", 0)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-brand mb-6">
              Notre Histoire
            </h2>
            <p className="text-lg text-textmain max-w-2xl mx-auto">
              Découvrez le parcours qui a fait de Podomus une référence en podologie
            </p>
          </motion.div>

          <motion.div
            className="relative"
            variants={fadeIn("up", 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Timeline */}
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  className={`flex items-center gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className="flex-1">
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                      <div className="text-2xl font-bold text-brand mb-2">{item.year}</div>
                      <h3 className="text-xl font-semibold text-brand mb-2">{item.title}</h3>
                      <p className="text-textmain">{item.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex flex-col items-center">
                    <div className="w-4 h-4 bg-brand rounded-full"></div>
                    {index < timeline.length - 1 && (
                      <div className="w-0.5 h-16 bg-brand/30"></div>
                    )}
                  </div>
                  <div className="flex-1"></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="relative z-10 py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            variants={fadeIn("up", 0)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-brand mb-6">
              Nos Valeurs Fondamentales
            </h2>
            <p className="text-lg text-textmain max-w-2xl mx-auto">
              Les principes qui guident notre pratique quotidienne
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={fadeIn("up", 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="group relative"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-100 group-hover:shadow-xl transition-all duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-brand mb-3">{value.title}</h3>
                  <p className="text-textmain text-sm leading-relaxed">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Notre Équipe */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            variants={fadeIn("up", 0)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-brand mb-6">
              Notre Équipe
            </h2>
            <p className="text-lg text-textmain max-w-2xl mx-auto">
              Des professionnels passionnés dédiés à votre bien-être
            </p>
          </motion.div>

                    <motion.div
            className="flex justify-center"
            variants={fadeIn("up", 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Dr Sonda Affes Ben Mahmoud */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg overflow-hidden group max-w-md"
              whileHover={{ scale: 1.02, y: -5 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative h-80 overflow-hidden">
                <Image
                  src="/sonda.jpg"
                  alt="Dr Sonda Affes Ben Mahmoud"
                  fill
                  className="object-cover object-top group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              <div className="p-8 text-center">
                <h3 className="text-3xl font-bold text-brand mb-3">Sonda Affes</h3>
                <p className="text-highlight font-semibold mb-4 text-lg">Pédicure-Podologue | Fondatrice de Podomus</p>
                <p className="text-textmain mb-6 leading-relaxed">
                  Diplômée de l&apos;ESSTSS de Sousse, Sonda a d&apos;abord fondé son propre cabinet à Sfax 
                  avant de rejoindre les prestigieux Bastien Gonzalez Studios — d&apos;abord au One&amp;Only 
                  Reethi Rah aux Maldives, puis au One&amp;Only Royal Mirage à Dubaï. Spécialisée en 
                  semelles thermoformées, bilans podologiques et soins des pathologies unguéales, 
                  elle a soigné célébrités, athlètes et clientèle VIP à travers le monde. En 2025, 
                  elle revient en Tunisie pour lancer Podomus.
                </p>
                <div className="flex justify-center gap-6">
                  <div className="flex items-center gap-2 text-sm text-textmain">
                    <TbCertificate className="text-brand text-lg" />
                    <span>K-Taping</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-textmain">
                    <TbCalendarTime className="text-brand text-lg" />
                    <span>Depuis 2016</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Citation */}
      <section className="relative z-10 py-16 px-4 bg-gradient-to-r from-brand to-highlight">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            variants={fadeIn("up", 0)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <TbStar className="text-6xl text-white/30 mx-auto mb-6" />
            <blockquote className="text-2xl md:text-3xl font-light text-white mb-6 italic">
              &quot;Des pieds sains méritent plus qu&apos;un traitement clinique — 
              ils méritent un soin avec intention.&quot;
            </blockquote>
            <div className="text-white">
              <p className="text-xl font-semibold">Sonda Affes</p>
              <p className="text-white/80">Fondatrice de Podomus</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="relative z-10 py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            variants={fadeIn("up", 0)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-brand mb-6">
              Nous Contacter
            </h2>
            <p className="text-lg text-textmain max-w-2xl mx-auto">
              Prêt à prendre soin de vos pieds ? Contactez-nous dès aujourd&apos;hui
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={fadeIn("up", 0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div
              className="text-center p-6 rounded-2xl bg-gradient-to-br from-brand/5 to-highlight/5 border border-brand/20"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <FaMapMarkerAlt className="text-4xl text-brand mx-auto mb-4" />
              <h3 className="text-xl font-bold text-brand mb-2">Adresse</h3>
              <p className="text-textmain">
                Bureau BM2 1er Etage<br />
                Imm. Golf Center 2<br />
                Av. De L&apos;environnement<br />
                Dar Fadhal La Soukra 2036
              </p>
            </motion.div>

            <motion.div
              className="text-center p-6 rounded-2xl bg-gradient-to-br from-brand/5 to-highlight/5 border border-brand/20"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <FaClock className="text-4xl text-brand mx-auto mb-4" />
              <h3 className="text-xl font-bold text-brand mb-2">Horaires</h3>
              <p className="text-textmain">
                Lundi - Vendredi: 9h - 18h<br />
                Samedi: 9h - 14h<br />
                Dimanche: Fermé
              </p>
            </motion.div>

            <motion.div
              className="text-center p-6 rounded-2xl bg-gradient-to-br from-brand/5 to-highlight/5 border border-brand/20"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <FaPhone className="text-4xl text-brand mx-auto mb-4" />
              <h3 className="text-xl font-bold text-brand mb-2">Contact</h3>
              <p className="text-textmain mb-2">
                Téléphone: +216 28 451 433<br />
                Email: contact@podomus.tn
              </p>
              <div className="flex justify-center gap-3 mt-4">
                <FaFacebook className="text-2xl text-brand hover:text-highlight cursor-pointer transition-colors" />
                <FaInstagram className="text-2xl text-brand hover:text-highlight cursor-pointer transition-colors" />
                <FaLinkedin className="text-2xl text-brand hover:text-highlight cursor-pointer transition-colors" />
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="text-center mt-12"
            variants={fadeIn("up", 0.4)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.a
              href="/contact"
              className="inline-block bg-brand text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:bg-highlight transition-all duration-300 text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Prendre Rendez-vous
            </motion.a>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 