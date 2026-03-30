import { defineField, defineType } from 'sanity'
import { HomeIcon } from '@sanity/icons'

export const homePage = defineType({
  name: 'homePage',
  title: "Page d'accueil",
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Titre de la page',
      type: 'string',
      initialValue: 'Accueil',
    }),
    defineField({
      name: 'seoTitle',
      title: 'Titre SEO',
      type: 'string',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Description SEO',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'sections',
      title: 'Sections de la page',
      description: "Ajoutez, réorganisez et modifiez les sections de la page d'accueil",
      type: 'array',
      of: [
        { type: 'heroSection' },
        { type: 'aboutSection' },
        { type: 'servicesSection' },
        { type: 'testimonialsSection' },
        { type: 'faqSection' },
        { type: 'ctaSection' },
        { type: 'valuesSection' },
      ],
      options: {
        insertMenu: {
          views: [
            {
              name: 'grid',
              previewImageUrl: (schemaTypeName: string) =>
                `/static/page-builder-thumbnails/${schemaTypeName}.webp`,
            },
          ],
        },
      },
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare: () => ({ title: "Page d'accueil" }),
  },
})
