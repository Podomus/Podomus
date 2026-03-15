"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { authClient } from "@/lib/auth-client"
import { Search, Plus, Edit, Trash, FolderOpen, Palette, Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
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
  createdAt: Date
  updatedAt: Date
  _count?: {
    typesProduits: number
  }
}

// Couleurs prédéfinies pour les catégories
const COULEURS_CATEGORIES = [
  "#3B82F6", // Bleu
  "#10B981", // Vert
  "#F59E0B", // Orange
  "#EF4444", // Rouge
  "#8B5CF6", // Violet
  "#F97316", // Orange foncé
  "#06B6D4", // Cyan
  "#84CC16", // Lime
  "#EC4899", // Rose
  "#6B7280", // Gris
]

// Icônes prédéfinies
const ICONES_CATEGORIES = [
  "Package",
  "FolderOpen", 
  "Palette",
  "Heart",
  "Star",
  "Shield",
  "Activity",
  "Settings",
  "Tool",
  "Zap"
]

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

export default function CategoriesPage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [categories, setCategories] = React.useState<Categorie[]>([])
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [categorieToEdit, setCategorieToEdit] = React.useState<Categorie | null>(null)
  const [categorieToDelete, setCategorieToDelete] = React.useState<string | null>(null)

  // Form state for new categorie
  const [newCategorie, setNewCategorie] = React.useState({
    nom: "",
    description: "",
    couleur: COULEURS_CATEGORIES[0],
    icone: ICONES_CATEGORIES[0],
    ordre: 0,
    actif: true
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
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error)
    }
  }, [])

  React.useEffect(() => {
    if (!loading) {
      fetchCategories()
    }
  }, [loading, fetchCategories])

  // Filter categories
  const filteredCategories = categories.filter(categorie =>
    categorie.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    categorie.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handlers
  const handleEditCategorie = (categorie: Categorie) => {
    setCategorieToEdit(categorie)
    setIsEditDialogOpen(true)
  }

  const handleDeleteCategorie = (id: string) => {
    setCategorieToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleCreateSubmit = async () => {
    if (!newCategorie.nom.trim()) return

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategorie),
      })

      if (response.ok) {
        setIsCreateDialogOpen(false)
        setNewCategorie({
          nom: "",
          description: "",
          couleur: COULEURS_CATEGORIES[0],
          icone: ICONES_CATEGORIES[0],
          ordre: 0,
          actif: true
        })
        fetchCategories()
        toast.success("Produit créé avec succès")
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
    if (!categorieToEdit) return

    try {
      const response = await fetch(`/api/categories/${categorieToEdit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categorieToEdit),
      })

      if (response.ok) {
        setIsEditDialogOpen(false)
        setCategorieToEdit(null)
        fetchCategories()
        toast.success("Produit modifiée avec succès")
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
    if (!categorieToDelete) return

    try {
      const response = await fetch(`/api/categories/${categorieToDelete}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setIsDeleteDialogOpen(false)
        setCategorieToDelete(null)
        fetchCategories()
        toast.success("Produit supprimé avec succès")
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
              <h2 className="text-3xl font-bold tracking-tight">Gestion des Produits</h2>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/admin">Tableau de bord</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Produits</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Produit
            </Button>
          </div>

          {/* Search */}
          <motion.div
            initial={fadeInUp.hidden}
            animate={fadeInUp.visible}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher un Produit..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>

          {/* Categories Grid */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredCategories.map((categorie) => (
              <motion.div key={categorie.id} variants={fadeInUp}>
                <Card className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: categorie.couleur || '#6B7280' }}
                      />
                      <CardTitle className="text-lg font-medium">
                        {categorie.nom}
                      </CardTitle>
                    </div>
                    <div className="flex items-center space-x-1">
                      {!categorie.actif && (
                        <Badge variant="secondary">Inactif</Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCategorie(categorie)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCategorie(categorie.id)}
                        disabled={!!categorie._count?.typesProduits}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {categorie.description && (
                        <p className="text-sm text-muted-foreground">
                          {categorie.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Types de produits:</span>
                        <Badge variant="outline">
                          {categorie._count?.typesProduits || 0}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Ordre:</span>
                        <Badge variant="outline">
                          {categorie.ordre}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredCategories.length === 0 && (
            <motion.div
              initial={fadeInUp.hidden}
              animate={fadeInUp.visible}
              className="text-center py-8"
            >
              <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">Aucun produit</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Commencez par créer un nouveau produit.
              </p>
            </motion.div>
          )}

        {/* Create Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Créer un nouveau produit</DialogTitle>
              <DialogDescription>
                Ajoutez un nouveau produit pour organiser vos types de produits.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom du produit</Label>
                <Input
                  id="nom"
                  value={newCategorie.nom}
                  onChange={(e) => setNewCategorie({...newCategorie, nom: e.target.value})}
                  placeholder="Ex: Semelles"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newCategorie.description}
                  onChange={(e) => setNewCategorie({...newCategorie, description: e.target.value})}
                  placeholder="Description du produit..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="couleur">Couleur</Label>
                  <div className="flex flex-wrap gap-2">
                    {COULEURS_CATEGORIES.map((couleur) => (
                      <button
                        key={couleur}
                        type="button"
                        className={`w-6 h-6 rounded border-2 ${
                          newCategorie.couleur === couleur ? 'border-gray-900' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: couleur }}
                        onClick={() => setNewCategorie({...newCategorie, couleur})}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ordre">Ordre d'affichage</Label>
                  <Input
                    id="ordre"
                    type="number"
                    value={newCategorie.ordre}
                    onChange={(e) => setNewCategorie({...newCategorie, ordre: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="actif"
                  checked={newCategorie.actif}
                  onCheckedChange={(checked) => setNewCategorie({...newCategorie, actif: checked})}
                />
                <Label htmlFor="actif">Produit actif</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateSubmit}>
                Créer le produit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        {categorieToEdit && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Modifier le produit</DialogTitle>
                <DialogDescription>
                  Modifiez les informations du produit.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-nom">Nom du produit</Label>
                  <Input
                    id="edit-nom"
                    value={categorieToEdit.nom}
                    onChange={(e) => setCategorieToEdit({...categorieToEdit, nom: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={categorieToEdit.description || ""}
                    onChange={(e) => setCategorieToEdit({...categorieToEdit, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-couleur">Couleur</Label>
                    <div className="flex flex-wrap gap-2">
                      {COULEURS_CATEGORIES.map((couleur) => (
                        <button
                          key={couleur}
                          type="button"
                          className={`w-6 h-6 rounded border-2 ${
                            categorieToEdit.couleur === couleur ? 'border-gray-900' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: couleur }}
                          onClick={() => setCategorieToEdit({...categorieToEdit, couleur})}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-ordre">Ordre d'affichage</Label>
                    <Input
                      id="edit-ordre"
                      type="number"
                      value={categorieToEdit.ordre}
                      onChange={(e) => setCategorieToEdit({...categorieToEdit, ordre: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-actif"
                    checked={categorieToEdit.actif}
                    onCheckedChange={(checked) => setCategorieToEdit({...categorieToEdit, actif: checked})}
                  />
                  <Label htmlFor="edit-actif">Produit actif</Label>
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
              <DialogTitle>Supprimer le produit</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
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
