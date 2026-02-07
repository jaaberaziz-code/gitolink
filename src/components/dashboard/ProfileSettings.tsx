'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { themes, getThemeClass } from '@/lib/utils'
import type { User } from '@/types'

interface ProfileSettingsProps {
  user: User
  onUpdate: () => void
}

export default function ProfileSettings({ user, onUpdate }: ProfileSettingsProps) {
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name || '',
    bio: user.bio || '',
    theme: user.theme,
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        toast.success('Profile updated!')
        onUpdate()
      } else {
        throw new Error('Failed to update')
      }
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="glass-dark rounded-xl p-6 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Display Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="John Doe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Bio
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Tell us about yourself..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-4">
          Theme
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setFormData({ ...formData, theme: theme.id })}
              className={`relative h-20 rounded-lg overflow-hidden transition-all ${
                formData.theme === theme.id
                  ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900'
                  : 'hover:opacity-80'
              }`}
            >
              <div className={`absolute inset-0 ${theme.class}`} />
              <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white drop-shadow-lg">
                {theme.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-white/10">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
