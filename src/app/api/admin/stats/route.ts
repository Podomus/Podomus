import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Récupérer les statistiques depuis la base de données
    const [
      totalPatients,
      totalAppointments,
      totalProducts,
      upcomingAppointments,
      completedAppointments,
      pendingProducts,
      deliveredProducts
    ] = await Promise.all([
      // Total des patients
      prisma.patient.count(),
      
      // Total des rendez-vous
      prisma.appointment.count(),
      
      // Total des produits
      prisma.produit.count(),
      
      // Rendez-vous à venir (statut 'SCHEDULED' et date future)
      prisma.appointment.count({
        where: {
          status: 'SCHEDULED',
          date: {
            gte: new Date()
          }
        }
      }),
      
      // Rendez-vous terminés
      prisma.appointment.count({
        where: {
          status: 'COMPLETED'
        }
      }),
      
      // Produits en attente (statut 'commande' ou 'en_fabrication')
      prisma.produit.count({
        where: {
          status: {
            in: ['commande', 'en_fabrication']
          }
        }
      }),
      
      // Produits livrés (statut 'livree')
      prisma.produit.count({
        where: {
          status: 'livree'
        }
      })
    ])

    const stats = {
      totalPatients,
      totalAppointments,
      totalProducts,
      upcomingAppointments,
      completedAppointments,
      pendingProducts,
      deliveredProducts
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    )
  }
}
