-- Ajouter le champ champsTemplate au modèle TypeProduit
ALTER TABLE "type_produit" ADD COLUMN "champsTemplate" JSONB;

-- Copier les templates existants des catégories vers les types de produits
UPDATE "type_produit" 
SET "champsTemplate" = "categorie_produit"."champsTemplate"
FROM "categorie_produit" 
WHERE "type_produit"."categorieId" = "categorie_produit"."id" 
  AND "categorie_produit"."champsTemplate" IS NOT NULL;
