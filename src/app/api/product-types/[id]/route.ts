import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const typeProduit = await prisma.typeProduit.findUnique({
      where: { id },
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
    
    return NextResponse.json(typeProduit)
  } catch (error) {
    console.error('Error fetching type produit:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du type de produit' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    console.log('PUT request body:', body)
    console.log('PUT request id:', id)
    
    const { nom, categorieId, description, prix, delaiLivraison } = body
    
    if (!nom || !categorieId || !prix || !delaiLivraison) {
      console.log('Missing fields:', { nom, categorieId, prix, delaiLivraison })
      return NextResponse.json(
        { error: 'Nom, catégorie, prix et délai de livraison sont requis' },
        { status: 400 }
      )
    }

    // Vérifier que le type de produit existe
    const existingTypeProduit = await prisma.typeProduit.findUnique({
      where: { id }
    })
    
    if (!existingTypeProduit) {
      return NextResponse.json(
        { error: 'Type de produit non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier que la catégorie existe
    const categorieExists = await prisma.categorieProduit.findUnique({
      where: { id: categorieId }
    })

    if (!categorieExists) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 400 }
      )
    }

    const updatedTypeProduit = await prisma.typeProduit.update({
      where: { id },
      data: {
        nom,
        categorieId,
        description: description || '',
        prix: parseFloat(prix),
        delaiLivraison: parseInt(delaiLivraison),
      },
      include: {
        categorie: true
      }
    })
    
    return NextResponse.json(updatedTypeProduit)
  } catch (error) {
    console.error('Error updating type produit:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la modification du type de produit' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Vérifier que le type de produit existe
    const existingTypeProduit = await prisma.typeProduit.findUnique({
      where: { id }
    })
    
    if (!existingTypeProduit) {
      return NextResponse.json(
        { error: 'Type de produit non trouvé' },
        { status: 404 }
      )
    }

    await prisma.typeProduit.delete({
      where: { id }
    })
    
    return NextResponse.json({ message: 'Type de produit supprimé avec succès' })
  } catch (error) {
    console.error('Error deleting type produit:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du type de produit' },
      { status: 500 }
    )
  }
}
