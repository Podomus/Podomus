/*
  Warnings:

  - You are about to drop the column `notes` on the `appointment` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `appointment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."appointment" DROP COLUMN "notes",
DROP COLUMN "reason";
