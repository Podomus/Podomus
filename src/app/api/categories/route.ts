import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Récupérer toutes les catégories
export async function GET() {
  try {
    const categories = await prisma.categorieProduit.findMany({
      orderBy: [
        { ordre: 'asc' },
        { nom: 'asc' }
      ],
      include: {
        _count: {
          select: {
            typesProduits: true
          }
        }
      }
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des catégories' },
      { status: 500 }
    )
  }
}

// POST - Créer une nouvelle catégorie
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nom, description, couleur, icone, ordre } = body

    // Vérifier si une catégorie avec ce nom existe déjà
    const existingCategorie = await prisma.categorieProduit.findUnique({
      where: { nom }
    })

    if (existingCategorie) {
      return NextResponse.json(
        { error: 'Une catégorie avec ce nom existe déjà' },
        { status: 400 }
      )
    }

    const categorie = await prisma.categorieProduit.create({
      data: {
        nom,
        description,
        couleur,
        icone,
        ordre: ordre || 0
      }
    })

    return NextResponse.json(categorie, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la catégorie' },
      { status: 500 }
    )
  }
}
