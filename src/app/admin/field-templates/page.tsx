"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Settings, Plus, Save, ArrowLeft, Wand2, Grid3x3, FileText, Copy, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { DynamicFields } from "@/components/DynamicFields"
import { DynamicField } from "@/types/dynamic-fields"
import { authClient } from "@/lib/auth-client"

interface CategorieProduit {
  id: string
  nom: string
  description?: string
  couleur?: string
  champsTemplate: DynamicField[]
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

export default function FieldTemplatesPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [categories, setCategories] = React.useState<CategorieProduit[]>([])
  const [selectedCategorieId, setSelectedCategorieId] = React.useState<string>("")
  const [currentTemplate, setCurrentTemplate] = React.useState<DynamicField[]>([])
  const [saving, setSaving] = React.useState(false)
  const [hasChanges, setHasChanges] = React.useState(false)

  // Templates prédéfinis pour différents types de produits
  const predefinedTemplates = {
    semelles: [
      { name: "taille", label: "Pointure", type: "select" as const, required: true, options: ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"], section: "Dimensions" },
      { name: "largeur", label: "Largeur du pied", type: "select" as const, required: false, options: ["Étroit", "Normal", "Large"], section: "Dimensions" },
      { name: "pathologie", label: "Pathologie spécifique", type: "textarea" as const, required: false, placeholder: "Décrivez la pathologie...", section: "Medical" },
      { name: "activites", label: "Activités pratiquées", type: "select" as const, required: false, options: ["Sport", "Marche", "Travail debout", "Bureau"], section: "Usage" }
    ],
    chaussures: [
      { name: "taille", label: "Pointure", type: "select" as const, required: true, options: ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"], section: "Dimensions" },
      { name: "largeur", label: "Largeur", type: "select" as const, required: false, options: ["C", "D", "E", "EE", "EEE"], section: "Dimensions" },
      { name: "couleur", label: "Couleur préférée", type: "select" as const, required: false, options: ["Noir", "Marron", "Blanc", "Autre"], section: "Esthétique" },
      { name: "diabetique", label: "Chaussures diabétiques", type: "boolean" as const, required: false, section: "Medical" }
    ],
    ortheses: [
      { name: "membre", label: "Membre concerné", type: "select" as const, required: true, options: ["Pied droit", "Pied gauche", "Les deux"], section: "Localisation" },
      { name: "rigidite", label: "Niveau de rigidité", type: "select" as const, required: false, options: ["Souple", "Semi-rigide", "Rigide"], section: "Caractéristiques" },
      { name: "duree_port", label: "Durée de port quotidien", type: "select" as const, required: false, options: ["< 2h", "2-6h", "6-12h", "> 12h"], section: "Usage" }
    ]
  }

  // Vérification de l'authentification
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: session } = await authClient.getSession()
        if (!session) {
          router.push('/login')
          return
        }
        setLoading(false)
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error)
        router.push('/login')
      }
    }

    checkAuth()
  }, [router])

  // Charger les catégories
  React.useEffect(() => {
    if (!loading) {
      loadCategories()
    }
  }, [loading])

  // Charger le template quand la catégorie change
  React.useEffect(() => {
    if (selectedCategorieId) {
      loadTemplate(selectedCategorieId)
    }
  }, [selectedCategorieId])

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/field-templates')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
        // Sélectionner la première catégorie par défaut
        if (data.length > 0 && !selectedCategorieId) {
          setSelectedCategorieId(data[0].id)
        }
      } else {
        toast.error('Erreur lors du chargement des catégories')
      }
    } catch (error) {
      console.error('Error loading categories:', error)
      toast.error('Erreur lors du chargement des catégories')
    }
  }

  const loadTemplate = async (categorieId: string) => {
    try {
      const response = await fetch(`/api/field-templates?categorieId=${categorieId}`)
      if (response.ok) {
        const data = await response.json()
        setCurrentTemplate(data.champsTemplate || [])
        setHasChanges(false)
      } else {
        toast.error('Erreur lors du chargement du template')
      }
    } catch (error) {
      console.error('Error loading template:', error)
      toast.error('Erreur lors du chargement du template')
    }
  }

  const saveTemplate = async () => {
    if (!selectedCategorieId) {
      toast.error('Aucune catégorie sélectionnée')
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/field-templates?categorieId=${selectedCategorieId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          champsTemplate: currentTemplate
        })
      })

      if (response.ok) {
        toast.success('Template sauvegardé avec succès')
        setHasChanges(false)
        await loadCategories()
      } else {
        toast.error('Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Error saving template:', error)
      toast.error('Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const handleAddField = (fieldData: Omit<DynamicField, 'id' | 'order'>) => {
    const newField: DynamicField = {
      ...fieldData,
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      order: currentTemplate.length
    }
    
    setCurrentTemplate([...currentTemplate, newField])
    setHasChanges(true)
  }

  const handleRemoveField = (fieldId: string) => {
    setCurrentTemplate(currentTemplate.filter(field => field.id !== fieldId))
    setHasChanges(true)
  }

  const handleFieldChange = (values: Record<string, any>) => {
    // Cette fonction n'est pas utilisée pour le template mais est requise par le composant
  }

  const applyPredefinedTemplate = (templateKey: keyof typeof predefinedTemplates) => {
    const template = predefinedTemplates[templateKey]
    const fieldsWithIds = template.map((field, index) => ({
      ...field,
      id: `field_${Date.now()}_${index}`,
      order: index
    }))
    
    setCurrentTemplate(fieldsWithIds)
    setHasChanges(true)
    toast.success(`Template "${templateKey}" appliqué avec succès`)
  }

  const duplicateTemplate = () => {
    if (currentTemplate.length === 0) {
      toast.error('Aucun template à dupliquer')
      return
    }

    const duplicatedFields = currentTemplate.map(field => ({
      ...field,
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: `${field.name}_copy`,
      label: `${field.label} (Copie)`
    }))

    setCurrentTemplate([...currentTemplate, ...duplicatedFields])
    setHasChanges(true)
    toast.success('Template dupliqué avec succès')
  }

  const clearTemplate = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer tous les champs ?')) {
      setCurrentTemplate([])
      setHasChanges(true)
      toast.success('Template vidé')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const selectedCategorie = categories.find(c => c.id === selectedCategorieId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={fadeInUp.hidden}
        animate={fadeInUp.visible}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/orders')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour aux ordres
          </Button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Settings className="h-6 w-6 text-blue-600" />
              Gestion des champs dynamiques
            </h1>
            <p className="text-muted-foreground">
              Configurez les champs personnalisés pour chaque catégorie de produit
            </p>
          </div>
        </div>
        
        {hasChanges && (
          <Button
            onClick={saveTemplate}
            disabled={saving}
            className="flex items-center gap-2"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Save className="h-4 w-4" />
            )}
            Sauvegarder
          </Button>
        )}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar - Sélection de catégorie */}
        <motion.div
          initial={fadeInUp.hidden}
          animate={fadeInUp.visible}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Grid3x3 className="h-5 w-5" />
                Catégories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {categories.map((categorie) => (
                <Button
                  key={categorie.id}
                  variant={selectedCategorieId === categorie.id ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategorieId(categorie.id)}
                >
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: categorie.couleur || '#6B7280' }}
                  />
                  <div className="text-left">
                    <div className="font-medium">{categorie.nom}</div>
                    <div className="text-xs text-muted-foreground">
                      {categorie.champsTemplate?.length || 0} champ{(categorie.champsTemplate?.length || 0) > 1 ? 's' : ''}
                    </div>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Main content */}
        <motion.div
          initial={fadeInUp.hidden}
          animate={fadeInUp.visible}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3"
        >
          {selectedCategorie ? (
            <div className="space-y-6">
              {/* Actions rapides */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5" />
                    Actions rapides pour "{selectedCategorie.nom}"
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {/* Templates prédéfinis */}
                    {Object.keys(predefinedTemplates).map((templateKey) => (
                      <Button
                        key={templateKey}
                        variant="outline"
                        size="sm"
                        onClick={() => applyPredefinedTemplate(templateKey as keyof typeof predefinedTemplates)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Template {templateKey}
                      </Button>
                    ))}
                    
                    <div className="border-l border-gray-200 mx-2"></div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={duplicateTemplate}
                      disabled={currentTemplate.length === 0}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Dupliquer
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearTemplate}
                      disabled={currentTemplate.length === 0}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Vider
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Configuration des champs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Configuration des champs
                    <Badge variant="outline">
                      {currentTemplate.length} champ{currentTemplate.length > 1 ? 's' : ''}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <DynamicFields
                    fields={currentTemplate}
                    values={{}} // Pas de valeurs pour l'édition du template
                    onChange={handleFieldChange}
                    onAddField={handleAddField}
                    onRemoveField={handleRemoveField}
                    canEdit={true}
                    className="min-h-[300px]"
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Settings className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Sélectionnez une catégorie
                </h3>
                <p className="text-gray-500">
                  Choisissez une catégorie dans la liste pour configurer ses champs personnalisés
                </p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Footer d'information */}
      <motion.div
        initial={fadeInUp.hidden}
        animate={fadeInUp.visible}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Comment ça marche ?</h4>
                <p className="text-sm text-blue-700">
                  Les champs dynamiques permettent de collecter des informations spécifiques pour chaque catégorie. 
                  Une fois configurés ici, ils apparaîtront automatiquement dans le formulaire de création d'ordre. 
                  Vous pouvez utiliser les templates prédéfinis ou créer vos propres champs personnalisés.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
