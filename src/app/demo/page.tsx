import { Metadata } from 'next'
import ProfileView from '@/components/profile/ProfileView'

export const metadata: Metadata = {
  title: 'Demo Profile - GitoLink',
  description: 'See how your GitoLink profile could look',
}

// Demo user data
const demoUser = {
  id: 'demo',
  username: 'creator_demo',
  name: 'Alex Creator',
  bio: '🎨 Digital Artist | 📸 Photographer | 🌟 Content Creator\nWelcome to my creative corner!',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
  theme: 'gradient-1',
  links: [
    {
      id: '1',
      title: '📸 My Photography Portfolio',
      url: 'https://example.com/portfolio',
      icon: 'website',
      active: true,
      order: 0,
    },
    {
      id: '2', 
      title: '🎨 Buy My Art Prints',
      url: 'https://example.com/shop',
      icon: 'website',
      active: true,
      order: 1,
    },
    {
      id: '3',
      title: '📺 YouTube Channel',
      url: 'https://youtube.com',
      icon: 'youtube',
      active: true,
      order: 2,
    },
    {
      id: '4',
      title: '📸 Instagram',
      url: 'https://instagram.com',
      icon: 'instagram',
      active: true,
      order: 3,
    },
    {
      id: '5',
      title: '🐦 Twitter/X',
      url: 'https://twitter.com',
      icon: 'twitter',
      active: true,
      order: 4,
    },
    {
      id: '6',
      title: '💼 LinkedIn',
      url: 'https://linkedin.com',
      icon: 'linkedin',
      active: true,
      order: 5,
    },
    {
      id: '7',
      title: '🎵 TikTok',
      url: 'https://tiktok.com',
      icon: 'tiktok',
      active: true,
      order: 6,
    },
    {
      id: '8',
      title: '☕ Support My Work',
      url: 'https://buymeacoffee.com',
      icon: 'website',
      active: true,
      order: 7,
    },
  ],
}

export default function DemoPage() {
  return (
    <div className="min-h-screen">
      {/* Demo Banner */}
      <div className="bg-blue-600 text-white text-center py-2 text-sm">
        👋 This is a demo profile.{' '}
        <a href="/register" className="underline font-semibold hover:text-blue-200">
          Create your own for free!
        </a>
      </div>
      
      <ProfileView user={demoUser} links={demoUser.links} />
    </div>
  )
}