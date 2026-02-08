import { NextRequest, NextResponse } from 'next/server'

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY

// Fallback images for search
const fallbackSearchImages = [
  { id: 'search-fallback-1', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', thumb: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', alt: 'Mountain landscape', author: { name: 'Unsplash', username: 'unsplash', link: 'https://unsplash.com' } },
  { id: 'search-fallback-2', url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800', thumb: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400', alt: 'Nature', author: { name: 'Unsplash', username: 'unsplash', link: 'https://unsplash.com' } },
  { id: 'search-fallback-3', url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800', thumb: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=400', alt: 'Forest', author: { name: 'Unsplash', username: 'unsplash', link: 'https://unsplash.com' } },
  { id: 'search-fallback-4', url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800', thumb: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400', alt: 'Waterfall', author: { name: 'Unsplash', username: 'unsplash', link: 'https://unsplash.com' } },
]

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('query') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const perPage = parseInt(searchParams.get('per_page') || '12')

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      )
    }

    // If no API key, return fallback images
    if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === 'your-unsplash-access-key') {
      console.log('Unsplash API key not configured, using fallback images')
      return NextResponse.json({
        images: fallbackSearchImages.map(img => ({
          ...img,
          width: 800,
          height: 600,
          color: '#333333',
        })),
        total: fallbackSearchImages.length,
        totalPages: 1,
        fallback: true,
      })
    }

    const url = new URL('https://api.unsplash.com/search/photos')
    url.searchParams.set('query', query)
    url.searchParams.set('page', page.toString())
    url.searchParams.set('per_page', perPage.toString())
    url.searchParams.set('orientation', 'landscape')

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Unsplash API error:', error)
      
      // Return fallback images on API error
      return NextResponse.json({
        images: fallbackSearchImages.map(img => ({
          ...img,
          width: 800,
          height: 600,
          color: '#333333',
        })),
        total: fallbackSearchImages.length,
        totalPages: 1,
        fallback: true,
      })
    }

    const data = await response.json()
    
    // Transform the response to include only what we need
    const images = data.results.map((photo: any) => ({
      id: photo.id,
      url: photo.urls.regular,
      thumb: photo.urls.small,
      alt: photo.alt_description || photo.description || 'Unsplash image',
      author: {
        name: photo.user.name,
        username: photo.user.username,
        link: photo.user.links.html,
      },
      width: photo.width,
      height: photo.height,
      color: photo.color,
    }))

    return NextResponse.json({
      images,
      total: data.total,
      totalPages: data.total_pages,
    })
  } catch (error) {
    console.error('Unsplash search error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
