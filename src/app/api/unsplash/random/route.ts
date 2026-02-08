import { NextRequest, NextResponse } from 'next/server'

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY

// Theme keywords mapping
const themeKeywords: Record<string, string> = {
  gaming: 'neon gaming cyberpunk',
  travel: 'sunset beach tropical',
  business: 'office corporate professional',
  creative: 'art creative design',
  nature: 'forest ocean nature',
  premium: 'luxury gold elegant',
  cyberpunk: 'cyberpunk neon futuristic',
  sunset: 'sunset golden hour landscape',
  ocean: 'ocean waves blue water',
  forest: 'forest trees green nature',
  minimal: 'minimal clean white',
  dark: 'dark moody black',
  abstract: 'abstract colorful pattern',
}

// Fallback images for when Unsplash API is not available
const fallbackImages: Record<string, any[]> = {
  gaming: [
    { id: 'gaming-fallback-1', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800', thumb: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400', alt: 'Gaming setup', author: { name: 'Unsplash', username: 'unsplash', link: 'https://unsplash.com' } },
    { id: 'gaming-fallback-2', url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800', thumb: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400', alt: 'Neon gaming', author: { name: 'Unsplash', username: 'unsplash', link: 'https://unsplash.com' } },
  ],
  travel: [
    { id: 'travel-fallback-1', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400', alt: 'Beach sunset', author: { name: 'Unsplash', username: 'unsplash', link: 'https://unsplash.com' } },
    { id: 'travel-fallback-2', url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800', thumb: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400', alt: 'Tropical travel', author: { name: 'Unsplash', username: 'unsplash', link: 'https://unsplash.com' } },
  ],
  business: [
    { id: 'business-fallback-1', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', thumb: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400', alt: 'Office', author: { name: 'Unsplash', username: 'unsplash', link: 'https://unsplash.com' } },
    { id: 'business-fallback-2', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', thumb: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400', alt: 'Corporate', author: { name: 'Unsplash', username: 'unsplash', link: 'https://unsplash.com' } },
  ],
  creative: [
    { id: 'creative-fallback-1', url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800', thumb: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400', alt: 'Art', author: { name: 'Unsplash', username: 'unsplash', link: 'https://unsplash.com' } },
    { id: 'creative-fallback-2', url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800', thumb: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400', alt: 'Creative design', author: { name: 'Unsplash', username: 'unsplash', link: 'https://unsplash.com' } },
  ],
  nature: [
    { id: 'nature-fallback-1', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800', thumb: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400', alt: 'Forest', author: { name: 'Unsplash', username: 'unsplash', link: 'https://unsplash.com' } },
    { id: 'nature-fallback-2', url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800', thumb: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400', alt: 'Ocean nature', author: { name: 'Unsplash', username: 'unsplash', link: 'https://unsplash.com' } },
  ],
  premium: [
    { id: 'premium-fallback-1', url: 'https://images.unsplash.com/photo-1565514020176-db8e2671f993?w=800', thumb: 'https://images.unsplash.com/photo-1565514020176-db8e2671f993?w=400', alt: 'Luxury', author: { name: 'Unsplash', username: 'unsplash', link: 'https://unsplash.com' } },
    { id: 'premium-fallback-2', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', thumb: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400', alt: 'Elegant', author: { name: 'Unsplash', username: 'unsplash', link: 'https://unsplash.com' } },
  ],
  cyberpunk: [
    { id: 'cyberpunk-fallback-1', url: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800', thumb: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=400', alt: 'Cyberpunk neon', author: { name: 'Unsplash', username: 'unsplash', link: 'https://unsplash.com' } },
  ],
  sunset: [
    { id: 'sunset-fallback-1', url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9d869?w=800', thumb: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9d869?w=400', alt: 'Sunset', author: { name: 'Unsplash', username: 'unsplash', link: 'https://unsplash.com' } },
  ],
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const theme = searchParams.get('theme') || ''
    const count = Math.min(parseInt(searchParams.get('count') || '1'), 10)

    // Build query from theme or use random
    let query = theme
    if (theme && themeKeywords[theme.toLowerCase()]) {
      query = themeKeywords[theme.toLowerCase()]
    }

    // If no API key, return fallback images
    if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === 'your-unsplash-access-key') {
      console.log('Unsplash API key not configured, using fallback images')
      const fallbacks = fallbackImages[theme.toLowerCase()] || fallbackImages.nature
      return NextResponse.json({
        images: fallbacks.slice(0, count).map(img => ({
          ...img,
          width: 800,
          height: 600,
          color: '#333333',
        })),
        theme: theme || 'random',
        fallback: true,
      })
    }

    // If a theme/query is provided, use random with query param
    // Otherwise, get completely random photos
    const url = new URL('https://api.unsplash.com/photos/random')
    url.searchParams.set('count', count.toString())
    url.searchParams.set('orientation', 'landscape')
    
    if (query) {
      url.searchParams.set('query', query)
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        'Accept': 'application/json',
      },
      next: { revalidate: 1800 }, // Cache for 30 minutes
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Unsplash API error:', response.status, errorText)
      
      // Return fallback images on API error
      const fallbacks = fallbackImages[theme.toLowerCase()] || fallbackImages.nature
      return NextResponse.json({
        images: fallbacks.slice(0, count).map(img => ({
          ...img,
          width: 800,
          height: 600,
          color: '#333333',
        })),
        theme: theme || 'random',
        fallback: true,
      })
    }

    const data = await response.json()
    
    // Handle both single photo and array of photos
    const photos = Array.isArray(data) ? data : [data]
    
    // Transform the response to include only what we need
    const images = photos.map((photo: any) => ({
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
      downloadLocation: photo.links.download_location,
    }))

    return NextResponse.json({
      images,
      theme: theme || 'random',
    })
  } catch (error) {
    console.error('Unsplash random error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
