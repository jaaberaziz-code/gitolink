'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FiLayout, FiType, FiImage, FiGrid, FiCheck } from 'react-icons/fi'
import { BsPalette } from 'react-icons/bs'
import { ImageUpload } from '@/components/upload/ImageUpload'
import { ImageCrop } from '@/components/upload/ImageCrop'
import { BackgroundCustomizer } from './BackgroundCustomizer'
import { themes } from '@/lib/utils'
import { layouts, buttonStyles, googleFonts } from '@/types'
import type { Link } from '@/types'
import toast from 'react-hot-toast'

type ImageType = 'avatar' | 'background'
type SectionType = 'layout' | 'typography' | 'colors' | 'buttons' | 'images'

interface DesignUser {
  layout: 'classic' | 'hero' | 'minimal'
  font_family: string
  title_color: string
  button_style: 'rounded' | 'pill' | 'square' | 'glass'
  button_color: string
  theme: string
  background_type: 'gradient' | 'solid' | 'image'
  background_value: string
}

interface DesignTabProps {
  user: DesignUser
  links: Link[]
  onDesignUpdate: (design: Partial<DesignUser>) => void
}

const presetColors = [
  '#ffffff', '#000000', '#1a1a1a', '#333333',
  '#ef4444', '#f97316', '#f59e0b', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4',
  '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6',
  '#a855f7', '#d946ef', '#ec4899', '#f43f5e',
]

export function DesignTab({ user, onDesignUpdate }: DesignTabProps) {
  const [activeSection, setActiveSection] = useState<SectionType>('layout')
  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const [cropImage, setCropImage] = useState<string | null>(null)
  const [cropType, setCropType] = useState<ImageType>('avatar')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

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
      const fileName = selectedFile?.name || `cropped-image-${Date.now()}.jpg`
      const croppedFile = new File([croppedBlob], fileName, { type: 'image/jpeg' })

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

      if (cropType === 'avatar') {
        const updateRes = await fetch('/api/auth/me', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avatar_url: data.url }),
        })

        if (updateRes.ok) {
          toast.success('Profile image updated!')
        }
      } else {
        onDesignUpdate({ background_type: 'image', background_value: data.url })
        toast.success('Background image updated!')
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
    onDesignUpdate({ background_type: type, background_value: value })
  }

  const sections = [
    { id: 'layout' as SectionType, label: 'Layout', icon: FiLayout },
    { id: 'typography' as SectionType, label: 'Typography', icon: FiType },
    { id: 'colors' as SectionType, label: 'Colors', icon: BsPalette },
    { id: 'buttons' as SectionType, label: 'Buttons', icon: FiGrid },
    { id: 'images' as SectionType, label: 'Images', icon: FiImage },
  ]

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Design</h1>
        <p className="text-gray-400 text-sm">Customize your profile design</p>
      </div>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-gray-800/50 rounded-xl">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                ${activeSection === section.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {section.label}
            </button>
          )
        })}
      </div>

      {/* Layout Section */}
      {activeSection === 'layout' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Choose Layout</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {layouts.map((layout) => (
              <button
                key={layout.id}
                onClick={() => onDesignUpdate({ layout: layout.id as typeof user.layout })}
                className={`
                  p-4 rounded-xl border-2 transition-all text-left
                  ${user.layout === layout.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-700 hover:border-gray-600 bg-gray-800/30'
                  }
                `}
              >
                <div className="w-full h-24 bg-gray-700 rounded-lg mb-3 flex items-center justify-center"
                >
                  <FiLayout className="w-8 h-8 text-gray-500" />
                </div>
                <p className="font-medium text-white">{layout.name}</p>
                <p className="text-sm text-gray-400">{layout.description}</p>
                {user.layout === layout.id && (
                  <div className="mt-2 flex items-center gap-1 text-blue-400 text-sm"
                  >
                    <FiCheck className="w-4 h-4" /> Selected
                  </div>
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Typography Section */}
      {activeSection === 'typography' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Choose Font</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {googleFonts.map((font) => (
              <button
                key={font.id}
                onClick={() => onDesignUpdate({ font_family: font.id })}
                className={`
                  p-3 rounded-xl border-2 transition-all
                  ${user.font_family === font.id
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-700 hover:border-gray-600 bg-gray-800/30'
                  }
                `}
                style={{ fontFamily: font.id }}
              >
                <p className="font-medium text-white text-lg">{font.name}</p>
                <p className="text-xs text-gray-400">{font.category}</p>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Colors Section */}
      {activeSection === 'colors' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Title Color</h3>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
            {presetColors.map((color) => (
              <button
                key={color}
                onClick={() => onDesignUpdate({ title_color: color })}
                className={`
                  aspect-square rounded-xl transition-all
                  ${user.title_color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''}
                `}
                style={{ backgroundColor: color }}
              >
                {user.title_color === color && (
                  <FiCheck className={`w-5 h-5 mx-auto ${color === '#ffffff' ? 'text-black' : 'text-white'}`} />
                )}
              </button>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <h4 className="text-sm font-medium text-gray-400 mb-3">Custom Color</h4>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={user.title_color}
                onChange={(e) => onDesignUpdate({ title_color: e.target.value })}
                className="w-12 h-12 rounded-lg cursor-pointer border-0 p-0"
              />
              <input
                type="text"
                value={user.title_color}
                onChange={(e) => onDesignUpdate({ title_color: e.target.value })}
                className="flex-1 px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm uppercase"
                placeholder="#000000"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Buttons Section */}
      {activeSection === 'buttons' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Button Style */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Button Style</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {buttonStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => onDesignUpdate({ button_style: style.id as typeof user.button_style })}
                  className={`
                    p-4 rounded-xl border-2 transition-all
                    ${user.button_style === style.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-700 hover:border-gray-600 bg-gray-800/30'
                    }
                  `}
                >
                  <div className={`
                    w-full h-10 mb-2 mx-auto
                    ${style.id === 'rounded' && 'rounded-lg'}
                    ${style.id === 'pill' && 'rounded-full'}
                    ${style.id === 'square' && 'rounded-none'}
                    ${style.id === 'glass' && 'rounded-lg bg-white/10 backdrop-blur'}
                    bg-current
                  `} style={{ color: user.button_color }}
                  />
                  <p className="font-medium text-white">{style.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Button Color */}
          <div className="glass-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Button Color</h3>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
              {presetColors.map((color) => (
                <button
                  key={color}
                  onClick={() => onDesignUpdate({ button_color: color })}
                  className={`
                    aspect-square rounded-xl transition-all
                    ${user.button_color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''}
                  `}
                  style={{ backgroundColor: color }}
                >
                  {user.button_color === color && (
                    <FiCheck className={`w-5 h-5 mx-auto ${color === '#ffffff' ? 'text-black' : 'text-white'}`} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Images Section */}
      {activeSection === 'images' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="glass-card rounded-2xl p-6">
            <BackgroundCustomizer
              currentType={user.background_type}
              currentValue={user.background_value}
              userId=""
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
            </div>
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
        aspectRatio={16 / 9}
        cropShape="rect"
        title="Crop Background"
      />
    </div>
  )
}

export default DesignTab
