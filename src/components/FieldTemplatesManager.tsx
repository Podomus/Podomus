"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Plus, Settings, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { DynamicFields } from "@/components/DynamicFields"
import { DynamicField } from "@/types/dynamic-fields"

interface CategorieProduit {
  id: string
  nom: string
  champsTemplate: DynamicField[]
}

export const FieldTemplatesManager: React.FC = () => {
  const [categories, setCategories] = useState<CategorieProduit[]>([])
  const [selectedCategorieId, setSelectedCategorieId] = useState<string>("")
  const [currentTemplate, setCurrentTemplate] = useState<DynamicField[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Charger les produits au démarrage
  useEffect(() => {
    loadCategories()
  }, [])

  // Charger le template quand le produit change
  useEffect(() => {
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
      } else {
        toast.error('Erreur lors du chargement des produits')
      }
    } catch (error) {
      console.error('Error loading categories:', error)
      toast.error('Erreur lors du chargement des catégories')
    } finally {
      setLoading(false)
    }
  }

  const loadTemplate = async (categorieId: string) => {
    try {
      const response = await fetch(`/api/field-templates?categorieId=${categorieId}`)
      if (response.ok) {
        const data = await response.json()
        setCurrentTemplate(data.champsTemplate || [])
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
      toast.error('Aucun produit sélectionné')
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
        // Mettre à jour la liste des produits
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
  }

  const handleRemoveField = (fieldId: string) => {
    setCurrentTemplate(currentTemplate.filter(field => field.id !== fieldId))
  }

  const handleFieldChange = (values: Record<string, any>) => {
    // Cette fonction n'est pas utilisée pour le template mais est requise par le composant
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Gestion des champs dynamiques par produit
            </CardTitle>
            <Button
              onClick={() => setIsDialogOpen(true)}
              variant="outline"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Gérer les templates
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Sélectionner un produit
              </label>
              <Select
                value={selectedCategorieId}
                onValueChange={setSelectedCategorieId}
              >
                <SelectTrigger className="w-full max-w-md">
                  <SelectValue placeholder="Choisir un produit..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((categorie) => (
                    <SelectItem key={categorie.id} value={categorie.id}>
                      {categorie.nom} 
                      {categorie.champsTemplate?.length > 0 && (
                        <span className="ml-2 text-xs text-gray-500">
                          ({categorie.champsTemplate.length} champ{categorie.champsTemplate.length > 1 ? 's' : ''})
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCategorieId && (
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">
                    Champs pour "{categories.find(c => c.id === selectedCategorieId)?.nom}"
                  </h3>
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
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <DynamicFields
                    fields={currentTemplate}
                    values={{}} // Pas de valeurs pour l'édition du template
                    onChange={handleFieldChange}
                    onAddField={handleAddField}
                    onRemoveField={handleRemoveField}
                    canEdit={true}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog pour la gestion rapide */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gestion des champs dynamiques</DialogTitle>
            <DialogDescription>
              Configurez les champs personnalisés pour chaque type de produit.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {categories.map((categorie) => (
              <Card key={categorie.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{categorie.nom}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600 mb-2">
                    {categorie.champsTemplate?.length || 0} champ{(categorie.champsTemplate?.length || 0) > 1 ? 's' : ''} configuré{(categorie.champsTemplate?.length || 0) > 1 ? 's' : ''}
                  </div>
                  {categorie.champsTemplate?.length > 0 && (
                    <div className="space-y-1">
                      {categorie.champsTemplate.map((field, index) => (
                        <div key={field.id || index} className="flex items-center justify-between text-xs bg-gray-100 p-2 rounded">
                          <span className="font-medium">{field.label}</span>
                          <span className="text-gray-500">
                            {field.type} {field.required && '(requis)'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      setSelectedCategorieId(categorie.id)
                      setIsDialogOpen(false)
                    }}
                  >
                    Configurer
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default FieldTemplatesManager
