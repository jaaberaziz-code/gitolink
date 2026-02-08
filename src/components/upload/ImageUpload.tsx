'use client'

import { useState, useRef, ChangeEvent, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUpload, FiX, FiLoader, FiImage, FiCheck } from 'react-icons/fi'
import Image from 'next/image'
import toast from 'react-hot-toast'

interface ImageUploadProps {
  onImageSelect: (file: File, previewUrl: string) => void
  onImageUpload?: (url: string, publicId?: string) => void
  currentImage?: string | null
  maxSizeMB?: number
  accept?: string
  aspectRatio?: number
  uploadEndpoint?: string
  folder?: string
  className?: string
  uploadButtonText?: string
  dragDropText?: string
  supportedFormatsText?: string
}

export function ImageUpload({
  onImageSelect,
  onImageUpload,
  currentImage,
  maxSizeMB = 5,
  accept = 'image/jpeg,image/png,image/webp,image/gif',
  aspectRatio,
  uploadEndpoint = '/api/upload/image',
  folder = 'gitolink/uploads',
  className = '',
  uploadButtonText = 'Upload Image',
  dragDropText = 'Drop image here or click to browse',
  supportedFormatsText = 'JPG, PNG, WebP, GIF'
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [uploading, setUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): boolean => {
    // Validate file type
    const allowedTypes = accept.split(',').map(t => t.trim())
    if (!allowedTypes.includes(file.type)) {
      toast.error(`Invalid file type. Please use ${supportedFormatsText}`)
      return false
    }

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      toast.error(`Image must be less than ${maxSizeMB}MB`)
      return false
    }

    return true
  }

  const createPreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setPreview(result)
        resolve(result)
      }
      reader.readAsDataURL(file)
    })
  }

  const uploadToServer = async (file: File): Promise<{ url: string; publicId?: string } | null> => {
    try {
      setUploading(true)
      setUploadProgress(0)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const data = await response.json()
      
      if (onImageUpload) {
        onImageUpload(data.url, data.publicId)
      }

      toast.success('Image uploaded successfully!')
      return { url: data.url, publicId: data.publicId }
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image')
      return null
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const processFile = async (file: File) => {
    if (!validateFile(file)) return

    const previewUrl = await createPreview(file)
    onImageSelect(file, previewUrl)

    // Auto-upload if onImageUpload is provided
    if (onImageUpload) {
      await uploadToServer(file)
    }
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await processFile(file)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }, [onImageSelect, onImageUpload])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const clearImage = () => {
    setPreview(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const containerStyle = aspectRatio
    ? { aspectRatio: `${aspectRatio}` }
    : { height: '200px' }

  return (
    <div className={`w-full ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        {/* Upload Zone */}
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={containerStyle}
          className={`
            relative w-full rounded-xl border-2 border-dashed cursor-pointer
            flex flex-col items-center justify-center gap-3
            transition-all duration-300 overflow-hidden
            ${isDragging 
              ? 'border-blue-500 bg-blue-500/10' 
              : preview
                ? 'border-transparent'
                : 'border-gray-600 hover:border-gray-500 bg-gray-800/30 hover:bg-gray-800/50'
            }
            ${uploading ? 'cursor-not-allowed' : ''}
          `}
        >
          {preview ? (
            <>
              <Image
                src={preview}
                alt="Image preview"
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
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center
                transition-colors duration-300
                ${isDragging ? 'bg-blue-500/20' : 'bg-gray-700/50'}
              `}>
                <FiImage className={`
                  w-8 h-8 transition-colors duration-300
                  ${isDragging ? 'text-blue-400' : 'text-gray-500'}
                `} />
              </div>
              <div className="text-center px-4">
                <p className="text-gray-300 font-medium">{dragDropText}</p>
                <p className="text-gray-500 text-sm mt-1">
                  {supportedFormatsText} (max {maxSizeMB}MB)
                </p>
              </div>
            </>
          )}

          {/* Uploading Overlay */}
          <AnimatePresence>
            {uploading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-xl"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <FiLoader className="w-10 h-10 text-white" />
                </motion.div>
                <p className="text-white mt-3 font-medium">Uploading...</p>
                {/* Progress bar */}
                <div className="w-48 h-1 bg-gray-600 rounded-full mt-3 overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500"
                    initial={{ width: '0%' }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hidden Input */}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />

        {/* Remove Button */}
        <AnimatePresence>
          {preview && !uploading && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation()
                clearImage()
              }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg z-10"
            >
              <FiX className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Success Indicator */}
        <AnimatePresence>
          {preview && !uploading && onImageUpload && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg"
            >
              <FiCheck className="w-3 h-3" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default ImageUpload
