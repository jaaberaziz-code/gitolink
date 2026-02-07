'use client'

import { useState, useRef, ChangeEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiImage, FiUpload, FiX, FiLoader, FiCheck, FiDroplet } from 'react-icons/fi'
import { BsPalette } from 'react-icons/bs'
import { uploadBackground } from '@/lib/supabase'
import { themes } from '@/lib/utils'
import Image from 'next/image'
import toast from 'react-hot-toast'

type BackgroundType = 'gradient' | 'solid' | 'image'

interface BackgroundCustomizerProps {
  currentType: BackgroundType
  currentValue: string
  userId: string
  onChange: (type: BackgroundType, value: string) => void
}

// Preset gradients
const presetGradients = themes.filter(t => 
  t.id !== 'minimal' && t.id !== 'white' && t.id !== 'glass' && t.id !== 'rainbow'
)

// Preset solid colors
const presetColors = [
  { name: 'Midnight', value: '#0a0a0f' },
  { name: 'Dark Gray', value: '#1f2937' },
  { name: 'Navy', value: '#1e3a5f' },
  { name: 'Forest', value: '#064e3b' },
  { name: 'Burgundy', value: '#4a0e0e' },
  { name: 'Purple', value: '#4c1d95' },
  { name: 'Charcoal', value: '#374151' },
  { name: 'Slate', value: '#0f172a' },
  { name: 'Black', value: '#000000' },
  { name: 'Dark Blue', value: '#172554' },
  { name: 'Dark Green', value: '#064e3b' },
  { name: 'Dark Red', value: '#7f1d1d' },
]

export function BackgroundCustomizer({ 
  currentType, 
  currentValue, 
  userId, 
  onChange 
}: BackgroundCustomizerProps) {
  const [activeTab, setActiveTab] = useState<BackgroundType>(currentType)
  const [selectedGradient, setSelectedGradient] = useState(
    currentType === 'gradient' ? currentValue : 'cyberpunk'
  )
  const [selectedColor, setSelectedColor] = useState(
    currentType === 'solid' ? currentValue : '#0a0a0f'
  )
  const [customImage, setCustomImage] = useState<string | null>(
    currentType === 'image' ? currentValue : null
  )
  const [uploading, setUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleTabChange = (tab: BackgroundType) => {
    setActiveTab(tab)
    
    // Update with default value for new tab
    if (tab === 'gradient') {
      onChange('gradient', selectedGradient)
    } else if (tab === 'solid') {
      onChange('solid', selectedColor)
    } else if (tab === 'image') {
      if (customImage) {
        onChange('image', customImage)
      }
    }
  }

  const handleGradientSelect = (gradientId: string) => {
    setSelectedGradient(gradientId)
    onChange('gradient', gradientId)
    toast.success('Background updated!')
  }

  const handleColorSelect = (color: string) => {
    setSelectedColor(color)
    onChange('solid', color)
    toast.success('Background updated!')
  }

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

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setCustomImage(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to Supabase
    setUploading(true)
    const { url, error } = await uploadBackground(file, userId)
    setUploading(false)

    if (error) {
      toast.error(error)
      return
    }

    setCustomImage(url)
    onChange('image', url)
    toast.success('Background image uploaded!')
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
    setCustomImage(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const tabs = [
    { id: 'gradient' as const, label: 'Gradient', icon: BsPalette },
    { id: 'solid' as const, label: 'Solid', icon: FiDroplet },
    { id: 'image' as const, label: 'Image', icon: FiImage },
  ]

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 p-1 bg-gray-800/50 rounded-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                ${activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'gradient' && (
          <motion.div
            key="gradient"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <h4 className="text-sm font-medium text-gray-400">Choose a Gradient</h4>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {presetGradients.map((theme) => (
                <motion.button
                  key={theme.id}
                  onClick={() => handleGradientSelect(theme.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    relative h-20 rounded-xl overflow-hidden transition-all
                    ${selectedGradient === theme.id
                      ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-[#0a0a0f]'
                      : ''
                    }
                  `}
                >
                  <div className={`absolute inset-0 ${theme.class}`} />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white drop-shadow-md">
                    {theme.name}
                  </span>
                  {selectedGradient === theme.id && (
                    <div className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <FiCheck className="w-3 h-3 text-white" />
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'solid' && (
          <motion.div
            key="solid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <h4 className="text-sm font-medium text-gray-400">Choose a Color</h4>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {presetColors.map((color) => (
                <motion.button
                  key={color.value}
                  onClick={() => handleColorSelect(color.value)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    relative aspect-square rounded-xl transition-all
                    ${selectedColor === color.value
                      ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-[#0a0a0f]'
                      : 'hover:ring-2 hover:ring-white/30'
                    }
                  `}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                >
                  {selectedColor === color.value && (
                    <FiCheck className="absolute inset-0 m-auto w-5 h-5 text-white drop-shadow-md" />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Custom color picker */}
            <div className="pt-4 border-t border-white/10">
              <label className="text-sm font-medium text-gray-400 mb-2 block">Custom Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => handleColorSelect(e.target.value)}
                  className="w-12 h-12 rounded-lg cursor-pointer border-0 p-0"
                />
                <input
                  type="text"
                  value={selectedColor}
                  onChange={(e) => handleColorSelect(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm"
                  placeholder="#000000"
                />
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'image' && (
          <motion.div
            key="image"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <h4 className="text-sm font-medium text-gray-400">Upload Background Image</h4>
            
            <div
              onClick={() => inputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`
                relative h-48 rounded-xl border-2 border-dashed cursor-pointer
                flex flex-col items-center justify-center gap-3
                transition-all duration-300
                ${isDragging 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : customImage
                    ? 'border-transparent'
                    : 'border-gray-600 hover:border-gray-500 bg-gray-800/30'
                }
              `}
            >
              {customImage ? (
                <>
                  <Image
                    src={customImage}
                    alt="Background preview"
                    fill
                    className="object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                    <div className="text-center">
                      <FiUpload className="w-8 h-8 text-white mx-auto mb-2" />
                      <p className="text-white font-medium">Click to change</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <FiImage className="w-10 h-10 text-gray-500" />
                  <div className="text-center">
                    <p className="text-gray-300 font-medium">Drop image here or click to upload</p>
                    <p className="text-gray-500 text-sm mt-1">JPG, PNG, WebP, GIF (max 5MB)</p>
                  </div>
                </>
              )}

              {uploading && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-xl">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <FiLoader className="w-10 h-10 text-white" />
                  </motion.div>
                </div>
              )}
            </div>

            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFileChange}
              className="hidden"
            />

            {customImage && (
              <button
                onClick={clearImage}
                className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm"
              >
                <FiX className="w-4 h-4" />
                Remove image
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}