"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { authClient } from "@/lib/auth-client"
import { Search, Plus, Edit, Trash, Package, Calendar, Euro, User, CalendarPlus, Eye, Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { DynamicFields } from "@/components/DynamicFields"
import { DynamicField } from "@/types/dynamic-fields"
import TypeTemplateManager from "@/components/TypeTemplateManager"

// Types
interface Ordre {
  id: string
  type: string
  description?: string
  dateCommande: Date
  dateLivraison?: Date
  prix: number
  status: string
  patientId: string
  patient?: {
    nom: string
    prenom: string
  }
  champsCustom?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

interface Patient {
  id: string
  nom: string
  prenom: string
}

interface TypeProduit {
  id: string
  nom: string
  description?: string
  prix: number
  delaiLivraison: number
  categorieId: string
  categorie: CategorieProduit
  createdAt: Date
  updatedAt: Date
}

interface CategorieProduit {
  id: string
  nom: string
  description?: string
  couleur?: string
  icone?: string
  ordre: number
  actif: boolean
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

export default function OrdrePage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [ordres, setOrdres] = React.useState<Ordre[]>([])
  const [patients, setPatients] = React.useState<Patient[]>([])
  const [typesProduits, setTypesProduits] = React.useState<TypeProduit[]>([])
  const [categories, setCategories] = React.useState<CategorieProduit[]>([])
  const [filteredTypes, setFilteredTypes] = React.useState<TypeProduit[]>([])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = React.useState(false)
  const [ordreToEdit, setOrdreToEdit] = React.useState<Ordre | null>(null)
  const [editCategorieId, setEditCategorieId] = React.useState<string>("")
  const [editFilteredTypes, setEditFilteredTypes] = React.useState<TypeProduit[]>([])
  const [ordreToDelete, setOrdreToDelete] = React.useState<string | null>(null)
  const [patientForAppointment, setPatientForAppointment] = React.useState<{id: string, nom: string, prenom: string} | null>(null)

  // États pour les champs dynamiques
  const [dynamicFields, setDynamicFields] = React.useState<DynamicField[]>([])
  const [dynamicFieldsValues, setDynamicFieldsValues] = React.useState<Record<string, any>>({})
  const [editDynamicFields, setEditDynamicFields] = React.useState<DynamicField[]>([])
  const [editDynamicFieldsValues, setEditDynamicFieldsValues] = React.useState<Record<string, any>>({})

  // États pour la gestion du template manager
  const [isTemplateManagerOpen, setIsTemplateManagerOpen] = React.useState(false)
  const [selectedTypeId, setSelectedTypeId] = React.useState<string>("")
  const [selectedTypeName, setSelectedTypeName] = React.useState<string>("")

  // États pour la gestion des créneaux disponibles
  const [existingAppointments, setExistingAppointments] = React.useState<any[]>([])
  const [availableTimeSlots, setAvailableTimeSlots] = React.useState<string[]>([])

  // Créneaux horaires par défaut
  const defaultTimeSlots = [
    "07:30", "08:00", "08:15", "08:30", "08:45", "09:00", "09:15", "09:30", "09:45", 
    "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45", "12:00",
    "13:30", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "15:45",
    "16:00", "16:15", "16:30", "16:45", "17:00"
  ]

  // Form state for new ordre
  const [newOrdre, setNewOrdre] = React.useState({
    categorieId: "",
    type: "",
    description: "",
    dateLivraison: "",
    prix: "",
    status: "commande",
    patientId: ""
  })

  // Fonction pour charger les champs dynamiques d'un type de produit
  const loadDynamicFields = async (typeId: string, isEdit = false) => {
    try {
      const response = await fetch(`/api/type-templates?typeId=${typeId}`)
      if (response.ok) {
        const data = await response.json()
        const fields = data.champsTemplate || []
        
        if (isEdit) {
          setEditDynamicFields(fields)
          // Reset les valeurs des champs dynamiques en mode édition
          setEditDynamicFieldsValues({})
        } else {
          setDynamicFields(fields)
          // Reset les valeurs des champs dynamiques
          setDynamicFieldsValues({})
        }
      }
    } catch (error) {
      console.error('Error loading dynamic fields:', error)
    }
  }

  // Form state for new appointment
  const [newAppointment, setNewAppointment] = React.useState({
    date: "",
    time: "",
    duration: "30",
    notes: ""
  })

  // État pour forcer le rechargement des ordres
  const [refresh, setRefresh] = React.useState(0)
  
  // Fonction pour recharger les ordres
  const reloadOrdres = () => {
    setRefresh(prev => prev + 1)
  }

  // Fonction pour gérer le changement de catégorie
  const handleCategorieChange = (categorieId: string, isEdit = false) => {
    // Filtrer les types selon la catégorie
    const typesFiltered = typesProduits.filter(type => type.categorieId === categorieId)
    
    // Charger les champs dynamiques pour cette catégorie
    // Note: Les champs dynamiques seront maintenant chargés lors de la sélection du type
    // loadDynamicFields(categorieId, isEdit)
    
    if (isEdit) {
      setEditCategorieId(categorieId)
      setEditFilteredTypes(typesFiltered)
      if (ordreToEdit) {
        setOrdreToEdit({
          ...ordreToEdit,
          type: "", // Reset type when category changes
          prix: 0,
          dateLivraison: undefined
        })
      }
    } else {
      setFilteredTypes(typesFiltered)
      setNewOrdre({
        ...newOrdre,
        categorieId,
        type: "", // Reset type when category changes
        prix: ""
      })
    }
  }

  // Fonction pour auto-compléter le prix et la date de livraison
  const handleTypeChange = async (typeNom: string, isEdit = false) => {
    const typeProduit = typesProduits.find(tp => tp.nom === typeNom)
    if (typeProduit) {
      const dateLivraison = new Date()
      dateLivraison.setDate(dateLivraison.getDate() + typeProduit.delaiLivraison)
      
      if (isEdit && ordreToEdit) {
        setOrdreToEdit({
          ...ordreToEdit,
          type: typeNom,
          prix: typeProduit.prix,
          dateLivraison: dateLivraison
        })
      } else {
        setNewOrdre({
          ...newOrdre,
          type: typeNom,
          prix: typeProduit.prix.toString(),
          dateLivraison: dateLivraison.toISOString().split('T')[0]
        })
      }

      // Charger les champs dynamiques du type de produit
      await loadDynamicFields(typeProduit.id, isEdit)
    }
  }

  // Fonction pour calculer les créneaux disponibles
  const getAvailableTimeSlots = (selectedDate: string) => {
    if (!selectedDate) return []
    
    const appointmentsForDate = existingAppointments.filter(apt => 
      apt.date === selectedDate
    )
    
    const bookedTimes = appointmentsForDate.map(apt => apt.time)
    const available = defaultTimeSlots.filter(slot => !bookedTimes.includes(slot))
    
    return available
  }

  // Mettre à jour les créneaux disponibles quand la date change
  React.useEffect(() => {
    if (newAppointment.date) {
      const slots = getAvailableTimeSlots(newAppointment.date)
      setAvailableTimeSlots(slots)
      if (newAppointment.time && !slots.includes(newAppointment.time)) {
        setNewAppointment(prev => ({ ...prev, time: "" }))
      }
    }
  }, [newAppointment.date, existingAppointments])

  // Load ordres
  const loadOrdres = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setOrdres(data)
      } else {
        console.error('Failed to load ordres')
        // Mock data
        const mockOrdres: Ordre[] = [
          {
            id: "1",
            type: "Semelles orthopédiques",
            description: "Semelles pour pieds plats",
            dateCommande: new Date("2024-01-15"),
            dateLivraison: new Date("2024-01-22"),
            prix: 150,
            status: "livré",
            patientId: "1",
            patient: { nom: "Dupont", prenom: "Jean" },
            createdAt: new Date("2024-01-15"),
            updatedAt: new Date("2024-01-22")
          },
          {
            id: "2",
            type: "Chaussures thérapeutiques",
            description: "Chaussures pour diabétique",
            dateCommande: new Date("2024-01-20"),
            dateLivraison: new Date("2024-02-05"),
            prix: 280,
            status: "en_cours",
            patientId: "2",
            patient: { nom: "Martin", prenom: "Marie" },
            createdAt: new Date("2024-01-20"),
            updatedAt: new Date("2024-01-20")
          }
        ]
        setOrdres(mockOrdres)
      }
    } catch (error) {
      console.error('Error loading ordres:', error)
      toast.error('Erreur lors du chargement des ordres')
    }
  }

  // Load patients
  const loadPatients = async () => {
    try {
      const response = await fetch('/api/patients')
      if (response.ok) {
        const data = await response.json()
        setPatients(data)
      }
    } catch (error) {
      console.error('Error loading patients:', error)
    }
  }

  // Load types produits
  const loadTypesProduits = async () => {
    try {
      const response = await fetch('/api/product-types')
      if (response.ok) {
        const data = await response.json()
        setTypesProduits(data)
      }
    } catch (error) {
      console.error('Error loading types produits:', error)
    }
  }

  // Load categories
  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.filter((cat: CategorieProduit) => cat.actif))
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  // Load appointments
  const loadAppointments = async () => {
    try {
      const response = await fetch('/api/appointments')
      if (response.ok) {
        const data = await response.json()
        setExistingAppointments(data)
      }
    } catch (error) {
      console.error('Error loading appointments:', error)
    }
  }

  // Authentification et chargement initial
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: session } = await authClient.getSession()
        if (!session) {
          router.push('/login')
          return
        }
        
        await Promise.all([
          loadOrdres(),
          loadPatients(),
          loadTypesProduits(),
          loadCategories(),
          loadAppointments()
        ])
        setLoading(false)
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/login')
      }
    }

    checkAuth()
  }, [router, refresh])

  // Add new ordre
  const handleAddOrdre = async () => {
    if (!newOrdre.categorieId || !newOrdre.type || !newOrdre.patientId || !newOrdre.prix) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    try {
      const ordreData = {
        ...newOrdre,
        prix: parseFloat(newOrdre.prix),
        dateLivraison: newOrdre.dateLivraison ? new Date(newOrdre.dateLivraison) : null,
        champsCustom: dynamicFieldsValues
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ordreData)
      })

      if (response.ok) {
        toast.success('Ordre ajouté avec succès')
        setNewOrdre({
          categorieId: "",
          type: "",
          description: "",
          dateLivraison: "",
          prix: "",
          status: "commande",
          patientId: ""
        })
        setDynamicFieldsValues({})
        setDynamicFields([])
        setIsAddDialogOpen(false)
        reloadOrdres()
      } else {
        toast.error('Erreur lors de l\'ajout de l\'ordre')
      }
    } catch (error) {
      console.error('Error adding ordre:', error)
      toast.error('Erreur lors de l\'ajout de l\'ordre')
    }
  }

  // Fonctions pour gérer les champs dynamiques
  const handleAddDynamicField = (fieldData: Omit<DynamicField, 'id' | 'order'>) => {
    const newField: DynamicField = {
      ...fieldData,
      id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      order: dynamicFields.length
    }
    
    setDynamicFields([...dynamicFields, newField])
  }

  const handleRemoveDynamicField = (fieldId: string) => {
    setDynamicFields(dynamicFields.filter(field => field.id !== fieldId))
    // Supprimer aussi la valeur correspondante
    const newValues = { ...dynamicFieldsValues }
    delete newValues[fieldId]
    setDynamicFieldsValues(newValues)
  }

  const handleDynamicFieldsChange = (values: Record<string, any>) => {
    setDynamicFieldsValues(values)
  }

  // Fonctions similaires pour l'édition
  const handleAddEditDynamicField = (fieldData: Omit<DynamicField, 'id' | 'order'>) => {
    const newField: DynamicField = {
      ...fieldData,
      id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      order: editDynamicFields.length
    }
    
    setEditDynamicFields([...editDynamicFields, newField])
  }

  const handleRemoveEditDynamicField = (fieldId: string) => {
    setEditDynamicFields(editDynamicFields.filter(field => field.id !== fieldId))
    // Supprimer aussi la valeur correspondante
    const newValues = { ...editDynamicFieldsValues }
    delete newValues[fieldId]
    setEditDynamicFieldsValues(newValues)
  }

  const handleEditDynamicFieldsChange = (values: Record<string, any>) => {
    setEditDynamicFieldsValues(values)
  }

  // Edit ordre
  const handleEditOrdre = async () => {
    if (!ordreToEdit) return

    try {
      const ordreData = {
        ...ordreToEdit,
        champsCustom: editDynamicFieldsValues
      }

      const response = await fetch(`/api/orders/${ordreToEdit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ordreData)
      })

      if (response.ok) {
        toast.success('Ordre modifié avec succès')
        setOrdreToEdit(null)
        setEditDynamicFields([])
        setEditDynamicFieldsValues({})
        setIsEditDialogOpen(false)
        reloadOrdres()
      } else {
        toast.error('Erreur lors de la modification de l\'ordre')
      }
    } catch (error) {
      console.error('Error editing ordre:', error)
      toast.error('Erreur lors de la modification de l\'ordre')
    }
  }

  // Delete ordre
  const handleDeleteOrdre = async () => {
    if (!ordreToDelete) return

    try {
      const response = await fetch(`/api/orders/${ordreToDelete}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Ordre supprimé avec succès')
        setOrdreToDelete(null)
        setIsDeleteDialogOpen(false)
        reloadOrdres()
      } else {
        toast.error('Erreur lors de la suppression de l\'ordre')
      }
    } catch (error) {
      console.error('Error deleting ordre:', error)
      toast.error('Erreur lors de la suppression de l\'ordre')
    }
  }

  // Add appointment
  const handleAddAppointment = async () => {
    if (!patientForAppointment || !newAppointment.date || !newAppointment.time) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    try {
      const appointmentData = {
        patientId: patientForAppointment.id,
        patientName: `${patientForAppointment.prenom} ${patientForAppointment.nom}`,
        patientEmail: "",
        patientPhone: "",
        date: newAppointment.date,
        time: newAppointment.time,
        duration: parseInt(newAppointment.duration),
        status: "confirmé"
      }

      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData)
      })

      if (response.ok) {
        toast.success('Rendez-vous ajouté avec succès')
        setNewAppointment({ date: "", time: "", duration: "30", notes: "" })
        setIsAppointmentDialogOpen(false)
        setPatientForAppointment(null)
        loadAppointments()
      } else {
        toast.error('Erreur lors de l\'ajout du rendez-vous')
      }
    } catch (error) {
      console.error('Error adding appointment:', error)
      toast.error('Erreur lors de l\'ajout du rendez-vous')
    }
  }

  // Filter ordres
  const filteredOrdres = ordres.filter(ordre => {
    const matchesSearch = ordre.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ordre.patient?.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ordre.patient?.prenom.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || ordre.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "commande": return "bg-yellow-100 text-yellow-800"
      case "en_cours": return "bg-blue-100 text-blue-800"
      case "livré": return "bg-green-100 text-green-800"
      case "annulé": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  // Get status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "commande": return "Commandé"
      case "en_cours": return "En cours"
      case "livré": return "Livré"
      case "annulé": return "Annulé"
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-4"
          >
            {/* Header */}
            <motion.div variants={fadeInUp} className="flex items-center justify-between space-y-2">
              <div>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/admin">Administration</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Ordres</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
                <h2 className="text-3xl font-bold tracking-tight">Gestion des Ordres</h2>
                <p className="text-muted-foreground">
                  Gérez les commandes de produits orthopédiques
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/admin/field-templates')}
                  className="flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Champs dynamiques
                </Button>
                <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Nouvel Ordre
                </Button>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div variants={fadeInUp} className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Ordres</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{ordres.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">En Cours</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {ordres.filter(p => p.status === "en_cours").length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Livrés</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {ordres.filter(p => p.status === "livré").length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Chiffre d'Affaires</CardTitle>
                  <Euro className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {ordres.filter(p => p.status === "livré").reduce((sum, p) => sum + p.prix, 0)}€
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Filters */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un ordre ou un patient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="commande">Commandé</SelectItem>
                  <SelectItem value="en_cours">En cours</SelectItem>
                  <SelectItem value="livré">Livré</SelectItem>
                  <SelectItem value="annulé">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            {/* Ordres List */}
            <motion.div variants={fadeInUp} className="grid gap-4">
              {filteredOrdres.map((ordre) => (
                <Card key={ordre.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-4">
                          <h3 className="text-lg font-semibold">{ordre.type}</h3>
                          <Badge className={getStatusColor(ordre.status)}>
                            {getStatusText(ordre.status)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>{ordre.patient?.prenom} {ordre.patient?.nom}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>Commande: {new Date(ordre.dateCommande).toLocaleDateString('fr-FR')}</span>
                            {ordre.dateLivraison && (
                              <span>• Livraison: {new Date(ordre.dateLivraison).toLocaleDateString('fr-FR')}</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Euro className="h-4 w-4" />
                            <span>{ordre.prix}€</span>
                          </div>
                          {ordre.description && (
                            <p className="text-sm">{ordre.description}</p>
                          )}
                          
                          {/* Affichage des champs dynamiques */}
                          {ordre.champsCustom && Object.keys(ordre.champsCustom).length > 0 && (
                            <div className="mt-2 p-2 bg-blue-50 rounded-md border-l-4 border-blue-200">
                              <h4 className="text-xs font-medium text-blue-800 mb-1">Informations spécifiques</h4>
                              <div className="grid grid-cols-2 gap-2">
                                {Object.entries(ordre.champsCustom).map(([key, value]) => (
                                  <div key={key} className="text-xs">
                                    <span className="font-medium text-blue-700 capitalize">{key.replace('_', ' ')}:</span>
                                    <span className="ml-1 text-blue-900">
                                      {typeof value === 'boolean' ? (value ? 'Oui' : 'Non') : String(value)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/admin/orders/${ordre.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Détails
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setPatientForAppointment({
                              id: ordre.patientId,
                              nom: ordre.patient?.nom || "",
                              prenom: ordre.patient?.prenom || ""
                            })
                            setIsAppointmentDialogOpen(true)
                          }}
                        >
                          <CalendarPlus className="h-4 w-4 mr-1" />
                          RDV
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            setOrdreToEdit(ordre)
                            // Trouver la catégorie du type actuel de l'ordre
                            const currentType = typesProduits.find(tp => tp.nom === ordre.type)
                            if (currentType) {
                              setEditCategorieId(currentType.categorieId)
                              const typesFiltered = typesProduits.filter(type => type.categorieId === currentType.categorieId)
                              setEditFilteredTypes(typesFiltered)
                              
                              // Charger les champs dynamiques de ce type de produit
                              await loadDynamicFields(currentType.id, true)
                              
                              // Charger les valeurs existantes des champs dynamiques si elles existent
                              if (ordre.champsCustom) {
                                setEditDynamicFieldsValues(ordre.champsCustom)
                              }
                            }
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setOrdreToDelete(ordre.id)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>

            {filteredOrdres.length === 0 && (
              <motion.div variants={fadeInUp} className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun ordre trouvé</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || statusFilter !== "all" 
                    ? "Aucun ordre ne correspond à vos critères de recherche."
                    : "Commencez par créer un nouvel ordre."}
                </p>
              </motion.div>
            )}

          {/* Add Ordre Dialog */}
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
            setIsAddDialogOpen(open)
            if (!open) {
              setFilteredTypes([])
              setDynamicFields([])
              setDynamicFieldsValues({})
            }
          }}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Ajouter un Nouvel Ordre</DialogTitle>
                <DialogDescription>
                  Créez une nouvelle commande de produit orthopédique.
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="required" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="required" className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Informations obligatoires
                  </TabsTrigger>
                  <TabsTrigger value="custom" className="flex items-center gap-2" disabled={!newOrdre.type}>
                    <Settings className="h-4 w-4" />
                    Champs spécifiques
                    {dynamicFields.length > 0 && (
                      <Badge variant="secondary" className="ml-1 text-xs">
                        {dynamicFields.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="required" className="space-y-3 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="produit">Produit *</Label>
                    <Select value={newOrdre.categorieId} onValueChange={(value) => handleCategorieChange(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un produit" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((categorie) => (
                          <SelectItem key={categorie.id} value={categorie.id}>
                            {categorie.nom}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {newOrdre.categorieId && (
                    <div className="space-y-2">
                      <Label htmlFor="type">Type de produit *</Label>
                      <Select value={newOrdre.type} onValueChange={(value) => handleTypeChange(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredTypes.map((type) => (
                            <SelectItem key={type.id} value={type.nom}>
                              {type.nom} - {type.prix}€
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  {newOrdre.type && (
                    <div className="space-y-2">
                      <Label htmlFor="patient">Patient *</Label>
                      <Select value={newOrdre.patientId} onValueChange={(value) => setNewOrdre({...newOrdre, patientId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id}>
                              {patient.prenom} {patient.nom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="prix">Prix (€) *</Label>
                    <Input
                      id="prix"
                      type="number"
                      step="0.01"
                      value={newOrdre.prix}
                      onChange={(e) => setNewOrdre({...newOrdre, prix: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dateLivraison">Date de livraison prévue</Label>
                    <Input
                      id="dateLivraison"
                      type="date"
                      value={newOrdre.dateLivraison}
                      onChange={(e) => setNewOrdre({...newOrdre, dateLivraison: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newOrdre.description}
                      onChange={(e) => setNewOrdre({...newOrdre, description: e.target.value})}
                      placeholder="Description optionnelle..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Statut</Label>
                    <Select value={newOrdre.status} onValueChange={(value) => setNewOrdre({...newOrdre, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="commande">Commandé</SelectItem>
                        <SelectItem value="en_cours">En cours</SelectItem>
                        <SelectItem value="livré">Livré</SelectItem>
                        <SelectItem value="annulé">Annulé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="custom" className="space-y-3 mt-4">
                  {newOrdre.categorieId && newOrdre.type ? (
                    <div>
                      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Settings className="h-4 w-4 text-blue-600" />
                            <h4 className="text-sm font-medium text-blue-900">Champs personnalisés - {newOrdre.type}</h4>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const typeProduit = typesProduits.find(tp => tp.nom === newOrdre.type)
                              if (typeProduit) {
                                setSelectedTypeId(typeProduit.id)
                                setSelectedTypeName(typeProduit.nom)
                                setIsTemplateManagerOpen(true)
                              }
                            }}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Modifier le template
                          </Button>
                        </div>
                        <p className="text-xs text-blue-700">
                          {dynamicFields.length > 0 
                            ? "Remplissez les champs spécifiques à ce produit et ajoutez-en d'autres si nécessaire"
                            : "Aucun champ prédéfini pour ce produit. Vous pouvez en ajouter selon vos besoins"
                          }
                        </p>
                      </div>
                      <DynamicFields
                        fields={dynamicFields}
                        values={dynamicFieldsValues}
                        onChange={handleDynamicFieldsChange}
                        onAddField={handleAddDynamicField}
                        onRemoveField={handleRemoveDynamicField}
                        canEdit={true}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Settings className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Sélectionnez d'abord un type de produit</h4>
                      <p className="text-xs text-gray-500">
                        Les champs spécifiques s'afficheront après avoir choisi un type de produit dans l'onglet précédent.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              
              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddOrdre}>
                  Ajouter l'Ordre
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Ordre Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
            setIsEditDialogOpen(open)
            if (!open) {
              setEditCategorieId("")
              setEditFilteredTypes([])
            }
          }}>
            <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Modifier l'Ordre</DialogTitle>
                <DialogDescription>
                  Modifiez les informations de l'ordre.
                </DialogDescription>
              </DialogHeader>
              
              {ordreToEdit && (
                <Tabs defaultValue="required" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="required" className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Informations obligatoires
                    </TabsTrigger>
                    <TabsTrigger value="custom" className="flex items-center gap-2" disabled={!editCategorieId}>
                      <Settings className="h-4 w-4" />
                      Champs spécifiques
                      {editDynamicFields.length > 0 && (
                        <Badge variant="secondary" className="ml-1 text-xs">
                          {editDynamicFields.length}
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="required" className="space-y-3 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-categorie">Produit</Label>
                      <Select 
                        value={editCategorieId} 
                        onValueChange={(value) => handleCategorieChange(value, true)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un produit" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((categorie) => (
                            <SelectItem key={categorie.id} value={categorie.id}>
                              {categorie.nom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {editCategorieId && (
                      <div className="space-y-2">
                        <Label htmlFor="edit-type">Type de produit</Label>
                        <Select 
                          value={ordreToEdit.type} 
                          onValueChange={(value) => handleTypeChange(value, true)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {editFilteredTypes.map((type) => (
                              <SelectItem key={type.id} value={type.nom}>
                                {type.nom} - {type.prix}€
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    {ordreToEdit.type && editCategorieId && (
                      <div className="space-y-2">
                        <Label htmlFor="edit-patient">Patient</Label>
                        <Select 
                          value={ordreToEdit.patientId} 
                          onValueChange={(value) => setOrdreToEdit({...ordreToEdit, patientId: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {patients.map((patient) => (
                              <SelectItem key={patient.id} value={patient.id}>
                                {patient.prenom} {patient.nom}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-prix">Prix (€)</Label>
                      <Input
                        id="edit-prix"
                        type="number"
                        step="0.01"
                        value={ordreToEdit.prix}
                        onChange={(e) => setOrdreToEdit({...ordreToEdit, prix: parseFloat(e.target.value)})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-dateLivraison">Date de livraison prévue</Label>
                      <Input
                        id="edit-dateLivraison"
                        type="date"
                        value={ordreToEdit.dateLivraison ? new Date(ordreToEdit.dateLivraison).toISOString().split('T')[0] : ""}
                        onChange={(e) => setOrdreToEdit({...ordreToEdit, dateLivraison: e.target.value ? new Date(e.target.value) : undefined})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-description">Description</Label>
                      <Textarea
                        id="edit-description"
                        value={ordreToEdit.description || ""}
                        onChange={(e) => setOrdreToEdit({...ordreToEdit, description: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-status">Statut</Label>
                      <Select 
                        value={ordreToEdit.status} 
                        onValueChange={(value) => setOrdreToEdit({...ordreToEdit, status: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="commande">Commandé</SelectItem>
                          <SelectItem value="en_cours">En cours</SelectItem>
                          <SelectItem value="livré">Livré</SelectItem>
                          <SelectItem value="annulé">Annulé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  <TabsContent value="custom" className="space-y-3 mt-4">
                    {editCategorieId && ordreToEdit?.type ? (
                      <div>
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Settings className="h-4 w-4 text-green-600" />
                              <h4 className="text-sm font-medium text-green-900">Champs personnalisés - {ordreToEdit.type}</h4>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const typeProduit = typesProduits.find(tp => tp.nom === ordreToEdit.type)
                                if (typeProduit) {
                                  setSelectedTypeId(typeProduit.id)
                                  setSelectedTypeName(typeProduit.nom)
                                  setIsTemplateManagerOpen(true)
                                }
                              }}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Modifier le template
                            </Button>
                          </div>
                          <p className="text-xs text-green-700">
                            {editDynamicFields.length > 0 
                              ? "Modifiez les champs spécifiques à ce produit et ajoutez-en d'autres si nécessaire"
                              : "Aucun champ prédéfini pour ce produit. Vous pouvez en ajouter selon vos besoins"
                            }
                          </p>
                        </div>
                        <DynamicFields
                          fields={editDynamicFields}
                          values={editDynamicFieldsValues}
                          onChange={handleEditDynamicFieldsChange}
                          onAddField={handleAddEditDynamicField}
                          onRemoveField={handleRemoveEditDynamicField}
                          canEdit={true}
                        />
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Settings className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Sélectionnez d'abord un produit</h4>
                        <p className="text-xs text-gray-500">
                          Les champs spécifiques s'afficheront après avoir choisi un produit dans l'onglet précédent.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              )}
              
              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleEditOrdre}>
                  Sauvegarder
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmer la suppression</DialogTitle>
                <DialogDescription>
                  Êtes-vous sûr de vouloir supprimer cet ordre ? Cette action est irréversible.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Annuler
                </Button>
                <Button variant="destructive" onClick={handleDeleteOrdre}>
                  Supprimer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add Appointment Dialog */}
          <Dialog open={isAppointmentDialogOpen} onOpenChange={setIsAppointmentDialogOpen}>
            <DialogContent className="sm:max-w-[350px]">
              <DialogHeader>
                <DialogTitle>Prendre un Rendez-vous</DialogTitle>
                <DialogDescription>
                  {patientForAppointment && 
                    `Planifier un rendez-vous pour ${patientForAppointment.prenom} ${patientForAppointment.nom}`
                  }
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 py-3">
                <div className="space-y-2">
                  <Label htmlFor="appointment-date">Date du rendez-vous *</Label>
                  <Input
                    id="appointment-date"
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                {newAppointment.date && (
                  <div className="space-y-2">
                    <Label htmlFor="appointment-time">Heure du rendez-vous *</Label>
                    <Select 
                      value={newAppointment.time} 
                      onValueChange={(value) => setNewAppointment({...newAppointment, time: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une heure" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTimeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {availableTimeSlots.length === 0 && (
                      <p className="text-sm text-red-500">
                        Aucun créneau disponible pour cette date.
                      </p>
                    )}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="appointment-duration">Durée (minutes)</Label>
                  <Select 
                    value={newAppointment.duration} 
                    onValueChange={(value) => setNewAppointment({...newAppointment, duration: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">1 heure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appointment-notes">Notes</Label>
                  <Textarea
                    id="appointment-notes"
                    value={newAppointment.notes}
                    onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                    placeholder="Notes optionnelles..."
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAppointmentDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddAppointment} disabled={!newAppointment.date || !newAppointment.time}>
                  Confirmer le RDV
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Template Manager */}
          <TypeTemplateManager
            isOpen={isTemplateManagerOpen}
            onOpenChange={setIsTemplateManagerOpen}
            typeId={selectedTypeId}
            typeName={selectedTypeName}
            onTemplateUpdated={() => {
              // Recharger les champs dynamiques après modification du template
              if (selectedTypeId) {
                loadDynamicFields(selectedTypeId, false)
              }
            }}
          />
        </motion.div>
      </div>
  )
}
