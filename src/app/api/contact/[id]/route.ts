import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    // Validation du statut
    const validStatuses = ['new', 'read', 'replied', 'archived'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Statut invalide' },
        { status: 400 }
      );
    }

    // Mise à jour du message
    const updatedMessage = await prisma.contactMessage.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(updatedMessage);
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Message non trouvé' },
        { status: 404 }
      );
    }
    
    console.error('Erreur lors de la mise à jour du message:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Suppression du message
    await prisma.contactMessage.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: 'Message supprimé avec succès' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        { error: 'Message non trouvé' },
        { status: 404 }
      );
    }
    
    console.error('Erreur lors de la suppression du message:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Récupération d'un message spécifique
    const message = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!message) {
      return NextResponse.json(
        { error: 'Message non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error('Erreur lors de la récupération du message:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 