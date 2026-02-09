'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { FiX, FiCalendar, FiClock, FiLink2, FiImage } from 'react-icons/fi'

interface AddLinkModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function AddLinkModal({ onClose, onSuccess }: AddLinkModalProps) {
  const [loading, setLoading] = useState(false)
  const [showScheduling, setShowScheduling] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    icon: '',
    scheduledAt: '',
    expiresAt: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload: any = {
        title: formData.title,
        url: formData.url,
        icon: formData.icon || undefined,
      }

      // Add scheduling if set
      if (formData.scheduledAt) {
        payload.scheduledAt = new Date(formData.scheduledAt).toISOString()
      }

      // Add expiration if set
      if (formData.expiresAt) {
        payload.expiresAt = new Date(formData.expiresAt).toISOString()
      }

      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to add link')
      }

      toast.success('Link added successfully!')
      onSuccess()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add link')
    } finally {
      setLoading(false)
    }
  }

  const formatDateTimeLocal = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  const now = new Date()
  const minDateTime = formatDateTimeLocal(now)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-dark rounded-xl p-6 w-full max-w-md animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Add New Link</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
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
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="My Website"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              URL *
            </label>
            <div className="relative">
              <FiLink2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="url"
                required
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Icon (optional)
            </label>
            <div className="relative">
              <FiImage className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
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
          </div>

          {/* Scheduling Toggle */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowScheduling(!showScheduling)}
              className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm"
            >
              <FiCalendar className="w-4 h-4" />
              {showScheduling ? 'Hide scheduling options' : 'Add scheduling & expiration'}
            </button>
          </div>

          {/* Scheduling Options */}
          {showScheduling && (
            <div className="space-y-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
                  <FiClock className="w-4 h-4" />
                  Schedule Publication
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Link will be hidden until this date
                </p>
                <input
                  type="datetime-local"
                  value={formData.scheduledAt}
                  min={minDateTime}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
                  <FiCalendar className="w-4 h-4" />
                  Expiration Date
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Link will be hidden after this date
                </p>
                <input
                  type="datetime-local"
                  value={formData.expiresAt}
                  min={formData.scheduledAt || minDateTime}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
