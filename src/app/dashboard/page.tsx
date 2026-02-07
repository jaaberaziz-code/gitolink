'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import {
  FiPlus,
  FiLogOut,
  FiExternalLink,
  FiCopy,
  FiBarChart2,
  FiSettings,
  FiUser,
  FiLink,
} from 'react-icons/fi'
import type { User, Link as LinkType } from '@/types'
import LinkList from '@/components/dashboard/LinkList'
import AddLinkModal from '@/components/dashboard/AddLinkModal'
import AnalyticsOverview from '@/components/dashboard/AnalyticsOverview'
import ProfileSettings from '@/components/dashboard/ProfileSettings'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [links, setLinks] = useState<LinkType[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'links' | 'analytics' | 'settings'>('links')
  const [showAddModal, setShowAddModal] = useState(false)

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!user) return null

  const profileUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/${user.username}`

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="glass-dark sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-white">
              <span className="text-blue-400">Gito</span>Link
            </Link>

            <div className="flex items-center gap-4">
              <button
                onClick={copyProfileUrl}
                className="hidden sm:flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <FiCopy className="w-4 h-4" />
                Copy URL
              </button>

              <a
                href={`/${user.username}`}
                target="_blank"
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <FiExternalLink className="w-4 h-4" />
                View Profile
              </a>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-300 hover:text-red-400 transition-colors"
              >
                <FiLogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-dark rounded-xl p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 mx-auto mb-4 flex items-center justify-center text-2xl font-bold">
                  {user.name?.[0] || user.username[0].toUpperCase()}
                </div>
                <h2 className="text-xl font-semibold text-white">{user.name || user.username}</h2>
                <p className="text-gray-400 text-sm">@{user.username}</p>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('links')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'links'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <FiLink className="w-5 h-5" />
                  My Links
                  <span className="ml-auto bg-white/20 px-2 py-0.5 rounded text-sm">
                    {links.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'analytics'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <FiBarChart2 className="w-5 h-5" />
                  Analytics
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <FiSettings className="w-5 h-5" />
                  Settings
                </button>
              </nav>

              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs text-gray-500 mb-2">Your profile URL:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-gray-800 px-3 py-2 rounded text-sm text-gray-300 truncate">
                    {profileUrl}
                  </code>
                  <button
                    onClick={copyProfileUrl}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <FiCopy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'links' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-white">My Links</h1>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <FiPlus className="w-5 h-5" />
                    Add Link
                  </button>
                </div>

                <LinkList
                  links={links}
                  onUpdate={fetchLinks}
                />
              </>
            )}

            {activeTab === 'analytics' && (
              <>
                <h1 className="text-2xl font-bold text-white mb-6">Analytics</h1>
                <AnalyticsOverview />
              </>
            )}

            {activeTab === 'settings' && (
              <>
                <h1 className="text-2xl font-bold text-white mb-6">Profile Settings</h1>
                <ProfileSettings user={user} onUpdate={fetchUser} />
              </>
            )}
          </div>
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
