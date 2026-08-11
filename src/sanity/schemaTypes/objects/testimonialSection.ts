import { defineField, defineType } from 'sanity'
import { UsersIcon } from '@sanity/icons/Users'

export const testimonialSection = defineType({
  name: 'testimonialSection',
  title: 'Testimonial Section',
  type: 'object',
  icon: UsersIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 3 }),
            defineField({ name: 'author', title: 'Author Name', type: 'string' }),
            defineField({ name: 'role', title: 'Role / Location', type: 'string' }),
            defineField({
              name: 'avatar',
              title: 'Avatar',
              type: 'image',
              options: { hotspot: true },
            }),
            defineField({
              name: 'rating',
              title: 'Rating (1-5)',
              type: 'number',
              validation: (Rule) => Rule.min(1).max(5).integer(),
            }),
          ],
          preview: {
            select: { title: 'author', subtitle: 'quote' },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Testimonials', subtitle: 'Testimonial Section' }
    },
  },
})
