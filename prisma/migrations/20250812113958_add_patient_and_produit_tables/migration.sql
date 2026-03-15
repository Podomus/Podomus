-- AlterTable
ALTER TABLE "public"."appointment" ADD COLUMN     "patientId" TEXT;

-- CreateTable
CREATE TABLE "public"."patient" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "dateNaissance" TIMESTAMP(3),
    "email" TEXT,
    "telephone" TEXT,
    "adresse" TEXT,
    "codePostal" TEXT,
    "ville" TEXT,
    "numSecu" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."produit" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "dateCommande" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateLivraison" TIMESTAMP(3),
    "prix" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'commande',
    "patientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "produit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."produit" ADD CONSTRAINT "produit_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."appointment" ADD CONSTRAINT "appointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;
