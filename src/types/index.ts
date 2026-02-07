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