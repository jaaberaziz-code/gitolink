export interface User {
  id: string
  email: string
  username: string
  name?: string | null
  bio?: string | null
  avatar?: string | null
  avatar_url?: string | null
  theme: string
  background_type: 'gradient' | 'solid' | 'image'
  background_value: string
  custom_css?: string | null
  // Design customization
  layout: 'classic' | 'hero' | 'minimal'
  font_family: string
  title_color: string
  button_style: 'rounded' | 'pill' | 'square' | 'glass'
  button_color: string
  createdAt: Date
  updatedAt: Date
}

export interface Link {
  id: string
  title: string
  url: string
  icon?: string | null
  order: number
  active: boolean
  userId: string
  createdAt: Date
  updatedAt: Date
  clicks?: Click[]
  _count?: {
    clicks: number
  }
}

export interface Click {
  id: string
  linkId: string
  userId: string
  ip?: string | null
  country?: string | null
  city?: string | null
  device?: string | null
  browser?: string | null
  os?: string | null
  referrer?: string | null
  createdAt: Date
}

export interface AnalyticsData {
  totalClicks: number
  clicksPerLink: { linkId: string; title: string; count: number }[]
  deviceStats: { device: string; count: number }[]
  browserStats: { browser: string; count: number }[]
  timelineData: { date: string; count: number }[]
}

export interface ProfileData {
  user: {
    username: string
    name?: string | null
    bio?: string | null
    avatar?: string | null
    avatar_url?: string | null
    theme: string
    background_type: 'gradient' | 'solid' | 'image'
    background_value: string
    custom_css?: string | null
    // Design customization
    layout: 'classic' | 'hero' | 'minimal'
    font_family: string
    title_color: string
    button_style: 'rounded' | 'pill' | 'square' | 'glass'
    button_color: string
  }
  links: Link[]
}

export interface BackgroundCustomization {
  type: 'gradient' | 'solid' | 'image'
  value: string
}

export interface ProfileCustomization {
  avatar_url?: string
  background: BackgroundCustomization
  custom_css?: string
}

export interface DesignCustomization {
  layout: 'classic' | 'hero' | 'minimal'
  font_family: string
  title_color: string
  button_style: 'rounded' | 'pill' | 'square' | 'glass'
  button_color: string
}

// Google Fonts available for selection
export const googleFonts = [
  { id: 'Inter', name: 'Inter', category: 'sans-serif' },
  { id: 'Roboto', name: 'Roboto', category: 'sans-serif' },
  { id: 'Open Sans', name: 'Open Sans', category: 'sans-serif' },
  { id: 'Lato', name: 'Lato', category: 'sans-serif' },
  { id: 'Montserrat', name: 'Montserrat', category: 'sans-serif' },
  { id: 'Poppins', name: 'Poppins', category: 'sans-serif' },
  { id: 'Nunito', name: 'Nunito', category: 'sans-serif' },
  { id: 'Playfair Display', name: 'Playfair Display', category: 'serif' },
  { id: 'Merriweather', name: 'Merriweather', category: 'serif' },
  { id: 'Lora', name: 'Lora', category: 'serif' },
  { id: 'Oswald', name: 'Oswald', category: 'sans-serif' },
  { id: 'Raleway', name: 'Raleway', category: 'sans-serif' },
  { id: 'Ubuntu', name: 'Ubuntu', category: 'sans-serif' },
  { id: 'Fira Code', name: 'Fira Code', category: 'monospace' },
  { id: 'Space Grotesk', name: 'Space Grotesk', category: 'sans-serif' },
  { id: 'DM Sans', name: 'DM Sans', category: 'sans-serif' },
  { id: 'Work Sans', name: 'Work Sans', category: 'sans-serif' },
  { id: 'Bebas Neue', name: 'Bebas Neue', category: 'display' },
  { id: 'Pacifico', name: 'Pacifico', category: 'handwriting' },
  { id: 'Caveat', name: 'Caveat', category: 'handwriting' },
]

// Layout options
export const layouts = [
  { id: 'classic', name: 'Classic', description: 'Traditional centered layout with avatar on top' },
  { id: 'hero', name: 'Hero', description: 'Large hero section with bold typography' },
  { id: 'minimal', name: 'Minimal', description: 'Clean and simple with focus on links' },
]

// Button styles
export const buttonStyles = [
  { id: 'rounded', name: 'Rounded', description: 'Modern rounded corners' },
  { id: 'pill', name: 'Pill', description: 'Fully rounded pill shape' },
  { id: 'square', name: 'Square', description: 'Sharp corners' },
  { id: 'glass', name: 'Glass', description: 'Glass morphism effect' },
]
