import { NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const patientId = searchParams.get('patientId')

    const appointments = await prisma.appointment.findMany({
      where: patientId ? { patientId } : undefined,
      orderBy: {
        date: 'asc',
      },
    })
    
    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    
    // Validation des champs obligatoires
    if (!body.patientName || !body.patientEmail || !body.date || !body.time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Parsing de la date
    const appointmentDate = new Date(body.date)
    const [hours, minutes] = body.time.split(':').map(Number)
    appointmentDate.setHours(hours, minutes, 0)
    
    // Calcul de la fin du rendez-vous
    const duration = body.duration || 30
    const appointmentEndDate = new Date(appointmentDate)
    appointmentEndDate.setMinutes(appointmentEndDate.getMinutes() + duration)
    
    // Vérification si le créneau est disponible (pas de chevauchement)
    const conflictingAppointments = await prisma.appointment.findMany({
      where: {
        date: {
          // Chercher les RDV dont la date est le même jour
          gte: new Date(appointmentDate.setHours(0, 0, 0, 0)),
          lt: new Date(appointmentDate.setHours(23, 59, 59, 999)),
        },
        // Ne pas inclure les RDV annulés ou les absences
        status: {
          notIn: ["cancelled", "no_show"]
        }
      }
    })
    
    // Restaurer l'heure du rendez-vous
    appointmentDate.setHours(hours, minutes, 0)
    
    // Vérifier les chevauchements
    for (const existingAppointment of conflictingAppointments) {
      const existingStart = new Date(existingAppointment.date)
      const existingEnd = new Date(existingStart)
      existingEnd.setMinutes(existingEnd.getMinutes() + existingAppointment.duration)
      
      // Vérifier s'il y a chevauchement
      const hasOverlap = (
        (appointmentDate < existingEnd && appointmentEndDate > existingStart) ||
        (appointmentDate.getTime() === existingStart.getTime())
      )
      
      if (hasOverlap) {
        return NextResponse.json(
          { 
            error: 'Créneau déjà réservé', 
            message: `Un rendez-vous existe déjà à ${existingAppointment.time} pour une durée de ${existingAppointment.duration} minutes` 
          },
          { status: 409 } // Conflict
        )
      }
    }
    
    const appointment = await prisma.appointment.create({
      data: {
        patientId: body.patientId || null,
        patientName: body.patientName,
        patientEmail: body.patientEmail,
        patientPhone: body.patientPhone || null,
        date: appointmentDate,
        time: body.time,
        duration: body.duration || 30,
        status: body.status || "scheduled",
      },
    })
    
    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
