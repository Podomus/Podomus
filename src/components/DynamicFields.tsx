"use client"

import * as React from "react"
import { Plus, X, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { DynamicField, DynamicFieldValue, FieldSection } from "@/types/dynamic-fields"

interface DynamicFieldsProps {
  fields: DynamicField[]
  values: Record<string, any>
  onChange: (values: Record<string, any>) => void
  onAddField?: (field: Omit<DynamicField, 'id' | 'order'>) => void
  onRemoveField?: (fieldId: string) => void
  canEdit?: boolean
  className?: string
}

interface FieldEditorProps {
  onAdd: (field: Omit<DynamicField, 'id' | 'order'>) => void
  existingFields: DynamicField[]
}

// Composant pour créer/éditer un nouveau champ
const FieldEditor: React.FC<FieldEditorProps> = ({ onAdd, existingFields }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [newField, setNewField] = React.useState<{
    name: string
    label: string
    type: DynamicField['type']
    required: boolean
    placeholder: string
    section: string
    options: string[]
  }>({
    name: '',
    label: '',
    type: 'text',
    required: false,
    placeholder: '',
    section: '',
    options: []
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newField.name || !newField.label) return

    // Vérifier que le nom n'existe pas déjà
    const nameExists = existingFields.some(field => field.name === newField.name)
    if (nameExists) {
      alert('Un champ avec ce nom existe déjà')
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
      options: []
    })
    setIsOpen(false)
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
    <Card className="mb-4 shadow-sm border-dashed border-blue-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Plus className="h-4 w-4 text-blue-500" />
            Ajouter un nouveau champ
          </CardTitle>
          <Button
            type="button"
            variant={isOpen ? "secondary" : "outline"}
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                Fermer
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1" />
                Nouveau champ
              </>
            )}
          </Button>
        </div>
        {!isOpen && (
          <p className="text-xs text-muted-foreground mt-1">
            Créez des champs personnalisés adaptés à vos besoins spécifiques
          </p>
        )}
      </CardHeader>
      
      <Collapsible open={isOpen}>
        <CollapsibleContent>
          <CardContent className="pt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    onValueChange={(value: DynamicField['type']) => setNewField({ ...newField, type: value })}
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
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addOption}
                    >
                      <Plus className="h-4 w-4" />
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
                  Ajouter le champ
                </Button>
              </div>
            </form>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  )
}

// Composant principal des champs dynamiques
export const DynamicFields: React.FC<DynamicFieldsProps> = ({
  fields,
  values,
  onChange,
  onAddField,
  onRemoveField,
  canEdit = false,
  className = ''
}) => {
  // Grouper les champs par section
  const sections = React.useMemo(() => {
    const sectionMap = new Map<string, DynamicField[]>()
    
    fields
      .sort((a, b) => a.order - b.order)
      .forEach(field => {
        const sectionName = field.section || 'general'
        if (!sectionMap.has(sectionName)) {
          sectionMap.set(sectionName, [])
        }
        sectionMap.get(sectionName)!.push(field)
      })

    return Array.from(sectionMap.entries()).map(([name, sectionFields]) => ({
      name,
      label: name === 'general' ? 'Informations générales' : name,
      fields: sectionFields
    }))
  }, [fields])

  const handleFieldChange = (fieldId: string, value: any) => {
    const newValues = { ...values, [fieldId]: value }
    onChange(newValues)
  }

  const renderField = (field: DynamicField) => {
    const value = values[field.id] || field.defaultValue || ''

    const fieldElement = (() => {
      switch (field.type) {
        case 'textarea':
          return (
            <Textarea
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
            />
          )

        case 'select':
          return (
            <Select
              value={value}
              onValueChange={(value) => handleFieldChange(field.id, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option, index) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )

        case 'boolean':
          return (
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={!!value}
                onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
              />
              <Label>{field.placeholder || field.label}</Label>
            </div>
          )

        case 'number':
          return (
            <Input
              type="number"
              value={value}
              onChange={(e) => handleFieldChange(field.id, parseFloat(e.target.value) || '')}
              placeholder={field.placeholder}
              required={field.required}
            />
          )

        case 'date':
          return (
            <Input
              type="date"
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              required={field.required}
            />
          )

        case 'email':
          return (
            <Input
              type="email"
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
            />
          )

        case 'tel':
          return (
            <Input
              type="tel"
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
            />
          )

        default: // text
          return (
            <Input
              type="text"
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              placeholder={field.placeholder}
              required={field.required}
            />
          )
      }
    })()

    return (
      <div key={field.id} className="space-y-2 group">
        <div className="flex items-center justify-between">
          <Label htmlFor={field.id} className="flex items-center gap-1">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
            {field.section && field.section !== 'general' && (
              <Badge variant="outline" className="text-xs ml-2">
                {field.section}
              </Badge>
            )}
          </Label>
          {canEdit && onRemoveField && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemoveField(field.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="relative">
          {fieldElement}
          {field.type === 'text' && field.placeholder && (
            <div className="text-xs text-muted-foreground mt-1">
              {field.placeholder}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      {canEdit && onAddField && (
        <FieldEditor onAdd={onAddField} existingFields={fields} />
      )}

      <div className="space-y-6">
        {sections.map((section, sectionIndex) => (
          <Card key={sectionIndex} className="transition-all duration-200 hover:shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                {section.label}
                <Badge variant="secondary" className="text-xs">
                  {section.fields.length} champ{section.fields.length > 1 ? 's' : ''}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {section.fields.map(renderField)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {fields.length === 0 && !canEdit && (
        <div className="text-center py-12 text-gray-500 bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-200">
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Plus className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-900">Aucun champ personnalisé</h3>
            <p className="text-sm max-w-sm mx-auto">
              Cette catégorie ne dispose pas encore de champs personnalisés définis. 
              {canEdit && " Vous pouvez en ajouter en utilisant le formulaire ci-dessus."}
            </p>
          </div>
        </div>
      )}

      {fields.length === 0 && canEdit && (
        <div className="text-center py-8 text-blue-800 bg-blue-50/30 rounded-lg border-2 border-dashed border-blue-200">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Plus className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-sm font-medium text-gray-700">
              Commencez par ajouter votre premier champ personnalisé
            </p>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Les champs personnalisés vous permettent de collecter des informations spécifiques à cette catégorie
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default DynamicFields
