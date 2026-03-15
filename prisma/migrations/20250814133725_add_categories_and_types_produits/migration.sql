/*
  Warnings:

  - You are about to drop the column `delaiLivraison` on the `produit` table. All the data in the column will be lost.
  - You are about to drop the column `tempsFabrication` on the `produit` table. All the data in the column will be lost.
  - Made the column `patientId` on table `produit` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."produit" DROP CONSTRAINT "produit_patientId_fkey";

-- AlterTable
ALTER TABLE "public"."produit" DROP COLUMN "delaiLivraison",
DROP COLUMN "tempsFabrication",
ALTER COLUMN "patientId" SET NOT NULL;

-- CreateTable
CREATE TABLE "public"."categorie_produit" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "couleur" TEXT,
    "icone" TEXT,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categorie_produit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."type_produit" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "prix" DOUBLE PRECISION NOT NULL,
    "delaiLivraison" INTEGER NOT NULL DEFAULT 7,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "categorieId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "type_produit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categorie_produit_nom_key" ON "public"."categorie_produit"("nom");

-- AddForeignKey
ALTER TABLE "public"."produit" ADD CONSTRAINT "produit_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."type_produit" ADD CONSTRAINT "type_produit_categorieId_fkey" FOREIGN KEY ("categorieId") REFERENCES "public"."categorie_produit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
