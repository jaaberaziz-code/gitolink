'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

// SVG Icons
const Icons = {
  x: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  image: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  loader: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 animate-spin">
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
    </svg>
  ),
  chevronDown: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  chevronUp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  )
}

interface AddLinkModalProps {
  onClose: () => void
  onSuccess: () => void
  onAdd?: (formData: { title: string; url: string; icon?: string }) => Promise<void>
}

export default function AddLinkModal({ onClose, onSuccess, onAdd }: AddLinkModalProps) {
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
      if (onAdd) {
        await onAdd({
          title: formData.title,
          url: formData.url,
          icon: formData.icon || undefined,
        })
      } else {
        const payload: any = {
          title: formData.title,
          url: formData.url,
          icon: formData.icon || undefined,
        }

        if (formData.scheduledAt) {
          payload.scheduledAt = new Date(formData.scheduledAt).toISOString()
        }

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
      }

      toast.success('Link added!')
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
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-[#0a0a0a] border border-gray-800 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold">ADD NEW LINK</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            {Icons.x}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-black border-b-2 border-gray-800 py-3 text-white placeholder-gray-600 focus:border-[#00FF41] focus:outline-none"
              placeholder="My Website"
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">
              URL *
            </label>
            <div className="relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-600">
                {Icons.link}
              </div>
              <input
                type="url"
                required
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full pl-8 bg-black border-b-2 border-gray-800 py-3 text-white placeholder-gray-600 focus:border-[#00FF41] focus:outline-none"
                placeholder="https://example.com"
              />
            </div>
          </div>

          {/* Icon Select */}
          <div>
            <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">
              Icon (optional)
            </label>
            <div className="relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-600">
                {Icons.image}
              </div>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full pl-8 bg-black border-b-2 border-gray-800 py-3 text-white focus:border-[#00FF41] focus:outline-none appearance-none cursor-pointer"
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
              <div className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none">
                {Icons.chevronDown}
              </div>
            </div>
          </div>

          {/* Scheduling Toggle */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowScheduling(!showScheduling)}
              className="flex items-center gap-2 text-[#00FF41] hover:text-[#00CC33] transition-colors text-sm font-mono"
            >
              {Icons.calendar}
              {showScheduling ? 'Hide scheduling' : 'Add scheduling & expiration'}
              <span className="ml-1">{showScheduling ? Icons.chevronUp : Icons.chevronDown}</span>
            </button>
          </div>

          {/* Scheduling Options */}
          {showScheduling && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-4 p-4 bg-black border border-gray-800"
            >
              <div>
                <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider flex items-center gap-2">
                  {Icons.clock}
                  Schedule Publication
                </label>
                <p className="text-xs text-gray-600 mb-2 font-mono">Link will be hidden until this date</p>
                <input
                  type="datetime-local"
                  value={formData.scheduledAt}
                  min={minDateTime}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                  className="w-full bg-black border border-gray-800 px-3 py-2 text-white focus:border-[#00FF41] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider flex items-center gap-2">
                  {Icons.calendar}
                  Expiration Date
                </label>
                <p className="text-xs text-gray-600 mb-2 font-mono">Link will be hidden after this date</p>
                <input
                  type="datetime-local"
                  value={formData.expiresAt}
                  min={formData.scheduledAt || minDateTime}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  className="w-full bg-black border border-gray-800 px-3 py-2 text-white focus:border-[#00FF41] focus:outline-none"
                />
              </div>
            </motion.div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-4 font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                {Icons.loader}
                ADDING...
              </>
            ) : (
              'ADD LINK'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
