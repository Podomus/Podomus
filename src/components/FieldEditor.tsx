"use client"

import * as React from "react"
import { Edit, Save, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DynamicField } from "@/types/dynamic-fields"
import { toast } from "sonner"

interface FieldEditorProps {
  field: DynamicField
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave: (field: DynamicField) => void
  onDelete?: (fieldId: string) => void
  existingFields: DynamicField[]
}

export const FieldEditor: React.FC<FieldEditorProps> = ({
  field,
  isOpen,
  onOpenChange,
  onSave,
  onDelete,
  existingFields
}) => {
  const [editedField, setEditedField] = React.useState<DynamicField>({ ...field })

  // Réinitialiser le formulaire quand le champ change
  React.useEffect(() => {
    setEditedField({ ...field })
  }, [field])

  const handleSave = () => {
    if (!editedField.name || !editedField.label) {
      toast.error('Le nom et le libellé sont obligatoires')
      return
    }

    // Vérifier que le nom n'existe pas déjà (sauf pour le champ actuel)
    const nameExists = existingFields.some(f => 
      f.name === editedField.name && f.id !== editedField.id
    )
    if (nameExists) {
      toast.error('Un champ avec ce nom existe déjà')
      return
    }

    onSave(editedField)
    onOpenChange(false)
    toast.success('Champ modifié avec succès')
  }

  const handleDelete = () => {
    if (onDelete && window.confirm('Êtes-vous sûr de vouloir supprimer ce champ ?')) {
      onDelete(editedField.id)
      onOpenChange(false)
      toast.success('Champ supprimé avec succès')
    }
  }

  const addOption = () => {
    setEditedField({
      ...editedField,
      options: [...(editedField.options || []), '']
    })
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...(editedField.options || [])]
    newOptions[index] = value
    setEditedField({ ...editedField, options: newOptions })
  }

  const removeOption = (index: number) => {
    const newOptions = (editedField.options || []).filter((_, i) => i !== index)
    setEditedField({ ...editedField, options: newOptions })
  }

  const fieldTypeLabels: Record<DynamicField['type'], string> = {
    text: 'Texte',
    number: 'Nombre',
    date: 'Date',
    select: 'Liste déroulante',
    textarea: 'Zone de texte',
    boolean: 'Case à cocher',
    email: 'Email',
    tel: 'Téléphone'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Modifier le champ : {field.label}
          </DialogTitle>
          <DialogDescription>
            Modifiez les propriétés de ce champ personnalisé. Les changements seront appliqués au template.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Informations de base */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Nom du champ *</Label>
                  <Input
                    id="edit-name"
                    value={editedField.name}
                    onChange={(e) => setEditedField({ ...editedField, name: e.target.value })}
                    placeholder="ex: couleur"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Nom technique utilisé dans la base de données
                  </p>
                </div>
                <div>
                  <Label htmlFor="edit-label">Libellé *</Label>
                  <Input
                    id="edit-label"
                    value={editedField.label}
                    onChange={(e) => setEditedField({ ...editedField, label: e.target.value })}
                    placeholder="ex: Couleur souhaitée"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Texte affiché à l'utilisateur
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-type">Type de champ</Label>
                  <Select
                    value={editedField.type}
                    onValueChange={(value: DynamicField['type']) => 
                      setEditedField({ ...editedField, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(fieldTypeLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-section">Section (optionnel)</Label>
                  <Input
                    id="edit-section"
                    value={editedField.section || ''}
                    onChange={(e) => setEditedField({ ...editedField, section: e.target.value })}
                    placeholder="ex: Mesures, Options"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Grouper les champs par thématique
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-placeholder">Placeholder / Aide</Label>
                <Input
                  id="edit-placeholder"
                  value={editedField.placeholder || ''}
                  onChange={(e) => setEditedField({ ...editedField, placeholder: e.target.value })}
                  placeholder="Texte d'aide pour l'utilisateur"
                />
              </div>

              <div>
                <Label htmlFor="edit-default">Valeur par défaut (optionnel)</Label>
                <Input
                  id="edit-default"
                  value={editedField.defaultValue || ''}
                  onChange={(e) => setEditedField({ ...editedField, defaultValue: e.target.value })}
                  placeholder="Valeur pré-remplie"
                />
              </div>
            </CardContent>
          </Card>

          {/* Options pour les listes déroulantes */}
          {editedField.type === 'select' && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Options de la liste déroulante</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(editedField.options || []).map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeOption(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une option
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Options avancées */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Options avancées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-required"
                  checked={editedField.required}
                  onCheckedChange={(checked) => 
                    setEditedField({ ...editedField, required: !!checked })
                  }
                />
                <Label htmlFor="edit-required">Champ obligatoire</Label>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Aperçu</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{fieldTypeLabels[editedField.type]}</Badge>
                    {editedField.required && (
                      <Badge variant="destructive" className="text-xs">Obligatoire</Badge>
                    )}
                    {editedField.section && (
                      <Badge variant="secondary" className="text-xs">
                        {editedField.section}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-blue-800">
                    <strong>{editedField.label}</strong>
                    {editedField.placeholder && ` (${editedField.placeholder})`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div>
            {onDelete && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                size="sm"
              >
                <X className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default FieldEditor
