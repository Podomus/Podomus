import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Récupérer une catégorie par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const categorie = await prisma.categorieProduit.findUnique({
      where: { id },
      include: {
        typesProduits: {
          orderBy: { nom: 'asc' }
        },
        _count: {
          select: {
            typesProduits: true
          }
        }
      }
    })

    if (!categorie) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json(categorie)
  } catch (error) {
    console.error('Erreur lors de la récupération de la catégorie:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la catégorie' },
      { status: 500 }
    )
  }
}

// PUT - Modifier une catégorie
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { nom, description, couleur, icone, ordre, actif } = body

    // Vérifier si la catégorie existe
    const existingCategorie = await prisma.categorieProduit.findUnique({
      where: { id }
    })

    if (!existingCategorie) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 404 }
      )
    }

    // Vérifier si le nom est unique (sauf pour cette catégorie)
    if (nom !== existingCategorie.nom) {
      const categorieWithSameName = await prisma.categorieProduit.findUnique({
        where: { nom }
      })

      if (categorieWithSameName) {
        return NextResponse.json(
          { error: 'Une catégorie avec ce nom existe déjà' },
          { status: 400 }
        )
      }
    }

    const updatedCategorie = await prisma.categorieProduit.update({
      where: { id },
      data: {
        nom,
        description,
        couleur,
        icone,
        ordre,
        actif
      }
    })

    return NextResponse.json(updatedCategorie)
  } catch (error) {
    console.error('Erreur lors de la modification de la catégorie:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la modification de la catégorie' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une catégorie
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Vérifier si la catégorie existe
    const existingCategorie = await prisma.categorieProduit.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            typesProduits: true
          }
        }
      }
    })

    if (!existingCategorie) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 404 }
      )
    }

    // Vérifier s'il y a des types de produits associés
    if (existingCategorie._count.typesProduits > 0) {
      return NextResponse.json(
        { error: 'Impossible de supprimer une catégorie qui contient des types de produits' },
        { status: 400 }
      )
    }

    await prisma.categorieProduit.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Catégorie supprimée avec succès' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la catégorie' },
      { status: 500 }
    )
  }
}
