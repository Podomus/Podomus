const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function migrateTemplates() {
  try {
    console.log('🚀 Début de la migration des templates...')

    // Récupérer tous les types de produits avec leur catégorie
    const typesProduits = await prisma.typeProduit.findMany({
      include: {
        categorie: true
      }
    })

    console.log(`📦 ${typesProduits.length} types de produits trouvés`)

    let migrated = 0

    for (const type of typesProduits) {
      // Vérifier si le type a déjà un template personnalisé
      if (type.champsTemplate) {
        console.log(`⏩ ${type.nom} - Template déjà existant, passage au suivant`)
        continue
      }

      // Vérifier si la catégorie a un template
      if (!type.categorie.champsTemplate || Object.keys(type.categorie.champsTemplate).length === 0) {
        console.log(`⏩ ${type.nom} - Aucun template dans la catégorie ${type.categorie.nom}`)
        continue
      }

      // Copier le template de la catégorie vers le type
      await prisma.$executeRaw`
        UPDATE "type_produit" 
        SET "champsTemplate" = ${JSON.stringify(type.categorie.champsTemplate)}::jsonb, 
            "updatedAt" = NOW()
        WHERE id = ${type.id}
      `

      migrated++
      console.log(`✅ ${type.nom} - Template copié depuis ${type.categorie.nom}`)
    }

    console.log(`🎉 Migration terminée ! ${migrated} templates migrés`)
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter la migration
migrateTemplates()
