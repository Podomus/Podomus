import { NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Récupération de l'ID de façon sûre dans Next.js 15+
    const { id } = await params
      
    const appointment = await prisma.appointment.findUnique({
      where: {
        id,
      },
    })
    
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(appointment)
  } catch (error) {
    console.error('Error fetching appointment:', error)
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
    // Récupération de l'ID de façon sûre dans Next.js 15+
    const { id } = await params
    const body = await req.json()
    
    const appointment = await prisma.appointment.findUnique({
      where: {
        id,
      },
    })
    
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }
    
    // Parsing de la date si présente
    let updatedDate = appointment.date
    let hours, minutes;
    
    if (body.date && body.time) {
      updatedDate = new Date(body.date)
      const timeParts = body.time.split(':').map(Number)
      hours = timeParts[0]
      minutes = timeParts[1]
      updatedDate.setHours(hours, minutes, 0)
    } else {
      hours = updatedDate.getHours()
      minutes = updatedDate.getMinutes()
    }
    
    // Calcul de la fin du rendez-vous
    const duration = body.duration || appointment.duration
    const appointmentEndDate = new Date(updatedDate)
    appointmentEndDate.setMinutes(appointmentEndDate.getMinutes() + duration)
    
    // Si date/heure modifiée, vérifier s'il y a chevauchement avec d'autres RDV
    if (body.date || body.time || body.duration) {
      // Créer des objets Date pour le début et la fin de la journée
      const startOfDayDate = new Date(updatedDate)
      startOfDayDate.setHours(0, 0, 0, 0)
      
      const endOfDayDate = new Date(updatedDate)
      endOfDayDate.setHours(23, 59, 59, 999)
      
      const conflictingAppointments = await prisma.appointment.findMany({
        where: {
          id: {
            not: id // Exclure le rendez-vous actuel
          },
          date: {
            // Chercher les RDV dont la date est le même jour
            gte: startOfDayDate,
            lt: endOfDayDate,
          },
          // Ne pas inclure les RDV annulés
          status: {
            not: "cancelled"
          }
        }
      })
      
      // Vérifier les chevauchements
      for (const existingAppointment of conflictingAppointments) {
        const existingStart = new Date(existingAppointment.date)
        const existingEnd = new Date(existingStart)
        existingEnd.setMinutes(existingEnd.getMinutes() + existingAppointment.duration)
        
        // Vérifier s'il y a chevauchement
        const hasOverlap = (
          (updatedDate < existingEnd && appointmentEndDate > existingStart) ||
          (updatedDate.getTime() === existingStart.getTime())
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
    }
    
    const updatedAppointment = await prisma.appointment.update({
      where: {
        id,
      },
      data: {
        patientName: body.patientName || appointment.patientName,
        patientEmail: body.patientEmail || appointment.patientEmail,
        patientPhone: body.patientPhone !== undefined ? body.patientPhone : appointment.patientPhone,
        date: updatedDate,
        time: body.time || appointment.time,
        duration: body.duration || appointment.duration,
        status: body.status || appointment.status,
      },
    })
    
    return NextResponse.json(updatedAppointment)
  } catch (error) {
    console.error('Error updating appointment:', error)
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
    // Récupération de l'ID de façon sûre dans Next.js 15+
    const { id } = await params
    const body = await req.json()
    
    const appointment = await prisma.appointment.findUnique({
      where: {
        id,
      },
    })
    
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }
    
    // Pour une requête PATCH, on ne vérifie les conflits que si on change la date/heure
    if ((body.date || body.time || body.duration) && body.status !== 'cancelled') {
      // Si on change juste le statut, pas besoin de vérifier les conflits
      
      // Parsing de la date si présente
      let updatedDate = appointment.date
      let hours, minutes;
      
      if (body.date && body.time) {
        updatedDate = new Date(body.date)
        const timeParts = body.time.split(':').map(Number)
        hours = timeParts[0]
        minutes = timeParts[1]
        updatedDate.setHours(hours, minutes, 0)
      } else if (body.time) {
        updatedDate = new Date(appointment.date)
        const timeParts = body.time.split(':').map(Number)
        hours = timeParts[0]
        minutes = timeParts[1]
        updatedDate.setHours(hours, minutes, 0)
      } else if (body.date) {
        updatedDate = new Date(body.date)
        hours = appointment.date.getHours()
        minutes = appointment.date.getMinutes()
        updatedDate.setHours(hours, minutes, 0)
      } else {
        hours = appointment.date.getHours()
        minutes = appointment.date.getMinutes()
      }
      
      // Calcul de la fin du rendez-vous
      const duration = body.duration || appointment.duration
      const appointmentEndDate = new Date(updatedDate)
      appointmentEndDate.setMinutes(appointmentEndDate.getMinutes() + duration)
      
      // Créer des objets Date pour le début et la fin de la journée
      const startOfDayDate = new Date(updatedDate)
      startOfDayDate.setHours(0, 0, 0, 0)
      
      const endOfDayDate = new Date(updatedDate)
      endOfDayDate.setHours(23, 59, 59, 999)
      
      const conflictingAppointments = await prisma.appointment.findMany({
        where: {
          id: {
            not: id // Exclure le rendez-vous actuel
          },
          date: {
            // Chercher les RDV dont la date est le même jour
            gte: startOfDayDate,
            lt: endOfDayDate,
          },
          // Ne pas inclure les RDV annulés ou terminés
          status: {
            notIn: ["cancelled", "no_show"]
          }
        }
      })
      
      // Vérifier les chevauchements
      for (const existingAppointment of conflictingAppointments) {
        const existingStart = new Date(existingAppointment.date)
        const existingEnd = new Date(existingStart)
        existingEnd.setMinutes(existingEnd.getMinutes() + existingAppointment.duration)
        
        // Vérifier s'il y a chevauchement
        const hasOverlap = (
          (updatedDate < existingEnd && appointmentEndDate > existingStart) ||
          (updatedDate.getTime() === existingStart.getTime())
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
    }
    
    // Construire l'objet de données à mettre à jour
    const updateData: any = {}
    
    // Ne mettre à jour que les champs fournis dans la requête
    if (body.patientName !== undefined) updateData.patientName = body.patientName
    if (body.patientEmail !== undefined) updateData.patientEmail = body.patientEmail
    if (body.patientPhone !== undefined) updateData.patientPhone = body.patientPhone
    if (body.date !== undefined || body.time !== undefined) {
      let updatedDate = new Date(body.date || appointment.date)
      if (body.time) {
        const [hours, minutes] = body.time.split(':').map(Number)
        updatedDate.setHours(hours, minutes, 0)
      } else if (!body.date) { // Si on n'a pas de nouvelle date mais on a une nouvelle heure
        updatedDate = new Date(appointment.date)
        const [hours, minutes] = body.time.split(':').map(Number)
        updatedDate.setHours(hours, minutes, 0)
      }
      updateData.date = updatedDate
    }
    if (body.time !== undefined) updateData.time = body.time
    if (body.duration !== undefined) updateData.duration = body.duration
    if (body.status !== undefined) updateData.status = body.status
    
    const updatedAppointment = await prisma.appointment.update({
      where: {
        id,
      },
      data: updateData,
    })
    
    return NextResponse.json(updatedAppointment)
  } catch (error) {
    console.error('Error updating appointment:', error)
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
    // Récupération de l'ID de façon sûre dans Next.js 16+
    const { id } = await params
    
    const appointment = await prisma.appointment.findUnique({
      where: {
        id,
      },
    })
    
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }
    
    await prisma.appointment.delete({
      where: {
        id,
      },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting appointment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
