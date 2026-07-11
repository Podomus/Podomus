/**
 * Sanity seed script — creates test blog posts and categories.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN="your-write-token" npx tsx scripts/seed-sanity.ts
 *
 * Get a write token from https://sq0ivtut.api.sanity.io/manage
 */

import 'dotenv/config'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'sq0ivtut'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN

if (!token) {
  console.error('Missing SANITY_WRITE_TOKEN. Set it in your environment.')
  console.error('Get one at https://sq0ivtut.api.sanity.io/manage')
  process.exit(1)
}

async function seed() {
  console.log(`Seeding Sanity dataset: ${dataset}`)

  // Create categories first
  const categories = [
    { _type: 'category', title: 'Soins', slug: { _type: 'slug', current: 'soins' }, description: 'Soins podologiques généraux' },
    { _type: 'category', title: 'Techniques', slug: { _type: 'slug', current: 'techniques' }, description: 'Techniques et innovations' },
    { _type: 'category', title: 'Sport', slug: { _type: 'slug', current: 'sport' }, description: 'Podologie du sportif' },
  ]

  const created: any[] = []
  for (const cat of categories) {
    const res = await fetch(
      `https://${projectId}.api.sanity.io/v2025-03-15/data/mutate/${dataset}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mutations: [
            {
              createOrReplace: {
                ...cat,
                _id: `cat-${cat.slug.current}`,
              },
            },
          ],
        }),
      },
    )
    const data = await res.json()
    if (data.error) {
      console.error(`Failed to create category ${cat.title}:`, data.error)
    } else {
      console.log(`  ✓ Category: ${cat.title}`)
      created.push(cat)
    }
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
          children: [
            {
              _type: 'span',
              text: 'La podologie préventive est une approche essentielle pour maintenir la santé de vos pieds à long terme. Tout comme vous consultez votre dentiste régulièrement, des visites périodiques chez votre podologue peuvent vous éviter bien des désagréments.',
            },
          ],
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
          children: [
            {
              _type: 'span',
              text: "L'orthoplastie est une technique de correction des ongles qui permet de traiter les ongles incarnés sans chirurgie. Cette méthode innovante utilise une résine spéciale pour redonner à l'ongle sa forme naturelle.",
            },
          ],
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
          children: [
            {
              _type: 'span',
              text: "La course à pied est l'un des sports les plus exigeants pour les pieds. Chaque kilomètre parcouru représente environ 1000 impacts au sol, ce qui sollicite énormément vos pieds, vos chevilles et vos genoux.",
            },
          ],
        },
      ],
    },
  ]

  for (const post of posts) {
    const res = await fetch(
      `https://${projectId}.api.sanity.io/v2025-03-15/data/mutate/${dataset}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mutations: [
            {
              createOrReplace: {
                ...post,
                _id: `post-${post.slug.current}`,
              },
            },
          ],
        }),
      },
    )
    const data = await res.json()
    if (data.error) {
      console.error(`Failed to create post ${post.title}:`, data.error)
    } else {
      console.log(`  ✓ Post: ${post.title}`)
    }
  }

  // Publish all by creating a release/publish mutation
  console.log('\nDone! Publish the dataset to make posts visible.')
  console.log('Or run: SANITY_WRITE_TOKEN=... npx sanity documents create --replace ...')
}

seed().catch(console.error)
