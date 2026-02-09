import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Simple in-memory cache for OG requests
const ogCache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 1000 * 60 * 60 * 24 // 24 hours

interface OGMetadata {
  title: string
  description: string
  image: string
}

async function fetchOGMetadata(url: string): Promise<OGMetadata | null> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000) // 10s timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    clearTimeout(timeout)

    const html = await response.text()
    
    // Parse OG tags
    const getMeta = (property: string): string | null => {
      const regex = new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i')
      const match = regex.exec(html)
      if (match) return match[1]
      
      const regex2 = new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*property=["']${property}["']`, 'i')
      const match2 = regex2.exec(html)
      return match2 ? match2[1] : null
    }

    const title = getMeta('og:title') || getMeta('twitter:title') || 
                  html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] || 
                  ''
    
    const description = getMeta('og:description') || getMeta('twitter:description') || 
                        getMeta('description') || ''
    
    let image = getMeta('og:image') || getMeta('twitter:image') || ''
    
    // Resolve relative URLs
    if (image && !image.startsWith('http')) {
      try {
        const baseUrl = new URL(url)
        image = new URL(image, baseUrl).href
      } catch {
        // Keep original if parsing fails
      }
    }

    return {
      title: title.slice(0, 200),
      description: description.slice(0, 500),
      image
    }
  } catch (error) {
    console.error('Failed to fetch OG metadata:', error)
    return null
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const url = searchParams.get('url')
    const linkId = searchParams.get('linkId')

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Check in-memory cache
    const cacheKey = url
    const cached = ogCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({ metadata: cached.data })
    }

    // Check database cache if linkId provided
    if (linkId) {
      const link = await prisma.link.findUnique({
        where: { id: linkId },
        select: {
          ogTitle: true,
          ogDescription: true,
          ogImage: true,
          ogCacheAt: true
        }
      })

      if (link?.ogCacheAt && Date.now() - new Date(link.ogCacheAt).getTime() < CACHE_TTL) {
        const metadata = {
          title: link.ogTitle || '',
          description: link.ogDescription || '',
          image: link.ogImage || ''
        }
        ogCache.set(cacheKey, { data: metadata, timestamp: Date.now() })
        return NextResponse.json({ metadata })
      }
    }

    // Fetch fresh metadata
    const metadata = await fetchOGMetadata(url)
    
    if (!metadata) {
      return NextResponse.json(
        { error: 'Failed to fetch metadata' },
        { status: 500 }
      )
    }

    // Update cache
    ogCache.set(cacheKey, { data: metadata, timestamp: Date.now() })

    // Update database cache if linkId provided
    if (linkId) {
      await prisma.link.update({
        where: { id: linkId },
        data: {
          ogTitle: metadata.title,
          ogDescription: metadata.description,
          ogImage: metadata.image,
          ogCacheAt: new Date()
        }
      })
    }

    return NextResponse.json({ metadata })
  } catch (error) {
    console.error('OG metadata error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
