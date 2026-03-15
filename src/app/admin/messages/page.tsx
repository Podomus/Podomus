"use client"

import * as React from "react"
import { TbMessageCircle, TbEye, TbTrash, TbCheck, TbClock, TbArchive, TbMail, TbUser, TbPhone, TbCalendar } from "react-icons/tb"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import clsx from "clsx"
import { motion, AnimatePresence } from "framer-motion"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"


interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface UserSession {
  user?: {
    email: string
    name?: string
    image?: string | null
  }
}

// Animations
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const messageVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
}

export default function MessagesPage() {
  const router = useRouter()
  const [session, setSession] = React.useState<UserSession | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [messages, setMessages] = React.useState<ContactMessage[]>([])
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedTab, setSelectedTab] = useState<'new' | 'read' | 'replied' | 'archived'>('new')
  const [authLoading, setAuthLoading] = React.useState(true)

  // Vérification de l'authentification
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await authClient.getSession()
        if (!data) {
          router.push("/login")
          return
        }
        // Vérifier si c'est le bon compte admin
        if (data.user?.email !== "admin@podomus.local") {
          router.push("/login")
          return
        }
        setSession(data)
      } catch (error) {
        console.error("Erreur lors de la vérification de session:", error)
        router.push("/login")
      } finally {
        setAuthLoading(false)
      }
    }

    checkAuth()
  }, [router])

  // Masquer l'en-tête et le pied de page par défaut
  useEffect(() => {
    const header = document.querySelector("header")
    if (header) header.style.display = "none"
    const footer = document.querySelector("footer")
    if (footer) footer.style.display = "none"
    return () => {
      if (header) header.style.display = ""
      if (footer) footer.style.display = ""
    }
  }, [])

  useEffect(() => {
    if (!authLoading) {
      fetchMessages();
    }
    // eslint-disable-next-line
  }, [authLoading]);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/contact');
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (messageId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/contact/${messageId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setMessages(messages.map(msg =>
          msg.id === messageId ? { ...msg, status: newStatus } : msg
        ));
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return;

    try {
      const response = await fetch(`/api/contact/${messageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessages(messages.filter(msg => msg.id !== messageId));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'read': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'replied': return 'bg-green-100 text-green-800 border-green-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <TbClock className="w-4 h-4" />;
      case 'read': return <TbEye className="w-4 h-4" />;
      case 'replied': return <TbCheck className="w-4 h-4" />;
      default: return <TbMessageCircle className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Onglets pour filtrer les messages
  const tabs = [
    { key: 'new', label: `Nouveaux (${messages.filter(m => m.status === 'new').length})` },
    { key: 'read', label: `Lus (${messages.filter(m => m.status === 'read').length})` },
    { key: 'replied', label: `Répondus (${messages.filter(m => m.status === 'replied').length})` },
    { key: 'archived', label: `Archivés (${messages.filter(m => m.status === 'archived').length})` },
  ];
  const filteredMessages = messages.filter(m => m.status === selectedTab);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-softtail-50 to-white">
        <motion.div 
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-softtail-200 border-t-softtail-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-softtail-300 rounded-full animate-spin" style={{ animationDelay: '0.5s' }}></div>
          </div>
          <p className="text-softtail-600 font-medium">Chargement des messages...</p>
        </motion.div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="w-full bg-gradient-to-br from-softtail-50/30 to-white">
        {/* Header avec style Podomus */}
        <motion.header 
          className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-softtail-100 bg-white/80 backdrop-blur-sm"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/admin/dashboard" className="text-softtail-600 hover:text-softtail-700">
                  Tableau de bord
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block text-softtail-300" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-softtail-800 font-semibold">Messages</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          {session?.user && (
            <motion.div 
              className="flex items-center gap-3"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-softtail-800">{session.user.name || 'Administrateur'}</p>
                <p className="text-xs text-softtail-500">{session.user.email}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-softtail-500 to-softtail-600 flex items-center justify-center shadow-lg">
                <span className="text-sm font-bold text-white">
                  {(session.user.name || 'A').charAt(0).toUpperCase()}
                </span>
              </div>
            </motion.div>
          )}
        </motion.header>
        
        <div className="flex-1 overflow-auto p-6">
          <motion.div 
            className="space-y-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* En-tête de la page */}
            <div className="flex flex-col space-y-2">
              <motion.h1 
                className="text-3xl font-bold text-softtail-800"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Messages de contact
              </motion.h1>
              <motion.p 
                className="text-softtail-600"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Gérez les messages envoyés depuis le formulaire de contact
              </motion.p>
            </div>

            {/* Statistiques */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {[
                { label: "Total", count: messages.length, color: "bg-softtail-500", icon: TbMessageCircle },
                { label: "Nouveaux", count: messages.filter(m => m.status === 'new').length, color: "bg-blue-500", icon: TbClock },
                { label: "Lus", count: messages.filter(m => m.status === 'read').length, color: "bg-yellow-500", icon: TbEye },
                { label: "Répondus", count: messages.filter(m => m.status === 'replied').length, color: "bg-green-500", icon: TbCheck },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="relative overflow-hidden rounded-xl bg-white p-4 shadow-lg border border-softtail-100"
                  variants={fadeInUp}
                  whileHover={{ y: -2, scale: 1.02 }}
                >
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-softtail-100 rounded-full opacity-50"></div>
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-softtail-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-softtail-800">{stat.count}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Onglets de filtrage */}
            <motion.div 
              className="flex flex-wrap gap-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key as any)}
                  className={clsx(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    selectedTab === tab.key
                      ? "bg-softtail-500 text-white shadow-lg"
                      : "bg-white text-softtail-600 hover:bg-softtail-50 border border-softtail-200"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </motion.div>

            {/* Liste des messages */}
            <motion.div 
              className="space-y-4"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence mode="wait">
                {filteredMessages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    className="relative overflow-hidden rounded-xl bg-white p-6 shadow-lg border border-softtail-100 hover:shadow-xl transition-all duration-300"
                    variants={messageVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    whileHover={{ y: -2, scale: 1.01 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Forme organique décorative */}
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-softtail-100 rounded-full opacity-30"></div>
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-softtail-100 rounded-lg">
                              <TbUser className="h-4 w-4 text-softtail-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-softtail-800">{message.name}</h3>
                              <p className="text-sm text-softtail-600">{message.email}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">

                          <div className="flex items-center gap-1 text-xs text-softtail-500">
                            <TbCalendar className="h-3 w-3" />
                            {formatDate(message.createdAt)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-softtail-800 mb-1">{message.subject}</h4>
                          <p className="text-sm text-softtail-600 line-clamp-2">
                            {message.message}
                          </p>
                        </div>
                        
                        {message.phone && (
                          <div className="flex items-center gap-2 text-sm text-softtail-600">
                            <TbPhone className="h-4 w-4" />
                            <span>{message.phone}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-softtail-100">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedMessage(message);
                            setShowModal(true);
                          }}
                          className="text-softtail-600 border-softtail-200 hover:bg-softtail-50"
                        >
                          <TbEye className="h-4 w-4 mr-1" />
                          Voir détails
                        </Button>
                        
                        {message.status === 'new' && (
                          <Button
                            size="sm"
                            onClick={() => updateMessageStatus(message.id, 'read')}
                            className="bg-softtail-500 hover:bg-softtail-600"
                          >
                            <TbEye className="h-4 w-4 mr-1" />
                            Marquer lu
                          </Button>
                        )}
                        
                        {message.status === 'read' && (
                          <Button
                            size="sm"
                            onClick={() => updateMessageStatus(message.id, 'replied')}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <TbCheck className="h-4 w-4 mr-1" />
                            Marquer répondu
                          </Button>
                        )}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateMessageStatus(message.id, 'archived')}
                          className="text-gray-600 border-gray-200 hover:bg-gray-50"
                        >
                          <TbArchive className="h-4 w-4 mr-1" />
                          Archiver
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteMessage(message.id)}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <TbTrash className="h-4 w-4 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {filteredMessages.length === 0 && (
                <motion.div 
                  className="text-center py-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="mx-auto w-16 h-16 bg-softtail-100 rounded-full flex items-center justify-center mb-4">
                    <TbMessageCircle className="h-8 w-8 text-softtail-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-softtail-800 mb-2">Aucun message</h3>
                  <p className="text-softtail-600">
                    Aucun message trouvé pour cette catégorie.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Modal de détail du message */}
        <AnimatePresence>
          {showModal && selectedMessage && (
            <motion.div 
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-softtail-800">Détails du message</h2>
                    <button
                      onClick={() => setShowModal(false)}
                      className="rounded-lg p-2 hover:bg-softtail-50 transition-colors"
                    >
                      <span className="sr-only">Fermer</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 text-softtail-600"
                      >
                        <path d="M18 6L6 18" />
                        <path d="M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-softtail-600 flex items-center gap-2">
                          <TbUser className="h-4 w-4" />
                          De
                        </p>
                        <p className="text-softtail-800 font-medium">{selectedMessage.name}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-softtail-600 flex items-center gap-2">
                          <TbMail className="h-4 w-4" />
                          Email
                        </p>
                        <p className="text-softtail-800">{selectedMessage.email}</p>
                      </div>
                      
                      {selectedMessage.phone && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-softtail-600 flex items-center gap-2">
                            <TbPhone className="h-4 w-4" />
                            Téléphone
                          </p>
                          <p className="text-softtail-800">{selectedMessage.phone}</p>
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-softtail-600 flex items-center gap-2">
                          <TbCalendar className="h-4 w-4" />
                          Date
                        </p>
                        <p className="text-softtail-800">{formatDate(selectedMessage.createdAt)}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-softtail-600">Sujet</p>
                      <p className="text-softtail-800 font-medium">{selectedMessage.subject}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-softtail-600">Message</p>
                      <div className="mt-2 rounded-lg bg-softtail-50 p-4 border border-softtail-100">
                        <p className="text-softtail-800 whitespace-pre-line leading-relaxed">{selectedMessage.message}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-6 border-t border-softtail-100">
                      <Button
                        variant="outline"
                        onClick={() => setShowModal(false)}
                        className="text-softtail-600 border-softtail-200 hover:bg-softtail-50"
                      >
                        Fermer
                      </Button>
                      <Button
                        onClick={() => {
                          window.open(`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`, '_blank');
                          setShowModal(false);
                        }}
                        className="bg-softtail-500 hover:bg-softtail-600"
                      >
                        <TbMail className="h-4 w-4 mr-2" />
                        Répondre
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  )
}