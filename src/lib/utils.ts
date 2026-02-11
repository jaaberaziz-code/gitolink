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
  { id: 'cyberpunk', name: 'Cyberpunk Neon', class: 'bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-400', gradient: 'linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #22d3ee 100%)' },
  { id: 'matrix', name: 'Matrix Code', class: 'bg-gradient-to-br from-green-400 via-emerald-600 to-black', gradient: 'linear-gradient(135deg, #4ade80 0%, #059669 50%, #000000 100%)' },
  
  // Lifestyle & Travel  
  { id: 'sunset', name: 'Sunset Beach', class: 'bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600', gradient: 'linear-gradient(135deg, #fb923c 0%, #ec4899 50%, #9333ea 100%)' },
  { id: 'tropical', name: 'Tropical Paradise', class: 'bg-gradient-to-br from-teal-300 via-cyan-400 to-blue-500', gradient: 'linear-gradient(135deg, #5eead4 0%, #22d3ee 50%, #3b82f6 100%)' },
  { id: 'desert', name: 'Desert Dunes', class: 'bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400', gradient: 'linear-gradient(135deg, #facc15 0%, #fb923c 50%, #f87171 100%)' },
  
  // Professional
  { id: 'corporate', name: 'Corporate Blue', class: 'bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-700', gradient: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #334155 100%)' },
  { id: 'minimal', name: 'Minimal White', class: 'bg-gray-50 text-gray-900', gradient: '#f9fafb' },
  { id: 'executive', name: 'Executive Dark', class: 'bg-gradient-to-br from-slate-800 via-gray-900 to-black', gradient: 'linear-gradient(135deg, #1e293b 0%, #111827 50%, #000000 100%)' },
  
  // Creative & Arts
  { id: 'aurora', name: 'Aurora Borealis', class: 'bg-gradient-to-br from-green-300 via-blue-500 to-purple-600', gradient: 'linear-gradient(135deg, #86efac 0%, #3b82f6 50%, #9333ea 100%)' },
  { id: 'cotton-candy', name: 'Cotton Candy', class: 'bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400', gradient: 'linear-gradient(135deg, #f9a8d4 0%, #c084fc 50%, #818cf8 100%)' },
  { id: 'retro', name: 'Retro Wave', class: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400', gradient: 'linear-gradient(135deg, #9333ea 0%, #ec4899 50%, #fb923c 100%)' },
  
  // Nature
  { id: 'forest', name: 'Deep Forest', class: 'bg-gradient-to-br from-emerald-500 via-teal-600 to-green-700', gradient: 'linear-gradient(135deg, #10b981 0%, #0d9488 50%, #15803d 100%)' },
  { id: 'ocean', name: 'Deep Ocean', class: 'bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-800', gradient: 'linear-gradient(135deg, #0891b2 0%, #1d4ed8 50%, #3730a3 100%)' },
  { id: 'lavender', name: 'Lavender Field', class: 'bg-gradient-to-br from-purple-300 via-purple-400 to-pink-300', gradient: 'linear-gradient(135deg, #c084fc 0%, #a855f7 50%, #f0abfc 100%)' },
  
  // Premium
  { id: 'gold', name: 'Luxury Gold', class: 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600', gradient: 'linear-gradient(135deg, #facc15 0%, #eab308 50%, #d97706 100%)' },
  { id: 'rose-gold', name: 'Rose Gold', class: 'bg-gradient-to-br from-rose-300 via-pink-400 to-purple-400', gradient: 'linear-gradient(135deg, #fda4af 0%, #f472b6 50%, #c084fc 100%)' },
  { id: 'midnight', name: 'Midnight Purple', class: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900', gradient: 'linear-gradient(135deg, #312e81 0%, #581c87 50%, #0f172a 100%)' },
  
  // Special
  { id: 'glass', name: 'Glass Morphism', class: 'bg-white/10 backdrop-blur-xl border border-white/20', gradient: 'rgba(255,255,255,0.1)' },
  { id: 'rainbow', name: 'Pride Rainbow', class: 'bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500', gradient: 'linear-gradient(90deg, #ef4444 0%, #eab308 25%, #22c55e 50%, #3b82f6 75%, #a855f7 100%)' },
  
  // New Photo-Based Themes
  { id: 'artemis', name: 'Artemis', class: 'bg-[#5C6B57]', gradient: '#5C6B57' },
  { id: 'balcombe', name: 'Balcombe', class: 'bg-[#4A90A4]', gradient: 'linear-gradient(180deg, #4A90A4 0%, #7FB3C8 100%)' },
  { id: 'boultont', name: 'Boultont', class: 'bg-[#8B7355]', gradient: 'linear-gradient(135deg, #8B7355 0%, #A89080 50%, #6B5344 100%)' },
  { id: 'hanna', name: 'Hanna', class: 'bg-[#7A9E7E]', gradient: '#7A9E7E' },
  { id: 'hay', name: 'Hay', class: 'bg-[#0099CC]', gradient: 'linear-gradient(180deg, #0099CC 0%, #00BBEE 100%)' },
  { id: 'healeys', name: 'Healeys', class: 'bg-[#1a0a2e]', gradient: 'linear-gradient(135deg, #1a0a2e 0%, #4a1a6e 50%, #ff0066 100%)' },
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
