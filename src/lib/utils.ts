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
  // Gaming & Tech
  { id: 'cyberpunk', name: 'Cyberpunk Neon', class: 'bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-400' },
  { id: 'matrix', name: 'Matrix Code', class: 'bg-gradient-to-br from-green-400 via-emerald-600 to-black' },
  
  // Lifestyle & Travel  
  { id: 'sunset', name: 'Sunset Beach', class: 'bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600' },
  { id: 'tropical', name: 'Tropical Paradise', class: 'bg-gradient-to-br from-teal-300 via-cyan-400 to-blue-500' },
  { id: 'desert', name: 'Desert Dunes', class: 'bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400' },
  
  // Professional
  { id: 'corporate', name: 'Corporate Blue', class: 'bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-700' },
  { id: 'minimal', name: 'Minimal White', class: 'bg-gray-50 text-gray-900' },
  { id: 'executive', name: 'Executive Dark', class: 'bg-gradient-to-br from-slate-800 via-gray-900 to-black' },
  
  // Creative & Arts
  { id: 'aurora', name: 'Aurora Borealis', class: 'bg-gradient-to-br from-green-300 via-blue-500 to-purple-600' },
  { id: 'cotton-candy', name: 'Cotton Candy', class: 'bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400' },
  { id: 'retro', name: 'Retro Wave', class: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400' },
  
  // Nature
  { id: 'forest', name: 'Deep Forest', class: 'bg-gradient-to-br from-emerald-500 via-teal-600 to-green-700' },
  { id: 'ocean', name: 'Deep Ocean', class: 'bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-800' },
  { id: 'lavender', name: 'Lavender Field', class: 'bg-gradient-to-br from-purple-300 via-purple-400 to-pink-300' },
  
  // Premium
  { id: 'gold', name: 'Luxury Gold', class: 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600' },
  { id: 'rose-gold', name: 'Rose Gold', class: 'bg-gradient-to-br from-rose-300 via-pink-400 to-purple-400' },
  { id: 'midnight', name: 'Midnight Purple', class: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900' },
  
  // Special
  { id: 'glass', name: 'Glass Morphism', class: 'bg-white/10 backdrop-blur-xl border border-white/20' },
  { id: 'rainbow', name: 'Pride Rainbow', class: 'bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500' },
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
