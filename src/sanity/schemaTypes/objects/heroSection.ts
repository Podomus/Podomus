import { defineField, defineType } from 'sanity'
import { ImageIcon } from '@sanity/icons/Image'

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
        },
      ],
    }),
    defineField({
      name: 'button',
      type: 'button',
    }),
  ],
  preview: {
    select: { title: 'heading', image: 'image.asset' },
    prepare({ title, image }) {
      return { title, subtitle: 'Hero Section', media: image || undefined }
    },
  },
})
