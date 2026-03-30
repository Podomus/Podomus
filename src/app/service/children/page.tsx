"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaChild, FaHeart, FaCheckCircle, FaStar, FaSmile } from "react-icons/fa";
import { TbTargetArrow, TbShieldCheck, TbSparkles } from "react-icons/tb";
import AppointmentModal from "../../../components/AppointmentModal";

export default function ChildrenPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const childrenServices = [
    {
      id: 1,
      title: "Bilan podologique pédiatrique",
      description: "Évaluation complète de la croissance et du développement des pieds de votre enfant.",
      icon: <FaChild className="text-3xl text-pink-600" />,
      features: [
        "Examen de la croissance",
        "Analyse de la marche",
        "Détection précoce des problèmes",
        "Conseils aux parents",
        "Suivi de développement"
      ],

    },
    {
      id: 2,
      title: "Soins des pieds pour enfants",
      description: "Traitement doux et adapté des problèmes courants chez les enfants : ongles incarnés, verrues, etc.",
      icon: <TbShieldCheck className="text-3xl text-blue-600" />,
      features: [
        "Traitement des ongles incarnés",
        "Soins des verrues plantaires",
        "Traitement des ampoules",
        "Conseils d'hygiène",
        "Approche douce et rassurante"
      ],

    },
    {
      id: 3,
      title: "Orthèses pédiatriques",
      description: "Fabrication d'orthèses adaptées à la croissance de votre enfant pour corriger les problèmes de posture.",
      icon: <TbTargetArrow className="text-3xl text-green-600" />,
      features: [
        "Orthèses sur-mesure",
        "Matériaux adaptés aux enfants",
        "Correction des déformations",
        "Suivi de croissance",
        "Ajustements réguliers"
      ],

    },
    {
      id: 4,
      title: "Prévention et conseils",
      description: "Guidance pour les parents sur le choix des chaussures et la prévention des problèmes podologiques.",
      icon: <TbSparkles className="text-3xl text-purple-600" />,
      features: [
        "Conseils chaussures",
        "Prévention des déformations",
        "Exercices de renforcement",
        "Éducation aux parents",
        "Suivi préventif"
      ],

    }
  ];

  const ageGroups = [
    {
      age: "0-3 ans",
      description: "Suivi de la croissance et développement précoce",
      icon: <FaChild className="text-2xl text-pink-500" />
    },
    {
      age: "4-7 ans",
      description: "Apprentissage de la marche et développement moteur",
      icon: <FaSmile className="text-2xl text-blue-500" />
    },
    {
      age: "8-12 ans",
      description: "Activités sportives et croissance active",
      icon: <TbTargetArrow className="text-2xl text-green-500" />
    },
    {
      age: "13-17 ans",
      description: "Sport intensif et développement final",
      icon: <TbSparkles className="text-2xl text-purple-500" />
    }
  ];

  const testimonials = [
    {
      name: "Marie Dubois",
      child: "Emma, 6 ans",
      rating: 5,
      comment: "Le podologue a été très patient avec Emma. Elle n'a plus peur d'aller chez le médecin !"
    },
    {
      name: "Pierre Martin",
      child: "Lucas, 10 ans",
      rating: 5,
      comment: "Grâce aux orthèses, Lucas a pu reprendre le football sans douleur."
    },
    {
      name: "Sophie Leroy",
      child: "Chloé, 4 ans",
      rating: 5,
      comment: "Excellent diagnostic précoce. Nous avons pu corriger le problème avant qu'il ne s'aggrave."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-100">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="bg-white shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <FaChild className="text-5xl text-pink-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Soins Podologiques pour Enfants
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des soins spécialement adaptés aux plus jeunes. Notre approche douce et rassurante 
              permet aux enfants de se sentir à l&apos;aise pendant leurs soins podologiques.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Services */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Nos Services Pédiatriques
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {childrenServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.3, delay: index * 0.05, ease: [0.23, 1, 0.32, 1] }}
                className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-200"
              >
                <div className="flex items-center mb-6">
                  {service.icon}
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <FaCheckCircle className="text-green-500 mr-3" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  

                  
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition-[transform,background-color] duration-150 hover:scale-105 active:scale-[0.97]"
                  >
                    Prendre Rendez-vous
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tranches d'âge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Soins Adaptés par Âge
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ageGroups.map((group, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.3, delay: index * 0.05, ease: [0.23, 1, 0.32, 1] }}
                className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-200"
              >
                <div className="flex justify-center mb-4">
                  {group.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{group.age}</h3>
                <p className="text-gray-600 text-sm">{group.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Avantages */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Pourquoi Choisir Nos Soins Pédiatriques ?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaHeart className="text-2xl text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Approche Douce</h3>
              <p className="text-gray-600">
                Notre équipe est spécialement formée pour rassurer les enfants et créer un environnement accueillant.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TbShieldCheck className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Prévention Précoce</h3>
              <p className="text-gray-600">
                Détection et traitement précoces des problèmes pour éviter les complications futures.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TbSparkles className="text-2xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Suivi Personnalisé</h3>
              <p className="text-gray-600">
                Accompagnement adapté à chaque étape de la croissance de votre enfant.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Témoignages */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Ce que disent les parents
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.3, delay: index * 0.05, ease: [0.23, 1, 0.32, 1] }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">&quot;{testimonial.comment}&quot;</p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.child}</p>
                </div>
              </motion.div>
            ))}
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
                  Prêt à prendre soin de vos pieds ?
                </motion.h3>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-white text-brand px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-[transform,box-shadow] duration-150 active:scale-[0.97] flex items-center gap-2 group text-lg mt-2"
                >
                  Prendre rendez-vous
                </button>
              </motion.div>
            </section>

      <AppointmentModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
} 