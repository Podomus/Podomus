"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { TbClock, TbMail, TbMapPin, TbMessageCircle, TbPhone } from "react-icons/tb";
import AppointmentModal from "../../../components/AppointmentModal";
import { useIsMobile } from "../../../hooks/useIsMobile";

// Particules flottantes décoratives
function FloatingParticles() {
  const isMobile = useIsMobile();
  const [positions, setPositions] = useState<{x: number, y: number}[]>([]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      setPositions(Array.from({ length: 16 }, () => ({
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
        y: Math.random() * 800,
      })));
    }
  }, [mounted]);
  if (!mounted || positions.length === 0 || isMobile) return null;
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {positions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 bg-brand/10 rounded-full blur-md"
          initial={{ x: pos.x, y: pos.y, opacity: 0 }}
          animate={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
            y: Math.random() * 800,
            opacity: [0, 1, 0.5, 1, 0],
          }}
          transition={{
            duration: 12 + Math.random() * 8,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}

const contactInfo = [
  {
    icon: <TbPhone size={32} className="text-brand" />,
    title: "Téléphone",
    value: "+216 28 451 433",
    link: "tel:+21628451433",
    description: "Appelez-nous pour prendre rendez-vous"
  },
  {
    icon: <TbMail size={32} className="text-highlight" />,
    title: "Email",
    value: "contact@podomus.tn",
    link: "mailto:contact@podomus.tn",
    description: "Envoyez-nous un message"
  },
  {
    icon: <TbMapPin size={32} className="text-brand" />,
    title: "Adresse",
    value: "Bureau A2.7, 2eme Etage, Le Doyen Medical, Av. Fattouma Bourguiba, La Soukra 2036",
    link: "https://maps.app.goo.gl/XGuLd9WbkAQvmSpu6",
    description: "Notre cabinet à La Soukra"
  },
  {
    icon: <TbClock size={32} className="text-highlight" />,
    title: "Horaires",
    value: "Lun-Ven\u00A0: 9h30-16h30 | Sam-Dim\u00A0: Fermé",
    link: null,
    description: "Sur rendez-vous uniquement"
  }
];

const socialLinks = [
  { icon: <FaWhatsapp size={24} />, name: "WhatsApp", link: "https://wa.me/21651617044", color: "text-green-500" },
  { icon: <FaInstagram size={24} />, name: "Instagram", link: "https://instagram.com/podomus", color: "text-pink-500" },
  { icon: <FaFacebook size={24} />, name: "Facebook", link: "https://facebook.com/podomus", color: "text-blue-600" }
];

const EASE = [0.23, 1, 0.32, 1] as const;

const formFieldVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: EASE } },
};

const formContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.03, delayChildren: 0.05 } },
};

export default function ContactPage() {
  const [openModal, setOpenModal] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  // Effet de transition de page
  useEffect(() => {
    setPageLoaded(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.');
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      } else {
        setSubmitStatus('error');
        setSubmitMessage(result.error || 'Une erreur est survenue lors de l\'envoi du message.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setSubmitMessage('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <main className="relative min-h-screen bg-neutralbg py-0 px-0 flex flex-col items-center justify-center">
      {/* Animation de transition de page */}
      <AnimatePresence>
        {!pageLoaded && (
          <motion.div
            className="fixed inset-0 z-50 bg-brand flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          >
            <motion.div
              className="text-white text-center"
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.02, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
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
                transition={{ delay: 0.1, duration: 0.15, ease: "easeOut" }}
              >
                Podomus
              </motion.h2>
              <motion.p
                className="text-white/80"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.15, ease: "easeOut" }}
              >
                Chargement de la page contact...
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
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.05, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Fond animé dynamique */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ 
            background: "radial-gradient(circle at 30% 30%, rgba(74,124,89,0.08) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(74,124,89,0.06) 0%, transparent 50%)" 
          }}
          animate={{ 
            background: [
              "radial-gradient(circle at 30% 30%, rgba(74,124,89,0.08) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(74,124,89,0.06) 0%, transparent 50%)",
              "radial-gradient(circle at 70% 30%, rgba(74,124,89,0.08) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(74,124,89,0.06) 0%, transparent 50%)",
              "radial-gradient(circle at 30% 30%, rgba(74,124,89,0.08) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(74,124,89,0.06) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Titre principal */}
        <motion.div className="relative z-10 text-center mb-8 px-4">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-brand mb-6"
            initial={{ y: 16, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          >
            <span className="block">Contact</span>
            <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mt-2 text-highlight">
              Podomus
            </span>
          </motion.h1>

          {/* Ligne décorative animée */}
          <motion.div
            className="w-32 h-1 bg-gradient-to-r from-brand via-highlight to-brand mx-auto rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          />
        </motion.div>

        {/* Description */}
        <motion.div
          className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 mb-12"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
        >
          <motion.div
            className="bg-white/95 backdrop-blur-sm rounded-2xl px-4 sm:px-6 md:px-8 py-4 sm:py-6 shadow-2xl border border-white/20"
            whileHover={{ 
              scale: 1.02, 
              boxShadow: "0 20px 60px rgba(64, 130, 109, 0.2)",
              borderColor: "#4A7C59"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.p
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-textmain text-center leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.2, ease: "easeOut" }}
            >
              Nous sommes là pour vous accompagner dans votre santé podologique. 
              Contactez-nous pour toute question ou pour prendre rendez-vous.
            </motion.p>
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

      {/* Informations de contact */}
      <section className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-center py-8 px-4 sm:px-6 md:px-8">
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand text-center mb-8 relative group"
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.05, ease: [0.23, 1, 0.32, 1] }}
        >
          Nos Coordonnées
          <motion.span
            className="absolute left-1/2 -bottom-2 h-1 w-0 bg-highlight group-hover:w-1/2 rounded transition-all duration-500"
            initial={{ width: 0 }}
            whileHover={{ width: "50%" }}
            style={{ left: "25%" }}
          />
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 w-full">
          {contactInfo.map((info, i) => (
            <motion.div
              key={info.title}
              className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col items-center text-center group relative overflow-hidden border border-transparent"
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.25, delay: i * 0.05, ease: [0.23, 1, 0.32, 1] }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 12px 40px 0 rgba(64, 130, 109, 0.18)",
                borderColor: "#4A7C59"
              }}
            >
              <motion.div
                className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-brand/10 mb-3 sm:mb-4 shadow"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {info.icon}
              </motion.div>
              
              <h3 className="text-base sm:text-lg font-bold text-brand mb-2">{info.title}</h3>
              
              {info.link ? (
                <a
                  href={info.link}
                  className="text-sm sm:text-base text-highlight font-semibold mb-2 hover:text-brand transition-colors duration-300 break-words"
                  target={info.link.startsWith('http') ? "_blank" : "_self"}
                  rel={info.link.startsWith('http') ? "noopener noreferrer" : ""}
                >
                  {info.value}
                </a>
              ) : (
                <p className="text-sm sm:text-base text-highlight font-semibold mb-2 break-words">{info.value}</p>
              )}
              
              <p className="text-xs sm:text-sm text-gray-600">{info.description}</p>
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

      {/* Formulaire de contact et carte */}
      <section className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center justify-center py-8 px-4 sm:px-6 md:px-8">
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand text-center mb-8 relative group"
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.05, ease: [0.23, 1, 0.32, 1] }}
        >
          Envoyez-nous un message
          <motion.span
            className="absolute left-1/2 -bottom-2 h-1 w-0 bg-highlight group-hover:w-1/2 rounded transition-all duration-500"
            initial={{ width: 0 }}
            whileHover={{ width: "50%" }}
            style={{ left: "25%" }}
          />
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 w-full">
          {/* Formulaire de contact */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8"
            initial={{ x: -16, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            whileHover={{ 
              boxShadow: "0 20px 60px rgba(64, 130, 109, 0.15)"
            }}
          >
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-4 sm:space-y-6"
              variants={formContainerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={formFieldVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-brand mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent transition-[border-color,box-shadow] duration-150 ease-out text-sm sm:text-base"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-brand mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent transition-[border-color,box-shadow] duration-150 ease-out text-sm sm:text-base"
                    placeholder="votre@email.com"
                  />
                </div>
              </motion.div>

              <motion.div variants={formFieldVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-brand mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent transition-[border-color,box-shadow] duration-150 ease-out text-sm sm:text-base"
                    placeholder="+216 XX XXX XXX"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-brand mb-2">
                    Sujet *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent transition-[border-color,box-shadow] duration-150 ease-out text-sm sm:text-base"
                  >
                    <option value="">Choisir un sujet</option>
                    <option value="rendez-vous">Prise de rendez-vous</option>
                    <option value="information">Demande d&apos;information</option>
                    <option value="urgence">Urgence</option>
                    <option value="autre">Autre</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">Pour toute urgence médicale, appelez directement le +216 51 617 044.</p>
                </div>
              </motion.div>

              <motion.div variants={formFieldVariants}>
                <label htmlFor="message" className="block text-sm font-semibold text-brand mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent transition-[border-color,box-shadow] duration-150 ease-out resize-none text-sm sm:text-base"
                  placeholder="Décrivez votre demande..."
                />
              </motion.div>

              {/* Messages de statut */}
              <AnimatePresence>
                {submitStatus !== 'idle' && (
                  <motion.div
                    key={submitStatus}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className={`p-3 rounded-lg text-sm ${
                      submitStatus === 'success' 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }`}
                  >
                    {submitMessage}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 sm:py-4 px-6 sm:px-8 rounded-lg font-semibold shadow-lg transition-[box-shadow] duration-150 flex items-center justify-center gap-2 group text-sm sm:text-base ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-brand text-white hover:shadow-xl'
                }`}
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.97 } : {}}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <TbMessageCircle size={18} className="sm:w-5 sm:h-5" />
                    Envoyer le message
                  </>
                )}
              </motion.button>
            </motion.form>
          </motion.div>

          {/* Carte et informations supplémentaires */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* Carte Google Maps */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="h-48 sm:h-64 md:h-80 relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3191.6529785084845!2d10.243496776443376!3d36.874724363494096!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12e2cb522f3ff977%3A0xd8ae67ac7e208f02!2sPodomus%20Sonda%20Affes%20Podologue%20Soukra!5e0!3m2!1sen!2stn!4v1774822964163!5m2!1sen!2stn"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localisation Podomus - Sonda Affes Podologue Soukra"
                />
              </div>
            </div>

            {/* Réseaux sociaux */}
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-4 sm:p-6"
              whileHover={{ 
                boxShadow: "0 20px 60px rgba(64, 130, 109, 0.15)"
              }}
            >
              <h3 className="text-lg sm:text-xl font-bold text-brand mb-3 sm:mb-4 text-center">Suivez-nous</h3>
              <div className="flex justify-center gap-3 sm:gap-4">
                {socialLinks.map((social, i) => (
                  <motion.a
                    key={social.name}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 sm:p-3 rounded-full bg-gray-100 hover:bg-brand/10 transition-all duration-300 ${social.color}`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.97 }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.25, delay: i * 0.05, ease: [0.23, 1, 0.32, 1] }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Informations supplémentaires */}
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-4 sm:p-6"
              whileHover={{ 
                boxShadow: "0 20px 60px rgba(64, 130, 109, 0.15)"
              }}
            >
              <h3 className="text-lg sm:text-xl font-bold text-brand mb-3 sm:mb-4 text-center">Informations pratiques</h3>
              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-700">
                <p><strong>Parking :</strong> Parking gratuit disponible</p>
                <p><strong>Accès :</strong> Métro et bus à proximité</p>
                <p><strong>Confidentialité :</strong> Cabinet médical privé</p>
                <p><strong>Paiement :</strong> Espèces, carte bancaire, chèque</p>
              </div>
            </motion.div>
          </motion.div>
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

      {/* Call to action */}
      <section className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center justify-center py-12">
        <motion.div
          className="bg-brand rounded-2xl shadow-xl p-8 flex flex-col items-center w-full"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        >
          <motion.h3
            className="text-2xl font-bold text-white mb-4 text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.25, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
          >
            Prêt à prendre rendez-vous ?
          </motion.h3>
          <motion.button
            onClick={() => setOpenModal(true)}
            className="bg-white text-brand px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group text-lg mt-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            Prendre rendez-vous
          </motion.button>
          <AppointmentModal open={openModal} onClose={() => setOpenModal(false)} />
        </motion.div>
      </section>
    </main>
  );
} 