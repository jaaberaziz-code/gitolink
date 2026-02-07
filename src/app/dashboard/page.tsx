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
  FiSettings,
  FiLink,
  FiGrid,
  FiTrendingUp,
  FiUser,
  FiSparkles,
} from 'react-icons/fi'
import type { User, Link as LinkType } from '@/types'
import ThemePreview from '@/components/dashboard/ThemePreview'
import LinkEditor from '@/components/dashboard/LinkEditor'
import AddLinkModal from '@/components/dashboard/AddLinkModal'
import AnalyticsOverview from '@/components/dashboard/AnalyticsOverview'
import MobileMockup from '@/components/dashboard/MobileMockup'
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

// Sortable Link Item wrapper
function SortableLinkItem({ 
  link, 
  onUpdate 
}: { 
  link: LinkType
  onUpdate: () => void 
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
  }

  return (
    <div ref={setNodeRef} style={style}>
      <LinkEditor
        link={link}
        onUpdate={onUpdate}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
      />
    </div>
  )
}

type TabType = 'links' | 'analytics' | 'appearance'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [links, setLinks] = useState<LinkType[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('links')
  const [showAddModal, setShowAddModal] = useState(false)
  const [previewTheme, setPreviewTheme] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

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

  const handleThemeChange = async (themeId: string) => {
    setPreviewTheme(themeId)
    setSaving(true)
    
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
      setPreviewTheme(user?.theme || null)
    } finally {
      setSaving(false)
    }
  }

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = links.findIndex((item) => item.id === active.id)
      const newIndex = links.findIndex((item) => item.id === over.id)
      const newItems = arrayMove(links, oldIndex, newIndex)
      setLinks(newItems)

      // Save new order
      try {
        await fetch(`/api/links/${active.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ linkIds: newItems.map((i) => i.id) }),
        })
      } catch {
        toast.error('Failed to reorder links')
        setLinks(links)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full"
        />
      </div>
    )
  }

  if (!user) return null

  const profileUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${user.username}`

  const navItems: { id: TabType; label: string; icon: React.ElementType }[] = [
    { id: 'links', label: 'My Links', icon: FiGrid },
    { id: 'appearance', label: 'Appearance', icon: FiSparkles },
    { id: 'analytics', label: 'Analytics', icon: FiTrendingUp },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      {/* Glass Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-gray-900/80 border-b border-white/5"
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="text-2xl font-bold"
              >
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Gito</span>
                <span className="text-white">Link</span>
              </motion.div>
            </Link>

            {/* Header Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={copyProfileUrl}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
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

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-[280px_1fr_340px] gap-6">
          {/* Sidebar */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 space-y-4"
            >
              {/* Profile Card */}
              <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
              >
                <div className="text-center"
                >
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-blue-500/25"
                  >
                    {user.name?.[0] || user.username[0].toUpperCase()}
                  </motion.div>
                  <h2 className="text-xl font-semibold text-white mb-1">{user.name || user.username}</h2>
                  <p className="text-gray-400 text-sm">@{user.username}</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10"
                >
                  <div className="text-center"
                  >
                    <p className="text-2xl font-bold text-white">{links.length}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Links</p>
                  </div>
                  <div className="text-center"
                  >
                    <p className="text-2xl font-bold text-white"
                    >
                      {links.reduce((acc, link) => acc + (link._count?.clicks || 0), 0)}
                    </p>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Clicks</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1"
              >
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      whileHover={{ x: 2 }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        activeTab === item.id
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                      {item.id === 'links' && (
                        <span className={`ml-auto px-2 py-0.5 rounded-full text-xs ${
                          activeTab === item.id ? 'bg-white/20' : 'bg-white/5'
                        }`}
                        >
                          {links.length}
                        </span>
                      )}
                    </motion.button>
                  )
                })}
              </nav>

              {/* Profile URL */}
              <div className="backdrop-blur-xl bg-white/5 rounded-xl p-4 border border-white/10"
              >
                <p className="text-xs text-gray-500 mb-2">Your profile URL</p>
                <div className="flex items-center gap-2"
                >
                  <code className="flex-1 text-xs text-gray-300 truncate"
                  >
                    {profileUrl}
                  </code>
                  <button
                    onClick={copyProfileUrl}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <FiCopy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 min-h-[600px]"
          >
            <AnimatePresence mode="wait">
              {activeTab === 'links' && (
                <motion.div
                  key="links"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between"
                  >
                    <div>
                      <h1 className="text-2xl font-bold text-white">My Links</h1>
                      <p className="text-gray-400 text-sm">Manage and organize your links</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowAddModal(true)}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl font-medium shadow-lg shadow-blue-600/25 transition-colors"
                    >
                      <FiPlus className="w-5 h-5" />
                      Add Link
                    </motion.button>
                  </div>

                  {/* Links List */}
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={links.map((l) => l.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <AnimatePresence>
                        {links.length === 0 ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="backdrop-blur-xl bg-white/5 rounded-2xl p-12 border border-white/10 text-center"
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
                              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
                            >
                              <FiPlus className="w-5 h-5" />
                              Add Your First Link
                            </motion.button>
                          </motion.div>
                        ) : (
                          <div className="space-y-3"
                          >
                            {links.map((link) => (
                              <SortableLinkItem
                                key={link.id}
                                link={link}
                                onUpdate={fetchLinks}
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
                    <p className="text-gray-400 text-sm">Customize your profile theme</p>
                  </div>

                  {/* Profile Settings Form */}
                  <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10 space-y-6"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                      <input
                        type="text"
                        defaultValue={user.name || ''}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                      <textarea
                        defaultValue={user.bio || ''}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-medium transition-colors"
                    
                      onClick={() => toast.success('Profile settings saved!')}
                    >
                      Save Changes
                    </motion.button>
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
                  <div className="mb-6"
                  >
                    <h1 className="text-2xl font-bold text-white">Analytics</h1>
                    <p className="text-gray-400 text-sm">Track your link performance</p>
                  </div>
                  <AnalyticsOverview />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Live Preview Panel */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="hidden lg:block lg:col-span-1"
          >
            <div className="sticky top-24"
            >
              <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 border border-white/10"
              >
                <ThemePreview
                  user={user}
                  links={links}
                  currentTheme={previewTheme || user.theme}
                  onThemeChange={handleThemeChange}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {showAddModal && (
        <AddLinkModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false)
            fetchLinks()
          }}
        />
      )}
    </div>
  )
}
