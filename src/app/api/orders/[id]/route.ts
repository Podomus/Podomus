import { NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const produit = await prisma.produit.findUnique({
      where: {
        id,
      },
      include: {
        patient: {
          include: {
            appointments: {
              orderBy: {
                date: 'desc'
              }
            }
          }
        }
      }
    })
    
    if (!produit) {
      return NextResponse.json(
        { error: 'Produit not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(produit)
  } catch (error) {
    console.error('Error fetching produit:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    
    const produit = await prisma.produit.findUnique({
      where: {
        id,
      },
    })
    
    if (!produit) {
      return NextResponse.json(
        { error: 'Produit not found' },
        { status: 404 }
      )
    }
    
    // Vérifier si le patient existe en cas de changement
    if (body.patientId && body.patientId !== produit.patientId) {
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
    }
    
    // Construire l'objet de données à mettre à jour
    const updateData: any = {}
    
    // Ne mettre à jour que les champs fournis dans la requête
    if (body.type !== undefined) updateData.type = body.type
    if (body.description !== undefined) updateData.description = body.description
    if (body.dateCommande !== undefined) updateData.dateCommande = body.dateCommande
    if (body.dateLivraison !== undefined) updateData.dateLivraison = body.dateLivraison
    if (body.prix !== undefined) updateData.prix = body.prix
    if (body.status !== undefined) updateData.status = body.status
    if (body.patientId !== undefined) updateData.patientId = body.patientId
    
    // Gérer les champs dynamiques
    if (body.champsCustom !== undefined) {
      const champsCustom = body.champsCustom || {}
      // Nettoyer les champs vides
      const cleanedChampsCustom = Object.keys(champsCustom).reduce((acc: any, key: string) => {
        const value = champsCustom[key]
        if (value !== null && value !== undefined && value !== '') {
          acc[key] = value
        }
        return acc
      }, {})
      
      updateData.champsCustom = Object.keys(cleanedChampsCustom).length > 0 ? cleanedChampsCustom : null
    }
    
    const updatedProduit = await prisma.produit.update({
      where: {
        id,
      },
      data: updateData,
    })
    
    return NextResponse.json(updatedProduit)
  } catch (error) {
    console.error('Error updating produit:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    
    const produit = await prisma.produit.findUnique({
      where: {
        id,
      },
    })
    
    if (!produit) {
      return NextResponse.json(
        { error: 'Ordre not found' },
        { status: 404 }
      )
    }
    
    // Vérifier si le patient existe en cas de changement
    if (body.patientId && body.patientId !== produit.patientId) {
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
    
    const updatedProduit = await prisma.produit.update({
      where: {
        id,
      },
      data: {
        type: body.type,
        description: body.description || null,
        dateCommande: body.dateCommande ? new Date(body.dateCommande) : produit.dateCommande,
        dateLivraison: body.dateLivraison ? new Date(body.dateLivraison) : produit.dateLivraison,
        prix: parseFloat(body.prix) || produit.prix,
        status: body.status || produit.status,
        patientId: body.patientId || produit.patientId,
        champsCustom: Object.keys(cleanedChampsCustom).length > 0 ? cleanedChampsCustom : null
      },
    })
    
    return NextResponse.json(updatedProduit)
  } catch (error) {
    console.error('Error updating ordre:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Vérifier si le produit existe
    const produit = await prisma.produit.findUnique({
      where: {
        id,
      },
    })
    
    if (!produit) {
      return NextResponse.json(
        { error: 'Produit not found' },
        { status: 404 }
      )
    }
    
    // Supprimer le produit
    await prisma.produit.delete({
      where: {
        id,
      },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting produit:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
