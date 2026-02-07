'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCamera, FiX, FiLoader } from 'react-icons/fi'
import { uploadAvatar } from '@/lib/supabase'
import Image from 'next/image'
import toast from 'react-hot-toast'

interface ProfileImageUploadProps {
  currentAvatar?: string | null
  userId: string
  onUpload: (url: string) => void
  name: string
}

export function ProfileImageUpload({ 
  currentAvatar, 
  userId, 
  onUpload,
  name 
}: ProfileImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null)
  const [uploading, setUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await processFile(file)
  }

  const processFile = async (file: File) => {
    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
      toast.error('Please upload a valid image file (JPG, PNG, WebP, or GIF)')
      return
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be less than 2MB')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to Supabase
    setUploading(true)
    const { url, error } = await uploadAvatar(file, userId)
    setUploading(false)

    if (error) {
      toast.error(error)
      return
    }

    onUpload(url)
    toast.success('Avatar updated!')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const clearImage = () => {
    setPreview(null)
    onUpload('')
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const initials = name?.[0]?.toUpperCase() || '?'

  return (
    <div className="flex flex-col items-center">
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative"
      >
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            w-28 h-28 rounded-full cursor-pointer overflow-hidden
            flex items-center justify-center
            transition-all duration-300
            ${isDragging 
              ? 'ring-4 ring-blue-500 ring-offset-4 ring-offset-[#0a0a0f] bg-blue-500/20' 
              : 'ring-2 ring-white/20 hover:ring-white/40'
            }
            ${preview 
              ? '' 
              : 'bg-gradient-to-br from-blue-500 to-purple-600'
            }
          `}
        >
          {preview ? (
            <Image
              src={preview}
              alt="Avatar preview"
              width={112}
              height={112}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-4xl font-bold text-white">{initials}</span>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <FiCamera className="w-8 h-8 text-white" />
          </div>

          {/* Uploading indicator */}
          {uploading && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <FiLoader className="w-8 h-8 text-white" />
              </motion.div>
            </div>
          )}
        </div>

        {/* Remove button */}
        <AnimatePresence>
          {preview && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={(e) => {
                e.stopPropagation()
                clearImage()
              }}
              className="absolute -top-1 -right-1 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg"
            >
              <FiX className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      <p className="mt-3 text-sm text-gray-400 text-center">
        Click or drag to upload
        <br />
        <span className="text-xs">JPG, PNG, WebP, GIF (max 2MB)</span>
      </p>
    </div>
  )
}