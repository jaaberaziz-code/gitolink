'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiUser, FiCamera, FiX, FiUpload } from 'react-icons/fi'
import Image from 'next/image'

interface ProfileSetupProps {
  data: {
    name: string
    bio: string
    avatar: string | null
  }
  onChange: (data: { name: string; bio: string; avatar: string | null }) => void
}

export function ProfileSetup({ data, onChange }: ProfileSetupProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    if (!file.type.startsWith('image/')) {
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 100)

      // Upload to API
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload/avatar', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!res.ok) {
        throw new Error('Upload failed')
      }

      const result = await res.json()
      onChange({ ...data, avatar: result.url })
    } catch (error) {
      console.error('Upload error:', error)
    } finally {
      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
      }, 500)
    }
  }

  const handleRemoveAvatar = () => {
    onChange({ ...data, avatar: null })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-bold text-white"
        >
          Set up your profile
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 text-lg"
        >
          Tell visitors who you are
        </motion.p>
      </div>

      {/* Avatar Upload */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col items-center"
      >
        <div className="relative">
          {/* Avatar Circle */}
          <button
            onClick={handleAvatarClick}
            disabled={isUploading}
            className={`
              relative w-32 h-32 rounded-full overflow-hidden
              transition-all duration-300 group
              ${data.avatar 
                ? 'ring-4 ring-blue-500/30' 
                : 'ring-4 ring-dashed ring-gray-600 hover:ring-blue-500/50'
              }
              ${isUploading ? 'cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {data.avatar ? (
              <Image
                src={data.avatar}
                alt="Profile"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <FiUser className="w-12 h-12 text-gray-500" />
              </div>
            )}

            {/* Hover Overlay */}
            {!isUploading && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <FiCamera className="w-8 h-8 text-white mb-1" />
                <span className="text-white text-xs">{data.avatar ? 'Change' : 'Upload'}</span>
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                <div className="w-20 h-1 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <span className="text-white text-xs mt-2">{uploadProgress}%</span>
              </div>
            )}
          </button>

          {/* Remove Button */}
          {data.avatar && !isUploading && (
            <button
              onClick={handleRemoveAvatar}
              className="absolute -top-1 -right-1 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg transition-colors"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <p className="mt-3 text-gray-500 text-sm">
          Click to upload a photo
        </p>
      </motion.div>

      {/* Form Fields */}
      <div className="space-y-5">
        {/* Name Field */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Display Name *
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange({ ...data, name: e.target.value })}
            placeholder="Your name or brand"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            maxLength={50}
          />
          <div className="flex justify-between mt-1">
            <span className="text-gray-500 text-xs">This will be shown on your profile</span>
            <span className="text-gray-500 text-xs">{data.name.length}/50</span>
          </div>
        </motion.div>

        {/* Bio Field */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Bio
          </label>
          <textarea
            value={data.bio}
            onChange={(e) => onChange({ ...data, bio: e.target.value })}
            placeholder="Tell people about yourself..."
            rows={4}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            maxLength={160}
          />
          <div className="flex justify-between mt-1">
            <span className="text-gray-500 text-xs">Brief description for your profile</span>
            <span className={`text-xs ${data.bio.length > 140 ? 'text-yellow-500' : 'text-gray-500'}`}>
              {data.bio.length}/160
            </span>
          </div>
        </motion.div>
      </div>

      {/* Preview Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-800/50 rounded-xl p-4 border border-gray-700"
      >
        <h4 className="text-sm font-medium text-gray-400 mb-3">Preview</h4>
        <div className="flex items-center gap-4">
          <div className={`
            w-12 h-12 rounded-full overflow-hidden flex-shrink-0
            ${data.avatar ? '' : 'bg-gray-700 flex items-center justify-center'}
          `}>
            {data.avatar ? (
              <Image src={data.avatar} alt="" width={48} height={48} className="object-cover w-full h-full" />
            ) : (
              <FiUser className="w-6 h-6 text-gray-500" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-white font-medium truncate">
              {data.name || 'Your Name'}
            </p>
            <p className="text-gray-500 text-sm truncate">
              {data.bio || 'Your bio will appear here...'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
