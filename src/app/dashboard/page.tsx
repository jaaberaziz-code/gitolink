'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  FiPlus,
  FiLogOut,
  FiExternalLink,
  FiCopy,
  FiBarChart2,
  FiImage,
  FiTrendingUp,
  FiUser,
  FiSparkles,
  FiLink,
  FiSettings,
  FiEye,
  FiTrash2,
  FiEdit2,
  FiCheck,
  FiX,
  FiChevronUp,
  FiChevronDown,
  FiSmartphone
} from 'react-icons/fi'
import {
  FaGlobe,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaTwitch,
  FaDiscord,
  FaSpotify,
  FaSnapchat,
  FaPinterest,
  FaReddit,
  FaTelegram,
  FaWhatsapp,
} from 'react-icons/fa'
import type { User, Link as LinkType } from '@/types'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useSortable } from '@dnd-kit/sortable'
import { themes } from '@/lib/utils'

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  website: FaGlobe,
  twitter: FaTwitter,
  instagram: FaInstagram,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  github: FaGithub,
  linkedin: FaLinkedin,
  facebook: FaFacebook,
  twitch: FaTwitch,
  discord: FaDiscord,
  spotify: FaSpotify,
  snapchat: FaSnapchat,
  pinterest: FaPinterest,
  reddit: FaReddit,
  telegram: FaTelegram,
  whatsapp: FaWhatsapp,
}

// Sortable Link Item
function SortableLinkItem({ 
  link, 
  onUpdate,
  onDelete,
  onToggle
}: { 
  link: LinkType
  onUpdate: (link: LinkType) => void
  onDelete: (id: string) => void
  onToggle: (id: string, active: boolean) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  }

  const Icon = link.icon ? iconMap[link.icon] : FaGlobe
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(link.title)
  const [editUrl, setEditUrl] = useState(link.url)

  const handleSave = () => {
    onUpdate({ ...link, title: editTitle, url: editUrl })
    setIsEditing(false)
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`group relative ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="glass-card rounded-xl p-4 hover:bg-white/10 transition-all">
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="Link Title"
            />
            <input
              type="url"
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              placeholder="https://..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <FiX className="w-4 h-4" />
              </button>
              <button
                onClick={handleSave}
                className="p-2 text-green-400 hover:text-green-300 rounded-lg hover:bg-green-500/10"
              >
                <FiCheck className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            {/* Drag Handle */}
            <button
              {...attributes}
              {...listeners}
              className="p-2 text-gray-500 hover:text-white cursor-grab active:cursor-grabbing"
            >
              <div className="flex flex-col gap-1">
                <div className="w-1 h-1 rounded-full bg-current" />
                <div className="w-1 h-1 rounded-full bg-current" />
                <div className="w-1 h-1 rounded-full bg-current" />
              </div>
            </button>

            {/* Icon */}
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
              {Icon && <Icon className="w-5 h-5 text-blue-400" />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{link.title}</p>
              <p className="text-gray-500 text-sm truncate">{link.url}</p>
            </div>

            {/* Stats */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5">
              <FiEye className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">{link._count?.clicks || 0}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onToggle(link.id, !link.active)}
                className={`p-2 rounded-lg transition-colors ${
                  link.active 
                    ? 'text-green-400 hover:bg-green-500/10' 
                    : 'text-gray-500 hover:text-gray-400 hover:bg-white/5'
                }`}
              >
                <div className={`w-8 h-4 rounded-full transition-colors ${link.active ? 'bg-green-500/30' : 'bg-gray-700'} relative`}>
                  <div className={`absolute top-0.5 w-3 h-3 rounded-full transition-all ${link.active ? 'left-[18px] bg-green-400' : 'left-0.5 bg-gray-500'}`} />
                </div>
              </button>
              
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <FiEdit2 className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => onDelete(link.id)}
                className="p-2 text-gray-400 hover:text-red-400 rounded-lg hover:bg-red-500/10"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Mobile Mockup Preview
function MobilePreview({ user, links, theme }: { user: User, links: LinkType[], theme: string }) {
  const themeObj = themes.find(t => t.id === theme) || themes[0]
  const isLight = theme === 'minimal'
  const textColor = isLight ? 'text-gray-900' : 'text-white'
  const subTextColor = isLight ? 'text-gray-600' : 'text-white/70'
  const activeLinks = links.filter(l => l.active)

  return (
    <div className="relative">
      <div className="w-[280px] bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl shadow-black/50 mx-auto">
        <div 
          className={`relative overflow-hidden rounded-[2rem] ${themeObj.class}`}
          style={{ height: '560px' }}
        >
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-24 h-6 bg-black rounded-b-xl" />
          
          {/* Status Bar */}
          <div className={`absolute top-2 left-4 right-4 z-10 flex justify-between items-center text-xs font-semibold ${textColor}`}>
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5z" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="h-full overflow-y-auto scrollbar-hide pt-12 pb-6 px-4">
            {/* Profile */}
            <div className="text-center mb-6">
              <div className={`w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold ${isLight ? 'bg-white shadow-lg' : 'bg-white/20 backdrop-blur-md border-2 border-white/30'}`}>
                <span className={textColor}>{user.name?.[0] || user.username[0].toUpperCase()}</span>
              </div>
              <h1 className={`text-lg font-bold ${textColor} mb-1`}>{user.name || user.username}</h1>
              <p className={`text-sm ${subTextColor} mb-2`}>@{user.username}</p>
              {user.bio && (
                <p className={`text-xs ${subTextColor} max-w-[200px] mx-auto leading-relaxed`}>{user.bio}</p>
              )}
            </div>

            {/* Links */}
            <div className="space-y-2.5">
              {activeLinks.length === 0 ? (
                <div className={`text-center py-8 ${subTextColor} text-sm`}>No active links</div>
              ) : (
                activeLinks.map((link, i) => {
                  const Icon = link.icon ? iconMap[link.icon] : FaGlobe
                  return (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`w-full ${isLight ? 'bg-white/80' : 'bg-white/10'} backdrop-blur-md rounded-xl p-3 flex items-center gap-3`}
                    >
                      <div className={`w-10 h-10 rounded-full ${isLight ? 'bg-gray-100' : 'bg-white/20'} flex items-center justify-center flex-shrink-0`}>
                        {Icon && <Icon className={`w-5 h-5 ${textColor}`} />}
                      </div>
                      <span className={`flex-1 text-sm font-medium truncate ${textColor}`}>{link.title}</span>
                    </motion.div>
                  )
                })
              )}
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <span className={`text-[10px] ${subTextColor}`}>Powered by GitoLink</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-black/30 blur-xl rounded-full" />
    </div>
  )
}

type TabType = 'links' | 'appearance' | 'analytics'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [links, setLinks] = useState<LinkType[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('links')
  const [previewTheme, setPreviewTheme] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newLinkTitle, setNewLinkTitle] = useState('')
  const [newLinkUrl, setNewLinkUrl] = useState('')
  const [newLinkIcon, setNewLinkIcon] = useState('website')
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null)

  const displayTheme = hoveredTheme || previewTheme || user?.theme || 'cyberpunk'

  useEffect(() => {
    fetchUser()
    fetchLinks()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (!res.ok) {
        router.push('/login')
        return
      }
      const data = await res.json()
      setUser(data.user)
      setPreviewTheme(data.user.theme)
    } catch {
      router.push('/login')
    }
  }

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/links')
      if (res.ok) {
        const data = await res.json()
        setLinks(data.links)
      }
    } catch {
      toast.error('Failed to load links')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/me', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  const copyProfileUrl = () => {
    const url = `${window.location.origin}/${user?.username}`
    navigator.clipboard.writeText(url)
    toast.success('Profile URL copied!')
  }

  const handleAddLink = async () => {
    if (!newLinkTitle || !newLinkUrl) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newLinkTitle,
          url: newLinkUrl,
          icon: newLinkIcon,
        }),
      })

      if (res.ok) {
        toast.success('Link added!')
        setShowAddModal(false)
        setNewLinkTitle('')
        setNewLinkUrl('')
        fetchLinks()
      } else {
        throw new Error('Failed to add link')
      }
    } catch {
      toast.error('Failed to add link')
    }
  }

  const handleUpdateLink = async (link: LinkType) => {
    try {
      const res = await fetch(`/api/links/${link.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(link),
      })

      if (res.ok) {
        toast.success('Link updated!')
        fetchLinks()
      } else {
        throw new Error('Failed to update')
      }
    } catch {
      toast.error('Failed to update link')
    }
  }

  const handleDeleteLink = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return

    try {
      const res = await fetch(`/api/links/${id}`, { method: 'DELETE' })

      if (res.ok) {
        toast.success('Link deleted!')
        fetchLinks()
      } else {
        throw new Error('Failed to delete')
      }
    } catch {
      toast.error('Failed to delete link')
    }
  }

  const handleToggleLink = async (id: string, active: boolean) => {
    try {
      const res = await fetch(`/api/links/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active }),
      })

      if (res.ok) {
        fetchLinks()
      } else {
        throw new Error('Failed to toggle')
      }
    } catch {
      toast.error('Failed to toggle link')
    }
  }

  const handleThemeChange = async (themeId: string) => {
    setPreviewTheme(themeId)
    
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: themeId }),
      })

      if (res.ok) {
        setUser(prev => prev ? { ...prev, theme: themeId } : null)
        toast.success('Theme updated!')
      } else {
        throw new Error('Failed to update')
      }
    } catch {
      toast.error('Failed to update theme')
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = links.findIndex(l => l.id === active.id)
    const newIndex = links.findIndex(l => l.id === over.id)
    const newItems = arrayMove(links, oldIndex, newIndex)
    
    setLinks(newItems)

    try {
      await fetch('/api/links/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkIds: newItems.map(i => i.id) }),
      })
    } catch {
      toast.error('Failed to reorder')
      setLinks(links)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full"
        />
      </div>
    )
  }

  if (!user) return null

  const navItems = [
    { id: 'links' as TabType, label: 'My Links', icon: FiLink, count: links.length },
    { id: 'appearance' as TabType, label: 'Appearance', icon: FiImage },
    { id: 'analytics' as TabType, label: 'Analytics', icon: FiTrendingUp },
  ]

  const gradientThemes = themes.filter(t => t.id.startsWith('gradient') || 
    ['cyberpunk', 'matrix', 'sunset', 'tropical', 'desert', 'corporate', 'aurora', 
     'cotton-candy', 'retro', 'forest', 'ocean', 'lavender', 'gold', 'rose-gold', 'midnight', 'executive'].includes(t.id))
  const solidThemes = themes.filter(t => ['minimal', 'white'].includes(t.id))
  const specialThemes = themes.filter(t => ['glass', 'rainbow'].includes(t.id))

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-black/50 border-b border-white/5"
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <FiLink className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold">
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Gito</span>
                <span className="text-white">Link</span>
              </span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={copyProfileUrl}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 transition-colors"
              >
                <FiCopy className="w-4 h-4" />
                <span className="text-sm">Copy URL</span>
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={`/${user.username}`}
                target="_blank"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 transition-colors"
              >
                <FiExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">View Profile</span>
              </motion.a>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <FiLogOut className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Layout */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-[280px_1fr_380px] gap-6">
          {/* Sidebar */}
          <motion.aside 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {/* Profile Card */}
            <div className="glass-card rounded-2xl p-6">
              <div className="text-center">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-blue-500/25"
                >
                  {user.name?.[0] || user.username[0].toUpperCase()}
                </motion.div>
                
                <h2 className="text-xl font-semibold text-white mb-1">{user.name || user.username}</h2>
                <p className="text-gray-400 text-sm">@{user.username}</p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{links.length}</p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Links</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">
                    {links.reduce((acc, link) => acc + (link._count?.clicks || 0), 0)}
                  </p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Clicks</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    whileHover={{ x: 2 }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-600/25'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                    {'count' in item && (
                      <span className={`ml-auto px-2 py-0.5 rounded-full text-xs ${
                        activeTab === item.id ? 'bg-white/20' : 'bg-white/5'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </motion.button>
                )
              })}
            </nav>

            {/* Profile URL */}
            <div className="glass-card rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-2">Your profile URL</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs text-gray-300 truncate">
                  {typeof window !== 'undefined' ? `${window.location.origin}/${user.username}` : ''}
                </code>
                <button
                  onClick={copyProfileUrl}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <FiCopy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.aside>

          {/* Main Content */}
          <motion.main 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="min-h-[600px]"
          >
            <AnimatePresence mode="wait">
              {activeTab === 'links' && (
                <motion.div
                  key="links"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-white">My Links</h1>
                      <p className="text-gray-400 text-sm">Manage and organize your links</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowAddModal(true)}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-600/25 hover:from-blue-500 hover:to-purple-500 transition-all"
                    >
                      <FiPlus className="w-5 h-5" />
                      Add Link
                    </motion.button>
                  </div>

                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={links.map(l => l.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <AnimatePresence>
                        {links.length === 0 ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card rounded-2xl p-12 text-center"
                          >
                            <motion.div 
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center"
                            >
                              <FiLink className="w-8 h-8 text-blue-400" />
                            </motion.div>
                            <p className="text-gray-300 mb-2">No links yet</p>
                            <p className="text-sm text-gray-500 mb-6">Add your first link to get started</p>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setShowAddModal(true)}
                              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-medium hover:from-blue-500 hover:to-purple-500 transition-all"
                            >
                              <FiPlus className="w-5 h-5" />
                              Add Your First Link
                            </motion.button>
                          </motion.div>
                        ) : (
                          <div className="space-y-3">
                            {links.map((link) => (
                              <SortableLinkItem
                                key={link.id}
                                link={link}
                                onUpdate={handleUpdateLink}
                                onDelete={handleDeleteLink}
                                onToggle={handleToggleLink}
                              />
                            ))}
                          </div>
                        )}
                      </AnimatePresence>
                    </SortableContext>
                  </DndContext>
                </motion.div>
              )}

              {activeTab === 'appearance' && (
                <motion.div
                  key="appearance"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div>
                    <h1 className="text-2xl font-bold text-white">Appearance</h1>
                    <p className="text-gray-400 text-sm">Customize your profile theme and settings</p>
                  </div>

                  {/* Profile Settings */}
                  <div className="glass-card rounded-2xl p-6 space-y-6">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <FiUser className="w-5 h-5 text-blue-400" />
                      Profile Information
                    </h3>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Display Name</label>
                        <input
                          type="text"
                          defaultValue={user.name || ''}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                        <div className="flex items-center px-4 py-3 bg-gray-800/30 border border-gray-700 rounded-xl text-gray-500">
                          <span>@{user.username}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Bio</label>
                      <textarea
                        defaultValue={user.bio || ''}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-2.5 rounded-xl font-medium transition-all"
                      onClick={() => toast.success('Profile settings saved!')}
                    >
                      Save Changes
                    </motion.button>
                  </div>

                  {/* Theme Selector */}
                  <div className="glass-card rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                      <FiImage className="w-5 h-5 text-purple-400" />
                      Choose Theme
                    </h3>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-3">Gradient Themes</h4>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                          {gradientThemes.map((theme) => (
                            <motion.button
                              key={theme.id}
                              onClick={() => handleThemeChange(theme.id)}
                              onMouseEnter={() => setHoveredTheme(theme.id)}
                              onMouseLeave={() => setHoveredTheme(null)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`relative h-16 rounded-xl overflow-hidden transition-all ${
                                displayTheme === theme.id
                                  ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-[#0a0a0f]'
                                  : ''
                              }`}
                            >
                              <div className={`absolute inset-0 ${theme.class}`} />
                              <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white drop-shadow-md">
                                {theme.name}
                              </span>
                              
                              {displayTheme === theme.id && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                                >
                                  <FiCheck className="w-3 h-3 text-white" />
                                </motion.div>
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-3">Solid Themes</h4>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                          {solidThemes.map((theme) => (
                            <motion.button
                              key={theme.id}
                              onClick={() => handleThemeChange(theme.id)}
                              onMouseEnter={() => setHoveredTheme(theme.id)}
                              onMouseLeave={() => setHoveredTheme(null)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`relative h-16 rounded-xl overflow-hidden transition-all ${
                                displayTheme === theme.id
                                  ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-[#0a0a0f]'
                                  : ''
                              }`}
                            >
                              <div className={`absolute inset-0 ${theme.class}`} />
                              <span className={`absolute inset-0 flex items-center justify-center text-xs font-medium drop-shadow-md ${theme.id === 'minimal' ? 'text-gray-900' : 'text-white'}`}>
                                {theme.name}
                              </span>
                              
                              {displayTheme === theme.id && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                                >
                                  <FiCheck className="w-3 h-3 text-white" />
                                </motion.div>
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'analytics' && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white">Analytics</h1>
                    <p className="text-gray-400 text-sm">Track your link performance</p>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4 mb-6">
                    {[
                      { label: 'Total Clicks', value: links.reduce((acc, l) => acc + (l._count?.clicks || 0), 0), icon: FiTrendingUp, color: 'from-blue-500 to-cyan-500' },
                      { label: 'Active Links', value: links.filter(l => l.active).length, icon: FiLink, color: 'from-purple-500 to-pink-500' },
                      { label: 'Total Links', value: links.length, icon: FiLayers, color: 'from-orange-500 to-red-500' },
                    ].map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card rounded-2xl p-6"
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                        <p className="text-gray-400 text-sm">{stat.label}</p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="glass-card rounded-2xl p-8 text-center">
                    <FiBarChart2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-300 mb-2">Detailed analytics coming soon</p>
                    <p className="text-gray-500 text-sm">We&apos;re working on bringing you comprehensive analytics insights</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.main>

          {/* Live Preview Panel */}
          <motion.aside 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="sticky top-24">
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <FiSmartphone className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-medium">Live Preview</span>
                  </div>
                  <motion.div
                    key={displayTheme}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-gray-400"
                  >
                    {themes.find(t => t.id === displayTheme)?.name}
                  </motion.div>
                </div>

                <motion.div
                  key={displayTheme}
                  initial={{ opacity: 0.8, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <MobilePreview 
                    user={user} 
                    links={links} 
                    theme={displayTheme} 
                  />
                </motion.div>
              </div>
            </div>
          </motion.aside>
        </div>
      </div>

      {/* Add Link Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card rounded-2xl p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-bold text-white mb-6">Add New Link</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Title</label>
                  <input
                    type="text"
                    value={newLinkTitle}
                    onChange={(e) => setNewLinkTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all"
                    placeholder="My Website"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">URL</label>
                  <input
                    type="url"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Icon</label>
                  <div className="grid grid-cols-6 gap-2">
                    {Object.keys(iconMap).slice(0, 12).map((iconKey) => {
                      const Icon = iconMap[iconKey]
                      return (
                        <button
                          key={iconKey}
                          onClick={() => setNewLinkIcon(iconKey)}
                          className={`p-3 rounded-xl transition-all ${
                            newLinkIcon === iconKey
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700'
                          }`}
                        >
                          <Icon className="w-5 h-5 mx-auto" />
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddLink}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:from-blue-500 hover:to-purple-500 transition-all"
                  >
                    Add Link
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
