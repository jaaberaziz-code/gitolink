'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FiCamera, FiUser, FiImage, FiCheck } from 'react-icons/fi'
import { ImageUpload } from '@/components/upload/ImageUpload'
import { ImageCrop } from '@/components/upload/ImageCrop'
import { BackgroundCustomizer } from './BackgroundCustomizer'
import Image from 'next/image'
import toast from 'react-hot-toast'

type ImageType = 'avatar' | 'background'

interface UserInfo {
  id: string
  username: string
  name?: string | null
  avatar_url?: string | null
  background_type: 'gradient' | 'solid' | 'image'
  background_value: string
}

interface DesignTabProps {
  user: UserInfo
  onUserUpdate: (updates: Partial<UserInfo>) => void
}

export function DesignTab({ user, onUserUpdate }: DesignTabProps) {
  const [activeSection, setActiveSection] = useState<'profile' | 'background'>('profile')
  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const [cropImage, setCropImage] = useState<string | null>(null)
  const [cropType, setCropType] = useState<ImageType>('avatar')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  // Get initials for avatar fallback
  const initials = user.name?.[0]?.toUpperCase() || user.username[0].toUpperCase()

  const handleImageSelect = useCallback((file: File, previewUrl: string, type: ImageType) => {
    setSelectedFile(file)
    setCropImage(previewUrl)
    setCropType(type)
    setIsCropModalOpen(true)
  }, [])

  const handleCropComplete = async (croppedImageUrl: string, croppedBlob?: Blob) => {
    if (!croppedBlob) return

    setUploading(true)
    try {
      // Create a File from the Blob
      const fileName = selectedFile?.name || `cropped-image-${Date.now()}.jpg`
      const croppedFile = new File([croppedBlob], fileName, { type: 'image/jpeg' })

      // Upload to Cloudinary
      const formData = new FormData()
      formData.append('file', croppedFile)
      formData.append('folder', cropType === 'avatar' ? 'gitolink/avatars' : 'gitolink/backgrounds')

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const data = await response.json()

      // Update user data via API
      if (cropType === 'avatar') {
        const updateRes = await fetch('/api/auth/me', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avatar_url: data.url }),
        })

        if (updateRes.ok) {
          onUserUpdate({ avatar_url: data.url })
          toast.success('Profile image updated!')
        }
      } else {
        const updateRes = await fetch('/api/upload/background', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'image', value: data.url }),
        })

        if (updateRes.ok) {
          onUserUpdate({ background_type: 'image', background_value: data.url })
          toast.success('Background image updated!')
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image')
    } finally {
      setUploading(false)
      setSelectedFile(null)
      setCropImage(null)
    }
  }

  const handleBackgroundChange = (type: 'gradient' | 'solid' | 'image', value: string) => {
    onUserUpdate({ background_type: type, background_value: value })
  }

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="flex gap-2 p-1 bg-gray-800/50 rounded-xl">
        <button
          onClick={() => setActiveSection('profile')}
          className={`
            flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
            ${activeSection === 'profile'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
            }
          `}
        >
          <FiUser className="w-4 h-4" />
          Profile Image
        </button>
        <button
          onClick={() => setActiveSection('background')}
          className={`
            flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
            ${activeSection === 'background'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
            }
          `}
        >
          <FiImage className="w-4 h-4" />
          Background
        </button>
      </div>

      {/* Profile Image Section */}
      {activeSection === 'profile' && (
        <motion.div
          key="profile"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Profile Image</h3>
            <p className="text-gray-400 text-sm">Upload a photo to personalize your profile</p>
          </div>

          <div className="flex flex-col items-center">
            {/* Current Avatar Preview */}
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white/10 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                {user.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-5xl font-bold text-white">{initials}</span>
                )}
              </div>
              
              {/* Upload Indicator */}
              {uploading && cropType === 'avatar' && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
                  />
                </div>
              )}
            </div>

            {/* Upload Component */}
            <div className="w-full max-w-sm">
              <ImageUpload
                onImageSelect={(file, previewUrl) => handleImageSelect(file, previewUrl, 'avatar')}
                maxSizeMB={2}
                aspectRatio={1}
                folder="gitolink/avatars"
                dragDropText="Drop profile photo here or click to browse"
                supportedFormatsText="JPG, PNG, WebP"
              />
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Recommended: Square image, at least 400x400 pixels
            </p>
          </div>
        </motion.div>
      )}

      {/* Background Section */}
      {activeSection === 'background' && (
        <motion.div
          key="background"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-2">Background</h3>
            <p className="text-gray-400 text-sm">Customize your profile background</p>
          </div>

          <BackgroundCustomizer
            currentType={user.background_type}
            currentValue={user.background_value}
            userId={user.id}
            onChange={handleBackgroundChange}
          />

          {/* Custom Background Upload */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <h4 className="text-sm font-medium text-gray-400 mb-4">Upload Custom Background</h4>
            <ImageUpload
              onImageSelect={(file, previewUrl) => handleImageSelect(file, previewUrl, 'background')}
              maxSizeMB={5}
              aspectRatio={16 / 9}
              folder="gitolink/backgrounds"
              dragDropText="Drop background image here or click to browse"
              supportedFormatsText="JPG, PNG, WebP"
            />
            <p className="mt-3 text-xs text-gray-500">
              Recommended: 1920x1080 pixels or larger for best quality
            </p>
          </div>
        </motion.div>
      )}

      {/* Crop Modal */}
      <ImageCrop
        image={cropImage || ''}
        isOpen={isCropModalOpen}
        onClose={() => {
          setIsCropModalOpen(false)
          setCropImage(null)
          setSelectedFile(null)
        }}
        onCropComplete={handleCropComplete}
        aspectRatio={cropType === 'avatar' ? 1 : 16 / 9}
        cropShape={cropType === 'avatar' ? 'round' : 'rect'}
        title={cropType === 'avatar' ? 'Crop Profile Photo' : 'Crop Background'}
      />
    </div>
  )
}

export default DesignTab
