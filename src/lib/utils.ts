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
  { id: 'gradient-1', name: 'Neon Purple', class: 'bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600' },
  { id: 'gradient-2', name: 'Sunset Vibes', class: 'bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600' },
  { id: 'gradient-3', name: 'Ocean Blue', class: 'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600' },
  { id: 'gradient-4', name: 'Forest Green', class: 'bg-gradient-to-br from-emerald-400 via-teal-500 to-green-600' },
  { id: 'gradient-5', name: 'Cherry Pop', class: 'bg-gradient-to-br from-rose-400 via-red-500 to-pink-600' },
  { id: 'gradient-6', name: 'Midnight Dark', class: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' },
  { id: 'gradient-7', name: 'Golden Hour', class: 'bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500' },
  { id: 'gradient-8', name: 'Berry Smooth', class: 'bg-gradient-to-br from-fuchsia-400 via-purple-500 to-indigo-500' },
  { id: 'gradient-9', name: 'Tropical Teal', class: 'bg-gradient-to-br from-teal-300 via-cyan-400 to-blue-500' },
  { id: 'gradient-10', name: 'Rose Gold', class: 'bg-gradient-to-br from-rose-300 via-pink-400 to-purple-400' },
  { id: 'gradient-11', name: 'Electric Blue', class: 'bg-gradient-to-br from-blue-400 via-indigo-500 to-violet-600' },
  { id: 'gradient-12', name: 'Magma Heat', class: 'bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500' },
  { id: 'white', name: 'Clean White', class: 'bg-gray-50 text-gray-900' },
  { id: 'dark', name: 'Midnight Black', class: 'bg-gray-950 text-white' },
  { id: 'glass', name: 'Glass Morph', class: 'bg-white/10 backdrop-blur-xl' },
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
