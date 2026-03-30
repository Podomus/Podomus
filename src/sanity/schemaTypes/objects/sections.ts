import { defineField, defineType } from 'sanity'
import {
  UsersIcon,
  TagIcon,
  HelpCircleIcon,
  StarIcon,
  ThListIcon,
  RocketIcon,
} from '@sanity/icons'

// ---------------------------------------------------------------------------
// aboutSection — about / intro section
// ---------------------------------------------------------------------------
export const aboutSection = defineType({
  name: 'aboutSection',
  title: "Section À propos",
  type: 'object',
  icon: UsersIcon,
  fields: [
    defineField({ name: 'heading', title: 'Titre', type: 'string' }),
    defineField({
      name: 'body',
      title: 'Contenu',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({ name: 'imageAlt', title: 'Description image', type: 'string' }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'À propos', subtitle: "Section À propos" }
    },
  },
})

// ---------------------------------------------------------------------------
// serviceCard — a single service card (used inside servicesSection)
// ---------------------------------------------------------------------------
export const serviceCard = defineType({
  name: 'serviceCard',
  title: 'Carte service',
  type: 'object',
  icon: TagIcon,
  fields: [
    defineField({ name: 'title', title: 'Nom du service', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3 }),
    defineField({ name: 'icon', title: 'Icône (nom Lucide)', type: 'string' }),
    defineField({ name: 'link', title: 'Lien', type: 'string' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'description' },
  },
})

// ---------------------------------------------------------------------------
// servicesSection — grid of service cards
// ---------------------------------------------------------------------------
export const servicesSection = defineType({
  name: 'servicesSection',
  title: 'Section Services',
  type: 'object',
  icon: ThListIcon,
  fields: [
    defineField({ name: 'heading', title: 'Titre de la section', type: 'string' }),
    defineField({ name: 'subheading', title: 'Sous-titre', type: 'string' }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [{ type: 'serviceCard' }],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Services', subtitle: 'Section Services' }
    },
  },
})

// ---------------------------------------------------------------------------
// testimonialItem — single testimonial (used inside testimonialsSection)
// ---------------------------------------------------------------------------
export const testimonialItem = defineType({
  name: 'testimonialItem',
  title: 'Témoignage',
  type: 'object',
  icon: StarIcon,
  fields: [
    defineField({ name: 'quote', title: 'Citation', type: 'text', rows: 3 }),
    defineField({ name: 'patientName', title: 'Prénom (anonymisé)', type: 'string' }),
    defineField({
      name: 'rating',
      title: 'Note (1-5)',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(5).integer(),
    }),
  ],
  preview: {
    select: { title: 'patientName', subtitle: 'quote' },
  },
})

// ---------------------------------------------------------------------------
// testimonialsSection — collection of patient testimonials
// ---------------------------------------------------------------------------
export const testimonialsSection = defineType({
  name: 'testimonialsSection',
  title: 'Section Témoignages',
  type: 'object',
  icon: UsersIcon,
  fields: [
    defineField({ name: 'heading', title: 'Titre', type: 'string' }),
    defineField({
      name: 'testimonials',
      title: 'Témoignages',
      type: 'array',
      of: [{ type: 'testimonialItem' }],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Témoignages', subtitle: 'Section Témoignages' }
    },
  },
})

// ---------------------------------------------------------------------------
// faqItem — single FAQ entry (used inside faqSection)
// ---------------------------------------------------------------------------
export const faqItem = defineType({
  name: 'faqItem',
  title: 'Question / Réponse',
  type: 'object',
  icon: HelpCircleIcon,
  fields: [
    defineField({ name: 'question', title: 'Question', type: 'string' }),
    defineField({ name: 'answer', title: 'Réponse', type: 'text', rows: 4 }),
  ],
  preview: {
    select: { title: 'question', subtitle: 'answer' },
  },
})

// ---------------------------------------------------------------------------
// faqSection — frequently asked questions
// ---------------------------------------------------------------------------
export const faqSection = defineType({
  name: 'faqSection',
  title: 'Section FAQ',
  type: 'object',
  icon: HelpCircleIcon,
  fields: [
    defineField({ name: 'heading', title: 'Titre', type: 'string' }),
    defineField({
      name: 'items',
      title: 'Questions',
      type: 'array',
      of: [{ type: 'faqItem' }],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'FAQ', subtitle: 'Section FAQ' }
    },
  },
})

// ---------------------------------------------------------------------------
// ctaSection — call to action banner
// ---------------------------------------------------------------------------
export const ctaSection = defineType({
  name: 'ctaSection',
  title: "Section Appel à l'action",
  type: 'object',
  icon: RocketIcon,
  fields: [
    defineField({ name: 'heading', title: 'Titre', type: 'string' }),
    defineField({ name: 'body', title: 'Texte', type: 'text', rows: 2 }),
    defineField({ name: 'ctaLabel', title: 'Bouton (label)', type: 'string' }),
    defineField({ name: 'ctaUrl', title: 'Bouton (lien)', type: 'string' }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || "Appel à l'action", subtitle: "Section CTA" }
    },
  },
})

// ---------------------------------------------------------------------------
// valuesSection — practice values / philosophy
// ---------------------------------------------------------------------------
export const valuesSection = defineType({
  name: 'valuesSection',
  title: 'Section Valeurs',
  type: 'object',
  icon: StarIcon,
  fields: [
    defineField({ name: 'heading', title: 'Titre', type: 'string' }),
    defineField({
      name: 'values',
      title: 'Valeurs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Titre', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
            defineField({ name: 'icon', title: 'Icône', type: 'string' }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'description' },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Valeurs', subtitle: 'Section Valeurs' }
    },
  },
})
