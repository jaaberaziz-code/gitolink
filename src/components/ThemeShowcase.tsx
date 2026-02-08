'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { FiArrowRight, FiLoader } from 'react-icons/fi'

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

interface ThemeCategory {
  id: string
  name: string
  keyword: string
  gradient: string
}

const themeCategories: ThemeCategory[] = [
  { id: 'gaming', name: 'Gaming', keyword: 'neon gaming cyberpunk', gradient: 'from-pink-500 via-purple-500 to-cyan-400' },
  { id: 'travel', name: 'Travel', keyword: 'sunset beach tropical', gradient: 'from-orange-400 via-pink-500 to-purple-600' },
  { id: 'business', name: 'Business', keyword: 'office corporate professional', gradient: 'from-slate-600 via-gray-700 to-slate-800' },
  { id: 'creative', name: 'Creative', keyword: 'art creative design', gradient: 'from-purple-500 via-pink-500 to-orange-400' },
  { id: 'nature', name: 'Nature', keyword: 'forest ocean nature', gradient: 'from-emerald-500 via-teal-600 to-green-700' },
  { id: 'premium', name: 'Premium', keyword: 'luxury gold elegant', gradient: 'from-yellow-400 via-yellow-500 to-amber-600' },
  { id: 'cyberpunk', name: 'Cyberpunk', keyword: 'cyberpunk neon futuristic', gradient: 'from-fuchsia-500 via-purple-600 to-cyan-500' },
  { id: 'sunset', name: 'Sunset', keyword: 'sunset golden hour landscape', gradient: 'from-orange-500 via-red-500 to-purple-600' },
]

export default function ThemeShowcase() {
  const [images, setImages] = useState<Record<string, UnsplashImage>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const fetchThemeImages = async () => {
      // Fetch one image per theme category
      const promises = themeCategories.map(async (category) => {
        setLoading(prev => ({ ...prev, [category.id]: true }))
        
        try {
          const url = new URL('/api/unsplash/random', window.location.origin)
          url.searchParams.set('theme', category.id)
          url.searchParams.set('count', '1')
          
          const response = await fetch(url.toString())
          
          if (!response.ok) {
            throw new Error('Failed to fetch')
          }
          
          const data = await response.json()
          
          if (data.images && data.images.length > 0) {
            setImages(prev => ({ ...prev, [category.id]: data.images[0] }))
          }
        } catch (err) {
          console.error(`Failed to fetch image for ${category.name}:`, err)
          setErrors(prev => ({ ...prev, [category.id]: true }))
        } finally {
          setLoading(prev => ({ ...prev, [category.id]: false }))
        }
      })

      await Promise.all(promises)
    }

    fetchThemeImages()
  }, [])

  return (
    <section className="py-32 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-purple-500/5" />
      <div className="max-w-7xl mx-auto relative">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-4">
            Themes
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Stunning Themes
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            From cyberpunk neon to corporate elegance, find the perfect look for your brand with real photos from Unsplash.
          </p>
        </motion.div>

        {/* Theme Previews Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {themeCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="group cursor-pointer"
            >
              <div className="relative h-32 rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-all">
                {loading[category.id] ? (
                  // Loading state
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} flex items-center justify-center`}>
                    <FiLoader className="w-6 h-6 text-white animate-spin" />
                  </div>
                ) : images[category.id] && !errors[category.id] ? (
                  // Image loaded successfully
                  <>
                    <Image
                      src={images[category.id].url}
                      alt={images[category.id].alt || category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, 25vw"
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL={`data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='${encodeURIComponent(images[category.id].color || '#333')}' width='400' height='300'/%3E%3C/svg%3E`}
                    />
                    {/* Attribution overlay on hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <p className="text-xs text-white/80">
                        Photo by{' '}
                        <a
                          href={images[category.id].author.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white underline hover:no-underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {images[category.id].author.name}
                        </a>
                        {' '}on{' '}
                        <a
                          href="https://unsplash.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white underline hover:no-underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Unsplash
                        </a>
                      </p>
                    </div>
                  </>
                ) : (
                  // Fallback gradient
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient}`} />
                )}
              </div>
              <p className="text-center text-sm text-gray-400 group-hover:text-white transition-colors mt-2">
                {category.name}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link 
            href="/demo" 
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            See all themes in action
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Unsplash attribution */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            Photos provided by{' '}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors underline"
            >
              Unsplash
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
