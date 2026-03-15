import { defineQuery } from 'next-sanity'

// Blog listing
export const POSTS_QUERY = defineQuery(`
  *[_type == "post"] | order(date desc) [0...12] {
    _id,
    title,
    slug,
    excerpt,
    date,
    coverImage,
    category->{
      _id,
      title,
      slug
    }
  }
`)

// Single blog post
export const POST_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    content,
    excerpt,
    date,
    coverImage,
    category->{
      _id,
      title,
      slug
    }
  }
`)

// All post slugs for generateStaticParams
export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] {
    "slug": slug.current
  }
`)

// Categories
export const CATEGORIES_QUERY = defineQuery(`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description
  }
`)

// Posts by category
export const POSTS_BY_CATEGORY_QUERY = defineQuery(`
  *[_type == "post" && category->slug.current == $categorySlug] | order(date desc) {
    _id,
    title,
    slug,
    excerpt,
    date,
    coverImage,
    category->{
      _id,
      title,
      slug
    }
  }
`)

// Site settings
export const SETTINGS_QUERY = defineQuery(`
  *[_type == "settings" && _id == "siteSettings"][0] {
    title,
    description,
    logo,
    ogImage,
    phone,
    email,
    address,
    socialLinks
  }
`)

// Dynamic page
export const PAGE_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    heading,
    subheading,
    pageBuilder[] {
      ...,
      _type == "callToAction" => {
        ...,
        button {
          label,
          url,
          style
        }
      },
      _type == "heroSection" => {
        ...,
        button {
          label,
          url,
          style
        }
      }
    }
  }
`)
