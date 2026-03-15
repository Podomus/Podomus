// Types pour les champs dynamiques des produits

export interface DynamicField {
  id: string
  name: string
  label: string
  type: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'boolean' | 'email' | 'tel'
  required: boolean
  placeholder?: string
  defaultValue?: any
  options?: string[] // Pour les champs select
  validation?: {
    min?: number
    max?: number
    minLength?: number
    maxLength?: number
    pattern?: string
    customMessage?: string
  }
  section?: string // Pour grouper les champs par sections
  order: number
}

export interface DynamicFieldValue {
  fieldId: string
  value: any
}

export interface ProductFormData {
  // Champs obligatoires
  categorieId: string
  type: string
  prix: number
  patientId: string
  
  // Champs optionnels standards
  description?: string
  dateLivraison?: string
  status: string
  
  // Champs dynamiques
  champsCustom: Record<string, any>
}

export interface FieldSection {
  name: string
  label: string
  fields: DynamicField[]
}
