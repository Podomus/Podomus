"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaHeart, FaCheckCircle, FaStar, FaUserFriends, FaHome } from "react-icons/fa";
import { TbTargetArrow, TbShieldCheck, TbSparkles, TbHeartHandshake } from "react-icons/tb";
import AppointmentModal from "../../../components/AppointmentModal";

export default function OldPeoplePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const seniorServices = [
    {
      id: 1,
      title: "Bilan podologique gériatrique",
      description: "Évaluation complète adaptée aux besoins spécifiques des seniors pour maintenir l'autonomie.",
      icon: <FaHeart className="text-3xl text-red-600" />,
      features: [
        "Évaluation de l'équilibre",
        "Analyse de la marche",
        "Détection des risques de chute",
        "Conseils de prévention",
        "Suivi personnalisé"
      ],

    },
    {
      id: 2,
      title: "Soins des pieds pour seniors",
      description: "Traitement spécialisé des problèmes courants chez les personnes âgées : ongles épais, callosités, etc.",
      icon: <TbShieldCheck className="text-3xl text-blue-600" />,
      features: [
        "Soins des ongles épais",
        "Traitement des callosités",
        "Prévention des ulcères",
        "Conseils d'hygiène",
        "Approche douce et respectueuse"
      ],

    },
    {
      id: 3,
      title: "Orthèses gériatriques",
      description: "Fabrication d'orthèses adaptées aux besoins des seniors pour améliorer le confort et la stabilité.",
      icon: <TbTargetArrow className="text-3xl text-green-600" />,
      features: [
        "Orthèses confortables",
        "Matériaux adaptés",
        "Amélioration de l'équilibre",
        "Prévention des chutes",
        "Suivi régulier"
      ],

    },
    {
      id: 4,
      title: "Prévention et conseils",
      description: "Guidance pour maintenir l'autonomie et prévenir les problèmes podologiques liés à l'âge.",
      icon: <TbSparkles className="text-3xl text-purple-600" />,
      features: [
        "Conseils chaussures",
        "Exercices de renforcement",
        "Prévention des chutes",
        "Éducation thérapeutique",
        "Suivi préventif"
      ],

    }
  ];

  const specialFeatures = [
    {
      title: "Visites à domicile",
      description: "Pour les personnes à mobilité réduite",
      icon: <FaHome className="text-2xl text-blue-500" />
    },
    {
      title: "Accompagnement personnalisé",
      description: "Prise en charge globale et bienveillante",
      icon: <FaUserFriends className="text-2xl text-green-500" />
    },
    {
      title: "Prévention des chutes",
      description: "Évaluation et conseils spécialisés",
      icon: <TbHeartHandshake className="text-2xl text-red-500" />
    },
    {
      title: "Suivi régulier",
      description: "Accompagnement sur le long terme",
      icon: <TbSparkles className="text-2xl text-purple-500" />
    }
  ];

  const testimonials = [
    {
      name: "Jeanne Martin",
      age: "78 ans",
      rating: 5,
      comment: "Grâce aux soins podologiques, je peux marcher sans douleur et garder mon autonomie."
    },
    {
      name: "Pierre Dubois",
      age: "82 ans",
      rating: 5,
      comment: "Le podologue vient à domicile, c'est très pratique. Il est très patient et compétent."
    },
    {
      name: "Marie Leroy",
      age: "75 ans",
      rating: 5,
      comment: "Les orthèses m'ont permis de retrouver l'équilibre et d'éviter les chutes."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
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
              <FaHeart className="text-5xl text-red-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Soins Podologiques pour Seniors
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des soins spécialement adaptés aux personnes âgées pour maintenir l&apos;autonomie 
              et améliorer la qualité de vie. Notre approche bienveillante et respectueuse 
              vous accompagne dans votre bien-être quotidien.
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
            Nos Services Gériatriques
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {seniorServices.map((service, index) => (
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
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-[transform,background-color] duration-150 hover:scale-105 active:scale-[0.97]"
                  >
                    Prendre Rendez-vous
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Services spéciaux */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Services Spécialisés pour Seniors
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {specialFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.3, delay: index * 0.05, ease: [0.23, 1, 0.32, 1] }}
                className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-200"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
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
            Pourquoi Choisir Nos Soins Gériatriques ?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FaHeart className="text-2xl text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Approche Bienveillante</h3>
              <p className="text-gray-600">
                Notre équipe est formée aux spécificités gériatriques et adopte une approche respectueuse et patiente.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TbShieldCheck className="text-2xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Prévention des Chutes</h3>
              <p className="text-gray-600">
                Évaluation et prévention des risques de chute pour maintenir l&apos;autonomie et la sécurité.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TbSparkles className="text-2xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Maintien de l&apos;Autonomie</h3>
              <p className="text-gray-600">
                Nos soins visent à préserver votre autonomie et améliorer votre qualité de vie quotidienne.
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
            Ce que disent nos patients seniors
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
                  <p className="text-sm text-gray-600">{testimonial.age}</p>
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