import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Récupérer tous les types de produits
export async function GET() {
  try {
    const typesProduits = await prisma.typeProduit.findMany({
      include: {
        categorie: true
      },
      orderBy: [
        { categorie: { ordre: 'asc' } },
        { nom: 'asc' }
      ]
    })

    // Ajouter les informations sur les templates
    const typesAvecTemplateInfo = typesProduits.map(type => {
      const typeAsAny = type as any
      const categorieAsAny = type.categorie as any
      const typeChampsTemplate = typeAsAny.champsTemplate as any[] | null
      const categorieChampsTemplate = categorieAsAny.champsTemplate as any[] | null
      
      return {
        ...type,
        hasOwnTemplate: typeChampsTemplate !== null && Array.isArray(typeChampsTemplate) && typeChampsTemplate.length > 0,
        champsTemplate: typeChampsTemplate || categorieChampsTemplate || []
      }
    })

    return NextResponse.json(typesAvecTemplateInfo)
  } catch (error) {
    console.error('Erreur lors de la récupération des types de produits:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des types de produits' },
      { status: 500 }
    )
  }
}

// POST - Créer un nouveau type de produit
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nom, description, prix, delaiLivraison, categorieId } = body

    // Vérifier que la catégorie existe
    const categorie = await prisma.categorieProduit.findUnique({
      where: { id: categorieId }
    })

    if (!categorie) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 400 }
      )
    }

    const typeProduit = await prisma.typeProduit.create({
      data: {
        nom,
        description,
        prix: parseFloat(prix),
        delaiLivraison: parseInt(delaiLivraison) || 7,
        categorieId
      },
      include: {
        categorie: true
      }
    })

    return NextResponse.json(typeProduit, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du type de produit:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du type de produit' },
      { status: 500 }
    )
  }
}
