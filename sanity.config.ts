'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import {
  presentationTool,
  defineDocuments,
  defineLocations,
  type DocumentLocation,
} from 'sanity/presentation'
import { schemaTypes } from './src/sanity/schemaTypes'
import { structure } from './src/sanity/structure'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

const SANITY_STUDIO_PREVIEW_URL =
  process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000'

const homeLocation: DocumentLocation = {
  title: 'Home',
  href: '/',
}

function resolveHref(documentType?: string, slug?: string): string | undefined {
  switch (documentType) {
    case 'post':
      return slug ? `/blog/${slug}` : undefined
    case 'page':
      return slug ? `/${slug}` : undefined
    default:
      return undefined
  }
}

export default defineConfig({
  name: 'podomus',
  title: 'Podomus Studio',
  projectId,
  dataset,
  basePath: '/studio',

  plugins: [
    presentationTool({
      previewUrl: {
        origin: SANITY_STUDIO_PREVIEW_URL,
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
      resolve: {
        mainDocuments: defineDocuments([
          {
            route: '/',
            filter: `_type == "homePage" && _id == "homePage"`,
          },
          {
            route: '/:slug',
            filter: `_type == "page" && slug.current == $slug || _id == $slug`,
          },
          {
            route: '/blog/:slug',
            filter: `_type == "post" && slug.current == $slug || _id == $slug`,
          },
        ]),
        locations: {
          settings: defineLocations({
            locations: [homeLocation],
            message: 'This document is used on all pages',
            tone: 'positive',
          }),
          homePage: defineLocations({
            locations: [homeLocation],
            message: "This is the home page content",
            tone: 'positive',
          }),
          page: defineLocations({
            select: { name: 'name', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.name || 'Untitled',
                  href: resolveHref('page', doc?.slug)!,
                },
              ],
            }),
          }),
          post: defineLocations({
            select: { title: 'title', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled',
                  href: resolveHref('post', doc?.slug)!,
                },
                homeLocation,
              ].filter(Boolean) as DocumentLocation[],
            }),
          }),
        },
      },
    }),
    structureTool({ structure }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
