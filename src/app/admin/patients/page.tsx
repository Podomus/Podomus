"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { authClient } from "@/lib/auth-client"
import { Search, Plus, Edit, Trash, FileText, CalendarPlus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

// Types
interface Patient {
  id: string
  nom: string
  prenom: string
  dateNaissance?: Date
  email?: string
  telephone?: string
  adresse?: string
  codePostal?: string
  ville?: string
  numSecu?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
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

export default function PatientsPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [patients, setPatients] = React.useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = React.useState(false)
  const [patientToEdit, setPatientToEdit] = React.useState<Patient | null>(null)
  const [patientToDelete, setPatientToDelete] = React.useState<string | null>(null)
  const [patientForAppointment, setPatientForAppointment] = React.useState<Patient | null>(null)

  // États pour la gestion des créneaux disponibles
  const [existingAppointments, setExistingAppointments] = React.useState<any[]>([])
  const [availableTimeSlots, setAvailableTimeSlots] = React.useState<string[]>([])

  // Créneaux horaires par défaut - Étendus avec plus d'options
  const defaultTimeSlots = [
    // Matin étendu: 7h30 - 12h00
    "07:30", "08:00", "08:15", "08:30", "08:45", "09:00", "09:15", "09:30", "09:45", 
    "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45", "12:00",
    // Après-midi étendu: 13h30 - 19h00
    "13:30", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "15:45",
    "16:00", "16:15", "16:30", "16:45", "17:00", "17:15", "17:30", "17:45", 
    "18:00", "18:15", "18:30", "18:45", "19:00"
  ]

  // Form state for new patient
  const [newPatient, setNewPatient] = React.useState({
    nom: "",
    prenom: "",
    dateNaissance: "",
    email: "",
    telephone: "",
    adresse: "",
    codePostal: "",
    ville: "",
    numSecu: "",
    notes: ""
  })

  // Form state for new appointment
  const [newAppointment, setNewAppointment] = React.useState({
    date: "",
    time: "",
    duration: "30",
    notes: ""
  })

  // État pour forcer le rechargement des patients
  const [refresh, setRefresh] = React.useState(0)
  
  // Fonction pour recharger les patients
  const reloadPatients = () => {
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
          // Charger les patients depuis l'API
          const response = await fetch('/api/patients')
          if (!response.ok) throw new Error('Erreur lors du chargement des patients')
          
          let patients = await response.json()
          
          // Convertir les dates string en objets Date
          patients = patients.map((pat: any) => ({
            ...pat,
            dateNaissance: pat.dateNaissance ? new Date(pat.dateNaissance) : undefined,
            createdAt: new Date(pat.createdAt),
            updatedAt: new Date(pat.updatedAt)
          }))
          
          setPatients(patients)
          await loadExistingAppointments()
        } catch (error) {
          toast.error('Erreur lors du chargement des patients')
          console.error('Error fetching patients:', error)
        } finally {
          setLoading(false)
        }
      } catch (error) {
        console.error('Authentication error:', error)
        router.push("/login")
      }
    }

    checkAuth()
  }, [router, refresh])

  // Filter patients by search term
  const filteredPatients = patients.filter(patient => 
    patient.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.telephone?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle patient creation
  const handleCreatePatient = async () => {
    try {
      // Conversion de la date de naissance
      const dateNaissance = newPatient.dateNaissance ? new Date(newPatient.dateNaissance) : undefined
      
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: newPatient.nom,
          prenom: newPatient.prenom,
          dateNaissance: dateNaissance?.toISOString(),
          email: newPatient.email || undefined,
          telephone: newPatient.telephone || undefined,
          adresse: newPatient.adresse || undefined,
          codePostal: newPatient.codePostal || undefined,
          ville: newPatient.ville || undefined,
          numSecu: newPatient.numSecu || undefined,
          notes: newPatient.notes || undefined
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erreur lors de la création du patient')
      }
      
      // Réinitialisation du formulaire
      setNewPatient({
        nom: "",
        prenom: "",
        dateNaissance: "",
        email: "",
        telephone: "",
        adresse: "",
        codePostal: "",
        ville: "",
        numSecu: "",
        notes: ""
      })
      
      // Fermeture du dialogue et rechargement des patients
      setIsAddDialogOpen(false)
      toast.success('Patient créé avec succès')
      reloadPatients()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue')
    }
  }

  // Handle patient update
  const handleUpdatePatient = async () => {
    if (!patientToEdit) return
    
    try {
      // Conversion de la date de naissance
      const dateNaissance = newPatient.dateNaissance ? new Date(newPatient.dateNaissance) : undefined
      
      const response = await fetch(`/api/patients/${patientToEdit.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: newPatient.nom,
          prenom: newPatient.prenom,
          dateNaissance: dateNaissance?.toISOString(),
          email: newPatient.email || undefined,
          telephone: newPatient.telephone || undefined,
          adresse: newPatient.adresse || undefined,
          codePostal: newPatient.codePostal || undefined,
          ville: newPatient.ville || undefined,
          numSecu: newPatient.numSecu || undefined,
          notes: newPatient.notes || undefined
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erreur lors de la mise à jour du patient')
      }
      
      // Réinitialisation du formulaire et état
      setPatientToEdit(null)
      setNewPatient({
        nom: "",
        prenom: "",
        dateNaissance: "",
        email: "",
        telephone: "",
        adresse: "",
        codePostal: "",
        ville: "",
        numSecu: "",
        notes: ""
      })
      
      // Fermeture du dialogue et rechargement des patients
      setIsEditDialogOpen(false)
      toast.success('Patient mis à jour avec succès')
      reloadPatients()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue')
    }
  }

  // Handle patient deletion
  const handleDeletePatient = async () => {
    if (!patientToDelete) return
    
    try {
      const response = await fetch(`/api/patients/${patientToDelete}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erreur lors de la suppression du patient')
      }
      
      // Réinitialisation de l'état
      setPatientToDelete(null)
      
      // Fermeture du dialogue et rechargement des patients
      setIsDeleteDialogOpen(false)
      toast.success('Patient supprimé avec succès')
      reloadPatients()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue')
    }
  }

  const handleCreateAppointment = async () => {
    if (!patientForAppointment || !newAppointment.date || !newAppointment.time) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    try {
      const appointmentData = {
        patientId: patientForAppointment.id,
        patientName: `${patientForAppointment.prenom} ${patientForAppointment.nom}`,
        patientEmail: patientForAppointment.email || '',
        patientPhone: patientForAppointment.telephone || '',
        date: new Date(newAppointment.date),
        time: newAppointment.time,
        duration: parseInt(newAppointment.duration),
        status: 'scheduled',
        notes: newAppointment.notes
      }

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData)
      })

      if (response.ok) {
        toast.success('Rendez-vous créé avec succès')
        setIsAppointmentDialogOpen(false)
        setPatientForAppointment(null)
        setNewAppointment({
          date: "",
          time: "",
          duration: "30",
          notes: ""
        })
        // Recharger les rendez-vous pour mettre à jour les créneaux disponibles
        await loadExistingAppointments()
      } else {
        toast.error('Erreur lors de la création du rendez-vous')
      }
    } catch (error) {
      console.error('Error creating appointment:', error)
      toast.error('Erreur lors de la création du rendez-vous')
    }
  }

  // Fonction pour charger les rendez-vous existants
  const loadExistingAppointments = async () => {
    try {
      const response = await fetch('/api/appointments')
      if (response.ok) {
        const appointments = await response.json()
        setExistingAppointments(appointments)
      }
    } catch (error) {
      console.error('Error loading appointments:', error)
    }
  }

  // Fonction pour calculer les créneaux disponibles pour une date donnée
  const calculateAvailableTimeSlots = (selectedDate: string) => {
    if (!selectedDate) {
      setAvailableTimeSlots(defaultTimeSlots)
      return
    }

    const selectedDateObj = new Date(selectedDate)
    const today = new Date()
    
    // Si c'est aujourd'hui, filtrer les heures passées
    let filteredSlots = [...defaultTimeSlots]
    if (selectedDateObj.toDateString() === today.toDateString()) {
      const currentTime = today.getHours() * 60 + today.getMinutes()
      filteredSlots = defaultTimeSlots.filter(slot => {
        const [hours, minutes] = slot.split(':').map(Number)
        const slotTime = hours * 60 + minutes
        return slotTime > currentTime + 15 // Réduire la marge à 15 min
      })
    }

    // Filtrer les créneaux déjà réservés pour cette date
    const dayAppointments = existingAppointments.filter(apt => {
      const aptDate = new Date(apt.date)
      return aptDate.toDateString() === selectedDateObj.toDateString()
    })

    const reservedSlots = dayAppointments.map(apt => apt.time)
    const availableSlots = filteredSlots.filter(slot => !reservedSlots.includes(slot))
    
    setAvailableTimeSlots(availableSlots)
  }

  // Ouvre le dialogue d'édition et prérempli les champs
  const openEditDialog = (patient: Patient) => {
    setPatientToEdit(patient)
    setNewPatient({
      nom: patient.nom,
      prenom: patient.prenom,
      dateNaissance: patient.dateNaissance ? patient.dateNaissance.toISOString().split('T')[0] : "",
      email: patient.email || "",
      telephone: patient.telephone || "",
      adresse: patient.adresse || "",
      codePostal: patient.codePostal || "",
      ville: patient.ville || "",
      numSecu: patient.numSecu || "",
      notes: patient.notes || ""
    })
    setIsEditDialogOpen(true)
  }

  // Fonction pour voir les détails d'un patient (vers une page spécifique)
  const viewPatientDetails = (patientId: string) => {
    router.push(`/admin/patients/${patientId}`)
  }

  return (
    <>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
            {/* Header avec breadcrumb */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <Breadcrumb className="mb-4 sm:mb-0">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Patients</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              
              <Button 
                className="bg-softtail-600 hover:bg-softtail-700"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus size={16} className="mr-1" /> Nouveau patient
              </Button>
            </div>
            
            {/* Barre de recherche */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-softtail-400" size={18} />
                <Input
                  className="pl-10 border-softtail-200 bg-white"
                  placeholder="Rechercher un patient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {/* Liste des patients */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {loading ? (
                <p>Chargement des patients...</p>
              ) : filteredPatients.length === 0 ? (
                <p>Aucun patient trouvé.</p>
              ) : (
                filteredPatients.map(patient => (
                  <motion.div
                    key={patient.id}
                    variants={fadeInUp}
                    className="bg-white rounded-lg shadow p-4 border border-softtail-100"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-softtail-800">
                          {patient.nom} {patient.prenom}
                        </h3>
                        <p className="text-sm text-softtail-500 mt-1">
                          {patient.dateNaissance && `Né(e) le: ${patient.dateNaissance.toLocaleDateString()}`}
                        </p>
                        {patient.email && (
                          <p className="text-sm text-softtail-600 mt-2">
                            Email: {patient.email}
                          </p>
                        )}
                        {patient.telephone && (
                          <p className="text-sm text-softtail-600">
                            Tél: {patient.telephone}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-blue-600 border-blue-200"
                          onClick={() => {
                            setPatientForAppointment(patient)
                            setIsAppointmentDialogOpen(true)
                          }}
                          title="Créer un rendez-vous"
                        >
                          <CalendarPlus size={14} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-softtail-600 border-softtail-200"
                          onClick={() => viewPatientDetails(patient.id)}
                        >
                          <FileText size={14} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-amber-600 border-amber-200"
                          onClick={() => openEditDialog(patient)}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 border-red-200"
                          onClick={() => {
                            setPatientToDelete(patient.id)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash size={14} />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>
        </div>

      {/* Dialog pour ajouter un patient */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Nouveau patient</DialogTitle>
            <DialogDescription>
              Remplissez les détails pour créer une fiche patient.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <Label htmlFor="nom" className="text-softtail-700">Nom *</Label>
                <Input
                  id="nom"
                  placeholder="Nom"
                  value={newPatient.nom}
                  onChange={(e) => setNewPatient({...newPatient, nom: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="col-span-1">
                <Label htmlFor="prenom" className="text-softtail-700">Prénom *</Label>
                <Input
                  id="prenom"
                  placeholder="Prénom"
                  value={newPatient.prenom}
                  onChange={(e) => setNewPatient({...newPatient, prenom: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="col-span-1">
                <Label htmlFor="dateNaissance" className="text-softtail-700">Date de naissance</Label>
                <Input
                  id="dateNaissance"
                  type="date"
                  value={newPatient.dateNaissance}
                  onChange={(e) => setNewPatient({...newPatient, dateNaissance: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="col-span-1">
                <Label htmlFor="numSecu" className="text-softtail-700">N° Sécurité Sociale</Label>
                <Input
                  id="numSecu"
                  placeholder="N° Sécurité Sociale"
                  value={newPatient.numSecu}
                  onChange={(e) => setNewPatient({...newPatient, numSecu: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="col-span-1">
                <Label htmlFor="email" className="text-softtail-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={newPatient.email}
                  onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="col-span-1">
                <Label htmlFor="telephone" className="text-softtail-700">Téléphone</Label>
                <Input
                  id="telephone"
                  placeholder="06 XX XX XX XX"
                  value={newPatient.telephone}
                  onChange={(e) => setNewPatient({...newPatient, telephone: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="adresse" className="text-softtail-700">Adresse</Label>
                <Input
                  id="adresse"
                  placeholder="Adresse"
                  value={newPatient.adresse}
                  onChange={(e) => setNewPatient({...newPatient, adresse: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="col-span-1">
                <Label htmlFor="codePostal" className="text-softtail-700">Code Postal</Label>
                <Input
                  id="codePostal"
                  placeholder="Code Postal"
                  value={newPatient.codePostal}
                  onChange={(e) => setNewPatient({...newPatient, codePostal: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="col-span-1">
                <Label htmlFor="ville" className="text-softtail-700">Ville</Label>
                <Input
                  id="ville"
                  placeholder="Ville"
                  value={newPatient.ville}
                  onChange={(e) => setNewPatient({...newPatient, ville: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="notes" className="text-softtail-700">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Informations complémentaires..."
                  value={newPatient.notes}
                  onChange={(e) => setNewPatient({...newPatient, notes: e.target.value})}
                  className="mt-1 resize-none h-24"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button 
              className="bg-softtail-600 hover:bg-softtail-700"
              onClick={handleCreatePatient}
              disabled={!newPatient.nom || !newPatient.prenom}
            >
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour modifier un patient */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier un patient</DialogTitle>
            <DialogDescription>
              Modifiez les informations du patient.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <Label htmlFor="edit-nom" className="text-softtail-700">Nom *</Label>
                <Input
                  id="edit-nom"
                  placeholder="Nom"
                  value={newPatient.nom}
                  onChange={(e) => setNewPatient({...newPatient, nom: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="col-span-1">
                <Label htmlFor="edit-prenom" className="text-softtail-700">Prénom *</Label>
                <Input
                  id="edit-prenom"
                  placeholder="Prénom"
                  value={newPatient.prenom}
                  onChange={(e) => setNewPatient({...newPatient, prenom: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="col-span-1">
                <Label htmlFor="edit-dateNaissance" className="text-softtail-700">Date de naissance</Label>
                <Input
                  id="edit-dateNaissance"
                  type="date"
                  value={newPatient.dateNaissance}
                  onChange={(e) => setNewPatient({...newPatient, dateNaissance: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="col-span-1">
                <Label htmlFor="edit-numSecu" className="text-softtail-700">N° Sécurité Sociale</Label>
                <Input
                  id="edit-numSecu"
                  placeholder="N° Sécurité Sociale"
                  value={newPatient.numSecu}
                  onChange={(e) => setNewPatient({...newPatient, numSecu: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="col-span-1">
                <Label htmlFor="edit-email" className="text-softtail-700">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  placeholder="email@example.com"
                  value={newPatient.email}
                  onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="col-span-1">
                <Label htmlFor="edit-telephone" className="text-softtail-700">Téléphone</Label>
                <Input
                  id="edit-telephone"
                  placeholder="06 XX XX XX XX"
                  value={newPatient.telephone}
                  onChange={(e) => setNewPatient({...newPatient, telephone: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-adresse" className="text-softtail-700">Adresse</Label>
                <Input
                  id="edit-adresse"
                  placeholder="Adresse"
                  value={newPatient.adresse}
                  onChange={(e) => setNewPatient({...newPatient, adresse: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="col-span-1">
                <Label htmlFor="edit-codePostal" className="text-softtail-700">Code Postal</Label>
                <Input
                  id="edit-codePostal"
                  placeholder="Code Postal"
                  value={newPatient.codePostal}
                  onChange={(e) => setNewPatient({...newPatient, codePostal: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="col-span-1">
                <Label htmlFor="edit-ville" className="text-softtail-700">Ville</Label>
                <Input
                  id="edit-ville"
                  placeholder="Ville"
                  value={newPatient.ville}
                  onChange={(e) => setNewPatient({...newPatient, ville: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-notes" className="text-softtail-700">Notes</Label>
                <Textarea
                  id="edit-notes"
                  placeholder="Informations complémentaires..."
                  value={newPatient.notes}
                  onChange={(e) => setNewPatient({...newPatient, notes: e.target.value})}
                  className="mt-1 resize-none h-24"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button 
              className="bg-softtail-600 hover:bg-softtail-700"
              onClick={handleUpdatePatient}
              disabled={!newPatient.nom || !newPatient.prenom}
            >
              Mettre à jour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour confirmer la suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce patient ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeletePatient}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog pour créer un rendez-vous */}
      <Dialog open={isAppointmentDialogOpen} onOpenChange={setIsAppointmentDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Créer un rendez-vous</DialogTitle>
            <DialogDescription>
              {patientForAppointment && 
                `Créer un rendez-vous pour ${patientForAppointment.prenom} ${patientForAppointment.nom}`
              }
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date du rendez-vous *</Label>
              <Input
                id="date"
                type="date"
                value={newAppointment.date}
                onChange={(e) => {
                  setNewAppointment({...newAppointment, date: e.target.value, time: ""})
                  calculateAvailableTimeSlots(e.target.value)
                }}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Heure *</Label>
              <Select 
                value={newAppointment.time} 
                onValueChange={(value) => setNewAppointment({...newAppointment, time: value})}
                disabled={!newAppointment.date}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    !newAppointment.date 
                      ? "Sélectionnez d'abord une date" 
                      : availableTimeSlots.length === 0 
                        ? "Aucun créneau disponible" 
                        : "Sélectionner l'heure"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {availableTimeSlots.map(slot => (
                    <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {newAppointment.date && availableTimeSlots.length === 0 && (
                <p className="text-xs text-red-500">
                  Aucun créneau disponible pour cette date. Veuillez choisir une autre date.
                </p>
              )}
              {newAppointment.date && availableTimeSlots.length > 0 && (
                <p className="text-xs text-green-600">
                  {availableTimeSlots.length} créneau(x) disponible(s)
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Durée (minutes)</Label>
              <Select value={newAppointment.duration} onValueChange={(value) => setNewAppointment({...newAppointment, duration: value})}>
                <SelectTrigger>
                  <SelectValue />
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
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <Textarea
                id="notes"
                placeholder="Notes concernant le rendez-vous..."
                value={newAppointment.notes}
                onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAppointmentDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateAppointment}>
              <CalendarPlus className="h-4 w-4 mr-2" />
              Créer le rendez-vous
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
