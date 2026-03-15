import { NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const typeId = searchParams.get('typeId')

    if (typeId) {
      // Récupérer le template d'un type de produit spécifique
      const typeProduit = await prisma.typeProduit.findUnique({
        where: { id: typeId },
        include: {
          categorie: true
        }
      })

      if (!typeProduit) {
        return NextResponse.json(
          { error: 'Type de produit non trouvé' },
          { status: 404 }
        )
      }

      // Retourner le template du type, sinon celui de la catégorie comme fallback
      return NextResponse.json({
        id: typeProduit.id,
        nom: typeProduit.nom,
        champsTemplate: (typeProduit as any).champsTemplate || (typeProduit.categorie as any).champsTemplate || [],
        hasOwnTemplate: !!(typeProduit as any).champsTemplate
      })
    }

    // Récupérer tous les templates de types de produits
    const typesProduits = await prisma.typeProduit.findMany({
      include: {
        categorie: true
      },
      orderBy: {
        nom: 'asc'
      }
    })

    const templatesWithDefaults = typesProduits.map(type => ({
      id: type.id,
      nom: type.nom,
      champsTemplate: (type as any).champsTemplate || (type.categorie as any).champsTemplate || [],
      hasOwnTemplate: !!(type as any).champsTemplate
    }))

    return NextResponse.json(templatesWithDefaults)
  } catch (error) {
    console.error('Error fetching type templates:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const typeId = searchParams.get('typeId')
    
    if (!typeId) {
      return NextResponse.json(
        { error: 'typeId requis' },
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
      UPDATE "type_produit" 
      SET "champsTemplate" = ${JSON.stringify(champsTemplate)}::jsonb, 
          "updatedAt" = NOW()
      WHERE id = ${typeId}
    `

    const updatedType = await prisma.typeProduit.findUnique({
      where: { id: typeId },
      include: {
        categorie: true
      }
    })

    return NextResponse.json({
      ...updatedType,
      champsTemplate: (updatedType as any).champsTemplate || [],
      hasOwnTemplate: !!(updatedType as any).champsTemplate
    })
  } catch (error) {
    console.error('Error updating type template:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const typeId = searchParams.get('typeId')
    
    if (!typeId) {
      return NextResponse.json(
        { error: 'typeId requis' },
        { status: 400 }
      )
    }

    // Supprimer le template personnalisé (remettre à null pour utiliser celui de la catégorie)
    await prisma.$executeRaw`
      UPDATE "type_produit" 
      SET "champsTemplate" = NULL, 
          "updatedAt" = NOW()
      WHERE id = ${typeId}
    `

    const updatedType = await prisma.typeProduit.findUnique({
      where: { id: typeId },
      include: {
        categorie: true
      }
    })

    return NextResponse.json({
      ...updatedType,
      champsTemplate: (updatedType?.categorie as any)?.champsTemplate || [],
      hasOwnTemplate: false
    })
  } catch (error) {
    console.error('Error resetting type template:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
