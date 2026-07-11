import { defineField, defineType } from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO & Partages sociaux',
  type: 'object',
  fields: [
    defineField({
      name: 'seoTitle',
      title: 'Titre SEO',
      type: 'string',
      description: 'Titre personnalisé pour les moteurs de recherche (laissez vide pour utiliser le titre par défaut)',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Description SEO',
      type: 'text',
      rows: 2,
      description: 'Description pour les moteurs de recherche (150-160 caractères recommandés)',
    }),
    defineField({
      name: 'seoKeywords',
      title: 'Mots-clés SEO',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'ogImage',
      title: 'Image de partage (Open Graph)',
      type: 'image',
      description: 'Image affichée lors du partage sur les réseaux sociaux (1200×630 px recommandé)',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Texte alternatif',
        }),
      ],
    }),
    defineField({
      name: 'noIndex',
      title: 'Ne pas indexer (noindex)',
      type: 'boolean',
      initialValue: false,
      description: 'Empêche les moteurs de recherche d\'indexer cette page',
    }),
  ],
})
