import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export const themes = [
  { id: 'gradient-1', name: 'Purple Dream', class: 'gradient-bg' },
  { id: 'gradient-2', name: 'Pink Sunset', class: 'gradient-bg-2' },
  { id: 'gradient-3', name: 'Ocean Blue', class: 'gradient-bg-3' },
  { id: 'gradient-4', name: 'Mint Fresh', class: 'gradient-bg-4' },
  { id: 'gradient-5', name: 'Candy Pop', class: 'gradient-bg-5' },
  { id: 'gradient-6', name: 'Deep Space', class: 'gradient-bg-6' },
  { id: 'gradient-7', name: 'Soft Pastel', class: 'gradient-bg-7' },
  { id: 'gradient-8', name: 'Rose Blush', class: 'gradient-bg-8' },
  { id: 'gradient-9', name: 'Midnight', class: 'gradient-bg-9' },
  { id: 'gradient-10', name: 'Forest', class: 'gradient-bg-10' },
  { id: 'white', name: 'Clean White', class: 'bg-white text-gray-900' },
  { id: 'dark', name: 'Dark Mode', class: 'bg-gray-900 text-white' },
]

export function getThemeClass(themeId: string): string {
  const theme = themes.find(t => t.id === themeId)
  return theme?.class || 'gradient-bg'
}

export const socialIcons = [
  { id: 'website', name: 'Website', icon: 'FaGlobe' },
  { id: 'twitter', name: 'Twitter/X', icon: 'FaTwitter' },
  { id: 'instagram', name: 'Instagram', icon: 'FaInstagram' },
  { id: 'youtube', name: 'YouTube', icon: 'FaYoutube' },
  { id: 'tiktok', name: 'TikTok', icon: 'FaTiktok' },
  { id: 'github', name: 'GitHub', icon: 'FaGithub' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'FaLinkedin' },
  { id: 'facebook', name: 'Facebook', icon: 'FaFacebook' },
  { id: 'twitch', name: 'Twitch', icon: 'FaTwitch' },
  { id: 'discord', name: 'Discord', icon: 'FaDiscord' },
  { id: 'spotify', name: 'Spotify', icon: 'FaSpotify' },
  { id: 'snapchat', name: 'Snapchat', icon: 'FaSnapchat' },
  { id: 'pinterest', name: 'Pinterest', icon: 'FaPinterest' },
  { id: 'reddit', name: 'Reddit', icon: 'FaReddit' },
  { id: 'telegram', name: 'Telegram', icon: 'FaTelegram' },
  { id: 'whatsapp', name: 'WhatsApp', icon: 'FaWhatsapp' },
  { id: 'email', name: 'Email', icon: 'FaEnvelope' },
  { id: 'phone', name: 'Phone', icon: 'FaPhone' },
]
