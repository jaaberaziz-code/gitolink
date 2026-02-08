import { isYouTubeUrl } from './YouTubeEmbed'
import { isInstagramUrl } from './InstagramEmbed'
import { isTikTokUrl } from './TikTokEmbed'

export type EmbedType = 'youtube' | 'instagram' | 'tiktok' | null

export function detectEmbedType(url: string): EmbedType {
  if (isYouTubeUrl(url)) return 'youtube'
  if (isInstagramUrl(url)) return 'instagram'
  if (isTikTokUrl(url)) return 'tiktok'
  return null
}

export function isEmbedSupported(url: string): boolean {
  return detectEmbedType(url) !== null
}

// Re-export individual checkers for convenience
export { isYouTubeUrl, isInstagramUrl, isTikTokUrl }
