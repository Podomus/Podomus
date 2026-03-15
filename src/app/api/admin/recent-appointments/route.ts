import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Récupérer les 5 prochains rendez-vous à venir
    const recentAppointments = await prisma.appointment.findMany({
      take: 5,
      where: {
        date: {
          gte: new Date() // Rendez-vous à partir d'aujourd'hui
        }
      },
      orderBy: {
        date: 'asc' // Trier par date croissante pour avoir les plus proches d'abord
      },
      include: {
        patient: {
          select: {
            nom: true,
            prenom: true
          }
        }
      }
    })

    // Formater les données pour le frontend
    const formattedAppointments = recentAppointments.map(appointment => ({
      id: appointment.id,
      patientName: appointment.patient ? 
        `${appointment.patient.nom} ${appointment.patient.prenom}` : 
        appointment.patientName, // Utiliser le nom stocké directement dans l'appointment
      date: appointment.date,
      status: appointment.status.toLowerCase()
    }))

    return NextResponse.json(formattedAppointments)
  } catch (error) {
    console.error('Erreur lors de la récupération des rendez-vous récents:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des rendez-vous récents' },
      { status: 500 }
    )
  }
}
