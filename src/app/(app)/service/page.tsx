"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaStar, FaUserMd, FaRegSmile, FaChevronDown, FaCalendarAlt, FaRunning, FaChild, FaHeart } from "react-icons/fa";
import { TbTargetArrow, TbHeartHandshake, TbShieldCheck, TbSparkles } from "react-icons/tb";
import AppointmentModal from "../../../components/AppointmentModal";
import { useIsMobile } from "../../../hooks/useIsMobile";

// Particules flottantes décoratives
function FloatingParticles() {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Array<{
    id: number;
    initialX: number;
    initialY: number;
    targetX: number;
    targetY: number;
    duration: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        initialX: Math.random() * window.innerWidth,
        initialY: Math.random() * 600,
        targetX: Math.random() * window.innerWidth,
        targetY: Math.random() * 600,
        duration: 8 + Math.random() * 4,
        delay: Math.random() * 3,
      }));
      setParticles(newParticles);
    }
  }, [mounted]);

  if (!mounted || particles.length === 0 || isMobile) return null;

  return (
    <div className="absolute inset-0 z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 bg-brand/20 rounded-full"
          initial={{ 
            x: particle.initialX, 
            y: particle.initialY,
            opacity: 0 
          }}
          animate={{
            x: particle.targetX,
            y: particle.targetY,
            opacity: [0, 1, 0.8, 1, 0]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear",
            delay: particle.delay
          }}
        />
      ))}
    </div>
  );
}

const services = [
  {
    title: "Soins podologiques personnalisés",
    description: "Cors résistants, ongles épaissis, peau fissurée — chaque soin commence par un bilan complet, pas par une liste de prestations standard.",
    image: "/7.jpg",
    icon: <FaUserMd size={32} className="text-brand" />,
    details: {
      points: [
        "Bilan podologique complet",
        "Soins de peau (cors, durillons, callosités)",
        "Soins des ongles (coupe, traitement, reconstruction)",
        "Conseils personnalisés d’hygiène et de prévention",
        "Suivi post-soin et recommandations sur-mesure"
      ],
      image: "/7.jpg",
      extra: "Parce qu'un pied traité à la légère revient toujours vous voir."
    }
  },
  {
    title: "Soin du Pied Diabétique",
    description: "Le pied diabétique ne pardonne pas les petites négligences — une plaie mal surveillée peut évoluer vite. On examine la vascularisation, la sensibilité, et on traite chaque callosité avant qu'elle ne devienne un risque.",
    image: "/9.jpg",
    icon: <FaHeart size={32} className="text-brand" />,
    details: {
      points: [
        "Examen vasculaire et neurologique",
        "Soins préventifs des ongles et callosités",
        "Détection précoce des plaies et ulcères",
        "Conseils hygiène et chaussage adaptés",
        "Suivi régulier et coordination médicale"
      ],
      image: "/9.jpg",
      extra: "Un suivi régulier qui peut, littéralement, préserver un pied."
    }
  },
  {
    title: "Orthoplastie & orthonyxie",
    description: "L’orthoplastie redresse un orteil en griffe. L’orthonyxie libère un ongle incarné sans chirurgie. Des appareillages sur mesure, discrets, qu’on porte sans y penser.",
    image: "/8.jpg",
    icon: <TbTargetArrow size={32} className="text-highlight" />,
    details: {
      points: [
        "Orthoplasties sur-mesure pour orteils déformés",
        "Orthonyxies pour ongles incarnés ou déformés",
        "Soulagement immédiat des douleurs",
        "Appareillages discrets et confortables"
      ],
      image: "/8.jpg",
      extra: "Le bon appareillage change souvent tout dès le premier rendez-vous."
    }
  },
  {
    title: "Traitement laser",
    description: "Le laser traite les mycoses de l'ongle et les verrues plantaires sans douleur, sans arrêt de travail. Quelques séances — pas d'excision, pas d'acide.",
    image: "/laser.jpg",
    icon: <TbSparkles size={32} className="text-brand" />,
    details: {
      points: [
        "Traitement des mycoses de l’ongle (onychomycose)",
        "Traitement des verrues plantaires",
        "Séance d'environ 20 minutes, sans anesthésie",
        "Résultats progressifs et visibles après quelques séances"
      ],
      image: "/laser.jpg",
      extra: "Aucune douleur. Des résultats visibles."
    }
  },
  {
    title: "Conseils et suivi",
    description: "La plupart des récidives arrivent parce que le suivi s’arrête après la guérison initiale. Nous continuons — pour les sportifs, les enfants, les patients diabétiques.",
    image: "/10.jpg",
    icon: <TbHeartHandshake size={32} className="text-highlight" />,
    details: {
      points: [
        "Conseils d’hygiène personnalisés",
        "Prévention des récidives",
        "Suivi post-soin régulier",
        "Accompagnement pour sportifs, enfants, seniors"
      ],
      image: "/10.jpg",
      extra: "Le soin s'arrête. Le suivi, non."
    }
  },
];

const whyPodomus = [
  { icon: <TbShieldCheck size={28} className="text-brand" />, text: "10 ans d'expérience, dont les studios Bastien Gonzalez" },
  { icon: <TbSparkles size={28} className="text-highlight" />, text: "Laser thérapeutique, orthonyxie, semelles sur mesure" },
  { icon: <FaRegSmile size={28} className="text-brand" />, text: "Cabinet privé, sur rendez-vous uniquement, à Ariana" },
  { icon: <FaCheckCircle size={28} className="text-highlight" />, text: "Des résultats qui tiennent — pas des soins à répéter sans fin" },
];

const testimonials = [
  {
    name: "Sonia B.",
    text: "Je venais pour un ongle incarné chronique. Après l’orthonyxie, c’est réglé depuis plus de huit mois.",
    image: "/a.jpg",
    stars: 5,
  },
  {
    name: "Karim D.",
    text: "Le laser a éliminé une mycose de l'ongle que j'avais depuis deux ans. Trois séances ont suffi.",
    image: "/b.jpg",
    stars: 5,
  },
  {
    name: "Leila M.",
    text: "Les semelles ont changé ma posture et mes douleurs de dos ont disparu. Je n'avais pas fait le lien.",
    image: "/c.jpg",
    stars: 5,
  },
];

const faqs = [
  {
    question: "Quels types de soins proposez-vous ?",
    answer: "Bilan podologique complet, soins des cors et durillons, orthoplastie, orthonyxie, laser thérapeutique pour mycoses et verrues plantaires, semelles sur mesure, et suivi du pied diabétique.",
  },
  {
    question: "Le traitement laser est-il douloureux ?",
    answer: "Non. Le laser traite les mycoses de l'ongle et les verrues plantaires sans anesthésie, sans arrêt de travail. La séance dure environ vingt minutes.",
  },
  {
    question: "Comment prendre rendez-vous ?",
    answer: "Via le formulaire en ligne ou par téléphone. Nous recevons sur rendez-vous uniquement — pour que chaque patient ait le temps dont il a besoin.",
  },
  {
    question: "Les soins sont-ils adaptés aux enfants ?",
    answer: "Oui. Nous suivons les pieds plats, les pieds valgus, les boiteries et les déformations de croissance — dès les premières années de marche.",
  },
];

const specializedServices = [
  {
    title: "Horaires & Rendez-vous",
    description: "Prenez rendez-vous en ligne — à l'heure qui vous convient, sans attendre.",
    icon: <FaCalendarAlt className="text-4xl text-blue-600" />,
    link: "/service/schedule",
    color: "from-blue-500 to-blue-600",
    bgColor: "from-blue-50 to-indigo-100",
    image: "/5.jpg"
  },
  {
    title: "Services pour Sportifs",
    description: "Fasciite plantaire, tendinites, analyse de la foulée — pour continuer à vous entraîner sans compenser.",
    icon: <FaRunning className="text-4xl text-green-600" />,
    link: "/service/sportif",
    color: "from-green-500 to-green-600",
    bgColor: "from-green-50 to-blue-100",
    image: "/sport.jpg"
  },
  {
    title: "Soins pour Enfants",
    description: "Pied plat, pied valgus, boiteries — traiter tôt, c'est souvent éviter une orthèse à l'adolescence.",
    icon: <FaChild className="text-4xl text-pink-600" />,
    link: "/service/children",
    color: "from-pink-500 to-pink-600",
    bgColor: "from-pink-50 to-blue-100",
    image: "/child.jpg"
  },
  {
    title: "Soins pour Seniors",
    description: "Cors, durillons, ongles épaissis, prévention des chutes — pour rester debout et autonome.",
    icon: <FaHeart className="text-4xl text-red-600" />,
    link: "/service/old-people",
    color: "from-red-500 to-red-600",
    bgColor: "from-red-50 to-orange-100",
    image: "/old.jpg"
  }
];

export default function ServicesPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [openDetail, setOpenDetail] = useState<number | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useIsMobile();

  // Effet de transition de page
  useEffect(() => {
    setPageLoaded(true);
  }, []);



  return (
    <main className="relative min-h-screen bg-neutralbg py-0 px-0 flex flex-col items-center justify-center">
      {/* Animation de transition de page */}
      <AnimatePresence>
        {!pageLoaded && (
          <motion.div
            className="fixed inset-0 z-50 bg-brand flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <motion.div
              className="text-white text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.div
                className="w-16 h-16 mx-auto mb-4 border-4 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <motion.h2
                className="text-2xl font-bold mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                Podomus
              </motion.h2>
              <motion.p
                className="text-white/80"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Chargement des services...
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Particules flottantes */}
      <FloatingParticles />
      {/* Dégradé animé très doux */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ background: "linear-gradient(120deg, #f5f5f5 60%, #e6f4ef 100%)" }}
        initial={{ opacity: 0.7, scale: 1 }}
        animate={{ opacity: [0.7, 0.9, 0.7], scale: [1, 1.02, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Hero Section */}
      <motion.section 
        className="relative w-full flex flex-col items-center justify-center py-20 md:py-32 overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
      >
        {/* Fond animé dynamique */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ 
            background: "radial-gradient(circle at 30% 30%, #40826d15 0%, transparent 50%), radial-gradient(circle at 70% 70%, #40826d10 0%, transparent 50%)" 
          }}
          animate={{ 
            background: [
              "radial-gradient(circle at 30% 30%, #40826d15 0%, transparent 50%), radial-gradient(circle at 70% 70%, #40826d10 0%, transparent 50%)",
              "radial-gradient(circle at 70% 30%, #40826d15 0%, transparent 50%), radial-gradient(circle at 30% 70%, #40826d10 0%, transparent 50%)",
              "radial-gradient(circle at 30% 30%, #40826d15 0%, transparent 50%), radial-gradient(circle at 70% 70%, #40826d10 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Particules spéciales pour le hero */}
        <FloatingParticles />

        {/* Titre principal */}
        <motion.div className="relative z-10 text-center mb-6 sm:mb-8 px-4">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black text-brand mb-4 sm:mb-6"
            initial={{ y: 80, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <span className="block">Nos Services</span>
            <span className="block text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mt-1 sm:mt-2 text-highlight">
              Podologiques
            </span>
          </motion.h1>

          {/* Ligne décorative animée */}
          <motion.div
            className="w-32 h-1 bg-gradient-to-r from-brand via-highlight to-brand mx-auto rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          />
        </motion.div>

        {/* Description avec effet de typewriter */}
        <motion.div
          className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 mb-12"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 shadow-2xl border border-white/20"
            whileHover={{ 
              scale: 1.02, 
              boxShadow: "0 20px 60px rgba(64, 130, 109, 0.2)",
              borderColor: "#40826D"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.p
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-textmain text-center leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                Dix ans de podologie clinique,
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.4 }}
              >
                des techniques éprouvées —
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.6 }}
              >
                 orthoplastie, laser,
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.8 }}
              >
                semelles sur mesure —
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 2.0 }}
              >
                {' '} et un regard formé
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 2.2 }}
              >
                 aux studios Bastien Gonzalez.
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 2.4 }}
              >
                {' '}Maintenant à Ariana.
              </motion.span>
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Image hero avec effets avancés */}
        <motion.div
          className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6"
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 1, ease: "easeOut" }}
        >
          <motion.div
            className="relative w-full h-64 sm:h-72 md:h-96 lg:h-[500px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl"
            whileHover={{ 
              scale: 1.05,
              rotateY: 5,
              rotateX: 2
            }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <Image
              src="/5.jpg"
              alt="Podomus Hero"
              fill
              className="object-cover w-full h-full rounded-3xl"
              sizes="100vw"
              priority
            />
            
            {/* Effets de lumière dynamiques */}
            <motion.div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{ 
                background: "radial-gradient(circle at 40% 30%, rgba(64,130,109,0.3) 0%, transparent 60%), radial-gradient(circle at 60% 70%, rgba(91,160,138,0.2) 0%, transparent 60%)" 
              }}
              animate={{ 
                opacity: [0.3, 0.6, 0.3],
                background: [
                  "radial-gradient(circle at 40% 30%, rgba(64,130,109,0.3) 0%, transparent 60%), radial-gradient(circle at 60% 70%, rgba(91,160,138,0.2) 0%, transparent 60%)",
                  "radial-gradient(circle at 60% 30%, rgba(64,130,109,0.3) 0%, transparent 60%), radial-gradient(circle at 40% 70%, rgba(91,160,138,0.2) 0%, transparent 60%)",
                  "radial-gradient(circle at 40% 30%, rgba(64,130,109,0.3) 0%, transparent 60%), radial-gradient(circle at 60% 70%, rgba(91,160,138,0.2) 0%, transparent 60%)"
                ]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Bordure lumineuse animée */}
            <motion.div
              className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{ 
                background: "linear-gradient(45deg, transparent 30%, rgba(64,130,109,0.3) 50%, transparent 70%)",
                backgroundSize: "200% 200%"
              }}
              animate={{ 
                backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />


          </motion.div>
        </motion.div>
      </motion.section>
      {/* Séparateur animé */}
      <motion.div className="w-full h-12 flex items-center justify-center overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <motion.div
          className="w-2/3 h-1 bg-gradient-to-r from-transparent via-brand to-transparent rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: [0, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ originX: 0.5 }}
        />
      </motion.div>
      {/* Grille de services */}
      <section className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center justify-center py-8 px-4 sm:px-6 md:px-8">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-10 w-full">
          {services.map((service, i) => (
            <div key={service.title} className="relative" id={[
              "soins",
              "orthoplastie",
              "laser",
              "conseils"
            ][i]}>
              <motion.div
                className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 flex flex-col items-center group relative overflow-hidden border border-transparent cursor-pointer w-full min-h-[280px] sm:min-h-[320px]"
                initial={false}
                animate={false}
                transition={undefined}
                whileHover={{ scale: 1.05, boxShadow: "0 12px 40px 0 rgba(64, 130, 109, 0.18)", borderColor: "#40826D" }}
                onClick={() => setOpenDetail(openDetail === i ? null : i)}
              >
                <motion.div
                  className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-brand/10 mb-4 shadow"
                  initial={false}
                  animate={false}
                  transition={undefined}
                >
                  {service.icon}
                </motion.div>
                <motion.div
                  className="relative w-full h-32 sm:h-36 md:h-44 lg:h-48 mb-4 rounded-xl sm:rounded-2xl overflow-hidden"
                  initial={false}
                  animate={false}
                  transition={undefined}
                  whileHover={{ scale: 1.07, rotate: [0, 2, -2, 0] }}
                >
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover w-full h-full rounded-2xl transition-[transform,filter] duration-300 group-hover:brightness-110 group-hover:scale-105"
                    sizes="100vw"
                  />
                  {/* Lueur animée */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    initial={false}
                    animate={false}
                    transition={undefined}
                    style={{ background: "radial-gradient(circle at 60% 40%, rgba(64,130,109,0.10) 0%, transparent 70%)" }}
                  />
                </motion.div>
                <motion.h3
                  className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-brand mb-2 text-center"
                  initial={false}
                  animate={false}
                  transition={undefined}
                >
                  {service.title}
                </motion.h3>
                <motion.p
                  className="text-xs sm:text-sm md:text-base text-gray-700 text-center"
                  initial={false}
                  animate={false}
                  transition={undefined}
                >
                  {service.description}
                </motion.p>
              </motion.div>
              <AnimatePresence>
                {openDetail === i && (
                  <motion.div
                    key={service.title + "-details"}
                    className="mt-4 bg-white rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4 md:p-6 z-20 border border-brand/20 w-full"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <div className="flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-6 items-center">
                      <div className="flex-1">
                        <h4 className="text-base sm:text-lg md:text-xl font-bold text-brand mb-2">Détails</h4>
                        <ul className="list-disc pl-4 sm:pl-5 mb-2 text-gray-700 text-xs sm:text-sm md:text-base">
                          {service.details.points.map((pt, idx) => (
                            <li key={idx}>{pt}</li>
                          ))}
                        </ul>
                        <p className="text-xs sm:text-sm text-highlight font-semibold mb-2">{service.details.extra}</p>
                        <button
                          className="mt-2 text-brand font-semibold underline hover:text-highlight transition text-xs sm:text-sm md:text-base"
                          onClick={e => { e.stopPropagation(); setOpenDetail(null); }}
                        >
                          Fermer
                        </button>
                      </div>
                      <div className="flex-1 flex items-center justify-center">
                        <Image
                          src={service.details.image}
                          alt={service.title + " détail"}
                          width={120}
                          height={120}
                          className="rounded-lg sm:rounded-xl shadow-lg object-cover w-20 h-20 sm:w-24 sm:h-24 md:w-36 md:h-36 lg:w-44 lg:h-44"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
      {/* Séparateur animé */}
      <motion.div className="w-full h-12 flex items-center justify-center overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <motion.div
          className="w-2/3 h-1 bg-gradient-to-r from-transparent via-highlight to-transparent rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: [0, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ originX: 0.5 }}
        />
      </motion.div>
      {/* Pourquoi choisir Podomus ? */}
      <section className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6">
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand text-center mb-6 sm:mb-8 relative group"
          initial={false}
          animate={false}
          transition={undefined}
        >
          Pourquoi choisir Podomus ?
          <motion.span
            className="absolute -bottom-2 h-1 w-0 bg-highlight group-hover:w-1/2 rounded transition-[width] duration-300"
            initial={{ width: 0 }}
            whileHover={{ width: "50%" }}
            style={{ left: "25%" }}
          />
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 w-full">
          {whyPodomus.map((item, i) => (
            <motion.div
              key={item.text}
              className="flex items-center gap-3 sm:gap-4 bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6"
              initial={false}
              animate={false}
              transition={undefined}
              whileHover={{ scale: 1.04, boxShadow: "0 8px 32px 0 rgba(64, 130, 109, 0.18)" }}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="text-sm sm:text-base md:text-lg font-semibold text-brand">{item.text}</span>
            </motion.div>
          ))}
        </div>
      </section>
      {/* Séparateur animé */}
      <motion.div className="w-full h-12 flex items-center justify-center overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <motion.div
          className="w-2/3 h-1 bg-gradient-to-r from-transparent via-brand to-transparent rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: [0, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ originX: 0.5 }}
        />
      </motion.div>
      {/* Témoignages clients */}
      <section className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6">
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand text-center mb-6 sm:mb-8 relative group"
          initial={false}
          animate={false}
          transition={undefined}
        >
          Ils nous font confiance
          <motion.span
            className="absolute -bottom-2 h-1 w-0 bg-highlight group-hover:w-1/2 rounded transition-[width] duration-300"
            initial={{ width: 0 }}
            whileHover={{ width: "50%" }}
            style={{ left: "25%" }}
          />
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 w-full">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col items-center group relative overflow-hidden border border-transparent"
              initial={false}
              animate={false}
              transition={undefined}
              whileHover={{ scale: 1.05, boxShadow: "0 12px 40px 0 rgba(64, 130, 109, 0.18)", borderColor: "#40826D" }}
            >
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-3 sm:mb-4 rounded-full overflow-hidden border-4 border-highlight">
                <Image
                  src={t.image}
                  alt={t.name}
                  fill
                  className="object-cover w-full h-full"
                  sizes="100vw"
                />
              </div>
              <div className="flex gap-1 mb-2">
                {Array.from({ length: t.stars }).map((_, idx) => (
                  <FaStar key={idx} className="text-highlight text-sm sm:text-base" />
                ))}
              </div>
              <p className="text-base text-gray-700 text-center mb-2">“{t.text}”</p>
              <span className="text-xs sm:text-sm font-semibold text-brand">{t.name}</span>
            </motion.div>
          ))}
        </div>
      </section>
      {/* Séparateur animé */}
      <motion.div className="w-full h-12 flex items-center justify-center overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <motion.div
          className="w-2/3 h-1 bg-gradient-to-r from-transparent via-highlight to-transparent rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: [0, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ originX: 0.5 }}
        />
      </motion.div>
      {/* FAQ animée */}
      <section className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center justify-center py-12">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-brand text-center mb-8 relative group"
          initial={false}
          animate={false}
          transition={undefined}
        >
          Questions Fréquentes
          <motion.span
            className="absolute -bottom-2 h-1 w-0 bg-highlight group-hover:w-1/2 rounded transition-[width] duration-300"
            initial={{ width: 0 }}
            whileHover={{ width: "50%" }}
            style={{ left: "25%" }}
          />
        </motion.h2>
        <div className="w-full flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.question}
              className="bg-white rounded-xl shadow-md p-4"
              initial={false}
              animate={false}
              transition={undefined}
            >
              <button
                className="flex items-center justify-between w-full text-lg font-semibold text-brand focus:outline-none"
                onClick={() => setFaqOpen(faqOpen === i ? null : i)}
              >
                <span>{faq.question}</span>
                <motion.span animate={{ rotate: faqOpen === i ? 180 : 0 }} transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}>
                  <FaChevronDown />
                </motion.span>
              </button>
              <AnimatePresence>
                {faqOpen === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                    className="overflow-hidden mt-2"
                  >
                    <p className="text-base text-gray-700">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>
      

      {/* Services Spécialisés */}
      <div
        className="relative z-10 w-full max-w-7xl mx-auto px-4 py-12"
      >
        <div
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Soins par profil de patient
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {specializedServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.3, delay: index * 0.05, ease: [0.23, 1, 0.32, 1] }}
                className="group"
              >
                <Link href={service.link}>
                  <div className={`relative bg-gradient-to-br ${service.bgColor} rounded-2xl shadow-xl p-8 h-full hover:shadow-2xl transition-[transform,box-shadow] duration-300 hover:scale-105 cursor-pointer flex flex-col overflow-hidden`}>
                    {/* Image d'arrière-plan */}
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent"></div>
                    </div>
                    
                    {/* Contenu de la carte */}
                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex justify-center mb-6">
                        <div className="group-hover:scale-110 transition-transform duration-300">
                          {service.icon}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 text-center group-hover:text-gray-800 transition-colors duration-300">
                        {service.title}
                      </h3>
                      <p className="text-gray-700 text-center mb-6 flex-grow group-hover:text-gray-600 transition-colors duration-300">
                        {service.description}
                      </p>
                      <div className="text-center mt-auto">
                        <span className={`inline-block bg-gradient-to-r ${service.color} text-white font-semibold py-2 px-6 rounded-lg transition-[transform,box-shadow] duration-200 group-hover:scale-105 group-hover:shadow-lg`}>
                          Découvrir
                        </span>
                      </div>
                    </div>
                    
                    {/* Effet de brillance au survol */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pourquoi nous choisir */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Ce qui distingue Podomus
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-brand/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaUserMd className="text-2xl text-brand" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Expertise Reconnue</h3>
              <p className="text-gray-600">
                Dr. Sonda Affes Ben Mahmoud — 10 ans de pratique, formée dans les établissements Bastien Gonzalez à Dubaï et aux Maldives.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-highlight/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TbTargetArrow className="text-2xl text-highlight" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Approche Personnalisée</h3>
              <p className="text-gray-600">
                Un bilan complet à chaque première consultation — pas de protocole automatique, pas de soin standard.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-500/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TbSparkles className="text-2xl text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Technologies Modernes</h3>
              <p className="text-gray-600">
                Laser thérapeutique, orthonyxie, orthoplastie sur mesure : les mêmes outils qu'en cabinet de luxe, accessibles en consultation de ville.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      {/* Call to action */}
      <section className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center justify-center py-12">
        <motion.div
          className="bg-brand rounded-2xl shadow-xl p-8 flex flex-col items-center w-full"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        >
          <motion.h3
            className="text-2xl font-bold text-white mb-4 text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.25, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          >
            Votre premier bilan est à un rendez-vous.
          </motion.h3>
          <button
            onClick={() => setOpenModal(true)}
            className="bg-white text-brand px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-[transform,box-shadow] duration-150 active:scale-[0.97] flex items-center gap-2 group text-lg mt-2"
          >
            Prendre rendez-vous
          </button>
          <AppointmentModal open={openModal} onClose={() => setOpenModal(false)} />
        </motion.div>
      </section>

      <AppointmentModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </main>
  );
} 