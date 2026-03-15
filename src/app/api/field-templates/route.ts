import { NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const categorieId = searchParams.get('categorieId')

    if (categorieId) {
      // Récupérer le template d'une catégorie spécifique avec une requête SQL brute si nécessaire
      const categorie = await prisma.categorieProduit.findUnique({
        where: { id: categorieId }
      })

      if (!categorie) {
        return NextResponse.json(
          { error: 'Catégorie non trouvée' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        id: categorie.id,
        nom: categorie.nom,
        champsTemplate: (categorie as any).champsTemplate || []
      })
    }

    // Récupérer tous les templates
    const categories = await prisma.categorieProduit.findMany({
      orderBy: {
        ordre: 'asc'
      }
    })

    const templatesWithDefaults = categories.map(cat => ({
      id: cat.id,
      nom: cat.nom,
      champsTemplate: (cat as any).champsTemplate || []
    }))

    return NextResponse.json(templatesWithDefaults)
  } catch (error) {
    console.error('Error fetching field templates:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const categorieId = searchParams.get('categorieId')
    
    if (!categorieId) {
      return NextResponse.json(
        { error: 'categorieId requis' },
        { status: 400 }
      )
    }

    const body = await req.json()
    const { champsTemplate } = body

    if (!Array.isArray(champsTemplate)) {
      return NextResponse.json(
        { error: 'champsTemplate doit être un tableau' },
        { status: 400 }
      )
    }

    // Utilisation d'une requête SQL brute pour mettre à jour le champ JSON
    await prisma.$executeRaw`
      UPDATE "categorie_produit" 
      SET "champsTemplate" = ${JSON.stringify(champsTemplate)}::jsonb, 
          "updatedAt" = NOW()
      WHERE id = ${categorieId}
    `

    const updatedCategorie = await prisma.categorieProduit.findUnique({
      where: { id: categorieId }
    })

    return NextResponse.json({
      ...updatedCategorie,
      champsTemplate: (updatedCategorie as any).champsTemplate || []
    })
  } catch (error) {
    console.error('Error updating field template:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
