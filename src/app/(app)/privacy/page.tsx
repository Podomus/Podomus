"use client";
import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animation/variants";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { TbArrowLeft } from "react-icons/tb";

const PrivacyPage = () => {
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
            Politique de Confidentialité
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
              1. Introduction
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-textmain leading-relaxed">
              Le Cabinet Podomus, dirigé par la Docteure Sonda Affes Ben Mahmoud, s&apos;engage à protéger la confidentialité 
              et la sécurité de vos informations personnelles. Cette politique décrit comment nous collectons, 
              utilisons et protégeons vos données.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 sm:space-y-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-brand border-b-2 border-brand/20 pb-2">
              2. Informations que nous collectons
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-brand mb-2">
                  Informations personnelles
                </h3>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm md:text-base text-textmain ml-3 sm:ml-4">
                  <li>Nom et prénom</li>
                  <li>Adresse email</li>
                  <li>Numéro de téléphone</li>
                  <li>Adresse postale</li>
                  <li>Date de naissance</li>
                </ul>
              </div>
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-brand mb-2">
                  Informations médicales
                </h3>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm md:text-base text-textmain ml-3 sm:ml-4">
                  <li>Antécédents médicaux</li>
                  <li>Diagnostics et traitements</li>
                  <li>Prescriptions médicales</li>
                  <li>Notes de consultation</li>
                </ul>
              </div>
              <div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-brand mb-2">
                  Données techniques
                </h3>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm md:text-base text-textmain ml-3 sm:ml-4">
                  <li>Adresse IP</li>
                  <li>Type de navigateur</li>
                  <li>Pages visitées</li>
                  <li>Durée de visite</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 sm:space-y-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-brand border-b-2 border-brand/20 pb-2">
              3. Comment nous utilisons vos informations
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-textmain leading-relaxed">
              Nous utilisons vos informations pour :
            </p>
            <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-xs sm:text-sm md:text-base text-textmain ml-3 sm:ml-4">
              <li>Fournir des soins podologiques personnalisés</li>
              <li>Planifier et gérer vos rendez-vous</li>
              <li>Communiquer avec vous concernant vos soins</li>
              <li>Améliorer nos services et notre site web</li>
              <li>Respecter nos obligations légales</li>
              <li>Assurer la sécurité de nos systèmes</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 sm:space-y-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-brand border-b-2 border-brand/20 pb-2">
              4. Partage des informations
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-textmain leading-relaxed">
              Nous ne vendons, n&apos;échangeons ni ne louons vos informations personnelles à des tiers. 
              Nous pouvons partager vos informations uniquement dans les cas suivants :
            </p>
            <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-xs sm:text-sm md:text-base text-textmain ml-3 sm:ml-4">
              <li>Avec votre consentement explicite</li>
              <li>Pour respecter des obligations légales</li>
              <li>Avec d&apos;autres professionnels de santé (avec votre accord)</li>
              <li>Pour protéger vos droits et notre sécurité</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 sm:space-y-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-brand border-b-2 border-brand/20 pb-2">
              5. Sécurité des données
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-textmain leading-relaxed">
              Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos informations :
            </p>
            <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-xs sm:text-sm md:text-base text-textmain ml-3 sm:ml-4">
              <li>Chiffrement des données sensibles</li>
              <li>Accès restreint aux informations médicales</li>
              <li>Formation du personnel sur la confidentialité</li>
              <li>Surveillance régulière de nos systèmes</li>
              <li>Sauvegardes sécurisées</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3 sm:space-y-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-brand border-b-2 border-brand/20 pb-2">
              6. Cookies et technologies similaires
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-textmain leading-relaxed">
              Notre site web utilise des cookies pour améliorer votre expérience. Ces cookies nous aident à :
            </p>
            <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-xs sm:text-sm md:text-base text-textmain ml-3 sm:ml-4">
              <li>Mémoriser vos préférences</li>
              <li>Analyser le trafic du site</li>
              <li>Améliorer les performances</li>
              <li>Personnaliser le contenu</li>
            </ul>
            <p className="text-xs sm:text-sm md:text-base text-textmain leading-relaxed mt-3 sm:mt-4">
              Vous pouvez désactiver les cookies dans les paramètres de votre navigateur, 
              mais cela peut affecter certaines fonctionnalités du site.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3 sm:space-y-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-brand border-b-2 border-brand/20 pb-2">
              7. Vos droits
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-textmain leading-relaxed">
              Vous avez le droit de :
            </p>
            <ul className="list-disc list-inside space-y-1 sm:space-y-2 text-xs sm:text-sm md:text-base text-textmain ml-3 sm:ml-4">
              <li>Accéder à vos informations personnelles</li>
              <li>Corriger des informations inexactes</li>
              <li>Demander la suppression de vos données</li>
              <li>Limiter le traitement de vos données</li>
              <li>Retirer votre consentement</li>
              <li>Porter plainte auprès des autorités compétentes</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="space-y-3 sm:space-y-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-brand border-b-2 border-brand/20 pb-2">
              8. Conservation des données
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-textmain leading-relaxed">
              Nous conservons vos informations médicales conformément aux obligations légales 
              et professionnelles. Les données techniques sont conservées pendant une durée 
              limitée nécessaire à leur traitement.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3 sm:space-y-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-brand border-b-2 border-brand/20 pb-2">
              9. Modifications de cette politique
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-textmain leading-relaxed">
              Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. 
              Les modifications seront publiées sur cette page avec une nouvelle date de mise à jour.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-3 sm:space-y-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-brand border-b-2 border-brand/20 pb-2">
              10. Contact
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-textmain leading-relaxed">
              Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, 
              veuillez nous contacter :
            </p>
            <div className="bg-neutralbg rounded-lg p-3 sm:p-4 space-y-2">
              <p className="text-xs sm:text-sm md:text-base text-textmain">
                <a href="https://maps.app.goo.gl/uV382aFHbzwSFruK9" target="_blank" rel="noopener noreferrer"><strong>Cabinet Podomus</strong><br />
                Docteure Sonda Affes Ben Mahmoud<br />
                Imm. Golf Center 2, Bureau BM2<br />
                La Soukra 2036<br /></a>
                Téléphone : <a href="tel:+21651617044" className="text-brand hover:text-highlight">+216 51 617 044</a><br />
                Email : <a href="mailto:contact@podomus.tn" className="text-brand hover:text-highlight">contact@podomus.tn</a>
              </p>
            </div>
          </section>
        </motion.div>

        {/* Lien vers les termes et conditions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-6 sm:mt-8"
        >
          <Link 
            href="/terms"
            className="inline-block bg-brand text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full hover:bg-highlight transition-colors duration-300 text-xs sm:text-sm md:text-base"
          >
            Voir nos Termes et Conditions
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PrivacyPage; 