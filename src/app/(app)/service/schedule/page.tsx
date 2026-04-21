"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaCalendarAlt, FaClock, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCheckCircle } from "react-icons/fa";
import AppointmentModal from "@/components/AppointmentModal";

export default function SchedulePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scheduleData = {
    weekdays: [
      { day: "Lundi", hours: "9:00 - 18:00", status: "Ouvert" },
      { day: "Mardi", hours: "9:00 - 18:00", status: "Ouvert" },
      { day: "Mercredi", hours: "9:00 - 18:00", status: "Ouvert" },
      { day: "Jeudi", hours: "9:00 - 18:00", status: "Ouvert" },
      { day: "Vendredi", hours: "9:00 - 18:00", status: "Ouvert" },
      { day: "Samedi", hours: "9:00 - 13:00", status: "Ouvert" },
      { day: "Dimanche", hours: "Fermé", status: "Fermé" }
    ],
    contact: {
      phone: { number: "+216 51 617 044", href: "tel:+21651617044" },
      email: { address: "contact@podomus.tn", href: "mailto:contact@podomus.tn" },
      address: { text: "Imm. Golf Center 2, Bureau BM2, La Soukra 2036", href: "https://maps.app.goo.gl/uV382aFHbzwSFruK9" }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="bg-white shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Horaires et Rendez-vous
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Planifiez votre consultation podologique en toute simplicité. 
              Nos horaires flexibles s&apos;adaptent à votre emploi du temps.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Horaires */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-center mb-6">
              <FaClock className="text-3xl text-blue-600 mr-4" />
              <h2 className="text-2xl font-bold text-gray-900">Nos Horaires</h2>
            </div>
            
            <div className="space-y-4">
              {scheduleData.weekdays.map((item, index) => (
                <motion.div
                  key={item.day}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.3, delay: index * 0.05, ease: [0.23, 1, 0.32, 1] }}
                  className={`flex justify-between items-center p-4 rounded-lg ${
                    item.status === "Ouvert" 
                      ? "bg-green-50 border border-green-200" 
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <span className="font-semibold text-gray-900">{item.day}</span>
                  <div className="text-right">
                    <span className={`font-medium ${
                      item.status === "Ouvert" ? "text-green-600" : "text-gray-500"
                    }`}>
                      {item.hours}
                    </span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === "Ouvert" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Prise de rendez-vous */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-center mb-6">
              <FaCalendarAlt className="text-3xl text-blue-600 mr-4" />
              <h2 className="text-2xl font-bold text-gray-900">Prendre Rendez-vous</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  Consultation rapide et efficace
                </h3>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-500 mr-2" />
                    Rendez-vous en ligne 24h/24
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-500 mr-2" />
                    Confirmation immédiate par email
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-500 mr-2" />
                    Rappel automatique 24h avant
                  </li>
                  <li className="flex items-center">
                    <FaCheckCircle className="text-green-500 mr-2" />
                    Annulation gratuite jusqu&apos;à 24h avant
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-[transform,background-color] duration-150 hover:scale-105 active:scale-[0.97]"
              >
                Prendre Rendez-vous Maintenant
              </button>
            </div>
          </motion.div>
        </div>

        {/* Contact Info */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="mt-12 bg-white rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Informations de Contact
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <FaPhone className="text-3xl text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Téléphone</h3>
              <p className="text-gray-600">
                <a href={scheduleData.contact.phone.href} className="text-blue-600 hover:text-blue-800">
                  {scheduleData.contact.phone.number}
                </a>
              </p>
            </div>
            
            <div className="text-center">
              <FaEnvelope className="text-3xl text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">
                <a href={scheduleData.contact.email.href} className="text-blue-600 hover:text-blue-800">
                  {scheduleData.contact.email.address}
                </a>
              </p>
            </div>
            
            <div className="text-center">
              <FaMapMarkerAlt className="text-3xl text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Adresse</h3>
              <p className="text-gray-600">
                <a href={scheduleData.contact.address.href} className="text-blue-600 hover:text-blue-800">
                  {scheduleData.contact.address.text}
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <AppointmentModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
} 