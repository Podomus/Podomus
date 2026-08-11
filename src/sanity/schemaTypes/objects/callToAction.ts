import { defineField, defineType } from 'sanity'
import { BulbOutlineIcon } from '@sanity/icons/BulbOutline'
import { ComposeSparklesIcon } from '@sanity/icons/ComposeSparkles'
import { ImageIcon } from '@sanity/icons/Image'
import { LinkIcon } from '@sanity/icons/Link'
import { ControlsIcon } from '@sanity/icons/Controls'

export const callToAction = defineType({
  name: 'callToAction',
  title: 'Call to Action',
  type: 'object',
  icon: BulbOutlineIcon,
  groups: [
    { name: 'contents', icon: ComposeSparklesIcon, default: true },
    { name: 'media', icon: ImageIcon },
    { name: 'button', icon: LinkIcon },
    { name: 'designSystem', icon: ControlsIcon },
  ],
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'contents',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'contents',
    }),
    defineField({
      name: 'body',
      type: 'blockContent',
      group: 'contents',
    }),
    defineField({
      name: 'button',
      type: 'button',
      group: 'button',
    }),
    defineField({
      name: 'image',
      type: 'image',
      group: 'media',
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
      name: 'theme',
      type: 'string',
      title: 'Theme',
      options: {
        list: [
          { title: 'Light', value: 'light' },
          { title: 'Dark', value: 'dark' },
        ],
        layout: 'radio',
      },
      initialValue: 'light',
      group: 'designSystem',
    }),
    defineField({
      name: 'contentAlignment',
      title: 'Content Order',
      type: 'string',
      initialValue: 'textFirst',
      options: {
        list: [
          { title: 'Text then Image', value: 'textFirst' },
          { title: 'Image then Text', value: 'imageFirst' },
        ],
        layout: 'radio',
      },
      hidden: ({ parent }) => !Boolean(parent?.image?.asset),
      group: 'designSystem',
    }),
  ],
  preview: {
    select: { title: 'heading', image: 'image.asset' },
    prepare({ title, image }) {
      return { title, subtitle: 'Call to Action', media: image || undefined }
    },
  },
})
