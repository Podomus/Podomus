import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Récupérer les produits en attente de livraison
    const pendingDeliveries = await prisma.produit.findMany({
      where: {
        status: {
          in: ['commande', 'en_fabrication']
        }
      },
      include: {
        patient: {
          select: {
            nom: true,
            prenom: true
          }
        }
      },
      orderBy: {
        dateLivraison: 'asc'
      },
      take: 10 // Limiter à 10 résultats
    })

    // Formater les données pour le frontend
    const formattedDeliveries = pendingDeliveries.map(produit => ({
      id: produit.id,
      patientName: produit.patient ? 
        `${produit.patient.nom} ${produit.patient.prenom}` : 
        'Patient inconnu',
      type: produit.type || 'Type inconnu',
      dateLivraison: produit.dateLivraison
    }))

    return NextResponse.json(formattedDeliveries)
  } catch (error) {
    console.error('Erreur lors de la récupération des livraisons en attente:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des livraisons en attente' },
      { status: 500 }
    )
  }
}
