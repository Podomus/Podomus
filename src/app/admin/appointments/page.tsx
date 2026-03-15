"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { authClient } from "@/lib/auth-client"
import { Calendar, Clock, Plus, Search, Trash } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { AppointmentCard } from "@/components/AppointmentCard"
import { format, addDays, startOfWeek, startOfDay, endOfDay } from "date-fns"
import { fr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { AppointmentActions } from "@/components/AppointmentActions"

// Types
interface Appointment {
  id: string
  patientName: string
  patientEmail: string
  patientPhone: string | null
  date: Date
  time: string
  duration: number
  reason: string | null
  notes: string | null
  status: string
  createdAt: Date
  updatedAt: Date
}

interface DayAppointment {
  id: string
  time: string
  patientName: string
  duration: number
  status: string
}

interface DayWithAppointments {
  date: Date
  appointments: DayAppointment[]
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

export default function AppointmentsPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [appointments, setAppointments] = React.useState<Appointment[]>([])
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date())
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [appointmentToDelete, setAppointmentToDelete] = React.useState<string | null>(null)

  // Créneaux horaires étendus - Synchronisés avec les autres pages
  const timeSlots = [
    // Matin étendu: 7h30 - 12h00
    "07:30", "08:00", "08:15", "08:30", "08:45", "09:00", "09:15", "09:30", "09:45", 
    "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45", "12:00",
    // Après-midi étendu: 13h30 - 19h00
    "13:30", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "15:45",
    "16:00", "16:15", "16:30", "16:45", "17:00", "17:15", "17:30", "17:45", 
    "18:00", "18:15", "18:30", "18:45", "19:00"
  ]

  // Fonction pour calculer les créneaux disponibles pour une date
  const calculateAvailableTimeSlots = React.useCallback((date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    const dayAppointments = appointments.filter(apt => 
      apt.date.toISOString().split('T')[0] === dateStr
    )
    
    return timeSlots.filter(timeSlot => {
      const isBooked = dayAppointments.some(apt => {
        const appointmentTime = apt.date.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
        return appointmentTime === timeSlot
      })
      return !isBooked
    })
  }, [appointments, timeSlots])

  // Form state for new appointment
  const [newAppointment, setNewAppointment] = React.useState({
    patientName: "",
    patientEmail: "",
    patientPhone: "",
    date: new Date(),
    time: "10:00",
    duration: 30,
    status: "scheduled"
  })

  // Fetch appointments data
  // État pour forcer le rechargement des rendez-vous
  const [refresh, setRefresh] = React.useState(0)
  
  // Fonction pour recharger les rendez-vous
  const reloadAppointments = () => {
    setRefresh(prev => prev + 1)
  }

  React.useEffect(() => {
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
        
        try {
          // Charger les rendez-vous depuis l'API
          const response = await fetch('/api/appointments')
          if (!response.ok) throw new Error('Erreur lors du chargement des rendez-vous')
          
          let appointments = await response.json()
          
          // Convertir les dates string en objets Date
          appointments = appointments.map((apt: any) => ({
            ...apt,
            date: new Date(apt.date),
            createdAt: new Date(apt.createdAt),
            updatedAt: new Date(apt.updatedAt)
          }))
          
          setAppointments(appointments)
        } catch (error) {
          console.error("Erreur lors du chargement des rendez-vous:", error)
          
          // Fallback aux données de test si l'API échoue
          const mockAppointments: Appointment[] = [
            {
              id: "1",
              patientName: "Sophie Dupont",
              patientEmail: "sophie.d@example.com",
              patientPhone: "0612345678",
              date: new Date(2025, 7, 12, 10, 0), // today 10:00
              time: "10:00",
              duration: 30,
              reason: "Consultation de routine",
              notes: "Problème à l'orteil droit",
              status: "scheduled",
              createdAt: new Date(2025, 7, 10),
              updatedAt: new Date(2025, 7, 10)
            },
            {
              id: "2",
              patientName: "Thomas Martin",
              patientEmail: "thomas.m@example.com",
              patientPhone: "0623456789",
              date: new Date(2025, 7, 12, 11, 0), // today 11:00
              time: "11:00",
              duration: 45,
              reason: "Douleur plantaire",
              notes: "Patient souffrant de fascite plantaire",
              status: "scheduled",
              createdAt: new Date(2025, 7, 8),
              updatedAt: new Date(2025, 7, 8)
            },
            {
              id: "3",
              patientName: "Marie Lambert",
              patientEmail: "marie.l@example.com",
              patientPhone: "0634567890",
              date: new Date(2025, 7, 12, 14, 30), // today 14:30
              time: "14:30",
              duration: 30,
              reason: "Suivi semelles orthopédiques",
              notes: null,
              status: "scheduled",
              createdAt: new Date(2025, 7, 9),
              updatedAt: new Date(2025, 7, 9)
            },
            {
              id: "4",
              patientName: "Lucas Bernard",
              patientEmail: "lucas.b@example.com",
              patientPhone: "0645678901",
              date: new Date(2025, 7, 13, 9, 0), // tomorrow 9:00
              time: "09:00",
              duration: 60,
              reason: "Traitement mycose",
              notes: "Traitement en cours depuis 3 semaines",
              status: "scheduled",
              createdAt: new Date(2025, 7, 7),
              updatedAt: new Date(2025, 7, 7)
            }
          ]
          
          setAppointments(mockAppointments)
          toast.error("Impossible de charger les rendez-vous depuis le serveur. Mode démo activé.")
        }
        
        setLoading(false)
      } catch (error) {
        console.error("Erreur lors de la vérification de session:", error)
        router.push("/login")
      }
    }

    checkAuth()
  }, [router, refresh])

  // Get appointments for selected day
  const getAppointmentsForDay = (day: Date): DayAppointment[] => {
    const startDay = startOfDay(day)
    const endDay = endOfDay(day)
    
    return appointments
      .filter(apt => apt.date >= startDay && apt.date <= endDay)
      .map(apt => ({
        id: apt.id,
        time: apt.time,
        patientName: apt.patientName,
        duration: apt.duration,
        status: apt.status
      }))
      .sort((a, b) => {
        // Sort by time
        const timeA = a.time.split(':').map(Number)
        const timeB = b.time.split(':').map(Number)
        return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1])
      })
  }

  // Get appointments for current week
  const getWeekAppointments = (): DayWithAppointments[] => {
    const today = new Date()
    const startDay = startOfWeek(today, { weekStartsOn: 1 }) // Start from Monday
    
    return Array.from({ length: 7 }).map((_, index) => {
      const day = addDays(startDay, index)
      return {
        date: day,
        appointments: getAppointmentsForDay(day)
      }
    })
  }

  // Filter appointments by search term
  const filteredAppointments = appointments.filter(apt => 
    apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.patientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.reason?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle appointment creation
  const handleCreateAppointment = async () => {
    try {
      // Create the appointment with the proper date object
      const appointmentDate = new Date(newAppointment.date)
      const [hours, minutes] = newAppointment.time.split(':').map(Number)
      appointmentDate.setHours(hours, minutes, 0)
      
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientName: newAppointment.patientName,
          patientEmail: newAppointment.patientEmail,
          patientPhone: newAppointment.patientPhone || null,
          date: appointmentDate.toISOString(),
          time: newAppointment.time,
          duration: newAppointment.duration,
          status: newAppointment.status,
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        // Si c'est un conflit de rendez-vous
        if (response.status === 409) {
          toast.error(errorData.message || 'Créneau déjà réservé')
          return
        }
        throw new Error(errorData.message || 'Erreur lors de la création du rendez-vous')
      }
      
      const createdAppointment = await response.json()
      
      // Reset form and close dialog
      setNewAppointment({
        patientName: "",
        patientEmail: "",
        patientPhone: "",
        date: new Date(),
        time: "10:00",
        duration: 30,
        status: "scheduled"
      })
      
      setIsAddDialogOpen(false)
      
      // Show success toast
      toast.success(`Rendez-vous pour ${createdAppointment.patientName} ajouté avec succès.`)
      
      // Reload appointments
      reloadAppointments()
    } catch (error) {
      console.error('Erreur lors de la création du rendez-vous:', error)
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue')
    }
  }

  // Handle appointment deletion
  const handleDeleteAppointment = async () => {
    if (!appointmentToDelete) return
    
    try {
      const response = await fetch(`/api/appointments/${appointmentToDelete}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erreur lors de la suppression du rendez-vous')
      }
      
      setAppointmentToDelete(null)
      setIsDeleteDialogOpen(false)
      
      toast.success("Le rendez-vous a été supprimé avec succès.")
      
      // Reload appointments
      reloadAppointments()
    } catch (error) {
      console.error('Erreur lors de la suppression du rendez-vous:', error)
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue')
    }
  }

  if (loading) {
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
          <p className="text-softtail-600 font-medium">Chargement...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="w-full bg-gradient-to-br from-softtail-50/30 to-white min-h-screen">
        {/* Header */}
        <motion.header 
          className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-softtail-100 bg-white/80 backdrop-blur-sm"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/dashboard" className="text-softtail-600 hover:text-softtail-700">
                  Tableau de bord
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-softtail-300" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-softtail-800 font-semibold">Rendez-vous</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </motion.header>

        {/* Contenu principal */}
        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* En-tête de la page */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <motion.div 
              className="space-y-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl font-bold text-softtail-800 flex items-center gap-2">
                <Calendar className="h-8 w-8 text-softtail-600" />
                Rendez-vous
              </h1>
              <p className="text-softtail-600">Gérez les rendez-vous des patients</p>
            </motion.div>

            <motion.div 
              className="flex items-center gap-3 w-full md:w-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-softtail-400" size={16} />
                <Input
                  placeholder="Rechercher un patient..." 
                  className="pl-10 bg-white border-softtail-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button 
                className="bg-softtail-600 hover:bg-softtail-700 text-white flex items-center gap-1"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus size={16} />
                <span>Nouveau</span>
              </Button>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendrier */}
            <motion.div
              className="col-span-1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border border-softtail-100 shadow-md overflow-hidden">
                <CardHeader className="bg-white pb-2">
                  <CardTitle className="text-lg text-softtail-800">Calendrier</CardTitle>
                </CardHeader>
                <CardContent className="pt-2 pb-6">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border-softtail-200"
                    locale={fr}
                  />
                </CardContent>
              </Card>

              <Card className="border border-softtail-100 shadow-md mt-6">
                <CardHeader className="bg-white pb-2">
                  <CardTitle className="text-lg text-softtail-800">Statistiques</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-softtail-600">Aujourd'hui</span>
                      <Badge className="bg-softtail-500">{getAppointmentsForDay(new Date()).length} RDV</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-softtail-600">Cette semaine</span>
                      <Badge className="bg-softtail-500">{
                        getWeekAppointments().reduce((total, day) => total + day.appointments.length, 0)
                      } RDV</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-softtail-600">En attente</span>
                      <Badge className="bg-amber-500">{
                        appointments.filter(apt => apt.status === "scheduled").length
                      } RDV</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Rendez-vous du jour */}
            <motion.div 
              className="col-span-1 lg:col-span-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border border-softtail-100 shadow-md h-full">
                <CardHeader className="bg-white pb-2 flex flex-row justify-between items-center">
                  <div>
                    <CardTitle className="text-lg text-softtail-800">
                      Rendez-vous du {format(selectedDate, "d MMMM yyyy", { locale: fr })}
                    </CardTitle>
                    <p className="text-softtail-500 text-sm">
                      {getAppointmentsForDay(selectedDate).length} rendez-vous planifiés
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  {getAppointmentsForDay(selectedDate).length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                      <Calendar className="h-12 w-12 text-softtail-300 mb-2" />
                      <h3 className="text-softtail-600 text-lg font-medium">Aucun rendez-vous</h3>
                      <p className="text-softtail-500 mt-1 max-w-xs">
                        Il n'y a pas de rendez-vous planifié pour cette date.
                      </p>
                      <Button 
                        className="mt-4 bg-softtail-600 hover:bg-softtail-700"
                        onClick={() => setIsAddDialogOpen(true)}
                      >
                        <Plus size={16} className="mr-1" />
                        Ajouter un rendez-vous
                      </Button>
                    </div>
                  ) : (
                    <Tabs defaultValue="all" className="w-full">
                      <TabsList className="mb-4 bg-softtail-50 w-full justify-start">
                        <TabsTrigger value="all" className="data-[state=active]:bg-white">
                          Tous ({getAppointmentsForDay(selectedDate).length})
                        </TabsTrigger>
                        <TabsTrigger 
                          value="scheduled" 
                          className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700"
                        >
                          Planifiés ({getAppointmentsForDay(selectedDate).filter(apt => apt.status === 'scheduled').length})
                        </TabsTrigger>
                        <TabsTrigger 
                          value="completed" 
                          className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
                        >
                          Terminés ({getAppointmentsForDay(selectedDate).filter(apt => apt.status === 'completed').length})
                        </TabsTrigger>
                        <TabsTrigger 
                          value="cancelled" 
                          className="data-[state=active]:bg-red-50 data-[state=active]:text-red-700"
                        >
                          Annulés ({getAppointmentsForDay(selectedDate).filter(apt => apt.status === 'cancelled').length})
                        </TabsTrigger>
                        <TabsTrigger 
                          value="no_show" 
                          className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700"
                        >
                          Absents ({getAppointmentsForDay(selectedDate).filter(apt => apt.status === 'no_show').length})
                        </TabsTrigger>
                      </TabsList>

                      {/* Onglet : Tous les rendez-vous */}
                      <TabsContent value="all" className="space-y-3 mt-0">
                        {getAppointmentsForDay(selectedDate).map((apt) => (
                          <AppointmentCard 
                            key={apt.id} 
                            appointment={apt}
                            onDelete={() => {
                              setAppointmentToDelete(apt.id)
                              setIsDeleteDialogOpen(true)
                            }}
                            onStatusChange={reloadAppointments}
                          />
                        ))}
                      </TabsContent>

                      {/* Onglet : Rendez-vous planifiés */}
                      <TabsContent value="scheduled" className="space-y-3 mt-0">
                        {getAppointmentsForDay(selectedDate)
                          .filter(apt => apt.status === 'scheduled')
                          .map((apt) => (
                            <AppointmentCard 
                              key={apt.id} 
                              appointment={apt}
                              onDelete={() => {
                                setAppointmentToDelete(apt.id)
                                setIsDeleteDialogOpen(true)
                              }}
                              onStatusChange={reloadAppointments}
                            />
                          ))}
                        {getAppointmentsForDay(selectedDate).filter(apt => apt.status === 'scheduled').length === 0 && (
                          <div className="text-center py-8 text-softtail-500">
                            Aucun rendez-vous planifié pour cette date
                          </div>
                        )}
                      </TabsContent>

                      {/* Onglet : Rendez-vous terminés */}
                      <TabsContent value="completed" className="space-y-3 mt-0">
                        {getAppointmentsForDay(selectedDate)
                          .filter(apt => apt.status === 'completed')
                          .map((apt) => (
                            <AppointmentCard 
                              key={apt.id} 
                              appointment={apt}
                              onDelete={() => {
                                setAppointmentToDelete(apt.id)
                                setIsDeleteDialogOpen(true)
                              }}
                              onStatusChange={reloadAppointments}
                            />
                          ))}
                        {getAppointmentsForDay(selectedDate).filter(apt => apt.status === 'completed').length === 0 && (
                          <div className="text-center py-8 text-softtail-500">
                            Aucun rendez-vous terminé pour cette date
                          </div>
                        )}
                      </TabsContent>

                      {/* Onglet : Rendez-vous annulés */}
                      <TabsContent value="cancelled" className="space-y-3 mt-0">
                        {getAppointmentsForDay(selectedDate)
                          .filter(apt => apt.status === 'cancelled')
                          .map((apt) => (
                            <AppointmentCard 
                              key={apt.id} 
                              appointment={apt}
                              onDelete={() => {
                                setAppointmentToDelete(apt.id)
                                setIsDeleteDialogOpen(true)
                              }}
                              onStatusChange={reloadAppointments}
                            />
                          ))}
                        {getAppointmentsForDay(selectedDate).filter(apt => apt.status === 'cancelled').length === 0 && (
                          <div className="text-center py-8 text-softtail-500">
                            Aucun rendez-vous annulé pour cette date
                          </div>
                        )}
                      </TabsContent>

                      {/* Onglet : Patients absents */}
                      <TabsContent value="no_show" className="space-y-3 mt-0">
                        {getAppointmentsForDay(selectedDate)
                          .filter(apt => apt.status === 'no_show')
                          .map((apt) => (
                            <AppointmentCard 
                              key={apt.id} 
                              appointment={apt}
                              onDelete={() => {
                                setAppointmentToDelete(apt.id)
                                setIsDeleteDialogOpen(true)
                              }}
                              onStatusChange={reloadAppointments}
                            />
                          ))}
                        {getAppointmentsForDay(selectedDate).filter(apt => apt.status === 'no_show').length === 0 && (
                          <div className="text-center py-8 text-softtail-500">
                            Aucun patient absent pour cette date
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

      {/* Dialog pour ajouter un rendez-vous */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nouveau rendez-vous</DialogTitle>
            <DialogDescription>
              Remplissez les détails pour créer un nouveau rendez-vous.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="patientName">Nom du patient</Label>
                <Input
                  id="patientName"
                  placeholder="Nom complet"
                  value={newAppointment.patientName}
                  onChange={(e) => setNewAppointment({...newAppointment, patientName: e.target.value})}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="patientEmail">Email</Label>
                <Input
                  id="patientEmail"
                  placeholder="email@exemple.com"
                  value={newAppointment.patientEmail}
                  onChange={(e) => setNewAppointment({...newAppointment, patientEmail: e.target.value})}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="patientPhone">Téléphone</Label>
                <Input
                  id="patientPhone"
                  placeholder="06 12 34 56 78"
                  value={newAppointment.patientPhone}
                  onChange={(e) => setNewAppointment({...newAppointment, patientPhone: e.target.value})}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {format(newAppointment.date, "PPP", { locale: fr })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={newAppointment.date}
                      onSelect={(date) => date && setNewAppointment({...newAppointment, date})}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="time">Heure</Label>
                <Select 
                  value={newAppointment.time} 
                  onValueChange={(value) => setNewAppointment({...newAppointment, time: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une heure" />
                  </SelectTrigger>
                  <SelectContent>
                    {calculateAvailableTimeSlots(newAppointment.date).map((time) => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="duration">Durée (minutes)</Label>
                <Select 
                  value={newAppointment.duration.toString()} 
                  onValueChange={(value) => setNewAppointment({...newAppointment, duration: parseInt(value)})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Durée" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="20">20 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 heure</SelectItem>
                    <SelectItem value="75">1h15</SelectItem>
                    <SelectItem value="90">1h30</SelectItem>
                    <SelectItem value="105">1h45</SelectItem>
                    <SelectItem value="120">2 heures</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <Label htmlFor="status">Statut</Label>
                <Select 
                  value={newAppointment.status} 
                  onValueChange={(value) => setNewAppointment({...newAppointment, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Planifié</SelectItem>
                    <SelectItem value="completed">Terminé</SelectItem>
                    <SelectItem value="cancelled">Annulé</SelectItem>
                    <SelectItem value="no_show">Absent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Annuler</Button>
            <Button className="bg-softtail-600 hover:bg-softtail-700" onClick={handleCreateAppointment}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Supprimer le rendez-vous</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce rendez-vous ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              variant="destructive" 
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteAppointment}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
