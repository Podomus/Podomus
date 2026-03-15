/*
  Warnings:

  - Added the required column `nom` to the `produit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."produit" ADD COLUMN     "delaiLivraison" INTEGER,
ADD COLUMN     "nom" TEXT NOT NULL,
ADD COLUMN     "tempsFabrication" INTEGER;
