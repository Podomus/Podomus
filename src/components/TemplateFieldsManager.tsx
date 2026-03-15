"use client"

import * as React from "react"
import { Plus, Edit, Trash2, Move, Eye, EyeOff, Settings, Save, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { FieldEditor } from "@/components/FieldEditor"
import { DynamicField } from "@/types/dynamic-fields"
import { toast } from "sonner"

interface TemplateFieldsManagerProps {
  fields: DynamicField[]
  onFieldsChange: (fields: DynamicField[]) => void
  title?: string
  description?: string
}

interface FieldCreatorProps {
  onAdd: (field: Omit<DynamicField, 'id' | 'order'>) => void
  existingFields: DynamicField[]
}

const FieldCreator: React.FC<FieldCreatorProps> = ({ onAdd, existingFields }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [newField, setNewField] = React.useState<{
    name: string
    label: string
    type: DynamicField['type']
    required: boolean
    placeholder: string
    section: string
    defaultValue: string
    options: string[]
  }>({
    name: '',
    label: '',
    type: 'text',
    required: false,
    placeholder: '',
    section: '',
    defaultValue: '',
    options: []
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newField.name || !newField.label) {
      toast.error('Le nom et le libellé sont obligatoires')
      return
    }

    // Vérifier que le nom n'existe pas déjà
    const nameExists = existingFields.some(field => field.name === newField.name)
    if (nameExists) {
      toast.error('Un champ avec ce nom existe déjà')
      return
    }

    onAdd({
      ...newField,
      options: newField.type === 'select' ? newField.options : undefined
    })

    // Reset form
    setNewField({
      name: '',
      label: '',
      type: 'text',
      required: false,
      placeholder: '',
      section: '',
      defaultValue: '',
      options: []
    })
    setIsOpen(false)
    toast.success('Champ ajouté avec succès')
  }

  const addOption = () => {
    setNewField({
      ...newField,
      options: [...newField.options, '']
    })
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...newField.options]
    newOptions[index] = value
    setNewField({ ...newField, options: newOptions })
  }

  const removeOption = (index: number) => {
    const newOptions = newField.options.filter((_, i) => i !== index)
    setNewField({ ...newField, options: newOptions })
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full border-dashed border-2"
        variant="outline"
      >
        <Plus className="h-4 w-4 mr-2" />
        Ajouter un champ
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer un nouveau champ</DialogTitle>
            <DialogDescription>
              Ajoutez un nouveau champ personnalisé au template.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="field-name">Nom du champ *</Label>
                <Input
                  id="field-name"
                  value={newField.name}
                  onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                  placeholder="ex: couleur"
                />
              </div>
              <div>
                <Label htmlFor="field-label">Libellé *</Label>
                <Input
                  id="field-label"
                  value={newField.label}
                  onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                  placeholder="ex: Couleur souhaitée"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="field-type">Type de champ</Label>
                <Select
                  value={newField.type}
                  onValueChange={(value: DynamicField['type']) => 
                    setNewField({ ...newField, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texte</SelectItem>
                    <SelectItem value="number">Nombre</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="select">Liste déroulante</SelectItem>
                    <SelectItem value="textarea">Zone de texte</SelectItem>
                    <SelectItem value="boolean">Case à cocher</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="tel">Téléphone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="field-section">Section (optionnel)</Label>
                <Input
                  id="field-section"
                  value={newField.section}
                  onChange={(e) => setNewField({ ...newField, section: e.target.value })}
                  placeholder="ex: Mesures, Options"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="field-placeholder">Placeholder</Label>
              <Input
                id="field-placeholder"
                value={newField.placeholder}
                onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                placeholder="Texte d'aide pour l'utilisateur"
              />
            </div>

            <div>
              <Label htmlFor="field-default">Valeur par défaut</Label>
              <Input
                id="field-default"
                value={newField.defaultValue}
                onChange={(e) => setNewField({ ...newField, defaultValue: e.target.value })}
                placeholder="Valeur pré-remplie"
              />
            </div>

            {newField.type === 'select' && (
              <div>
                <Label>Options de la liste</Label>
                <div className="space-y-2 mt-2">
                  {newField.options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeOption(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une option
                  </Button>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id="field-required"
                checked={newField.required}
                onCheckedChange={(checked) => setNewField({ ...newField, required: !!checked })}
              />
              <Label htmlFor="field-required">Champ obligatoire</Label>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Annuler
              </Button>
              <Button type="submit">
                Créer le champ
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export const TemplateFieldsManager: React.FC<TemplateFieldsManagerProps> = ({
  fields,
  onFieldsChange,
  title = "Gestion des champs du template",
  description = "Organisez et modifiez les champs de ce template"
}) => {
  const [editingField, setEditingField] = React.useState<DynamicField | null>(null)
  const [previewMode, setPreviewMode] = React.useState(false)

  const handleAddField = (fieldData: Omit<DynamicField, 'id' | 'order'>) => {
    const newField: DynamicField = {
      ...fieldData,
      id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      order: fields.length
    }
    onFieldsChange([...fields, newField])
  }

  const handleEditField = (updatedField: DynamicField) => {
    const updatedFields = fields.map(field => 
      field.id === updatedField.id ? updatedField : field
    )
    onFieldsChange(updatedFields)
  }

  const handleDeleteField = (fieldId: string) => {
    const updatedFields = fields.filter(field => field.id !== fieldId)
    // Réorganiser les ordres
    const reorderedFields = updatedFields.map((field, index) => ({
      ...field,
      order: index
    }))
    onFieldsChange(reorderedFields)
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(fields)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Mettre à jour les ordres
    const reorderedFields = items.map((field, index) => ({
      ...field,
      order: index
    }))

    onFieldsChange(reorderedFields)
    toast.success('Ordre des champs mis à jour')
  }

  const fieldTypeLabels: Record<DynamicField['type'], string> = {
    text: 'Texte',
    number: 'Nombre',
    date: 'Date',
    select: 'Liste',
    textarea: 'Texte long',
    boolean: 'Booléen',
    email: 'Email',
    tel: 'Téléphone'
  }

  // Grouper les champs par section
  const sections = React.useMemo(() => {
    const sectionMap = new Map<string, DynamicField[]>()
    
    fields
      .sort((a, b) => a.order - b.order)
      .forEach(field => {
        const sectionName = field.section || 'général'
        if (!sectionMap.has(sectionName)) {
          sectionMap.set(sectionName, [])
        }
        sectionMap.get(sectionName)!.push(field)
      })

    return Array.from(sectionMap.entries()).map(([name, sectionFields]) => ({
      name,
      label: name === 'général' ? 'Informations générales' : name,
      fields: sectionFields
    }))
  }, [fields])

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                {title}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={previewMode ? "default" : "outline"}
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
              >
                {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {previewMode ? "Édition" : "Aperçu"}
              </Button>
              <Badge variant="secondary">
                {fields.length} champ{fields.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Liste des champs */}
      {!previewMode ? (
        <div className="space-y-4">
          <FieldCreator onAdd={handleAddField} existingFields={fields} />

          {fields.length > 0 && (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="fields">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                    {fields
                      .sort((a, b) => a.order - b.order)
                      .map((field, index) => (
                        <Draggable key={field.id} draggableId={field.id} index={index}>
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`transition-all ${
                                snapshot.isDragging ? 'shadow-lg rotate-2' : 'hover:shadow-md'
                              }`}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3 flex-1">
                                    <div
                                      {...provided.dragHandleProps}
                                      className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
                                    >
                                      <Move className="h-4 w-4 text-gray-400" />
                                    </div>
                                    
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-medium">{field.label}</h4>
                                        <Badge variant="outline" className="text-xs">
                                          {fieldTypeLabels[field.type]}
                                        </Badge>
                                        {field.required && (
                                          <Badge variant="destructive" className="text-xs">
                                            Obligatoire
                                          </Badge>
                                        )}
                                        {field.section && (
                                          <Badge variant="secondary" className="text-xs">
                                            {field.section}
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded mr-2">
                                          {field.name}
                                        </span>
                                        {field.placeholder && (
                                          <span>{field.placeholder}</span>
                                        )}
                                      </div>
                                      {field.options && field.options.length > 0 && (
                                        <div className="mt-2">
                                          <span className="text-xs text-muted-foreground">Options : </span>
                                          {field.options.slice(0, 3).map((option, i) => (
                                            <Badge key={i} variant="outline" className="text-xs mr-1">
                                              {option}
                                            </Badge>
                                          ))}
                                          {field.options.length > 3 && (
                                            <Badge variant="outline" className="text-xs">
                                              +{field.options.length - 3} autres
                                            </Badge>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setEditingField(field)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteField(field.id)}
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      ) : (
        // Mode aperçu
        <div className="space-y-6">
          {sections.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-base">{section.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {section.fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label className="flex items-center gap-1">
                        {field.label}
                        {field.required && <span className="text-red-500">*</span>}
                      </Label>
                      <div className="text-sm text-muted-foreground bg-gray-50 p-3 rounded border-2 border-dashed">
                        Champ {fieldTypeLabels[field.type].toLowerCase()}
                        {field.placeholder && ` - ${field.placeholder}`}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {fields.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun champ configuré
            </h3>
            <p className="text-gray-500 mb-4">
              Commencez par ajouter votre premier champ personnalisé
            </p>
          </CardContent>
        </Card>
      )}

      {/* Éditeur de champ */}
      {editingField && (
        <FieldEditor
          field={editingField}
          isOpen={!!editingField}
          onOpenChange={(open) => !open && setEditingField(null)}
          onSave={handleEditField}
          onDelete={handleDeleteField}
          existingFields={fields}
        />
      )}
    </div>
  )
}
