import { NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const patient = await prisma.patient.findUnique({
      where: {
        id,
      },
      include: {
        appointments: true,
        produits: true
      }
    })
    
    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(patient)
  } catch (error) {
    console.error('Error fetching patient:', error)
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
    
    const patient = await prisma.patient.findUnique({
      where: {
        id,
      },
    })
    
    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      )
    }
    
    // Construire l'objet de données à mettre à jour
    const updateData: any = {}
    
    // Ne mettre à jour que les champs fournis dans la requête
    if (body.nom !== undefined) updateData.nom = body.nom
    if (body.prenom !== undefined) updateData.prenom = body.prenom
    if (body.dateNaissance !== undefined) updateData.dateNaissance = body.dateNaissance
    if (body.email !== undefined) updateData.email = body.email
    if (body.telephone !== undefined) updateData.telephone = body.telephone
    if (body.adresse !== undefined) updateData.adresse = body.adresse
    if (body.codePostal !== undefined) updateData.codePostal = body.codePostal
    if (body.ville !== undefined) updateData.ville = body.ville
    if (body.numSecu !== undefined) updateData.numSecu = body.numSecu
    if (body.notes !== undefined) updateData.notes = body.notes
    
    const updatedPatient = await prisma.patient.update({
      where: {
        id,
      },
      data: updateData,
    })
    
    return NextResponse.json(updatedPatient)
  } catch (error) {
    console.error('Error updating patient:', error)
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
    
    // Vérifier si le patient existe
    const patient = await prisma.patient.findUnique({
      where: {
        id,
      },
      include: {
        appointments: true,
        produits: true
      }
    })
    
    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      )
    }
    
    // Vérifier s'il a des rendez-vous ou des produits
    if (patient.appointments.length > 0 || patient.produits.length > 0) {
      return NextResponse.json(
        { error: 'Ce patient a des rendez-vous ou des produits associés. Supprimez-les d\'abord.' },
        { status: 400 }
      )
    }
    
    // Supprimer le patient
    await prisma.patient.delete({
      where: {
        id,
      },
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting patient:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
