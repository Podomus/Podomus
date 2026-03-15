-- AlterTable
ALTER TABLE "public"."categorie_produit" ADD COLUMN     "champsTemplate" JSONB;

-- AlterTable
ALTER TABLE "public"."produit" ADD COLUMN     "champsCustom" JSONB;
