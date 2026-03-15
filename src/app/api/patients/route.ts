import { NextResponse } from "next/server"
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json(patients)
  } catch (error) {
    console.error('Error fetching patients:', error)
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
    if (!body.nom || !body.prenom) {
      return NextResponse.json(
        { error: 'Nom et prénom sont requis' },
        { status: 400 }
      )
    }
    
    const patient = await prisma.patient.create({
      data: {
        nom: body.nom,
        prenom: body.prenom,
        dateNaissance: body.dateNaissance,
        email: body.email,
        telephone: body.telephone,
        adresse: body.adresse,
        codePostal: body.codePostal,
        ville: body.ville,
        numSecu: body.numSecu,
        notes: body.notes
      }
    })
    
    return NextResponse.json(patient, { status: 201 })
  } catch (error) {
    console.error('Error creating patient:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
