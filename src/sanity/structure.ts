import type { StructureResolver } from 'sanity/structure'
import { CogIcon, DocumentTextIcon, DocumentIcon, TagIcon } from '@sanity/icons'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Podomus')
    .items([
      // Settings singleton
      S.listItem()
        .title('Settings')
        .icon(CogIcon)
        .child(S.document().schemaType('settings').documentId('siteSettings')),
      S.divider(),
      // Blog
      S.listItem()
        .title('Blog Posts')
        .icon(DocumentTextIcon)
        .schemaType('post')
        .child(S.documentTypeList('post').title('Blog Posts')),
      S.listItem()
        .title('Categories')
        .icon(TagIcon)
        .schemaType('category')
        .child(S.documentTypeList('category').title('Categories')),
      S.divider(),
      // Pages
      S.listItem()
        .title('Pages')
        .icon(DocumentIcon)
        .schemaType('page')
        .child(S.documentTypeList('page').title('Pages')),
    ])
