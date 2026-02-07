'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiExternalLink,
  FiCheck,
  FiX,
  FiLink,
  FiCopy,
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import type { Link } from '@/types'

interface LinkEditorProps {
  link: Link
  onUpdate: () => void
  dragHandleProps?: any
  isDragging?: boolean
}

export default function LinkEditor({ 
  link, 
  onUpdate, 
  dragHandleProps,
  isDragging 
}: LinkEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [editData, setEditData] = useState({
    title: link.title,
    url: link.url,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    if (!editData.title.trim() || !editData.url.trim()) {
      toast.error('Title and URL are required')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`/api/links/${link.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      })

      if (res.ok) {
        setIsEditing(false)
        onUpdate()
        toast.success('Link updated')
      } else {
        throw new Error('Failed to update')
      }
    } catch {
      toast.error('Failed to update link')
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleActive = async () => {
    try {
      const res = await fetch(`/api/links/${link.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !link.active }),
      })

      if (res.ok) {
        onUpdate()
        toast.success(link.active ? 'Link hidden' : 'Link visible')
      }
    } catch {
      toast.error('Failed to update link')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this link?')) return

    try {
      const res = await fetch(`/api/links/${link.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        onUpdate()
        toast.success('Link deleted')
      }
    } catch {
      toast.error('Failed to delete link')
    }
  }

  const copyUrl = () => {
    navigator.clipboard.writeText(link.url)
    toast.success('URL copied!')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleSave()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
      setEditData({ title: link.title, url: link.url })
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: isDragging ? 0.5 : 1, 
        y: 0,
        scale: isDragging ? 1.02 : 1
      }}
      exit={{ opacity: 0, x: -20 }}
      whileHover={{ scale: isEditing ? 1 : 1.01 }}
      className={`group relative ${
        !link.active ? 'opacity-60' : ''
      }`}
    >
      <div className={`
        glass-dark rounded-xl overflow-hidden
        border border-white/10
        transition-all duration-200
        ${isEditing ? 'ring-2 ring-blue-500/50' : 'hover:border-white/20'}
        ${isDragging ? 'shadow-2xl shadow-blue-500/20' : 'hover:shadow-lg hover:shadow-black/20'}
      `}>
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              key="editing"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 space-y-3"
              onKeyDown={handleKeyDown}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-blue-500/20 rounded-lg">
                  <FiEdit2 className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-sm font-medium text-blue-400">Editing Link</span>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Title</label>
                <input
                  type="text"
                  value={editData.title}
                  onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-800/80 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  placeholder="Link title"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5">URL</label>
                <div className="relative">
                  <FiLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="url"
                    value={editData.url}
                    onChange={(e) => setEditData({ ...editData, url: e.target.value })}
                    className="w-full pl-10 pr-3 py-2.5 bg-gray-800/80 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  <FiCheck className="w-4 h-4" />
                  {isLoading ? 'Saving...' : 'Save'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsEditing(false)
                    setEditData({ title: link.title, url: link.url })
                  }}
                  disabled={isLoading}
                  className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  <FiX className="w-4 h-4" />
                  Cancel
                </motion.button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Press <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">⌘ Enter</kbd> to save, <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">Esc</kbd> to cancel
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 flex items-center gap-3"
            >
              {/* Drag Handle */}
              <button
                {...dragHandleProps}
                className="text-gray-500 hover:text-gray-300 cursor-grab active:cursor-grabbing p-1 hover:bg-white/5 rounded transition-colors"
              >
                <FiMoreVertical className="w-5 h-5" />
              </button>

              {/* Link Info */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex-1 min-w-0 text-left group/link"
              >
                <h3 className="text-white font-medium truncate group-hover/link:text-blue-400 transition-colors">
                  {link.title}
                </h3>
                <p className="text-gray-500 text-sm truncate">{link.url}</p>
              </button>

              {/* Stats */}
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-white font-medium text-sm">
                  {link._count?.clicks || 0}
                </span>
                <span className="text-gray-500 text-xs">clicks</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={copyUrl}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Copy URL"
                >
                  <FiCopy className="w-4 h-4" />
                </motion.button>

                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Open Link"
                >
                  <FiExternalLink className="w-4 h-4" />
                </a>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                  title="Edit"
                >
                  <FiEdit2 className="w-4 h-4" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleToggleActive}
                  className={`p-2 rounded-lg transition-colors ${
                    link.active 
                      ? 'text-gray-400 hover:text-white hover:bg-white/10' 
                      : 'text-gray-500 hover:text-green-400 hover:bg-green-500/10'
                  }`}
                  title={link.active ? 'Hide Link' : 'Show Link'}
                >
                  {link.active ? (
                    <FiEye className="w-4 h-4" />
                  ) : (
                    <FiEyeOff className="w-4 h-4" />
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleDelete}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Delete"
                >
                  <FiTrash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
