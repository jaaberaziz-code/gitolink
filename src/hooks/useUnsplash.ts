'use client'

import { useState, useEffect, useCallback } from 'react'

interface UnsplashAuthor {
  name: string
  username: string
  link: string
}

interface UnsplashImage {
  id: string
  url: string
  thumb: string
  alt: string
  author: UnsplashAuthor
  width: number
  height: number
  color: string | null
}

interface UseUnsplashRandomOptions {
  theme?: string
  count?: number
}

export function useUnsplashRandom(options: UseUnsplashRandomOptions = {}) {
  const { theme, count = 1 } = options
  const [images, setImages] = useState<UnsplashImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const url = new URL('/api/unsplash/random', window.location.origin)
        if (theme) url.searchParams.set('theme', theme)
        url.searchParams.set('count', count.toString())
        
        const response = await fetch(url.toString())
        
        if (!response.ok) {
          throw new Error('Failed to fetch images')
        }
        
        const data = await response.json()
        setImages(data.images)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [theme, count])

  return { images, loading, error }
}

export function useUnsplashSearch() {
  const [images, setImages] = useState<UnsplashImage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (query: string, page = 1, perPage = 12) => {
    try {
      setLoading(true)
      setError(null)
      
      const url = new URL('/api/unsplash/search', window.location.origin)
      url.searchParams.set('query', query)
      url.searchParams.set('page', page.toString())
      url.searchParams.set('per_page', perPage.toString())
      
      const response = await fetch(url.toString())
      
      if (!response.ok) {
        throw new Error('Failed to search images')
      }
      
      const data = await response.json()
      setImages(data.images)
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { images, loading, error, search }
}

// Predefined theme keywords for different categories
export const themeKeywords = {
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
} as const

export type ThemeKeyword = keyof typeof themeKeywords
