import { defineLive } from 'next-sanity/live'
import { client } from './client'

const token = process.env.SANITY_VIEWER_TOKEN

// defineLive is only configured when a viewer token is available
// Without a token, sanityFetch falls back to regular client.fetch
const live = token
  ? defineLive({
      client,
      serverToken: token,
      browserToken: token,
    })
  : null

export const sanityFetch = live?.sanityFetch ?? (async ({ query, params }: any) => {
  const data = await client.fetch(query, params)
  return { data }
})

export const SanityLive = live?.SanityLive ?? (() => null)
