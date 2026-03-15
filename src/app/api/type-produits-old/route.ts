import { NextResponse } from 'next/server'

// Redirect legacy French route to canonical English route
export async function GET(request: Request) {
  const url = new URL(request.url)
  url.pathname = '/api/product-types'
  return NextResponse.redirect(url, 308)
}
