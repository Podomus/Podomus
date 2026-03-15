import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({ adapter })

async function seedCategories() {
  try {
    // Créer les catégories par défaut
    const categories = [
      {
        nom: 'Semelles',
        description: 'Semelles orthopédiques et de confort',
        couleur: '#3B82F6', // Bleu
        icone: 'Package',
        ordre: 1
      },
      {
        nom: 'Orthèses',
        description: 'Orthèses plantaires et corrections spécialisées',
        couleur: '#10B981', // Vert
        icone: 'Shield',
        ordre: 2
      },
      {
        nom: 'Chaussures thérapeutiques',
        description: 'Chaussures spécialisées pour le traitement',
        couleur: '#F59E0B', // Orange
        icone: 'Heart',
        ordre: 3
      },
      {
        nom: 'Supports plantaires',
        description: 'Supports et coussinets pour les pieds',
        couleur: '#EF4444', // Rouge
        icone: 'Activity',
        ordre: 4
      },
      {
        nom: 'Prothèses',
        description: 'Prothèses et dispositifs de remplacement',
        couleur: '#8B5CF6', // Violet
        icone: 'Settings',
        ordre: 5
      },
      {
        nom: 'Attelles',
        description: 'Attelles et dispositifs de maintien',
        couleur: '#06B6D4', // Cyan
        icone: 'Tool',
        ordre: 6
      }
    ]

    console.log('Création des catégories...')
    
    for (const categorieData of categories) {
      const categorie = await prisma.categorieProduit.upsert({
        where: { nom: categorieData.nom },
        update: categorieData,
        create: categorieData
      })
      console.log(`Catégorie créée/mise à jour: ${categorie.nom}`)
    }

    // Récupérer les catégories créées
    const semellesCategorie = await prisma.categorieProduit.findUnique({ where: { nom: 'Semelles' } })
    const orthesesCategorie = await prisma.categorieProduit.findUnique({ where: { nom: 'Orthèses' } })
    const chaussuresCategorie = await prisma.categorieProduit.findUnique({ where: { nom: 'Chaussures thérapeutiques' } })

    if (semellesCategorie && orthesesCategorie && chaussuresCategorie) {
      // Créer des types de produits d'exemple
      const typesProduits = [
        {
          nom: 'Semelle orthopédique standard',
          description: 'Semelle classique pour correction posturale basique',
          prix: 150.00,
          delaiLivraison: 10,
          categorieId: semellesCategorie.id
        },
        {
          nom: 'Semelle orthopédique sport',
          description: 'Semelle adaptée pour les activités sportives et la course',
          prix: 180.00,
          delaiLivraison: 14,
          categorieId: semellesCategorie.id
        },
        {
          nom: 'Semelle orthopédique sur mesure',
          description: 'Semelle entièrement personnalisée avec moulage 3D',
          prix: 250.00,
          delaiLivraison: 21,
          categorieId: semellesCategorie.id
        },
        {
          nom: 'Semelle de confort',
          description: 'Semelle pour le confort quotidien sans correction orthopédique',
          prix: 80.00,
          delaiLivraison: 7,
          categorieId: semellesCategorie.id
        },
        {
          nom: 'Orthèse plantaire',
          description: 'Orthèse pour correction de pathologies spécifiques',
          prix: 200.00,
          delaiLivraison: 14,
          categorieId: orthesesCategorie.id
        },
        {
          nom: 'Chaussures post-opératoires',
          description: 'Chaussures de décharge pour période post-opératoire',
          prix: 120.00,
          delaiLivraison: 5,
          categorieId: chaussuresCategorie.id
        }
      ]

      console.log('Création des types de produits...')
      
      for (const typeProduitData of typesProduits) {
        const typeProduit = await prisma.typeProduit.create({
          data: typeProduitData
        })
        console.log(`Type de produit créé: ${typeProduit.nom}`)
      }
    }

    console.log('Seed terminé avec succès!')
  } catch (error) {
    console.error('Erreur lors du seed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedCategories()
