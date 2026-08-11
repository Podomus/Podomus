import type { StructureResolver } from 'sanity/structure'
import { CogIcon } from '@sanity/icons/Cog'
import { DocumentTextIcon } from '@sanity/icons/DocumentText'
import { DocumentIcon } from '@sanity/icons/Document'
import { TagIcon } from '@sanity/icons/Tag'
import { HomeIcon } from '@sanity/icons/Home'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Podomus')
    .items([
      // Home page singleton
      S.listItem()
        .title("Page d'accueil")
        .icon(HomeIcon)
        .child(S.document().schemaType('homePage').documentId('homePage')),
      S.divider(),
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
