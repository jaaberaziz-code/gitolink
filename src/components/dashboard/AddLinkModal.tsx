'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { FiX, FiLoader } from 'react-icons/fi'

interface AddLinkModalProps {
  onClose: () => void
  onSuccess: () => void
  onAdd: (data: { title: string; url: string; icon?: string }) => Promise<void>
}

export default function AddLinkModal({ onClose, onAdd }: AddLinkModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    icon: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate URL
    let url = formData.url.trim()
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`
    }

    setLoading(true)

    try {
      await onAdd({
        title: formData.title.trim(),
        url,
        icon: formData.icon || undefined,
      })
      // Modal is closed by parent on success
    } catch (error) {
      // Error is handled by parent
      console.error('Add link error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-dark rounded-xl p-6 w-full max-w-md animate-slide-up relative"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Add New Link</h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              disabled={loading}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="My Website"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              URL *
            </label>
            <input
              type="text"
              required
              disabled={loading}
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              placeholder="https://example.com"
            />
            <p className="text-xs text-gray-500 mt-1">We'll add https:// if you don't include it</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Icon (optional)
            </label>
            <select
              value={formData.icon}
              disabled={loading}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">No icon</option>
              <option value="website">Website</option>
              <option value="twitter">Twitter/X</option>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="github">GitHub</option>
              <option value="linkedin">LinkedIn</option>
              <option value="facebook">Facebook</option>
              <option value="tiktok">TikTok</option>
              <option value="twitch">Twitch</option>
              <option value="discord">Discord</option>
              <option value="spotify">Spotify</option>
              <option value="email">Email</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || !formData.title.trim() || !formData.url.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <FiLoader className="w-5 h-5 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Link'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
