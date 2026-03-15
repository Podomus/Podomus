/*
  Warnings:

  - You are about to drop the column `nom` on the `produit` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."produit" DROP CONSTRAINT "produit_patientId_fkey";

-- AlterTable
ALTER TABLE "public"."produit" DROP COLUMN "nom",
ALTER COLUMN "patientId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."produit" ADD CONSTRAINT "produit_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "public"."patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;
