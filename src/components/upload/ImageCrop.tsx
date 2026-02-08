'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Cropper, { Point, Area } from 'react-easy-crop'
import { FiX, FiCheck, FiRotateCw, FiZoomIn, FiZoomOut } from 'react-icons/fi'
import toast from 'react-hot-toast'

interface ImageCropProps {
  image: string
  isOpen: boolean
  onClose: () => void
  onCropComplete: (croppedImageUrl: string, croppedBlob?: Blob) => void
  aspectRatio?: number
  cropShape?: 'rect' | 'round'
  minZoom?: number
  maxZoom?: number
  title?: string
}

export function ImageCrop({
  image,
  isOpen,
  onClose,
  onCropComplete,
  aspectRatio = 1,
  cropShape = 'rect',
  minZoom = 1,
  maxZoom = 3,
  title = 'Crop Image'
}: ImageCropProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const onCropChange = useCallback((newCrop: Point) => {
    setCrop(newCrop)
  }, [])

  const onZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom)
  }, [])

  const onCropCompleteCallback = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, maxZoom))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, minZoom))
  }

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const createCroppedImage = async (): Promise<{ url: string; blob: Blob } | null> => {
    if (!croppedAreaPixels) return null

    try {
      const canvas = document.createElement('canvas')
      const imageElement = new Image()
      imageElement.crossOrigin = 'anonymous'
      
      await new Promise((resolve, reject) => {
        imageElement.onload = resolve
        imageElement.onerror = reject
        imageElement.src = image
      })

      const ctx = canvas.getContext('2d')
      if (!ctx) return null

      // Set canvas dimensions to match cropped area
      canvas.width = croppedAreaPixels.width
      canvas.height = croppedAreaPixels.height

      // Apply rotation if needed
      ctx.save()
      
      // Move to center of canvas for rotation
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.translate(-canvas.width / 2, -canvas.height / 2)

      // Draw the cropped image
      ctx.drawImage(
        imageElement,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      )

      ctx.restore()

      // Convert to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob)
        }, 'image/jpeg', 0.95)
      })

      const url = URL.createObjectURL(blob)
      return { url, blob }
    } catch (error) {
      console.error('Error creating cropped image:', error)
      toast.error('Failed to crop image')
      return null
    }
  }

  const handleConfirm = async () => {
    setIsProcessing(true)
    try {
      const result = await createCroppedImage()
      if (result) {
        onCropComplete(result.url, result.blob)
        onClose()
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCancel = () => {
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setRotation(0)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={handleCancel}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 sm:inset-10 md:inset-20 lg:inset-32 bg-gray-900 rounded-2xl z-50 flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white">{title}</h2>
              <button
                onClick={handleCancel}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Cropper Container */}
            <div className="flex-1 relative bg-gray-800">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={aspectRatio}
                onCropChange={onCropChange}
                onZoomChange={onZoomChange}
                onCropComplete={onCropCompleteCallback}
                cropShape={cropShape}
                showGrid={true}
                style={{
                  containerStyle: {
                    background: '#1f2937',
                  },
                  cropAreaStyle: {
                    border: '2px solid #3b82f6',
                  }
                }}
              />
            </div>

            {/* Controls */}
            <div className="px-6 py-4 border-t border-white/10 bg-gray-900">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Zoom Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleZoomOut}
                    disabled={zoom <= minZoom}
                    className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-white/10"
                    title="Zoom out"
                  >
                    <FiZoomOut className="w-5 h-5" />
                  </button>
                  
                  <input
                    type="range"
                    min={minZoom}
                    max={maxZoom}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-32 sm:w-48 accent-blue-500"
                  />
                  
                  <button
                    onClick={handleZoomIn}
                    disabled={zoom >= maxZoom}
                    className="p-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-lg hover:bg-white/10"
                    title="Zoom in"
                  >
                    <FiZoomIn className="w-5 h-5" />
                  </button>
                </div>

                {/* Rotate Button */}
                <button
                  onClick={handleRotate}
                  className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                  title="Rotate 90°"
                >
                  <FiRotateCw className="w-5 h-5" />
                  <span className="text-sm">Rotate</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-white/10">
                <button
                  onClick={handleCancel}
                  disabled={isProcessing}
                  className="px-6 py-2.5 text-gray-300 hover:text-white transition-colors rounded-xl hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <FiRotateCw className="w-4 h-4" />
                      </motion.div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiCheck className="w-4 h-4" />
                      Apply Crop
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ImageCrop
