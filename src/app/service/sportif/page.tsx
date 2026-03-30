"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaRunning, FaDumbbell, FaHeart, FaCheckCircle, FaStar } from "react-icons/fa";
import { TbTargetArrow, TbShieldCheck, TbSparkles } from "react-icons/tb";
import AppointmentModal from "../../../components/AppointmentModal";


export default function SportifPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const sportifServices = [
    {
      id: 1,
      title: "Bilan podologique sportif",
      description: "Évaluation complète de la biomécanique et de la posture pour optimiser vos performances sportives.",
      icon: <FaRunning className="text-3xl text-blue-600" />,
      features: [
        "Analyse de la marche et de la course",
        "Évaluation des pressions plantaires",
        "Détection des déséquilibres",
        "Recommandations personnalisées",
        "Suivi des améliorations"
      ],

    },
    {
      id: 2,
      title: "Orthèses sportives sur-mesure",
      description: "Fabrication d'orthèses adaptées à votre sport et à votre morphologie pour prévenir les blessures.",
      icon: <TbTargetArrow className="text-3xl text-green-600" />,
      features: [
        "Moulage personnalisé",
        "Matériaux adaptés au sport",
        "Correction biomécanique",
        "Amélioration des performances",
        "Prévention des blessures"
      ],

    },
    {
      id: 3,
      title: "Soins des pieds du sportif",
      description: "Traitement spécialisé des problèmes courants chez les sportifs : ampoules, ongles incarnés, callosités.",
      icon: <TbShieldCheck className="text-3xl text-purple-600" />,
      features: [
        "Traitement des ampoules",
        "Soins des ongles incarnés",
        "Élimination des callosités",
        "Conseils de prévention",
        "Protection des zones sensibles"
      ],

    },
    {
      id: 4,
      title: "Rééducation podologique",
      description: "Programme de rééducation après blessure pour retrouver vos performances sportives optimales.",
      icon: <TbSparkles className="text-3xl text-orange-600" />,
      features: [
        "Évaluation post-blessure",
        "Exercices de renforcement",
        "Techniques de rééducation",
        "Retour progressif au sport",
        "Suivi personnalisé"
      ],

    }
  ];

  const testimonials = [
    {
      name: "Thomas Martin",
      sport: "Marathonien",
      rating: 5,
      comment: "Grâce aux orthèses sur-mesure, j'ai pu améliorer mes performances et éviter les blessures récurrentes."
    },
    {
      name: "Sarah Dubois",
      sport: "Tennis",
      rating: 5,
      comment: "Le bilan podologique m'a permis de comprendre mes problèmes de posture et d'optimiser mon jeu."
    },
    {
      name: "Marc Leroy",
      sport: "Football",
      rating: 5,
      comment: "Excellent suivi après ma blessure. J'ai pu reprendre le sport en toute sécurité."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
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
              <FaRunning className="text-5xl text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Services Podologiques pour Sportifs
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Optimisez vos performances sportives avec nos soins podologiques spécialisés. 
              De la prévention à la rééducation, nous vous accompagnons dans votre pratique sportive.
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
            Nos Services Spécialisés
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {sportifServices.map((service, index) => (
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
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-[transform,background-color] duration-150 hover:scale-105 active:scale-[0.97]"
                  >
                    Prendre Rendez-vous
                  </button>
                </div>
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
            Pourquoi Choisir Nos Services Sportifs ?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaHeart className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Expertise Sportive</h3>
              <p className="text-gray-600">
                Notre équipe connaît les spécificités de chaque sport et adapte les soins en conséquence.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TbTargetArrow className="text-2xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Performance Optimale</h3>
              <p className="text-gray-600">
                Nos soins visent à améliorer vos performances tout en prévenant les blessures.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TbShieldCheck className="text-2xl text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Prévention</h3>
              <p className="text-gray-600">
                Nous vous aidons à prévenir les blessures courantes chez les sportifs.
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
            Ce que disent nos sportifs
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
                  <p className="text-sm text-gray-600">{testimonial.sport}</p>
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
                <AppointmentModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
              </motion.div>
            </section>

    </div>
  );
} 