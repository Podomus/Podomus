'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import DynamicFields from '@/components/DynamicFields'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  Package, 
  User, 
  FileText, 
  Settings, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar as CalendarIcon,
  Euro
} from 'lucide-react'

// Types
interface Patient {
  id: string
  nom: string
  prenom: string
  email?: string
  telephone?: string
  dateNaissance?: Date
  adresse?: string
  codePostal?: string
  ville?: string
  numSecu?: string
  notes?: string
}

interface Ordre {
  id: string
  type: string
  description?: string
  prix: number
  status: string
  dateCommande: Date
  dateLivraison?: Date
  champsCustom?: any
  patientId: string
  patient: Patient
  createdAt: Date
  updatedAt: Date
}

interface CategorieProduit {
  id: string
  nom: string
  champsTemplate?: any[]
}

// Animation variants
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const ordreId = resolvedParams.id

  const [ordre, setOrdre] = useState<Ordre | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [category, setCategory] = useState<CategorieProduit | null>(null)
  
  const [editedOrdre, setEditedOrdre] = useState<Partial<Ordre>>({})
  const [editedDynamicValues, setEditedDynamicValues] = useState<any>({})

  useEffect(() => {
    loadOrdre()
  }, [ordreId])

  const loadOrdre = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/orders/${ordreId}`)
      
      if (!response.ok) {
        throw new Error('Ordre introuvable')
      }

      const data = await response.json()
      setOrdre({
        ...data,
        dateCommande: data.dateCommande ? new Date(data.dateCommande) : new Date(),
        dateLivraison: data.dateLivraison ? new Date(data.dateLivraison) : undefined,
        createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
        updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
        patient: {
          ...data.patient,
          dateNaissance: data.patient?.dateNaissance ? new Date(data.patient.dateNaissance) : undefined
        }
      })

      // Charger la catégorie pour récupérer les champs dynamiques
      if (data.type) {
        await loadCategoryForType(data.type)
      }
    } catch (error) {
      console.error('Error loading ordre:', error)
      toast.error('Erreur lors du chargement de l\'ordre')
    } finally {
      setLoading(false)
    }
  }

  const loadCategoryForType = async (typeName: string) => {
    try {
      // D'abord récupérer le type de produit pour avoir la catégorie
      const typesResponse = await fetch('/api/product-types')
      if (typesResponse.ok) {
        const types = await typesResponse.json()
        const matchingType = types.find((t: any) => t.nom === typeName)
        
        if (matchingType?.categorieId) {
          // Ensuite récupérer les champs dynamiques de cette catégorie
          const categoryResponse = await fetch(`/api/field-templates?categorieId=${matchingType.categorieId}`)
          if (categoryResponse.ok) {
            const categoryData = await categoryResponse.json()
            setCategory(categoryData)
          }
        }
      }
    } catch (error) {
      console.error('Error loading category:', error)
    }
  }

  const handleEdit = () => {
    if (ordre) {
      setEditedOrdre({
        type: ordre.type,
        description: ordre.description,
        prix: ordre.prix,
        status: ordre.status,
        dateLivraison: ordre.dateLivraison
      })
      setEditedDynamicValues(ordre.champsCustom || {})
      setIsEditing(true)
    }
  }

  const handleSave = async () => {
    if (!ordre) return

    setSaving(true)
    try {
      const response = await fetch(`/api/orders/${ordre.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editedOrdre,
          champsCustom: editedDynamicValues
        })
      })

      if (response.ok) {
        toast.success('Ordre mis à jour avec succès')
        await loadOrdre() // Recharger les données
        setIsEditing(false)
      } else {
        toast.error('Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Error updating ordre:', error)
      toast.error('Erreur lors de la mise à jour')
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (date?: Date | string) => {
    if (!date) return 'Non spécifié'
    const dateObj = date instanceof Date ? date : new Date(date)
    if (isNaN(dateObj.getTime())) return 'Date invalide'
    return dateObj.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatDateTime = (date: Date | string) => {
    if (!date) return 'Non spécifié'
    const dateObj = date instanceof Date ? date : new Date(date)
    if (isNaN(dateObj.getTime())) return 'Date invalide'
    return dateObj.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'commande':
        return <Clock className="h-4 w-4" />
      case 'en_fabrication':
      case 'en_cours':
        return <Settings className="h-4 w-4" />
      case 'livree':
      case 'livré':
        return <CheckCircle className="h-4 w-4" />
      case 'annulé':
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'commande':
        return 'bg-blue-500'
      case 'en_fabrication':
      case 'en_cours':
        return 'bg-yellow-500'
      case 'livree':
      case 'livré':
        return 'bg-green-500'
      case 'annulé':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'commande':
        return 'Commandé'
      case 'en_fabrication':
        return 'En fabrication'
      case 'en_cours':
        return 'En cours'
      case 'livree':
        return 'Livré'
      case 'livré':
        return 'Livré'
      case 'annulé':
        return 'Annulé'
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des détails de l'ordre...</p>
        </div>
      </div>
    )
  }

  if (!ordre) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ordre introuvable</h2>
          <p className="text-gray-600 mb-4">L'ordre demandé n'existe pas ou a été supprimé.</p>
          <Button onClick={() => router.push('/admin/orders')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux ordres
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6">
            {/* Header avec breadcrumb et actions */}
            <div className="flex items-center justify-between">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/admin">Administration</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/admin/orders">Orders</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Ordre #{ordre.id.slice(-6)}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <div className="flex items-center gap-2">
                <Button 
                  variant="outline"
                  onClick={() => router.push('/admin/orders')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>

                {!isEditing ? (
                  <Button onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      disabled={saving}
                    >
                      Annuler
                    </Button>
                    <Button 
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Sauvegarder
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* En-tête de l'ordre */}
              <motion.div variants={fadeInUp}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Package className="h-6 w-6 text-blue-600" />
                          <h1 className="text-2xl font-bold text-gray-900">
                            {ordre.type}
                          </h1>
                          <Badge variant="outline" className="flex items-center gap-1">
                            {getStatusIcon(ordre.status)}
                            {getStatusLabel(ordre.status)}
                          </Badge>
                        </div>
                        <p className="text-gray-600">
                          Ordre #{ordre.id.slice(-8)} • Créé le {formatDateTime(ordre.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-green-600">
                          {ordre.prix.toFixed(2)} €
                        </div>
                        <div className="text-sm text-gray-500">Prix total</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Colonne de gauche - Informations générales */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Détails de l'ordre */}
                  <motion.div variants={fadeInUp}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          Détails de l'ordre
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {isEditing ? (
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="type">Type de produit</Label>
                              <Input
                                id="type"
                                value={editedOrdre.type || ''}
                                onChange={(e) => setEditedOrdre({...editedOrdre, type: e.target.value})}
                              />
                            </div>
                            <div>
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                id="description"
                                value={editedOrdre.description || ''}
                                onChange={(e) => setEditedOrdre({...editedOrdre, description: e.target.value})}
                                rows={3}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="prix">Prix (€)</Label>
                                <Input
                                  id="prix"
                                  type="number"
                                  step="0.01"
                                  value={editedOrdre.prix || ''}
                                  onChange={(e) => setEditedOrdre({...editedOrdre, prix: parseFloat(e.target.value)})}
                                />
                              </div>
                              <div>
                                <Label htmlFor="dateLivraison">Date de livraison</Label>
                                <Input
                                  id="dateLivraison"
                                  type="date"
                                  value={editedOrdre.dateLivraison ? editedOrdre.dateLivraison.toISOString().split('T')[0] : ''}
                                  onChange={(e) => setEditedOrdre({...editedOrdre, dateLivraison: e.target.value ? new Date(e.target.value) : undefined})}
                                />
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="status">Statut</Label>
                              <Select
                                value={editedOrdre.status || ''}
                                onValueChange={(value) => setEditedOrdre({...editedOrdre, status: value})}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="commande">Commandé</SelectItem>
                                  <SelectItem value="en_fabrication">En fabrication</SelectItem>
                                  <SelectItem value="en_cours">En cours</SelectItem>
                                  <SelectItem value="livré">Livré</SelectItem>
                                  <SelectItem value="annulé">Annulé</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-6">
                              <div>
                                <div className="text-sm font-medium text-gray-500 mb-1">Type de produit</div>
                                <div className="text-gray-900">{ordre.type}</div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-500 mb-1">Statut</div>
                                <Badge className={`${getStatusColor(ordre.status)} text-white flex items-center gap-1 w-fit`}>
                                  {getStatusIcon(ordre.status)}
                                  {getStatusLabel(ordre.status)}
                                </Badge>
                              </div>
                            </div>

                            {ordre.description && (
                              <div>
                                <div className="text-sm font-medium text-gray-500 mb-1">Description</div>
                                <div className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                                  {ordre.description}
                                </div>
                              </div>
                            )}

                            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                              <div>
                                <div className="text-sm font-medium text-gray-500 mb-1">Date de commande</div>
                                <div className="flex items-center gap-2 text-gray-900">
                                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                                  {formatDate(ordre.dateCommande)}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-500 mb-1">Date de livraison</div>
                                <div className="flex items-center gap-2 text-gray-900">
                                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                                  {formatDate(ordre.dateLivraison)}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-500 mb-1">Prix</div>
                                <div className="flex items-center gap-2 text-green-600 font-semibold">
                                  <Euro className="h-4 w-4" />
                                  {ordre.prix.toFixed(2)} €
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Champs dynamiques */}
                  {(ordre.champsCustom && Object.keys(ordre.champsCustom).length > 0) || (isEditing && category?.champsTemplate) ? (
                    <motion.div variants={fadeInUp}>
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Informations personnalisées
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {isEditing && category?.champsTemplate ? (
                            <DynamicFields
                              fields={category.champsTemplate}
                              values={editedDynamicValues}
                              onChange={setEditedDynamicValues}
                              canEdit={false}
                            />
                          ) : ordre.champsCustom ? (
                            <div className="space-y-4">
                              {Object.entries(ordre.champsCustom).map(([key, value]) => {
                                const field = category?.champsTemplate?.find(f => f.id === key || f.name === key)
                                const label = field?.label || key
                                
                                return (
                                  <div key={key} className="flex items-start justify-between py-2 border-b border-gray-100 last:border-b-0">
                                    <div className="text-sm font-medium text-gray-500">{label}</div>
                                    <div className="text-gray-900 text-right max-w-xs">
                                      {typeof value === 'boolean' ? (value ? 'Oui' : 'Non') : 
                                       Array.isArray(value) ? value.join(', ') : 
                                       value?.toString() || 'Non spécifié'}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          ) : null}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ) : null}
                </div>

                {/* Colonne de droite - Informations du patient */}
                <div className="space-y-6">
                  <motion.div variants={fadeInUp}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5" />
                          Informations du patient
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="text-center pb-4 border-b">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                              <User className="h-8 w-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {ordre.patient.prenom} {ordre.patient.nom}
                            </h3>
                            {ordre.patient.dateNaissance && (
                              <p className="text-sm text-gray-500">
                                Né(e) le {formatDate(ordre.patient.dateNaissance)}
                              </p>
                            )}
                          </div>

                          <div className="space-y-3">
                            {ordre.patient.email && (
                              <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <div>
                                  <div className="text-xs text-gray-500">Email</div>
                                  <div className="text-sm text-gray-900">{ordre.patient.email}</div>
                                </div>
                              </div>
                            )}

                            {ordre.patient.telephone && (
                              <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <div>
                                  <div className="text-xs text-gray-500">Téléphone</div>
                                  <div className="text-sm text-gray-900">{ordre.patient.telephone}</div>
                                </div>
                              </div>
                            )}

                            {(ordre.patient.adresse || ordre.patient.ville) && (
                              <div className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                                <div>
                                  <div className="text-xs text-gray-500">Adresse</div>
                                  <div className="text-sm text-gray-900">
                                    {ordre.patient.adresse && <div>{ordre.patient.adresse}</div>}
                                    {(ordre.patient.codePostal || ordre.patient.ville) && (
                                      <div>{ordre.patient.codePostal} {ordre.patient.ville}</div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                            {ordre.patient.numSecu && (
                              <div>
                                <div className="text-xs text-gray-500">Numéro de sécurité sociale</div>
                                <div className="text-sm text-gray-900 font-mono">{ordre.patient.numSecu}</div>
                              </div>
                            )}

                            {ordre.patient.notes && (
                              <div>
                                <div className="text-xs text-gray-500">Notes</div>
                                <div className="text-sm text-gray-900 bg-yellow-50 p-2 rounded">
                                  {ordre.patient.notes}
                                </div>
                              </div>
                            )}
                          </div>

                          <Separator />

                          <div className="pt-2">
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => router.push(`/admin/patients/${ordre.patientId}`)}
                            >
                              Voir le profil complet
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Timeline/Historique */}
                  <motion.div variants={fadeInUp}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="h-5 w-5" />
                          Historique
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <div>
                              <div className="text-sm font-medium">Ordre créé</div>
                              <div className="text-xs text-gray-500">
                                {formatDateTime(ordre.createdAt)}
                              </div>
                            </div>
                          </div>
                          
                          {ordre.updatedAt > ordre.createdAt && (
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                              <div>
                                <div className="text-sm font-medium">Dernière modification</div>
                                <div className="text-xs text-gray-500">
                                  {formatDateTime(ordre.updatedAt)}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {ordre.dateLivraison && (
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                              <div>
                                <div className="text-sm font-medium">Date de livraison prévue</div>
                                <div className="text-xs text-gray-500">
                                  {formatDate(ordre.dateLivraison)}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </motion.div>
    </div>
  )
}
