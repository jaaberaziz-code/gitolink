'use client'

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUpload, FiX, FiPlay, FiVideo, FiLoader, FiCheck } from 'react-icons/fi'
import toast from 'react-hot-toast'

interface VideoUploadProps {
  currentVideo?: string | null
  onUpload: (videoUrl: string) => void
  onRemove: () => void
}

export default function VideoUpload({ currentVideo, onUpload, onRemove }: VideoUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentVideo || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const validateFile = (file: File): boolean => {
    // Check file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-m4v']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Only MP4, WebM, and MOV are allowed.')
      return false
    }

    // Check file size (10MB max)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error('File too large. Maximum size is 10MB.')
      return false
    }

    return true
  }

  const uploadVideo = async (file: File) => {
    if (!validateFile(file)) return

    setUploading(true)
    setUploadProgress(0)

    // Create local preview
    const localUrl = URL.createObjectURL(file)
    setPreviewUrl(localUrl)

    try {
      const formData = new FormData()
      formData.append('video', file)

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const res = await fetch('/api/upload/video', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to upload video')
      }

      const data = await res.json()
      setUploadProgress(100)
      setPreviewUrl(data.videoUrl)
      onUpload(data.videoUrl)
      toast.success('Video uploaded successfully!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload video')
      setPreviewUrl(currentVideo || null)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      uploadVideo(file)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadVideo(file)
    }
  }

  const handleRemove = async () => {
    try {
      const res = await fetch('/api/upload/video', {
        method: 'DELETE',
      })

      if (res.ok) {
        setPreviewUrl(null)
        onRemove()
        toast.success('Video removed')
      }
    } catch {
      toast.error('Failed to remove video')
    }
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {previewUrl ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative"
          >
            <div className="relative rounded-xl overflow-hidden bg-gray-800 aspect-video">
              <video
                src={previewUrl}
                className="w-full h-full object-cover"
                controls
                playsInline
              />
              
              {/* Remove button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleRemove}
                className="absolute top-3 right-3 p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-lg backdrop-blur-sm transition-colors cursor-pointer"
              >
                <FiX className="w-4 h-4" />
              </motion.button>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              This video will play in the background of your profile
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-xl p-8 text-center
                transition-all duration-200 cursor-pointer
                ${isDragging 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/30'}
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={handleFileSelect}
                className="hidden"
              />

              <AnimatePresence>
                {uploading ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    <FiLoader className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
                    <p className="text-sm text-gray-400">Uploading video...{uploadProgress}%</p>
                    <div className="w-full max-w-xs mx-auto h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-blue-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    <div className={`
                      w-16 h-16 mx-auto rounded-full flex items-center justify-center
                      transition-colors
                      ${isDragging ? 'bg-blue-500/20' : 'bg-gray-800'}
                    `}>
                      {isDragging ? (
                        <FiCheck className="w-8 h-8 text-blue-400" />
                      ) : (
                        <FiVideo className="w-8 h-8 text-gray-400" />
                      )}
                    </div>

                    <div>
                      <p className="text-white font-medium">
                        {isDragging ? 'Drop video here' : 'Upload background video'}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        Drag & drop or click to browse
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        MP4, WebM up to 10MB
                      </p>
                    </div>

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
                    >
                      <FiUpload className="w-4 h-4" />
                      Select Video
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
