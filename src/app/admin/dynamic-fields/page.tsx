"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FieldTemplatesManager } from "@/components/FieldTemplatesManager"
import TypeTemplateManager from "@/components/TypeTemplateManager"
import { TemplateFieldsManager } from "@/components/TemplateFieldsManager"
import { Settings, Package, Search, Edit, Eye, Layers, ShoppingBag } from "lucide-react"
import { toast } from "sonner"
import { DynamicField } from "@/types/dynamic-fields"

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

interface TypeProduit {
  id: string
  nom: string
  description?: string
  categorieId: string
  categorie: {
    nom: string
    couleur?: string
  }
  champsTemplate?: any[]
  hasOwnTemplate?: boolean
}

interface CategorieProduit {
  id: string
  nom: string
  couleur?: string
  champsTemplate?: any[]
}

export default function DynamicFieldsPage() {
  const [typesProduits, setTypesProduits] = React.useState<TypeProduit[]>([])
  const [categories, setCategories] = React.useState<CategorieProduit[]>([])
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all")
  const [searchTerm, setSearchTerm] = React.useState("")
  const [loading, setLoading] = React.useState(true)
  const [selectedTypeId, setSelectedTypeId] = React.useState("")
  const [selectedTypeName, setSelectedTypeName] = React.useState("")
  const [isTemplateManagerOpen, setIsTemplateManagerOpen] = React.useState(false)
  const [isFieldsManagerOpen, setIsFieldsManagerOpen] = React.useState(false)
  const [selectedTypeForFieldsManager, setSelectedTypeForFieldsManager] = React.useState<TypeProduit | null>(null)

  // Charger les données au démarrage
  React.useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [typesResponse, categoriesResponse] = await Promise.all([
        fetch('/api/product-types'),
        fetch('/api/categories')
      ])

      if (typesResponse.ok) {
        const typesData = await typesResponse.json()
        setTypesProduits(typesData)
      }

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData)
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  const filteredTypes = typesProduits.filter(type => {
    const matchesSearch = type.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         type.categorie.nom.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || selectedCategory === "all" || type.categorieId === selectedCategory
    return matchesSearch && matchesCategory
  })

  const openTemplateManager = (typeId: string, typeName: string) => {
    setSelectedTypeId(typeId)
    setSelectedTypeName(typeName)
    setIsTemplateManagerOpen(true)
  }

  const openFieldsManager = (type: TypeProduit) => {
    setSelectedTypeForFieldsManager(type)
    setIsFieldsManagerOpen(true)
  }

  const handleTemplateUpdated = () => {
    // Recharger les données pour mettre à jour les indicateurs
    loadData()
  }

  const handleFieldsUpdated = async (fields: DynamicField[]) => {
    if (!selectedTypeForFieldsManager) return

    try {
      const response = await fetch(`/api/type-templates?typeId=${selectedTypeForFieldsManager.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ champsTemplate: fields })
      })

      if (response.ok) {
        await loadData() // Recharger les données
        toast.success('Template mis à jour avec succès')
      } else {
        toast.error('Erreur lors de la mise à jour du template')
      }
    } catch (error) {
      console.error('Error updating template:', error)
      toast.error('Erreur lors de la mise à jour du template')
    }
  }

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6">
          <div className="flex items-center gap-2 px-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin">Administration</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Templates de Produits</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Templates de Produits</h1>
                <p className="text-gray-600 mt-2">
                  Configurez les champs personnalisés pour chaque produit et type de produit. 
                  Ces templates déterminent quels champs spécifiques seront disponibles lors de la création d'ordres.
                </p>
              </div>

              <Tabs defaultValue="categories" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="categories" className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Templates par Produit
                  </TabsTrigger>
                  <TabsTrigger value="produits" className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Templates par sous-Produits
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="categories" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Layers className="h-5 w-5" />
                        Gestion des Templates par Produit
                      </CardTitle>
                      <CardDescription>
                        Configurez les champs de base qui seront hérités par tous les types de produits .
                        Ces champs constituent le template par défaut.
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  <FieldTemplatesManager />
                </TabsContent>

                <TabsContent value="produits" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        Gestion des Templates par Types de Produits
                      </CardTitle>
                      <CardDescription>
                        Personnalisez les champs spécifiques pour chaque type de produit. 
                        Ces templates remplacent ou complètent celui du produit.
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  {/* Filtres et recherche */}
                  <div className="flex gap-4 items-center">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Rechercher un type de produit..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="Filtrer par produit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les produits</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded"
                                style={{ backgroundColor: category.couleur || '#6B7280' }}
                              />
                              {category.nom}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Liste des types de produits */}
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredTypes.map((type) => (
                        <motion.div key={type.id} variants={fadeInUp}>
                          <Card className="hover:shadow-md transition-shadow duration-200">
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <CardTitle className="text-lg font-medium mb-2">
                                    {type.nom}
                                  </CardTitle>
                                  {type.description && (
                                    <p className="text-sm text-gray-600 mb-3">
                                      {type.description}
                                    </p>
                                  )}
                                  <Badge
                                    variant="outline"
                                    className="text-xs"
                                    style={{
                                      borderColor: type.categorie.couleur,
                                      color: type.categorie.couleur,
                                      backgroundColor: `${type.categorie.couleur}10`
                                    }}
                                  >
                                    {type.categorie.nom}
                                  </Badge>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {/* Indicateur de template */}
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center gap-2">
                                    <Settings className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm font-medium">
                                      Template
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {type.hasOwnTemplate ? (
                                      <Badge variant="default" className="text-xs">
                                        Personnalisé
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline" className="text-xs">
                                        Hérité
                                      </Badge>
                                    )}
                                    <span className="text-xs text-gray-500">
                                      {type.champsTemplate?.length || 0} champ(s)
                                    </span>
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => openTemplateManager(type.id, type.nom)}
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Modifier
                                  </Button>
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => openFieldsManager(type)}
                                    title="Gestion avancée des champs"
                                  >
                                    <Settings className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      // Fonction pour prévisualiser le template
                                      toast.info('Fonctionnalité de prévisualisation à venir')
                                    }}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {filteredTypes.length === 0 && !loading && (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Aucun type de produit trouvé
                        </h3>
                        <p className="text-gray-500 mb-4">
                          {searchTerm || (selectedCategory && selectedCategory !== "all")
                            ? "Aucun résultat ne correspond aux critères de recherche."
                            : "Aucun type de produit n'est encore configuré."}
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSearchTerm("")
                            setSelectedCategory("all")
                          }}
                        >
                          Effacer les filtres
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>

              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Comment ça marche ?
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
                  <div>
                    <h4 className="font-medium mb-2">🏷️ Templates par Produit</h4>
                    <ul className="space-y-1">
                      <li>• Définissez des champs de base pour tout un produit</li>
                      <li>• Tous les types de produits héritent de ces champs</li>
                      <li>• Permet une cohérence au niveau produit</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">📦 Templates par sous-Produits</h4>
                    <ul className="space-y-1">
                      <li>• <strong>Modifier</strong> : Interface simple pour personnaliser</li>
                      <li>• <strong>⚙️</strong> : Gestion avancée (ajouter, modifier, réorganiser)</li>
                      <li>• <strong>👁️</strong> : Prévisualisation du template</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-100 rounded">
                  <p className="text-xs text-blue-800">
                    <strong>Priorité :</strong> Template personnalisé &gt; Template de produit &gt; Champs par défaut
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Manager de template pour les types */}
          <TypeTemplateManager
            isOpen={isTemplateManagerOpen}
            onOpenChange={setIsTemplateManagerOpen}
            typeId={selectedTypeId}
            typeName={selectedTypeName}
            onTemplateUpdated={handleTemplateUpdated}
          />

          {/* Gestionnaire avancé de champs */}
          {selectedTypeForFieldsManager && (
            <Dialog open={isFieldsManagerOpen} onOpenChange={setIsFieldsManagerOpen}>
              <DialogContent className="sm:max-w-6xl max-h-[95vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Gestion avancée - {selectedTypeForFieldsManager.nom}
                  </DialogTitle>
                  <DialogDescription>
                    Gérez tous les aspects des champs de template pour ce type de produit. 
                    Vous pouvez ajouter, modifier, supprimer et réorganiser les champs.
                  </DialogDescription>
                </DialogHeader>

                <TemplateFieldsManager
                  fields={selectedTypeForFieldsManager.champsTemplate || []}
                  onFieldsChange={handleFieldsUpdated}
                  title={`Template pour ${selectedTypeForFieldsManager.nom}`}
                  description={`Produit : ${selectedTypeForFieldsManager.categorie.nom}`}
                />
              </DialogContent>
            </Dialog>
          )}
    </div>
  )
}
