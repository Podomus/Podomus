"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { authClient } from "@/lib/auth-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, Users, Package, ChevronRight, Activity, AlertTriangle, LogOut } from "lucide-react"

// Types
interface DashboardStats {
  totalPatients: number
  totalAppointments: number
  totalProducts: number
  upcomingAppointments: number
  completedAppointments: number
  pendingProducts: number
  deliveredProducts: number
}

// Animation variants
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

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [userSession, setUserSession] = React.useState<any>(null)
  const [stats, setStats] = React.useState<DashboardStats>({
    totalPatients: 0,
    totalAppointments: 0,
    totalProducts: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    pendingProducts: 0,
    deliveredProducts: 0
  })
  const [recentAppointments, setRecentAppointments] = React.useState<any[]>([])
  const [pendingDeliveries, setPendingDeliveries] = React.useState<any[]>([])

  // Fonction de déconnexion
  const handleLogout = async () => {
    try {
      await authClient.signOut()
      router.push("/login")
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
    }
  }
  // Fetch dashboard data
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await authClient.getSession()
        if (!data?.user) {
          console.log("Aucune session active, redirection vers login")
          router.push("/login")
          return
        }
        
        // Stocker les informations de session
        setUserSession(data)
        console.log("Session utilisateur active:", data.user.email)
        
        // Vérifier si c'est le bon compte admin
        if (data.user?.email !== "admin@podomus.local") {
          console.log("Utilisateur non autorisé:", data.user.email)
          router.push("/login")
          return
        }
        
        try {
          // Charger les données réelles depuis les APIs
          const [statsResponse, appointmentsResponse, deliveriesResponse] = await Promise.all([
            fetch('/api/admin/stats'),
            fetch('/api/admin/recent-appointments'),
            fetch('/api/admin/pending-deliveries')
          ])

          if (statsResponse.ok) {
            const statsData = await statsResponse.json()
            setStats(statsData)
          }

          if (appointmentsResponse.ok) {
            const appointmentsData = await appointmentsResponse.json()
            // Convertir les dates string en objets Date
            const formattedAppointments = appointmentsData.map((apt: any) => ({
              ...apt,
              date: new Date(apt.date)
            }))
            setRecentAppointments(formattedAppointments)
          }

          if (deliveriesResponse.ok) {
            const deliveriesData = await deliveriesResponse.json()
            // Convertir les dates string en objets Date
            const formattedDeliveries = deliveriesData.map((delivery: any) => ({
              ...delivery,
              dateLivraison: delivery.dateLivraison ? new Date(delivery.dateLivraison) : null
            }))
            setPendingDeliveries(formattedDeliveries)
          }

          setLoading(false)
          
        } catch (error) {
          console.error('Error fetching dashboard data:', error)
          setLoading(false)
        }
      } catch (error) {
        console.error('Authentication error:', error)
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }
  
  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get appointment status label and color
  const getAppointmentStatus = (status: string) => {
    switch (status) {
      case 'scheduled':
        return { label: 'Planifié', color: 'bg-amber-500' }
      case 'completed':
        return { label: 'Terminé', color: 'bg-green-500' }
      case 'cancelled':
        return { label: 'Annulé', color: 'bg-red-500' }
      case 'no_show':
        return { label: 'Absent', color: 'bg-orange-500' }
      default:
        return { label: status, color: 'bg-gray-500' }
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
            {/* Header avec breadcrumb et session */}
            <div className="mb-6">
              <div className="flex justify-between items-start mb-4">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Tableau de bord</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
                
                {/* Indicateur de session */}
                {userSession && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-3 text-sm text-softtail-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Connecté en tant que: <strong>{userSession.user?.email}</strong></span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg border border-red-200 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
              <h1 className="text-2xl font-bold mt-2 text-softtail-800">Tableau de bord</h1>
            </div>
            
            {loading ? (
              <div className="text-center py-10">
                <p>Chargement des données...</p>
              </div>
            ) : (
              <>
                {/* Statistiques générales */}
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
                >
                  <motion.div variants={fadeInUp}>
                    <Card className="border border-softtail-100 hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-softtail-600 flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          Patients
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-softtail-800">
                          {stats.totalPatients}
                        </div>
                        <p className="text-xs text-softtail-500">Total des patients</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  <motion.div variants={fadeInUp}>
                    <Card className="border border-softtail-100 hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-softtail-600 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Rendez-vous
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-softtail-800">
                          {stats.totalAppointments}
                        </div>
                        <div className="flex items-center justify-between text-xs text-softtail-500">
                          <span>Total des rendez-vous</span>
                          <span className="text-green-600 font-medium">{stats.upcomingAppointments} à venir</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  <motion.div variants={fadeInUp}>
                    <Card className="border border-softtail-100 hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-softtail-600 flex items-center">
                          <Package className="h-4 w-4 mr-1" />
                          Semelles
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-softtail-800">
                          {stats.totalProducts}
                        </div>
                        <div className="flex items-center justify-between text-xs text-softtail-500">
                          <span>Total des semelles</span>
                          <span className="text-amber-600 font-medium">{stats.pendingProducts} en attente</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  <motion.div variants={fadeInUp}>
                    <Card className="border border-softtail-100 hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-softtail-600 flex items-center">
                          <Activity className="h-4 w-4 mr-1" />
                          Activité
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 -mt-1">
                          <div className="text-xl font-bold text-softtail-800">
                            92%
                          </div>
                          <div className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                            +3%
                          </div>
                        </div>
                        <p className="text-xs text-softtail-500">Taux de rendez-vous honorés</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Prochains rendez-vous */}
                  <Card className="border border-softtail-100">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center">
                          <Clock className="h-5 w-5 mr-2 text-softtail-500" />
                          Prochains rendez-vous
                        </span>
                        <button 
                          onClick={() => router.push('/admin/appointments')}
                          className="text-xs text-softtail-500 hover:text-softtail-700 flex items-center"
                        >
                          Voir tout
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentAppointments.map((appointment) => {
                          const status = getAppointmentStatus(appointment.status)
                          return (
                            <div 
                              key={appointment.id} 
                              className="flex items-center justify-between pb-2 border-b border-gray-100 last:border-0"
                            >
                              <div>
                                <p className="font-medium text-sm">{appointment.patientName}</p>
                                <div className="flex items-center text-xs text-softtail-500 mt-1">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatDate(appointment.date)} à {formatTime(appointment.date)}
                                </div>
                              </div>
                              <div className={`text-xs px-2 py-1 rounded-full text-white ${status.color}`}>
                                {status.label}
                              </div>
                            </div>
                          )
                        })}
                        
                        {recentAppointments.length === 0 && (
                          <div className="text-center py-6 text-softtail-500">
                            Aucun rendez-vous prévu prochainement
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Livraisons prévues */}
                  <Card className="border border-softtail-100">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center">
                          <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                          Livraisons prévues
                        </span>
                        <button 
                          onClick={() => router.push('/admin/orders')}
                          className="text-xs text-softtail-500 hover:text-softtail-700 flex items-center"
                        >
                          Voir tout
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {pendingDeliveries.map((delivery) => (
                          <div 
                            key={delivery.id} 
                            className="flex items-center justify-between pb-2 border-b border-gray-100 last:border-0"
                          >
                            <div>
                              <p className="font-medium text-sm">{delivery.patientName}</p>
                              <p className="text-xs text-softtail-600 mt-1">{delivery.type}</p>
                              <div className="flex items-center text-xs text-amber-600 mt-1">
                                <Calendar className="h-3 w-3 mr-1" />
                                {delivery.dateLivraison ? (
                                  `Livraison prévue le ${formatDate(delivery.dateLivraison)}`
                                ) : (
                                  'Date de livraison à définir'
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {pendingDeliveries.length === 0 && (
                          <div className="text-center py-6 text-softtail-500">
                            Aucune livraison en attente
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </div>
        </div>
  )
}
