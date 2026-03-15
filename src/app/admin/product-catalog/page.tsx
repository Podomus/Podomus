"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { authClient } from "@/lib/auth-client"
import { Search, Plus, Edit, Trash, Package, Euro, Calendar, Filter, FolderOpen, Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

// Types
interface Categorie {
  id: string
  nom: string
  description?: string
  couleur?: string
  icone?: string
  ordre: number
  actif: boolean
}

interface TypeProduit {
  id: string
  nom: string
  description?: string
  prix: number
  delaiLivraison: number
  actif: boolean
  categorieId: string
  categorie: Categorie
  createdAt: Date
  updatedAt: Date
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

export default function ProduitsCataloguePage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [typesProduits, setTypesProduits] = React.useState<TypeProduit[]>([])
  const [categories, setCategories] = React.useState<Categorie[]>([])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedCategorie, setSelectedCategorie] = React.useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [typeProduitToEdit, setTypeProduitToEdit] = React.useState<TypeProduit | null>(null)
  const [typeProduitToDelete, setTypeProduitToDelete] = React.useState<string | null>(null)

  // Form state for new type produit
  const [newTypeProduit, setNewTypeProduit] = React.useState({
    nom: "",
    categorieId: "",
    description: "",
    prix: "",
    delaiLivraison: ""
  })

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

  // Fetch categories
  const fetchCategories = React.useCallback(async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
        // Définir la première catégorie comme sélectionnée par défaut
        if (data.length > 0 && newTypeProduit.categorieId === "") {
          setNewTypeProduit(prev => ({ ...prev, categorieId: data[0].id }))
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error)
    }
  }, [newTypeProduit.categorieId])

  // Fetch types produits
  const fetchTypesProduits = React.useCallback(async () => {
    try {
      const response = await fetch('/api/product-types')
      if (response.ok) {
        const data = await response.json()
        setTypesProduits(data)
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des types de produits:', error)
    }
  }, [])

  React.useEffect(() => {
    if (!loading) {
      fetchCategories()
      fetchTypesProduits()
    }
  }, [loading, fetchCategories, fetchTypesProduits])

  // Filter types produits
  const filteredTypesProduits = typesProduits.filter(typeProduit => {
    const matchesSearch = typeProduit.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         typeProduit.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategorie = selectedCategorie === null || typeProduit.categorie.nom === selectedCategorie
    return matchesSearch && matchesCategorie
  })

  // Handlers
  const handleEditTypeProduit = (typeProduit: TypeProduit) => {
    setTypeProduitToEdit(typeProduit)
    setIsEditDialogOpen(true)
  }

  const handleDeleteTypeProduit = (id: string) => {
    setTypeProduitToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleCreateSubmit = async () => {
    if (!newTypeProduit.nom || !newTypeProduit.categorieId || !newTypeProduit.prix) return

    try {
      const response = await fetch('/api/product-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTypeProduit),
      })

      if (response.ok) {
        setIsAddDialogOpen(false)
        setNewTypeProduit({
          nom: "",
          categorieId: categories.length > 0 ? categories[0].id : "",
          description: "",
          prix: "",
          delaiLivraison: ""
        })
        fetchTypesProduits()
        toast.success("Type de produit créé avec succès")
      } else {
        const error = await response.json()
        toast.error(error.error || "Erreur lors de la création")
      }
    } catch (error) {
      console.error('Erreur lors de la création:', error)
      toast.error("Une erreur est survenue lors de la création")
    }
  }

  const handleEditSubmit = async () => {
    if (!typeProduitToEdit) return

    try {
      const response = await fetch(`/api/product-types/${typeProduitToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: typeProduitToEdit.nom,
          description: typeProduitToEdit.description,
          prix: typeProduitToEdit.prix,
          delaiLivraison: typeProduitToEdit.delaiLivraison,
          categorieId: typeProduitToEdit.categorieId
        }),
      })

      if (response.ok) {
        setIsEditDialogOpen(false)
        setTypeProduitToEdit(null)
        fetchTypesProduits()
        toast.success("Type de produit modifié avec succès")
      } else {
        const error = await response.json()
        toast.error(error.error || "Erreur lors de la modification")
      }
    } catch (error) {
      console.error('Erreur lors de la modification:', error)
      toast.error("Une erreur est survenue lors de la modification")
    }
  }

  const handleDeleteSubmit = async () => {
    if (!typeProduitToDelete) return

    try {
      const response = await fetch(`/api/product-types/${typeProduitToDelete}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setIsDeleteDialogOpen(false)
        setTypeProduitToDelete(null)
        fetchTypesProduits()
        toast.success("Type de produit supprimé avec succès")
      } else {
        const error = await response.json()
        toast.error(error.error || "Erreur lors de la suppression")
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      toast.error("Une erreur est survenue lors de la suppression")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          {/* Header */}
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Catalogue des Produits</h2>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/admin">Tableau de bord</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Catalogue</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Type
            </Button>
          </div>

          {/* Categories Overview - Always visible */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">1. Choisissez un produit</h3>
              {selectedCategorie && (
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedCategorie(null)}
                  className="text-sm"
                >
                  Voir toutes les produits
                </Button>
              )}
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categories.map((categorie) => {
                const produitsCount = typesProduits.filter(p => p.categorie.nom === categorie.nom).length
                const isSelected = selectedCategorie === categorie.nom
                return (
                  <motion.div key={categorie.id} variants={fadeInUp}>
                    <Card 
                      className={`cursor-pointer transition-all duration-200 border-l-4 ${
                        isSelected 
                          ? 'ring-2 ring-primary shadow-lg scale-105' 
                          : 'hover:shadow-lg hover:scale-102'
                      }`}
                      style={{ borderLeftColor: categorie.couleur || '#6B7280' }}
                      onClick={() => setSelectedCategorie(categorie.nom)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className={`text-sm font-medium ${isSelected ? 'text-primary' : ''}`}>
                            {categorie.nom}
                          </CardTitle>
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: categorie.couleur || '#6B7280' }}
                          />
                        </div>
                        {categorie.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {categorie.description}
                          </p>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold">{produitsCount}</div>
                          <p className="text-xs text-muted-foreground">
                            type{produitsCount > 1 ? 's' : ''} disponible{produitsCount > 1 ? 's' : ''}
                          </p>
                        </div>
                        {isSelected && (
                          <Badge className="mt-2 w-full justify-center" variant="default">
                            Sélectionnée
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Products Section - Only visible when category is selected */}
          {selectedCategorie && (
            <motion.div
              initial={fadeInUp.hidden}
              animate={fadeInUp.visible}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: categories.find(c => c.nom === selectedCategorie)?.couleur || '#6B7280' }}
                  />
                  <h3 className="text-xl font-semibold">
                    2. Types de produits - {selectedCategorie}
                  </h3>
                  <Badge variant="outline">
                    {filteredTypesProduits.length} produit{filteredTypesProduits.length > 1 ? 's' : ''}
                  </Badge>
                </div>
                <Button 
                  onClick={() => {
                    const categorieObj = categories.find(c => c.nom === selectedCategorie)
                    if (categorieObj) {
                      setNewTypeProduit(prev => ({ ...prev, categorieId: categorieObj.id }))
                    }
                    setIsAddDialogOpen(true)
                  }}
                  size="sm"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un type
                </Button>
              </div>

              {/* Search within selected category */}
              <div className="relative max-w-md">
                <Search className="absolute left-2 top-2.5 h-4 w-4 muted-foreground" />
                <Input
                  type="search"
                  placeholder={`Rechercher dans ${selectedCategorie}...`}
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredTypesProduits.map((typeProduit) => (
                  <motion.div 
                    key={typeProduit.id} 
                    variants={fadeInUp}
                    initial="hidden"
                    animate="visible"
                  >
                    <Card className="hover:shadow-lg transition-shadow duration-200">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium">
                          {typeProduit.nom}
                        </CardTitle>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTypeProduit(typeProduit)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTypeProduit(typeProduit.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {typeProduit.description && (
                            <p className="text-sm text-muted-foreground">
                              {typeProduit.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              <Euro className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium text-lg">{typeProduit.prix.toFixed(2)} €</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{typeProduit.delaiLivraison} jours</span>
                            </div>
                          </div>
                          <Badge 
                            variant="secondary" 
                            className="w-full justify-center"
                            style={{ 
                              backgroundColor: `${typeProduit.categorie.couleur}15`, 
                              borderColor: typeProduit.categorie.couleur,
                              color: typeProduit.categorie.couleur 
                            }}
                          >
                            {typeProduit.categorie.nom}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {filteredTypesProduits.length === 0 && (
                <motion.div
                  initial={fadeInUp.hidden}
                  animate={fadeInUp.visible}
                  className="text-center py-8"
                >
                  <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold">Aucun type de produit dans ce produit</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {searchTerm 
                      ? `Aucun résultat pour "${searchTerm}" dans ${selectedCategorie}.`
                      : `Commencez par créer un type de produit pour ${selectedCategorie}.`
                    }
                  </p>
                  <Button 
                    className="mt-4"
                    onClick={() => {
                      const categorieObj = categories.find(c => c.nom === selectedCategorie)
                      if (categorieObj) {
                        setNewTypeProduit(prev => ({ ...prev, categorieId: categorieObj.id }))
                      }
                      setIsAddDialogOpen(true)
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Créer le premier type de produit
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Initial state - No category selected */}
          {!selectedCategorie && (
            <motion.div
              initial={fadeInUp.hidden}
              animate={fadeInUp.visible}
              className="text-center py-12"
            >
              <FolderOpen className="mx-auto h-16 w-16 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">Sélectionnez un produit</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                Choisissez un produit ci-dessus pour voir et gérer ses types de produits. 
                Vous pouvez également créer de nouveaux produits depuis la page de gestion des produits.
              </p>
              <div className="mt-6 flex gap-3 justify-center">
                <Button onClick={() => router.push('/admin/categories')} variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Gérer les produits
                </Button>
                <Button 
                  onClick={() => setIsAddDialogOpen(true)}
                  disabled={categories.length === 0}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau type de produit
                </Button>
              </div>
            </motion.div>
          )}

        {/* Create Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Créer un nouveau type de produit</DialogTitle>
              <DialogDescription>
                Ajoutez un nouveau type de produit au catalogue.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom du type de produit</Label>
                <Input
                  id="nom"
                  value={newTypeProduit.nom}
                  onChange={(e) => setNewTypeProduit({...newTypeProduit, nom: e.target.value})}
                  placeholder="Ex: Semelle orthopédique standard"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categorie">Produit</Label>
                <Select
                  value={newTypeProduit.categorieId}
                  onValueChange={(value) => setNewTypeProduit({...newTypeProduit, categorieId: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un produit" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((categorie) => (
                      <SelectItem key={categorie.id} value={categorie.id}>
                        {categorie.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTypeProduit.description}
                  onChange={(e) => setNewTypeProduit({...newTypeProduit, description: e.target.value})}
                  placeholder="Description du type de produit..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prix">Prix (€)</Label>
                  <Input
                    id="prix"
                    type="number"
                    step="0.01"
                    value={newTypeProduit.prix}
                    onChange={(e) => setNewTypeProduit({...newTypeProduit, prix: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delaiLivraison">Délai livraison (jours)</Label>
                  <Input
                    id="delaiLivraison"
                    type="number"
                    value={newTypeProduit.delaiLivraison}
                    onChange={(e) => setNewTypeProduit({...newTypeProduit, delaiLivraison: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateSubmit}>
                Créer le type de produit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        {typeProduitToEdit && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Modifier le type de produit</DialogTitle>
                <DialogDescription>
                  Modifiez les informations du type de produit.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-nom">Nom du type de produit</Label>
                  <Input
                    id="edit-nom"
                    value={typeProduitToEdit.nom}
                    onChange={(e) => setTypeProduitToEdit({...typeProduitToEdit, nom: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-categorie">Produit</Label>
                  <Select 
                    value={typeProduitToEdit.categorieId} 
                    onValueChange={(value) => setTypeProduitToEdit({...typeProduitToEdit, categorieId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((categorie) => (
                        <SelectItem key={categorie.id} value={categorie.id}>
                          {categorie.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={typeProduitToEdit.description || ""}
                    onChange={(e) => setTypeProduitToEdit({...typeProduitToEdit, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-prix">Prix (€)</Label>
                    <Input
                      id="edit-prix"
                      type="number"
                      step="0.01"
                      value={typeProduitToEdit.prix}
                      onChange={(e) => setTypeProduitToEdit({...typeProduitToEdit, prix: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-delaiLivraison">Délai livraison (jours)</Label>
                    <Input
                      id="edit-delaiLivraison"
                      type="number"
                      value={typeProduitToEdit.delaiLivraison}
                      onChange={(e) => setTypeProduitToEdit({...typeProduitToEdit, delaiLivraison: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleEditSubmit}>
                  Sauvegarder les modifications
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Delete Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Supprimer le type de produit</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer ce type de produit ? Cette action est irréversible.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleDeleteSubmit}>
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  )
}
