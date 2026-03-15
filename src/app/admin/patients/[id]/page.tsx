"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { authClient } from "@/lib/auth-client"
import { ArrowLeft, Calendar, Edit, Save, Trash, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
  appointments: Appointment[]
  produits: Produit[]
}

interface Appointment {
  id: string
  patientId: string
  patientName: string
  patientEmail: string
  patientPhone?: string
  date: Date
  time: string
  duration: number
  status: string
  createdAt: Date
  updatedAt: Date
}

interface Produit {
  id: string
  type: string
  description?: string
  dateCommande: Date
  dateLivraison?: Date
  prix: number
  status: string
  patientId: string
  champsCustom?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function PatientDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const patientId = params.id as string

  const [loading, setLoading] = React.useState(true)
  const [patient, setPatient] = React.useState<Patient | null>(null)
  const [isEditing, setIsEditing] = React.useState(false)
  const [editedPatient, setEditedPatient] = React.useState({
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

  // Fetch patient data
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
          // Charger les données du patient depuis l'API
          const response = await fetch(`/api/patients/${patientId}`)
          if (!response.ok) throw new Error('Erreur lors du chargement du patient')
          
          const patientData = await response.json()
          
          // Convertir les dates string en objets Date
          const formattedPatient = {
            ...patientData,
            dateNaissance: patientData.dateNaissance ? new Date(patientData.dateNaissance) : undefined,
            createdAt: new Date(patientData.createdAt),
            updatedAt: new Date(patientData.updatedAt),
            appointments: patientData.appointments.map((apt: any) => ({
              ...apt,
              date: new Date(apt.date),
              createdAt: new Date(apt.createdAt),
              updatedAt: new Date(apt.updatedAt)
            })),
            produits: patientData.produits.map((prod: any) => ({
              ...prod,
              dateCommande: new Date(prod.dateCommande),
              dateLivraison: prod.dateLivraison ? new Date(prod.dateLivraison) : undefined,
              createdAt: new Date(prod.createdAt),
              updatedAt: new Date(prod.updatedAt)
            }))
          }
          
          setPatient(formattedPatient)
          
          // Initialiser le formulaire d'édition
          setEditedPatient({
            nom: formattedPatient.nom,
            prenom: formattedPatient.prenom,
            dateNaissance: formattedPatient.dateNaissance ? formattedPatient.dateNaissance.toISOString().split('T')[0] : "",
            email: formattedPatient.email || "",
            telephone: formattedPatient.telephone || "",
            adresse: formattedPatient.adresse || "",
            codePostal: formattedPatient.codePostal || "",
            ville: formattedPatient.ville || "",
            numSecu: formattedPatient.numSecu || "",
            notes: formattedPatient.notes || ""
          })
        } catch (error) {
          toast.error('Erreur lors du chargement du patient')
          console.error('Error fetching patient:', error)
        } finally {
          setLoading(false)
        }
      } catch (error) {
        console.error('Authentication error:', error)
        router.push("/login")
      }
    }

    checkAuth()
  }, [router, patientId])

  // Handle patient update
  const handleUpdatePatient = async () => {
    try {
      // Conversion de la date de naissance
      const dateNaissance = editedPatient.dateNaissance ? new Date(editedPatient.dateNaissance) : undefined
      
      const response = await fetch(`/api/patients/${patientId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: editedPatient.nom,
          prenom: editedPatient.prenom,
          dateNaissance: dateNaissance?.toISOString(),
          email: editedPatient.email || undefined,
          telephone: editedPatient.telephone || undefined,
          adresse: editedPatient.adresse || undefined,
          codePostal: editedPatient.codePostal || undefined,
          ville: editedPatient.ville || undefined,
          numSecu: editedPatient.numSecu || undefined,
          notes: editedPatient.notes || undefined
        })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erreur lors de la mise à jour du patient')
      }
      
      // Récupérer les données mises à jour
      const updatedPatient = await response.json()
      
      // Mettre à jour l'état
      setPatient({
        ...patient!,
        ...updatedPatient,
        dateNaissance: updatedPatient.dateNaissance ? new Date(updatedPatient.dateNaissance) : undefined
      })
      
      setIsEditing(false)
      toast.success('Patient mis à jour avec succès')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Une erreur est survenue')
    }
  }

  // Format date
  const formatDate = (date?: Date) => {
    if (!date) return 'Non spécifié'
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  // Extraire les informations supplémentaires consolidées des produits
  const getConsolidatedProductInfo = () => {
    if (!patient || !patient.produits.length) return {}
    
    const consolidated: Record<string, any> = {}
    
    patient.produits.forEach(produit => {
      if (produit.champsCustom) {
        Object.entries(produit.champsCustom).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            // Si la clé existe déjà, on l'organise par produit
            if (consolidated[key]) {
              if (!Array.isArray(consolidated[key])) {
                consolidated[key] = [consolidated[key]]
              }
              consolidated[key].push({
                value,
                produit: produit.type,
                date: produit.dateCommande
              })
            } else {
              consolidated[key] = {
                value,
                produit: produit.type,
                date: produit.dateCommande
              }
            }
          }
        })
      }
    })
    
    return consolidated
  }

  // Formater la valeur d'un champ dynamique
  const formatDynamicFieldValue = (value: any) => {
    if (typeof value === 'boolean') return value ? 'Oui' : 'Non'
    if (typeof value === 'object' && value.value !== undefined) return value.value
    return value?.toString() || 'Non spécifié'
  }

  // Get appointment status badge color
  const getAppointmentStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-amber-500'
      case 'completed':
        return 'bg-green-500'
      case 'cancelled':
        return 'bg-red-500'
      case 'no_show':
        return 'bg-orange-500'
      default:
        return 'bg-gray-500'
    }
  }

  // Get appointment status label
  const getAppointmentStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Planifié'
      case 'completed':
        return 'Terminé'
      case 'cancelled':
        return 'Annulé'
      case 'no_show':
        return 'Absent'
      default:
        return status
    }
  }

  // Get product status badge color
  const getProduitStatusColor = (status: string) => {
    switch (status) {
      case 'commande':
        return 'bg-amber-500'
      case 'en_fabrication':
        return 'bg-blue-500'
      case 'livree':
        return 'bg-green-500'
      case 'facturee':
        return 'bg-purple-500'
      default:
        return 'bg-gray-500'
    }
  }

  // Get product status label
  const getProduitStatusLabel = (status: string) => {
    switch (status) {
      case 'commande':
        return 'Commandée'
      case 'en_fabrication':
        return 'En fabrication'
      case 'livree':
        return 'Livrée'
      case 'facturee':
        return 'Facturée'
      default:
        return status
    }
  }

  return (
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
                    <BreadcrumbLink href="/admin/patients">Patients</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{patient ? `${patient.prenom} ${patient.nom}` : 'Détails patient'}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline"
                  onClick={() => router.push('/admin/patients')}
                  className="gap-1"
                >
                  <ArrowLeft size={16} />
                  Retour
                </Button>
                
                {!isEditing ? (
                  <Button 
                    className="bg-amber-500 hover:bg-amber-600 gap-1"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit size={16} />
                    Modifier
                  </Button>
                ) : (
                  <Button 
                    className="bg-green-500 hover:bg-green-600 gap-1"
                    onClick={handleUpdatePatient}
                  >
                    <Save size={16} />
                    Enregistrer
                  </Button>
                )}
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-10">
                <p>Chargement des données du patient...</p>
              </div>
            ) : patient ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Informations du patient */}
                <motion.div 
                  className="lg:col-span-1"
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                >
                  <Card className="border border-softtail-100 shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2 text-softtail-800">
                        <User className="h-5 w-5" />
                        Informations patient
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isEditing ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Nom</Label>
                              <Input
                                value={editedPatient.nom}
                                onChange={(e) => setEditedPatient({...editedPatient, nom: e.target.value})}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label>Prénom</Label>
                              <Input
                                value={editedPatient.prenom}
                                onChange={(e) => setEditedPatient({...editedPatient, prenom: e.target.value})}
                                className="mt-1"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label>Date de naissance</Label>
                            <Input
                              type="date"
                              value={editedPatient.dateNaissance}
                              onChange={(e) => setEditedPatient({...editedPatient, dateNaissance: e.target.value})}
                              className="mt-1"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Email</Label>
                              <Input
                                type="email"
                                value={editedPatient.email}
                                onChange={(e) => setEditedPatient({...editedPatient, email: e.target.value})}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label>Téléphone</Label>
                              <Input
                                value={editedPatient.telephone}
                                onChange={(e) => setEditedPatient({...editedPatient, telephone: e.target.value})}
                                className="mt-1"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label>Adresse</Label>
                            <Input
                              value={editedPatient.adresse}
                              onChange={(e) => setEditedPatient({...editedPatient, adresse: e.target.value})}
                              className="mt-1"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Code postal</Label>
                              <Input
                                value={editedPatient.codePostal}
                                onChange={(e) => setEditedPatient({...editedPatient, codePostal: e.target.value})}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label>Ville</Label>
                              <Input
                                value={editedPatient.ville}
                                onChange={(e) => setEditedPatient({...editedPatient, ville: e.target.value})}
                                className="mt-1"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label>N° Sécurité sociale</Label>
                            <Input
                              value={editedPatient.numSecu}
                              onChange={(e) => setEditedPatient({...editedPatient, numSecu: e.target.value})}
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label>Notes</Label>
                            <Textarea
                              value={editedPatient.notes}
                              onChange={(e) => setEditedPatient({...editedPatient, notes: e.target.value})}
                              className="mt-1 resize-none h-24"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="text-lg font-medium text-softtail-800">
                            {patient.prenom} {patient.nom}
                          </div>
                          
                          <div>
                            <div className="text-xs text-softtail-500">Date de naissance</div>
                            <div className="text-softtail-700">{formatDate(patient.dateNaissance)}</div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-xs text-softtail-500">Email</div>
                              <div className="text-softtail-700">{patient.email || 'Non spécifié'}</div>
                            </div>
                            <div>
                              <div className="text-xs text-softtail-500">Téléphone</div>
                              <div className="text-softtail-700">{patient.telephone || 'Non spécifié'}</div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-softtail-500">Adresse</div>
                            <div className="text-softtail-700">
                              {patient.adresse ? (
                                <>
                                  {patient.adresse}<br />
                                  {patient.codePostal} {patient.ville}
                                </>
                              ) : 'Non spécifiée'}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-softtail-500">N° Sécurité sociale</div>
                            <div className="text-softtail-700">{patient.numSecu || 'Non spécifié'}</div>
                          </div>
                          
                          {patient.notes && (
                            <div>
                              <div className="text-xs text-softtail-500">Notes</div>
                              <div className="text-softtail-700 bg-gray-50 p-3 rounded-md border border-gray-100">
                                {patient.notes}
                              </div>
                            </div>
                          )}

                          {/* Informations supplémentaires consolidées des produits */}
                          {(() => {
                            const consolidatedInfo = getConsolidatedProductInfo()
                            return Object.keys(consolidatedInfo).length > 0 && (
                              <div className="mt-6 pt-4 border-t border-gray-200">
                                <div className="text-sm font-medium text-softtail-800 mb-3">
                                  Informations médicales consolidées
                                </div>
                                <div className="space-y-3">
                                  {Object.entries(consolidatedInfo).map(([fieldName, fieldData]) => (
                                    <div key={fieldName} className="bg-blue-50 p-3 rounded-md border border-blue-100">
                                      <div className="text-xs text-blue-600 font-medium mb-1">
                                        {fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                      </div>
                                      {Array.isArray(fieldData) ? (
                                        <div className="space-y-2">
                                          {fieldData.map((item, index) => (
                                            <div key={index} className="text-sm">
                                              <div className="text-softtail-700">
                                                {formatDynamicFieldValue(item.value)}
                                              </div>
                                              <div className="text-xs text-softtail-500">
                                                {item.produit} - {formatDate(new Date(item.date))}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <div className="text-sm">
                                          <div className="text-softtail-700">
                                            {formatDynamicFieldValue(fieldData.value)}
                                          </div>
                                          <div className="text-xs text-softtail-500">
                                            {fieldData.produit} - {formatDate(new Date(fieldData.date))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )
                          })()}
                          
                          <div>
                            <div className="text-xs text-softtail-500">Patient depuis</div>
                            <div className="text-softtail-700">{formatDate(patient.createdAt)}</div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Historique et activité */}
                <motion.div 
                  className="lg:col-span-2"
                  initial="hidden"
                  animate="visible"
                  variants={fadeInUp}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="border border-softtail-100 shadow-md h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2 text-softtail-800">
                        Historique et activité
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="appointments">
                        <TabsList className="mb-4 border-b w-full rounded-none justify-start">
                          <TabsTrigger value="appointments" className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-softtail-500">
                            Rendez-vous ({patient.appointments.length})
                          </TabsTrigger>
                          <TabsTrigger value="produits" className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-softtail-500">
                            Produits ({patient.produits.length})
                          </TabsTrigger>
                          <TabsTrigger value="medical-info" className="rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-softtail-500">
                            Infos médicales
                          </TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="appointments">
                          {patient.appointments.length > 0 ? (
                            <div className="space-y-3">
                              {patient.appointments
                                .sort((a, b) => b.date.getTime() - a.date.getTime())
                                .map(appointment => (
                                  <div 
                                    key={appointment.id} 
                                    className="p-3 bg-white rounded-md border border-gray-100 hover:shadow-sm transition-shadow"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 bg-softtail-50 rounded-full flex flex-col items-center justify-center">
                                          <Calendar size={14} className="text-softtail-500" />
                                          <span className="text-xs font-medium">{appointment.time}</span>
                                        </div>
                                        <div>
                                          <div className="text-sm font-medium">
                                            {appointment.date.toLocaleDateString('fr-FR', {
                                              day: 'numeric',
                                              month: 'long',
                                              year: 'numeric'
                                            })}
                                          </div>
                                          <div className="text-xs text-softtail-500">
                                            Durée: {appointment.duration} minutes
                                          </div>
                                          <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 text-white ${getAppointmentStatusColor(appointment.status)}`}>
                                            {getAppointmentStatusLabel(appointment.status)}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <div className="text-center py-10 text-softtail-500">
                              Aucun rendez-vous trouvé pour ce patient
                            </div>
                          )}
                        </TabsContent>
                        
                        <TabsContent value="produits">
                          {patient.produits.length > 0 ? (
                            <div className="space-y-3">
                              {patient.produits
                                .sort((a, b) => b.dateCommande.getTime() - a.dateCommande.getTime())
                                .map(produit => (
                                  <div 
                                    key={produit.id} 
                                    className="p-3 bg-white rounded-md border border-gray-100 hover:shadow-sm transition-shadow"
                                  >
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <div className="text-sm font-medium">
                                          {produit.type}
                                        </div>
                                        <div className="text-xs text-softtail-500 flex items-center gap-1 mt-1">
                                          <Calendar size={12} />
                                          Commandée le: {produit.dateCommande.toLocaleDateString('fr-FR')}
                                        </div>
                                        {produit.dateLivraison && (
                                          <div className="text-xs text-softtail-500 mt-1">
                                            Livraison prévue: {produit.dateLivraison.toLocaleDateString('fr-FR')}
                                          </div>
                                        )}
                                        <div className={`text-xs px-2 py-1 rounded-full inline-block mt-2 text-white ${getProduitStatusColor(produit.status)}`}>
                                          {getProduitStatusLabel(produit.status)}
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-sm font-semibold text-softtail-700">
                                          {produit.prix.toFixed(2)} €
                                        </div>
                                      </div>
                                    </div>
                                    {produit.description && (
                                      <div className="text-xs text-softtail-600 mt-2 pt-2 border-t border-gray-100">
                                        {produit.description}
                                      </div>
                                    )}
                                    {/* Affichage des informations supplémentaires du produit */}
                                    {produit.champsCustom && Object.keys(produit.champsCustom).length > 0 && (
                                      <div className="mt-2 pt-2 border-t border-gray-100">
                                        <div className="text-xs text-softtail-600 font-medium mb-2">Informations supplémentaires :</div>
                                        <div className="space-y-1">
                                          {Object.entries(produit.champsCustom).map(([key, value]) => 
                                            value !== null && value !== undefined && value !== '' && (
                                              <div key={key} className="text-xs text-softtail-600">
                                                <span className="font-medium">
                                                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} :
                                                </span>{' '}
                                                <span>{formatDynamicFieldValue(value)}</span>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                            </div>
                          ) : (
                            <div className="text-center py-10 text-softtail-500">
                              Aucune semelle trouvée pour ce patient
                            </div>
                          )}
                        </TabsContent>
                        
                        <TabsContent value="medical-info">
                          {(() => {
                            const consolidatedInfo = getConsolidatedProductInfo()
                            return Object.keys(consolidatedInfo).length > 0 ? (
                              <div className="space-y-4">
                                <div className="text-sm text-softtail-600 bg-blue-50 p-3 rounded-md border border-blue-100">
                                  Ces informations sont automatiquement consolidées à partir des données collectées lors des commandes de semelles.
                                </div>
                                
                                <div className="grid gap-4">
                                  {Object.entries(consolidatedInfo).map(([fieldName, fieldData]) => (
                                    <div key={fieldName} className="bg-white p-4 rounded-md border border-gray-100">
                                      <div className="text-sm font-medium text-softtail-800 mb-3">
                                        {fieldName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                      </div>
                                      
                                      {Array.isArray(fieldData) ? (
                                        <div className="space-y-3">
                                          {fieldData.map((item, index) => (
                                            <div key={index} className="bg-gray-50 p-3 rounded border border-gray-200">
                                              <div className="text-sm text-softtail-700 font-medium">
                                                {formatDynamicFieldValue(item.value)}
                                              </div>
                                              <div className="text-xs text-softtail-500 mt-1 flex items-center gap-2">
                                                <span>{item.produit}</span>
                                                <span>•</span>
                                                <span>{formatDate(new Date(item.date))}</span>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <div className="bg-gray-50 p-3 rounded border border-gray-200">
                                          <div className="text-sm text-softtail-700 font-medium">
                                            {formatDynamicFieldValue(fieldData.value)}
                                          </div>
                                          <div className="text-xs text-softtail-500 mt-1 flex items-center gap-2">
                                            <span>{fieldData.produit}</span>
                                            <span>•</span>
                                            <span>{formatDate(new Date(fieldData.date))}</span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-10">
                                <div className="text-softtail-500 mb-2">
                                  Aucune information médicale supplémentaire disponible
                                </div>
                                <div className="text-xs text-softtail-400">
                                  Les informations médicales sont collectées automatiquement lors des commandes de semelles avec des champs personnalisés.
                                </div>
                              </div>
                            )
                          })()}
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-red-500">Patient non trouvé</p>
                <Button 
                  variant="outline"
                  onClick={() => router.push('/admin/patients')}
                  className="mt-4"
                >
                  Retour à la liste des patients
                </Button>
              </div>
            )}
      </div>
    </div>
  )
}
