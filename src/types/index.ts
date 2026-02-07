export interface User {
  id: string
  email: string
  username: string
  name?: string | null
  bio?: string | null
  avatar?: string | null
  theme: string
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
    theme: string
  }
  links: Link[]
}
