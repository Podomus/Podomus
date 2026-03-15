"use client";

import React, { ReactNode, useState, useEffect } from "react";
import { Button, Link } from "@nextui-org/react";
import Image from "next/image";
import NextLink from "next/link";
import {
  FaInstagram,
  FaXTwitter,
  FaGithub,
  FaLinkedinIn,
  FaChevronRight,
  FaFacebookF,
} from "react-icons/fa6";
import { TbMapStar, TbPhone, TbMail, TbClock, TbStethoscope } from "react-icons/tb";
import { IoCalendarOutline } from "react-icons/io5";
import { motion, useAnimation, useInView } from "framer-motion";
import AppointmentModal from "./AppointmentModal";
import { useIsMobile } from "../hooks/useIsMobile";

type ButtonSize = "sm" | "md" | "lg" | undefined;

interface SocialLinkProps {
  href: string;
  icon: ReactNode;
  size: ButtonSize;
  delay: number;
}

function SocialLink({ href, icon, size, delay }: SocialLinkProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ 
        type: "spring", 
        stiffness: 200, 
        damping: 15, 
        delay: delay 
      }}
      whileHover={{ 
        scale: 1.15, 
        rotate: 5,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
      whileTap={{ scale: 0.95 }}
    >
      <Link href={href} isExternal>
        <Button
          isIconOnly
          startContent={icon}
          size={size}
          className="bg-white border border-white/20 text-brand hover:bg-white/90 hover:border-white/40 transition-all duration-300 shadow-lg hover:shadow-xl"
        />
      </Link>
    </motion.div>
  );
}

// Composant pour les particules flottantes
function FloatingParticles() {
  const [positions, setPositions] = useState<{x: number, y: number}[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      setPositions(
        Array.from({ length: 6 }, () => ({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
        }))
      );
    }
  }, [mounted]);

  if (!mounted || positions.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {positions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/20 rounded-full"
          initial={{
            x: pos.x,
            y: pos.y,
            opacity: 0,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}

// Composant pour les lignes animées
function AnimatedLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
          style={{
            top: `${20 + i * 30}%`,
            left: "-100%",
            width: "200%",
          }}
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 6 + i * 2,
            repeat: Infinity,
            ease: "linear",
            delay: i * 2,
          }}
        />
      ))}
    </div>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [openModal, setOpenModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useIsMobile();

  return (
    <motion.footer
      initial={{ y: 60, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative w-full bg-gradient-to-br from-brand/95 to-brand text-white overflow-hidden"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Particules flottantes */}
      <FloatingParticles />
      
      {/* Lignes animées */}
      <AnimatedLines />

      {/* Gradient animé en fond */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isHovered ? 0.8 : 0.4,
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity, 
          ease: "linear",
          scale: { duration: 0.5 }
        }}
        className={isMobile ? "pointer-events-none absolute inset-0 z-0 bg-gradient-to-tr from-white/5 via-highlight/10 to-transparent blur" : "pointer-events-none absolute inset-0 z-0 bg-gradient-to-tr from-white/5 via-highlight/10 to-transparent blur-2xl"}
        style={{ backgroundSize: "200% 200%" }}
      />

      {/* Contenu principal du footer */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Logo et présentation */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            >
              <Link href="/">
                <motion.div
                  className="flex flex-col items-start group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <motion.div
                    whileHover={{ rotate: [0, -2, 2, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Image
                      src="/Group 3.svg"
                      alt="Podomus - Cabinet de Podologie de Luxe"
                      width={180}
                      height={50}
                      className="h-auto w-44 object-contain transition-all duration-300 filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0"
                    />
                  </motion.div>
                  <motion.span 
                    className="text-sm text-white/90 font-medium tracking-wide mt-2"
                    whileHover={{ color: "#ffffff" }}
                    transition={{ duration: 0.3 }}
                  >
                    Cabinet de Podologie de Luxe
                  </motion.span>
                </motion.div>
              </Link>
              <motion.p 
                className="mt-4 text-sm text-white/80 leading-relaxed"
                whileHover={{ color: "rgba(255, 255, 255, 0.9)" }}
                transition={{ duration: 0.3 }}
              >
                Spécialiste en soins podologiques d&apos;exception, la Docteure Sonda Affes Ben Mahmoud vous accompagne 
                avec expertise et discrétion pour la santé et la beauté de vos pieds.
              </motion.p>
            </motion.div>
          </div>

          {/* Informations de contact */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            >
              <motion.h3 
                className="text-lg font-semibold mb-4 flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <TbStethoscope size={20} />
                </motion.div>
                Contact & Accès
              </motion.h3>
              <div className="space-y-3">
                <motion.div 
                  className="flex items-start gap-3 group"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <TbMapStar size={18} className="text-highlight mt-1 flex-shrink-0" />
                  </motion.div>
                  <div className="text-sm text-white/80 group-hover:text-white/90 transition-colors duration-300">
                    <p>Bureau BM2 1er Etage</p>
                    <p>Imm. Golf Center 2</p>
                    <p>Av. De L&apos;environnement</p>
                    <p>Dar Fadhal La Soukra 2036</p>
                  </div>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-3 group"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <TbPhone size={18} className="text-highlight flex-shrink-0" />
                  </motion.div>
                  <span className="text-sm text-white/80 group-hover:text-white/90 transition-colors duration-300">28 451 433</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-3 group"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <TbMail size={18} className="text-highlight flex-shrink-0" />
                  </motion.div>
                  <span className="text-sm text-white/80 group-hover:text-white/90 transition-colors duration-300">contact@podomus.tn</span>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Horaires d'ouverture */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            >
              <motion.h3 
                className="text-lg font-semibold mb-4 flex items-center gap-2"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  <TbClock size={20} />
                </motion.div>
                Horaires
              </motion.h3>
              <div className="space-y-2 text-sm text-white/80">
                {[
                  { day: "Lundi - Vendredi", time: "10:00 - 15:00" },
                  { day: "Samedi", time: "09:00 - 14:00" },
                  { day: "Dimanche", time: "Fermé" }
                ].map((schedule, index) => (
                                     <motion.div 
                     key={index}
                     className="flex justify-between group"
                     whileHover={{ x: 5, scale: 1.02 }}
                     initial={{ opacity: 0, x: -20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ 
                       type: "spring", 
                       stiffness: 300, 
                       damping: 15,
                       delay: index * 0.1 
                     }}
                   >
                    <span className="group-hover:text-white transition-colors duration-300">{schedule.day}</span>
                    <span className="group-hover:text-highlight transition-colors duration-300">{schedule.time}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Services et réseaux sociaux */}
          {/* Navigation principale */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            >
              <motion.h3 
                className="text-lg font-semibold mb-4"
                whileHover={{ scale: 1.02, color: '#40826D' }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                Navigation
              </motion.h3>
              <div className="space-y-2 text-sm text-white/80 mb-6">
                {[
                  { label: "Accueil", href: "/" },
                  { label: "À propos", href: "/a_propos" },
                  { label: "Services", href: "/service" },
                  { label: "Contact", href: "/contact" }
                ].map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.href}
                    className="flex items-center gap-2 group hover:text-highlight transition-colors duration-300"
                    whileHover={{ x: 5, color: "#40826D" }}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 15,
                      delay: index * 0.1 
                    }}
                  >
                    <motion.span
                      className="w-1 h-1 bg-highlight rounded-full"
                      whileHover={{ scale: 1.5 }}
                      transition={{ duration: 0.2 }}
                    />
                    {link.label}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Services */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
            >
              <motion.h3 
                className="text-lg font-semibold mb-4"
                whileHover={{ scale: 1.02, color: '#40826D' }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <a href="/service" className="hover:underline hover:text-highlight transition-colors duration-300">Nos Services</a>
              </motion.h3>
              <div className="space-y-2 text-sm text-white/80 mb-6">
                {[
                  { label: "Soins podologiques personnalisés", anchor: "soins" },
                  { label: "Orthoplastie & orthonyxie", anchor: "orthoplastie" },
                  { label: "Traitement laser", anchor: "laser" },
                  { label: "Conseils et suivi", anchor: "conseils" }
                ].map((service, index) => (
                  <motion.a
                    key={index}
                    href={`/service#${service.anchor}`}
                    className="flex items-center gap-2 group hover:text-highlight transition-colors duration-300"
                    whileHover={{ x: 5, color: "#40826D" }}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 15,
                      delay: index * 0.1 
                    }}
                  >
                    <motion.span
                      className="w-1 h-1 bg-highlight rounded-full"
                      whileHover={{ scale: 1.5 }}
                      transition={{ duration: 0.2 }}
                    />
                    {service.label}
                  </motion.a>
                ))}
              </div>

              <motion.div 
                className="mb-6"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <Button
                  className="w-full h-12 text-sm font-medium bg-white text-brand hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                  endContent={
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <IoCalendarOutline size={20} />
                    </motion.div>
                  }
                  onClick={() => setOpenModal(true)}
                >
                  Prendre rendez-vous
                </Button>
              </motion.div>

              <motion.h4 
                className="text-sm font-semibold mb-3"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                Suivez-nous
              </motion.h4>
              <div className="flex gap-3">
                <SocialLink
                  href="https://www.instagram.com/podomus_podologue_sonda_affes/"
                  icon={<FaInstagram size={18} className="text-brand" />}
                  size="sm"
                  delay={0.1}
                />
                <SocialLink
                  href="https://www.facebook.com/cabientsondaaffes"
                  icon={<FaFacebookF size={18} className="text-brand" />}
                  size="sm"
                  delay={0.2}
                />
                <SocialLink
                  href="https://www.linkedin.com/in/sonda-affes-651821200/"
                  icon={<FaLinkedinIn size={18} className="text-brand" />}
                  size="sm"
                  delay={0.3}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Barre de copyright */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative z-10 border-t border-white/20 bg-brand/50 backdrop-blur-sm px-4 py-4 text-center text-xs text-white/70"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <motion.p 
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            &copy; {currentYear} Podomus. Tous droits réservés.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center gap-4">
              <motion.span
                whileHover={{ color: "rgba(255, 255, 255, 0.9)" }}
                transition={{ duration: 0.3 }}
              >
                Cabinet de podologie de luxe
              </motion.span>
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                •
              </motion.span>
              <motion.span
                whileHover={{ color: "rgba(255, 255, 255, 0.9)" }}
                transition={{ duration: 0.3 }}
              >
                Docteure Sonda Affes Ben Mahmoud
              </motion.span>
            </div>
            <div className="flex items-center gap-4">
              <NextLink href="/terms">
                <motion.span
                  whileHover={{ color: "rgba(255, 255, 255, 0.9)" }}
                  transition={{ duration: 0.3 }}
                  className="cursor-pointer hover:underline"
                >
                  Termes et Conditions
                </motion.span>
              </NextLink>
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                •
              </motion.span>
              <NextLink href="/privacy">
                <motion.span
                  whileHover={{ color: "rgba(255, 255, 255, 0.9)" }}
                  transition={{ duration: 0.3 }}
                  className="cursor-pointer hover:underline"
                >
                  Politique de Confidentialité
                </motion.span>
              </NextLink>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Modal de réservation */}
      <AppointmentModal open={openModal} onClose={() => setOpenModal(false)} />
    </motion.footer>
  );
}
