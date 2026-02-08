'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiLayout, FiType, FiImage, FiGrid, FiCheck, FiRotateCcw, FiSave, FiAlertCircle, FiLoader } from 'react-icons/fi'
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
  onDesignUpdate: (design: Partial<DesignUser>) => Promise<any>
}

const presetColors = [
  '#ffffff', '#000000', '#1a1a1a', '#333333',
  '#ef4444', '#f97316', '#f59e0b', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4',
  '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6',
  '#a855f7', '#d946ef', '#ec4899', '#f43f5e',
]

// Default design values
const defaultDesign: DesignUser = {
  layout: 'classic',
  font_family: 'Inter',
  title_color: '#ffffff',
  button_style: 'rounded',
  button_color: '#3b82f6',
  theme: 'cyberpunk',
  background_type: 'gradient',
  background_value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
}

export function DesignTab({ user, onDesignUpdate }: DesignTabProps) {
  const [activeSection, setActiveSection] = useState<SectionType>('layout')
  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const [cropImage, setCropImage] = useState<string | null>(null)
  const [cropType, setCropType] = useState<ImageType>('avatar')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  
  // State management for optimistic updates
  const [displayState, setDisplayState] = useState<DesignUser>(user)
  const [savedState, setSavedState] = useState<DesignUser>(user)
  const [isSaving, setIsSaving] = useState(false)
  const [hasErrors, setHasErrors] = useState(false)
  
  // Track pending changes
  const [pendingChanges, setPendingChanges] = useState<Partial<DesignUser>>({})
  
  // Ref to track if component is mounted
  const isMounted = useRef(true)

  // Calculate effective design (saved + pending changes)
  const effectiveDesign: DesignUser = { ...savedState, ...pendingChanges }

  // Check if there are unsaved changes
  const hasUnsavedChanges = Object.keys(pendingChanges).length > 0

  // Update states when user prop changes (initial load)
  useEffect(() => {
    if (isMounted.current) {
      setSavedState(user)
      setDisplayState(user)
      setPendingChanges({})
      setHasErrors(false)
    }
  }, [user])

  // Handle beforeunload event for unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
        return e.returnValue
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [hasUnsavedChanges])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  // Handle design changes with optimistic updates
  const handleDesignChange = useCallback((changes: Partial<DesignUser>) => {
    // Update pending changes
    setPendingChanges(prev => ({ ...prev, ...changes }))
    // Immediately update display for optimistic feedback
    setDisplayState(prev => ({ ...prev, ...changes }))
    setHasErrors(false)
  }, [])

  // Apply changes to the database with rollback on error
  const handleApplyChanges = async () => {
    if (!hasUnsavedChanges) return

    const originalState = { ...savedState }
    
    setIsSaving(true)
    try {
      // Call the parent's onDesignUpdate with all pending changes
      const result = await onDesignUpdate(pendingChanges)
      
      // Update saved state with pending changes
      const newState = { ...savedState, ...pendingChanges }
      setSavedState(newState)
      setDisplayState(newState)
      
      // Clear pending changes
      setPendingChanges({})
      setHasErrors(false)
      
      toast.success('Design changes saved successfully!')
      return result
    } catch (error: any) {
      // Rollback on error
      setDisplayState(originalState)
      setSavedState(originalState)
      setPendingChanges({})
      setHasErrors(true)
      toast.error(error.message || 'Failed to save changes')
      throw error
    } finally {
      setIsSaving(false)
    }
  }

  // Reset to saved state
  const handleReset = () => {
    if (!hasUnsavedChanges) return
    
    // Rollback display to saved state
    setDisplayState(savedState)
    setPendingChanges({})
    setHasErrors(false)
    toast('Changes discarded', { icon: '↩️' })
  }

  // Reset to default values
  const handleResetToDefault = () => {
    const confirmReset = window.confirm(
      'This will reset all design settings to default values. Any unsaved changes will be lost. Continue?'
    )
    
    if (confirmReset) {
      const defaultChanges = {
        layout: defaultDesign.layout,
        font_family: defaultDesign.font_family,
        title_color: defaultDesign.title_color,
        button_style: defaultDesign.button_style,
        button_color: defaultDesign.button_color,
        background_type: defaultDesign.background_type,
        background_value: defaultDesign.background_value,
      }
      
      setPendingChanges(defaultChanges)
      setDisplayState(prev => ({ ...prev, ...defaultChanges }))
      toast('Default values loaded. Click Apply to save.', { icon: 'ℹ️' })
    }
  }

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
        // Optimistically update background
        handleDesignChange({ background_type: 'image', background_value: data.url })
        toast.success('Background image added to draft!')
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
    handleDesignChange({ background_type: type, background_value: value })
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
      {/* Header with unsaved changes indicator */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">Design</h1>
            {hasUnsavedChanges && (
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded-full flex items-center gap-1">
                <FiAlertCircle className="w-3 h-3" />
                Unsaved changes
              </span>
            )}
            {hasErrors && (
              <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full flex items-center gap-1">
                <FiAlertCircle className="w-3 h-3" />
                Save failed
              </span>
            )}
          </div>
          <p className="text-gray-400 text-sm">Customize your profile design</p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleResetToDefault}
            disabled={isSaving}
            className="px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            title="Reset to default values"
          >
            Default
          </button>
          <button
            onClick={handleReset}
            disabled={!hasUnsavedChanges || isSaving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed
              bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <FiRotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handleApplyChanges}
            disabled={!hasUnsavedChanges || isSaving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed
              bg-blue-600 text-white hover:bg-blue-700"
          >
            {isSaving ? (
              <>
                <FiLoader className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FiSave className="w-4 h-4" />
                Apply Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Unsaved Changes Warning Banner */}
      {hasUnsavedChanges && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center gap-3"
        >
          <FiAlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-amber-200 text-sm font-medium">You have unsaved changes</p>
            <p className="text-amber-200/70 text-xs">Click "Apply Changes" to save your modifications, or "Reset" to discard them.</p>
          </div>
        </motion.div>
      )}

      {/* Error Banner */}
      {hasErrors && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3"
        >
          <FiAlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-red-200 text-sm font-medium">Failed to save changes</p>
            <p className="text-red-200/70 text-xs">Your changes have been reverted. Please try again.</p>
          </div>
          <button
            onClick={handleApplyChanges}
            disabled={isSaving}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors disabled:opacity-50"
          >
            Retry
          </button>
        </motion.div>
      )}

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
                onClick={() => handleDesignChange({ layout: layout.id as typeof user.layout })}
                className={`
                  p-4 rounded-xl border-2 transition-all text-left
                  ${effectiveDesign.layout === layout.id
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
                {effectiveDesign.layout === layout.id && (
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
                onClick={() => handleDesignChange({ font_family: font.id })}
                className={`
                  p-3 rounded-xl border-2 transition-all
                  ${effectiveDesign.font_family === font.id
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
                onClick={() => handleDesignChange({ title_color: color })}
                className={`
                  aspect-square rounded-xl transition-all
                  ${effectiveDesign.title_color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''}
                `}
                style={{ backgroundColor: color }}
              >
                {effectiveDesign.title_color === color && (
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
                value={effectiveDesign.title_color}
                onChange={(e) => handleDesignChange({ title_color: e.target.value })}
                className="w-12 h-12 rounded-lg cursor-pointer border-0 p-0"
              />
              <input
                type="text"
                value={effectiveDesign.title_color}
                onChange={(e) => handleDesignChange({ title_color: e.target.value })}
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
                  onClick={() => handleDesignChange({ button_style: style.id as typeof user.button_style })}
                  className={`
                    p-4 rounded-xl border-2 transition-all
                    ${effectiveDesign.button_style === style.id
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
                  `} style={{ color: effectiveDesign.button_color }}
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
                  onClick={() => handleDesignChange({ button_color: color })}
                  className={`
                    aspect-square rounded-xl transition-all
                    ${effectiveDesign.button_color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''}
                  `}
                  style={{ backgroundColor: color }}
                >
                  {effectiveDesign.button_color === color && (
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
              currentType={effectiveDesign.background_type}
              currentValue={effectiveDesign.background_value}
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
