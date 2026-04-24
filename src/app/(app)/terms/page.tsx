"use client";
import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animation/variants";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { TbArrowLeft } from "react-icons/tb";

const TermsPage = () => {
  const [ref, inView] = useInView({ triggerOnce: false });

  return (
    <div className="min-h-screen bg-mainbg">
      <motion.div
        variants={fadeIn("up", 0)}
        initial="hidden"
        animate={inView ? "show" : "hidden"}
        exit="hidden"
        className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 lg:px-8 max-w-4xl"
        ref={ref}
      >
        {/* Bouton retour */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-8"
        >
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-brand hover:text-highlight transition-colors duration-300 text-xs sm:text-sm md:text-base"
          >
            <TbArrowLeft size={16} className="sm:w-5 sm:h-5" />
            Retour à l&apos;accueil
          </Link>
        </motion.div>

        {/* En-tête */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-8 sm:mb-12 px-2 sm:px-0"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-brand mb-3 sm:mb-4">
            Termes et Conditions
          </h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-textmain max-w-2xl mx-auto">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </motion.div>

        {/* Contenu */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-10 space-y-6 sm:space-y-8"
        >
          {/* Section 1 */}
          <section className="space-y-3 sm:space-y-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-brand border-b-2 border-brand/20 pb-2">
              1. Acceptation des termes
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-textmain leading-relaxed">
              En accédant et en utilisant le site web de Podomus, vous acceptez d&apos;être lié par ces termes et conditions. 
              Si vous n&apos;acceptez pas ces termes, veuillez ne pas utiliser notre site.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 sm:space-y-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-brand border-b-2 border-brand/20 pb-2">
              2. Services proposés
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-textmain leading-relaxed">
              Podomus propose des services de podologie professionnels, incluant :
            </p>
            <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-xs sm:text-sm md:text-base text-textmain ml-3 sm:ml-4">
              <li>Consultations podologiques personnalisées</li>
              <li>Orthoplastie et orthonyxie</li>
              <li>Traitements par laser</li>
              <li>Conseils et suivi médical</li>
              <li>Prise de rendez-vous en ligne</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 sm:space-y-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-brand border-b-2 border-brand/20 pb-2">
              3. Prise de rendez-vous
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-textmain leading-relaxed">
              La prise de rendez-vous en ligne est un service de convenance. Nous nous efforçons de respecter les horaires 
              programmés, mais des retards peuvent survenir en raison d&apos;urgences médicales.
            </p>
            <p className="text-xs sm:text-sm md:text-base text-textmain leading-relaxed">
              <strong>Annulation :</strong> Merci d&apos;annuler votre rendez-vous au moins 24 heures à l&apos;avance.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 sm:space-y-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-brand border-b-2 border-brand/20 pb-2">
              4. Confidentialité médicale
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-textmain leading-relaxed">
              Toutes les informations médicales partagées avec Podomus sont strictement confidentielles et protégées 
              par le secret médical. Nous respectons scrupuleusement les normes de confidentialité médicale.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 sm:space-y-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-brand border-b-2 border-brand/20 pb-2">
              5. Responsabilité
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-textmain leading-relaxed">
              Podomus s&apos;engage à fournir des soins de qualité selon les standards professionnels. Cependant, 
              nous ne pouvons garantir des résultats spécifiques, car ceux-ci dépendent de nombreux facteurs individuels.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 sm:space-y-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-brand border-b-2 border-brand/20 pb-2">
              6. Propriété intellectuelle
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-textmain leading-relaxed">
              Tout le contenu de ce site web, incluant les textes, images, logos et design, est la propriété 
              exclusive de Podomus et est protégé par les lois sur la propriété intellectuelle.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3 sm:space-y-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-brand border-b-2 border-brand/20 pb-2">
              7. Modifications des termes
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-textmain leading-relaxed">
              Podomus se réserve le droit de modifier ces termes et conditions à tout moment. 
              Les modifications prendront effet dès leur publication sur le site.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3 sm:space-y-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-brand border-b-2 border-brand/20 pb-2">
              8. Contact
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-textmain leading-relaxed">
              Pour toute question concernant ces termes et conditions, veuillez nous contacter :
            </p>
            <div className="bg-neutralbg rounded-lg p-3 sm:p-4 space-y-2">
              <p className="text-xs sm:text-sm md:text-base text-textmain">
                <a href="https://maps.app.goo.gl/XGuLd9WbkAQvmSpu6" target="_blank" rel="noopener noreferrer"><strong>Cabinet Podomus</strong><br />
                Bureau A2.7, 2eme Etage, Le Doyen Medical<br />
                Av. Fattouma Bourguiba, La Soukra 2036<br /></a>
                Téléphone : <a href="tel:+21628451433" className="text-brand hover:text-highlight">+216 28 451 433</a><br />
                Email : <a href="mailto:contact@podomus.tn" className="text-brand hover:text-highlight">contact@podomus.tn</a>
              </p>
            </div>
          </section>
        </motion.div>

        {/* Lien vers la politique de confidentialité */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-6 sm:mt-8"
        >
          <Link 
            href="/privacy"
            className="inline-block bg-brand text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-highlight transition-colors duration-300 text-xs sm:text-sm md:text-base"
          >
            Voir notre Politique de Confidentialité
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TermsPage; 