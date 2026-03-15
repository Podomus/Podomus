const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testCategoriesAndTypes() {
  try {
    console.log("🔍 Vérification des catégories de produits...")
    
    const categories = await prisma.categorieProduit.findMany({
      include: {
        typesProduits: true,
        _count: {
          select: {
            typesProduits: true
          }
        }
      },
      orderBy: [
        { ordre: 'asc' },
        { nom: 'asc' }
      ]
    })

    console.log(`\n📊 Nombre de catégories trouvées: ${categories.length}`)
    
    categories.forEach((categorie, index) => {
      console.log(`\n${index + 1}. 📁 ${categorie.nom}`)
      console.log(`   ID: ${categorie.id}`)
      console.log(`   Description: ${categorie.description || 'Aucune'}`)
      console.log(`   Couleur: ${categorie.couleur || 'Aucune'}`)
      console.log(`   Icône: ${categorie.icone || 'Aucune'}`)
      console.log(`   Ordre: ${categorie.ordre}`)
      console.log(`   Actif: ${categorie.actif ? 'Oui' : 'Non'}`)
      console.log(`   Nombre de types: ${categorie._count.typesProduits}`)
      
      if (categorie.typesProduits.length > 0) {
        console.log(`   Types de produits:`)
        categorie.typesProduits.forEach((type, typeIndex) => {
          console.log(`     ${typeIndex + 1}. ${type.nom} - ${type.prix}€ (${type.delaiLivraison} jours)`)
        })
      }
    })

    console.log("\n🔍 Vérification des types de produits...")
    
    const typesProduits = await prisma.typeProduit.findMany({
      include: {
        categorie: true
      },
      orderBy: [
        { categorie: { ordre: 'asc' } },
        { nom: 'asc' }
      ]
    })

    console.log(`\n📊 Nombre total de types de produits: ${typesProduits.length}`)
    
    if (typesProduits.length === 0) {
      console.log("\n⚠️  Aucun type de produit trouvé. Créons des exemples...")
      
      // Créer quelques catégories et types d'exemple
      const semelles = await prisma.categorieProduit.create({
        data: {
          nom: "Semelles Orthopédiques",
          description: "Semelles sur mesure pour pieds",
          couleur: "#3b82f6",
          icone: "👟",
          ordre: 1,
          actif: true
        }
      })

      const chaussures = await prisma.categorieProduit.create({
        data: {
          nom: "Chaussures Thérapeutiques",
          description: "Chaussures spécialisées",
          couleur: "#10b981",
          icone: "👞",
          ordre: 2,
          actif: true
        }
      })

      const ortheses = await prisma.categorieProduit.create({
        data: {
          nom: "Orthèses",
          description: "Dispositifs d'aide à la marche",
          couleur: "#f59e0b",
          icone: "🦽",
          ordre: 3,
          actif: true
        }
      })

      // Créer des types pour semelles
      await prisma.typeProduit.createMany({
        data: [
          {
            nom: "Semelles Thermoformées",
            description: "Semelles moulées à la chaleur",
            prix: 150.00,
            delaiLivraison: 7,
            categorieId: semelles.id
          },
          {
            nom: "Semelles Proprioceptives",
            description: "Semelles avec stimulations sensorielles",
            prix: 180.00,
            delaiLivraison: 10,
            categorieId: semelles.id
          },
          {
            nom: "Semelles Sport",
            description: "Semelles pour activités sportives",
            prix: 200.00,
            delaiLivraison: 5,
            categorieId: semelles.id
          }
        ]
      })

      // Créer des types pour chaussures
      await prisma.typeProduit.createMany({
        data: [
          {
            nom: "Chaussures Diabétiques",
            description: "Chaussures pour patients diabétiques",
            prix: 280.00,
            delaiLivraison: 14,
            categorieId: chaussures.id
          },
          {
            nom: "Chaussures Post-Opératoires",
            description: "Chaussures de récupération",
            prix: 120.00,
            delaiLivraison: 3,
            categorieId: chaussures.id
          },
          {
            nom: "Chaussures Orthopédiques",
            description: "Chaussures sur mesure",
            prix: 450.00,
            delaiLivraison: 21,
            categorieId: chaussures.id
          }
        ]
      })

      // Créer des types pour orthèses
      await prisma.typeProduit.createMany({
        data: [
          {
            nom: "Orthèses Plantaires",
            description: "Support plantaire rigide",
            prix: 90.00,
            delaiLivraison: 5,
            categorieId: ortheses.id
          },
          {
            nom: "Orthèses de Cheville",
            description: "Support de cheville articulé",
            prix: 160.00,
            delaiLivraison: 7,
            categorieId: ortheses.id
          }
        ]
      })

      console.log("✅ Catégories et types d'exemple créés avec succès!")
    }

  } catch (error) {
    console.error('❌ Erreur lors de la vérification:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testCategoriesAndTypes()
