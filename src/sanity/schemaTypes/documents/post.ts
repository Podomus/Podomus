import { DocumentTextIcon } from '@sanity/icons'
import { format, parseISO } from 'date-fns'
import { defineField, defineType } from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Post',
  icon: DocumentTextIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly identifier for this post',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Short summary shown in blog listing and SEO',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
        },
      ],
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({
      name: 'author',
      title: 'Auteur',
      type: 'string',
      description: "Nom et qualifications de l'auteur (ex: Dr. Sonda Affes Ben Mahmoud, Pédicure-Podologue)",
    }),
    defineField({
      name: 'featured',
      title: 'Article mis en avant',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'lastReviewed',
      title: 'Dernière révision médicale',
      type: 'date',
      description: "Date de la dernière vérification de l'exactitude médicale",
    }),
    defineField({
      name: 'medicalDisclaimer',
      title: 'Avertissement médical',
      type: 'text',
      rows: 3,
      description: 'Avertissement à afficher en bas de l\'article (ex: "Cet article est fourni à titre informatif uniquement...")',
    }),
    defineField({
      name: 'seoTitle',
      title: 'Titre SEO',
      type: 'string',
      description: 'Titre personnalisé pour les moteurs de recherche (laissez vide pour utiliser le titre de l\'article)',
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
      description: 'Mots-clés liés à cet article',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      media: 'coverImage',
      categoryTitle: 'category.title',
    },
    prepare({ title, media, date, categoryTitle }) {
      const subtitles = [
        categoryTitle,
        date && format(parseISO(date), 'LLL d, yyyy'),
      ].filter(Boolean)

      return { title, media, subtitle: subtitles.join(' · ') }
    },
  },
})
