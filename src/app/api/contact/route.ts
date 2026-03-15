import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validation des champs requis
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Les champs nom, email, sujet et message sont requis' },
        { status: 400 }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }

    // Sauvegarde du message dans la base de données
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        message,
      },
    });

    // Envoi d'un email à l'admin
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Podomus Contact" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `Nouveau message de contact: ${subject}`,
      html: `<p><b>Nom:</b> ${name}</p>
             <p><b>Email:</b> ${email}</p>
             <p><b>Sujet:</b> ${subject}</p>
             <p><b>Message:</b><br/>${message}</p>`
    });

    // Ici vous pourriez ajouter l'envoi d'un email de notification
    // Par exemple avec Nodemailer ou un service comme SendGrid

    return NextResponse.json(
      { 
        success: true, 
        message: 'Message envoyé avec succès',
        id: contactMessage.id 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Erreur lors de la sauvegarde du message:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Récupération de tous les messages (pour l'administration)
    const messages = await prisma.contactMessage.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
} 