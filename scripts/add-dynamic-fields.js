// Script pour tester l'ajout de champs dynamiques à une catégorie

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const addDynamicFieldsToCategory = async () => {
  try {
    // Récupérer la première catégorie pour test
    const categories = await prisma.categorieProduit.findMany({
      orderBy: { ordre: 'asc' },
      take: 1
    });

    if (categories.length === 0) {
      console.log('Aucune catégorie trouvée. Créons une catégorie de test.');
      
      // Créer une catégorie de test
      const newCategory = await prisma.categorieProduit.create({
        data: {
          nom: 'Semelles Orthopédiques',
          description: 'Catégorie pour les semelles sur mesure',
          couleur: '#3B82F6',
          icone: 'ShoeIcon',
          ordre: 1,
          actif: true
        }
      });
      
      console.log('Catégorie créée:', newCategory.nom);
      
      // Ajouter des champs dynamiques à cette catégorie
      const dynamicFields = [
        {
          id: 'taille_pied',
          name: 'taille_pied',
          label: 'Taille du pied',
          type: 'select',
          required: true,
          options: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'],
          section: 'Mesures',
          order: 0
        },
        {
          id: 'couleur_semelle',
          name: 'couleur_semelle',
          label: 'Couleur souhaitée',
          type: 'select',
          required: false,
          options: ['Noir', 'Marron', 'Beige', 'Blanc'],
          section: 'Options',
          order: 1
        },
        {
          id: 'hauteur_arche',
          name: 'hauteur_arche',
          label: 'Hauteur de l\'arche (mm)',
          type: 'number',
          required: false,
          placeholder: 'Ex: 15',
          section: 'Mesures',
          order: 2
        },
        {
          id: 'problemes_specifiques',
          name: 'problemes_specifiques',
          label: 'Problèmes spécifiques',
          type: 'textarea',
          required: false,
          placeholder: 'Décrivez les problèmes particuliers du patient...',
          section: 'Informations médicales',
          order: 3
        },
        {
          id: 'urgence',
          name: 'urgence',
          label: 'Commande urgente',
          type: 'boolean',
          required: false,
          section: 'Options',
          order: 4
        },
        {
          id: 'date_essayage',
          name: 'date_essayage',
          label: 'Date d\'essayage souhaitée',
          type: 'date',
          required: false,
          section: 'Planning',
          order: 5
        }
      ];

      // Utiliser une requête SQL brute pour mettre à jour le champ JSON
      await prisma.$executeRaw`
        UPDATE "categorie_produit" 
        SET "champsTemplate" = ${JSON.stringify(dynamicFields)}::jsonb, 
            "updatedAt" = NOW()
        WHERE id = ${newCategory.id}
      `;

      console.log(`Champs dynamiques ajoutés à la catégorie "${newCategory.nom}":`, dynamicFields.length, 'champs');
    } else {
      const category = categories[0];
      console.log('Catégorie trouvée:', category.nom);

      // Ajouter des champs dynamiques à cette catégorie existante
      const dynamicFields = [
        {
          id: 'taille_pied',
          name: 'taille_pied',
          label: 'Taille du pied',
          type: 'select',
          required: true,
          options: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'],
          section: 'Mesures',
          order: 0
        },
        {
          id: 'couleur_semelle',
          name: 'couleur_semelle',
          label: 'Couleur souhaitée',
          type: 'select',
          required: false,
          options: ['Noir', 'Marron', 'Beige', 'Blanc'],
          section: 'Options',
          order: 1
        },
        {
          id: 'hauteur_arche',
          name: 'hauteur_arche',
          label: 'Hauteur de l\'arche (mm)',
          type: 'number',
          required: false,
          placeholder: 'Ex: 15',
          section: 'Mesures',
          order: 2
        },
        {
          id: 'problemes_specifiques',
          name: 'problemes_specifiques',
          label: 'Problèmes spécifiques',
          type: 'textarea',
          required: false,
          placeholder: 'Décrivez les problèmes particuliers du patient...',
          section: 'Informations médicales',
          order: 3
        },
        {
          id: 'urgence',
          name: 'urgence',
          label: 'Commande urgente',
          type: 'boolean',
          required: false,
          section: 'Options',
          order: 4
        }
      ];

      // Mettre à jour avec les champs dynamiques
      await prisma.$executeRaw`
        UPDATE "categorie_produit" 
        SET "champsTemplate" = ${JSON.stringify(dynamicFields)}::jsonb, 
            "updatedAt" = NOW()
        WHERE id = ${category.id}
      `;

      console.log(`Champs dynamiques ajoutés à la catégorie "${category.nom}":`, dynamicFields.length, 'champs');
    }

    console.log('✅ Script terminé avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des champs dynamiques:', error);
  } finally {
    await prisma.$disconnect();
  }
};

// Exécuter le script
addDynamicFieldsToCategory();
