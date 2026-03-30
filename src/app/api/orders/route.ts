import { NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const patientId = searchParams.get('patientId')

    const produits = await prisma.produit.findMany({
      where: patientId ? { patientId } : undefined,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        patient: {
          select: {
            id: true,
            nom: true,
            prenom: true
          }
        }
      }
    })
    
    return NextResponse.json(produits)
  } catch (error) {
    console.error('Error fetching produits:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Validation de base
    if (!body.type || !body.patientId || !body.prix) {
      return NextResponse.json(
        { error: 'Type, patientId et prix sont requis' },
        { status: 400 }
      )
    }
    
    // Vérifier si le patient existe
    const patient = await prisma.patient.findUnique({
      where: {
        id: body.patientId
      }
    })
    
    if (!patient) {
      return NextResponse.json(
        { error: 'Patient non trouvé' },
        { status: 404 }
      )
    }

    // Préparer les champs personnalisés
    const champsCustom = body.champsCustom || {}
    
    // Nettoyer les champs vides
    const cleanedChampsCustom = Object.keys(champsCustom).reduce((acc: any, key: string) => {
      const value = champsCustom[key]
      if (value !== null && value !== undefined && value !== '') {
        acc[key] = value
      }
      return acc
    }, {})
    
    const produit = await prisma.produit.create({
      data: {
        type: body.type,
        description: body.description || null,
        dateCommande: body.dateCommande ? new Date(body.dateCommande) : new Date(),
        dateLivraison: body.dateLivraison ? new Date(body.dateLivraison) : null,
        prix: parseFloat(body.prix),
        status: body.status || 'commande',
        patientId: body.patientId,
        champsCustom: Object.keys(cleanedChampsCustom).length > 0 ? cleanedChampsCustom : null
      }
    })
    
    return NextResponse.json(produit, { status: 201 })
  } catch (error) {
    console.error('Error creating produit:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
