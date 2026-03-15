"use client"

import * as React from "react"
import { Settings, Edit, RotateCcw, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { DynamicFields } from "@/components/DynamicFields"
import { DynamicField } from "@/types/dynamic-fields"
import { toast } from "sonner"

interface TypeTemplate {
  id: string
  nom: string
  champsTemplate: DynamicField[]
  hasOwnTemplate: boolean
}

interface TemplateManagerProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  typeId: string
  typeName: string
  onTemplateUpdated?: () => void
}

export default function TypeTemplateManager({ 
  isOpen, 
  onOpenChange, 
  typeId, 
  typeName,
  onTemplateUpdated 
}: TemplateManagerProps) {
  const [template, setTemplate] = React.useState<TypeTemplate | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [fields, setFields] = React.useState<DynamicField[]>([])
  const [fieldValues, setFieldValues] = React.useState<Record<string, any>>({})

  // Charger le template du type de produit
  const loadTemplate = async () => {
    if (!typeId) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/type-templates?typeId=${typeId}`)
      if (response.ok) {
        const data = await response.json()
        setTemplate(data)
        setFields(data.champsTemplate || [])
        setFieldValues({}) // Reset des valeurs
      } else {
        toast.error('Erreur lors du chargement du template')
      }
    } catch (error) {
      console.error('Error loading template:', error)
      toast.error('Erreur lors du chargement du template')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (isOpen && typeId) {
      loadTemplate()
    }
  }, [isOpen, typeId])

  const handleSaveTemplate = async () => {
    if (!typeId) return

    setSaving(true)
    try {
      const response = await fetch(`/api/type-templates?typeId=${typeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ champsTemplate: fields })
      })

      if (response.ok) {
        const updatedTemplate = await response.json()
        setTemplate(updatedTemplate)
        toast.success('Template sauvegardé avec succès')
        onTemplateUpdated?.()
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

  const handleResetTemplate = async () => {
    if (!typeId) return

    setSaving(true)
    try {
      const response = await fetch(`/api/type-templates?typeId=${typeId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        const updatedTemplate = await response.json()
        setTemplate(updatedTemplate)
        setFields(updatedTemplate.champsTemplate || [])
        setFieldValues({})
        toast.success('Template réinitialisé - utilise maintenant le template de la catégorie')
        onTemplateUpdated?.()
      } else {
        toast.error('Erreur lors de la réinitialisation')
      }
    } catch (error) {
      console.error('Error resetting template:', error)
      toast.error('Erreur lors de la réinitialisation')
    } finally {
      setSaving(false)
    }
  }

  const handleAddField = (fieldData: Omit<DynamicField, 'id' | 'order'>) => {
    const newField: DynamicField = {
      ...fieldData,
      id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      order: fields.length
    }
    
    setFields([...fields, newField])
  }

  const handleRemoveField = (fieldId: string) => {
    setFields(fields.filter(field => field.id !== fieldId))
    // Supprimer aussi la valeur correspondante
    const newValues = { ...fieldValues }
    delete newValues[fieldId]
    setFieldValues(newValues)
  }

  const handleFieldsChange = (values: Record<string, any>) => {
    setFieldValues(values)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Template personnalisé - {typeName}
          </DialogTitle>
          <DialogDescription>
            Personnalisez les champs spécifiques pour ce type de produit. 
            Si aucun template personnalisé n'est défini, celui de la catégorie sera utilisé.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center">
            <div className="animate-pulse">Chargement du template...</div>
          </div>
        ) : template ? (
          <div className="space-y-6">
            {/* Status du template */}
            <div className="flex items-center justify-between p-4 rounded-lg border bg-gray-50">
              <div className="flex items-center gap-3">
                {template.hasOwnTemplate ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium text-green-900">Template personnalisé actif</div>
                      <div className="text-sm text-green-700">
                        Ce type utilise son propre template avec {fields.length} champ(s)
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Personnalisé
                    </Badge>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="font-medium text-blue-900">Template de catégorie</div>
                      <div className="text-sm text-blue-700">
                        Ce type utilise le template de sa catégorie avec {fields.length} champ(s)
                      </div>
                    </div>
                    <Badge variant="outline" className="border-blue-200 text-blue-800">
                      Par défaut
                    </Badge>
                  </>
                )}
              </div>
              
              {template.hasOwnTemplate && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetTemplate}
                  disabled={saving}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Réinitialiser
                </Button>
              )}
            </div>

            {/* Éditeur de champs */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Champs du template
              </h3>
              
              <DynamicFields
                fields={fields}
                values={fieldValues}
                onChange={handleFieldsChange}
                onAddField={handleAddField}
                onRemoveField={handleRemoveField}
                canEdit={true}
              />
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            Erreur lors du chargement du template
          </div>
        )}

        <DialogFooter className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {fields.length > 0 
              ? `${fields.length} champ${fields.length > 1 ? 's' : ''} configuré${fields.length > 1 ? 's' : ''}`
              : "Aucun champ configuré"
            }
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fermer
            </Button>
            <Button 
              onClick={handleSaveTemplate} 
              disabled={saving}
            >
              {saving ? 'Sauvegarde...' : 'Sauvegarder le template'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
