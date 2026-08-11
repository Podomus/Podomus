"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animation/variants";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
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
  const timelineRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!timelineRef.current) return;

    const ctx = gsap.context(() => {
      const cards = timelineRef.current!.querySelectorAll("[data-timeline-card]");

      gsap.set(cards, { autoAlpha: 0, y: 40, x: (i) => i % 2 === 0 ? -20 : 20 });

      ScrollTrigger.batch(cards, {
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            x: 0,
            duration: 0.75,
            ease: "power3.out",
            stagger: 0.12,
            overwrite: true,
          }),
        start: "top 85%",
        once: true,
      });
    }, timelineRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!valuesRef.current) return;

    const ctx = gsap.context(() => {
      const cards = valuesRef.current!.querySelectorAll("[data-values-card]");

      gsap.set(cards, { autoAlpha: 0, y: 40 });

      ScrollTrigger.batch(cards, {
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: 0.75,
            ease: "power3.out",
            stagger: 0.12,
            overwrite: true,
          }),
        start: "top 85%",
        once: true,
      });
    }, valuesRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    { icon: <FaUsers className="text-3xl" />, number: "500+", label: "Patients Traités" },
    { icon: <FaAward className="text-3xl" />, number: "9+", label: "Années d'Expérience" },
    { icon: <TbCertificate className="text-3xl" />, number: "3", label: "Pays d'Exercice" },
    { icon: <FaHeart className="text-3xl" />, number: "2", label: "Resorts 5★ BG Studios" },
  ];

  const values = [
    {
      icon: <TbStethoscope className="text-4xl" />,
      title: "Expertise Médicale",
      description: "Protocoles issus de la podologie clinique et de l'hôtellerie de luxe — appliqués à chaque séance.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <FaHeart className="text-4xl" />,
      title: "Bienveillance",
      description: "Un accueil attentif, un suivi adapté — qu'il s'agisse d'un enfant de 8 ans ou d'un patient diabétique.",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: <TbShieldCheck className="text-4xl" />,
      title: "Sécurité",
      description: "Stérilisation en autoclave, matériaux à usage unique, traçabilité à chaque consultation.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <TbTargetArrow className="text-4xl" />,
      title: "Innovation",
      description: "Semelles orthopédiques sur mesure, ondes de choc, analyse de la marche — les outils qui changent les traitements.",
      color: "from-purple-500 to-purple-600"
    }
  ];

  const timeline = [
    {
      year: "2014",
      title: "Stage — CHU Farhat Hached, Sousse",
      description: "Aux côtés d'un oncologue du CHU Farhat Hached de Sousse, elle construit le premier protocole podologique consacré aux complications de la chimiothérapie — mucites plantaires, neuropathies périphériques, troubles de l'appui. Ce protocole, elle l'applique encore aujourd'hui avec ses patients sous traitement oncologique."
    },
    {
      year: "2016",
      title: "Cabinet Sonda Affes — Sfax",
      description: "Elle ouvre son cabinet de pédicurie médicale à Sfax et le dirige seule pendant cinq ans — pieds plats, neuropathies diabétiques, tendinopathies du sportif, orthèses sur mesure. Son premier laboratoire clinique complet."
    },
    {
      year: "2019",
      title: "Secrétaire Générale — ATSP",
      description: "L'ATSP la nomme secrétaire générale. Elle organise des congrès nationaux, structure les protocoles de formation continue et travaille à faire reconnaître une profession encore peu réglementée en Tunisie."
    },
    {
      year: "2021",
      title: "Bastien Gonzalez Studio — Maldives",
      description: "Studio Manager au One&Only Reethi Rah aux Maldives — l'un des resorts les plus exclusifs au monde — elle traite des athlètes professionnels, des célébrités et des dirigeants d'entreprise tout en coordonnant l'équipe thérapeutique. C'est là qu'elle apprend ce que signifie soigner sans droit à l'erreur."
    },
    {
      year: "2023",
      title: "Bastien Gonzalez Studio — Dubaï",
      description: "La marque la transfère au One&Only Royal Mirage à Dubaï. Elle forme les thérapeutes juniors, standardise les protocoles de soin et représente Bastien Gonzalez auprès d'une clientèle du Golfe exigeante — rôle de clinicienne, mais aussi de directrice et de formatrice."
    },
    {
      year: "2025",
      title: "Lancement de Podomus — La Soukra",
      description: "En décembre 2024, elle rentre en Tunisie avec dix ans de pratique accumulés dans trois pays — CHU d'oncologie à Sousse, cabinet privé à Sfax, resorts Bastien Gonzalez aux Maldives et à Dubaï — et ouvre Podomus à La Soukra. Chaque pied traité ici bénéficie de tout ce parcours."
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
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
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
              Une podologie forgée entre Sousse, les Maldives et Dubaï — et ramenée ici.
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
                whileHover={{ scale: 1.02, y: -4 }}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
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
                Sonda Affes a exercé dans un CHU d&apos;oncologie, dirigé son propre cabinet pendant cinq ans et soigné dans deux resorts One&amp;Only — aux Maldives, puis à Dubaï. Ce que Podomus apporte en Tunisie, c&apos;est la rigueur clinique de l&apos;hôpital et le soin précis du studio de luxe — dans le même cabinet.
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
                  Ce que Sonda a pratiqué au One&amp;Only Reethi Rah et au One&amp;Only Royal Mirage — protocoles rigoureux, matériaux de haute qualité, attention au moindre détail — elle l&apos;applique aujourd&apos;hui à La Soukra, sans compromis.
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
              Dix ans, trois pays, six étapes — le parcours qui explique pourquoi Podomus existe.
            </p>
          </motion.div>

          <div
            className="relative"
            ref={timelineRef}
          >
            {/* Timeline */}
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  data-timeline-card
                  className={`flex items-center gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
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
                </div>
              ))}
            </div>
          </div>
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

          <div
            ref={valuesRef}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                data-values-card
                className="group relative"
                whileHover={{ scale: 1.02 }}
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
          </div>
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
              Notre Fondatrice &amp; Directrice
            </h2>
            <p className="text-lg text-textmain max-w-2xl mx-auto">
              Une podologue, dix ans d&apos;exercice clinique, trois pays.
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
              whileHover={{ scale: 1.01, y: -4 }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="relative h-80 overflow-hidden">
                <Image
                  src="/sonda.jpg"
                  alt="Dr Sonda Affes Ben Mahmoud"
                  fill
                  className="object-cover object-top group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              <div className="p-8 text-center">
                <h3 className="text-3xl font-bold text-brand mb-3">Sonda Affes</h3>
                <p className="text-highlight font-semibold mb-4 text-lg">Pédicure-Podologue | Fondatrice de Podomus</p>
                <p className="text-textmain mb-6 leading-relaxed">
                  Diplômée de l&apos;ESSTSS de Sousse, Sonda fonde son cabinet à Sfax en 2016 avant
                  de rejoindre les Bastien Gonzalez Studios — au One&amp;Only Reethi Rah aux Maldives
                  (2021–2023) puis au One&amp;Only Royal Mirage à Dubaï (2023–2025). En décembre 2024,
                  elle rentre en Tunisie et ouvre Podomus : ce qu&apos;elle a appris partout,
                  elle le pratique ici.
                </p>
                <div className="flex justify-center gap-6">
                  <div className="flex items-center gap-2 text-sm text-textmain">
                    <TbCertificate className="text-brand text-lg" />
                    <span>ESSTSS Sousse</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-textmain">
                    <TbCalendarTime className="text-brand text-lg" />
                    <span>Depuis 2025</span>
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
              Un pied qui fait mal n&apos;attend pas. Prenez rendez-vous.
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
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05, duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            >
              <FaMapMarkerAlt className="text-4xl text-brand mx-auto mb-4" />
              <h3 className="text-xl font-bold text-brand mb-2">Adresse</h3>
              <p className="text-textmain">
                Bureau A2.7, 2eme Etage<br />
                Le Doyen Medical<br />
                Av. Fattouma Bourguiba<br />
                La Soukra 2036
              </p>
            </motion.div>

            <motion.div
              className="text-center p-6 rounded-2xl bg-gradient-to-br from-brand/5 to-highlight/5 border border-brand/20"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            >
              <FaClock className="text-4xl text-brand mx-auto mb-4" />
              <h3 className="text-xl font-bold text-brand mb-2">Horaires</h3>
              <p className="text-textmain">
                Lundi - Vendredi: 9h30 - 16h30<br />
                Samedi: Fermé<br />
                Dimanche: Fermé
              </p>
            </motion.div>

            <motion.div
              className="text-center p-6 rounded-2xl bg-gradient-to-br from-brand/5 to-highlight/5 border border-brand/20"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            >
              <FaPhone className="text-4xl text-brand mx-auto mb-4" />
              <h3 className="text-xl font-bold text-brand mb-2">Contact</h3>
              <p className="text-textmain mb-2">
                Téléphone: <a href="tel:+21628451433" className="text-brand hover:text-highlight">+216 28 451 433</a><br />
                Email: <a href="mailto:contact@podomus.tn" className="text-brand hover:text-highlight">contact@podomus.tn</a>
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              Prendre Rendez-vous
            </motion.a>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 