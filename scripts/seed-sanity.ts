/**
 * Sanity seed script — creates test blog posts and categories.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN="your-editor-token" npx tsx scripts/seed-sanity.ts
 *
 * Get a token from https://sq0ivtut.api.sanity.io/manage → API → Tokens
 */

import 'dotenv/config'
import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'sq0ivtut'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN

if (!token) {
  console.error('Missing SANITY_WRITE_TOKEN. Set it in your environment.')
  console.error('Get one at https://sq0ivtut.api.sanity.io/manage')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2025-03-15',
  useCdn: false,
})

async function seed() {
  console.log(`Seeding Sanity dataset: ${dataset}\n`)

  // Create categories
  const categories = [
    { _type: 'category', title: 'Soins', slug: { _type: 'slug', current: 'soins' }, description: 'Soins podologiques généraux' },
    { _type: 'category', title: 'Techniques', slug: { _type: 'slug', current: 'techniques' }, description: 'Techniques et innovations' },
    { _type: 'category', title: 'Sport', slug: { _type: 'slug', current: 'sport' }, description: 'Podologie du sportif' },
  ]

  const catIds: Record<string, string> = {}
  for (const cat of categories) {
    const result = await client.createOrReplace(
      { _id: `cat-${cat.slug.current}`, ...cat },
    )
    catIds[cat.slug.current] = result._id
    console.log(`  ✓ Category: ${cat.title}`)
  }

  // Create test posts
  const posts = [
    {
      _type: 'post',
      title: 'Les bienfaits de la podologie préventive',
      slug: { _type: 'slug', current: 'bienfaits-podologie-preventive' },
      excerpt: 'Découvrez comment des soins podologiques réguliers peuvent prévenir les douleurs et améliorer votre qualité de vie au quotidien.',
      date: new Date().toISOString(),
      author: 'Dr. Sonda Affes Ben Mahmoud',
      featured: true,
      category: { _type: 'reference', _ref: 'cat-soins' },
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: 'La podologie préventive est une approche essentielle pour maintenir la santé de vos pieds à long terme. Tout comme vous consultez votre dentiste régulièrement, des visites périodiques chez votre podologue peuvent vous éviter bien des désagréments.' }],
        },
      ],
    },
    {
      _type: 'post',
      title: "Orthoplastie : tout ce qu'il faut savoir",
      slug: { _type: 'slug', current: 'orthoplastie-guide-complet' },
      excerpt: "L'orthoplastie est une technique innovante pour corriger les ongles incarnés et autres pathologies unguéales.",
      date: new Date().toISOString(),
      author: 'Dr. Sonda Affes Ben Mahmoud',
      featured: false,
      category: { _type: 'reference', _ref: 'cat-techniques' },
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: "L'orthoplastie est une technique de correction des ongles qui permet de traiter les ongles incarnés sans chirurgie. Cette méthode innovante utilise une résine spéciale pour redonner à l'ongle sa forme naturelle." }],
        },
      ],
    },
    {
      _type: 'post',
      title: 'Podologie du sportif : conseils pour les coureurs',
      slug: { _type: 'slug', current: 'podologie-sportif-conseils-coureurs' },
      excerpt: "Les coureurs sollicitent énormément leurs pieds. Voici les conseils de notre podologue pour éviter les blessures.",
      date: new Date().toISOString(),
      author: 'Dr. Sonda Affes Ben Mahmoud',
      featured: false,
      category: { _type: 'reference', _ref: 'cat-sport' },
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: 'La course à pied est un sport exigeant pour les pieds. Chaque kilomètre représente environ 1000 impacts au sol, sollicitant pieds, chevilles et genoux.' }],
        },
      ],
    },
  ]

  for (const post of posts) {
    await client.createOrReplace(
      { _id: `post-${post.slug.current}`, ...post },
    )
    console.log(`  ✓ Post: ${post.title}`)
  }

  console.log('\n✅ Seeding complete. The posts should now appear on the blog.')
}

seed().catch((err) => {
  console.error('\n❌ Seed failed:', err.message)
  process.exit(1)
})
