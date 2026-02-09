'use client'

import { useState, useRef } from 'react'
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react'
import { motion } from 'framer-motion'
import { FiX, FiDownload, FiCopy, FiLink } from 'react-icons/fi'
import type { Link } from '@/types'
import toast from 'react-hot-toast'

interface QRCodeModalProps {
  link: Link
  onClose: () => void
}

export default function QRCodeModal({ link, onClose }: QRCodeModalProps) {
  const [size, setSize] = useState(256)
  const [format, setFormat] = useState<'png' | 'svg'>('svg')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [fgColor, setFgColor] = useState('#000000')
  const [includeLogo, setIncludeLogo] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : ''
  const linkUrl = `${baseUrl}/${link.userId ? '' : ''}${link.title.toLowerCase().replace(/\s+/g, '-')}`
  const publicUrl = `${baseUrl}/${link.userId || 'u'}`

  const downloadQRCode = () => {
    if (format === 'svg') {
      const svg = document.getElementById('qr-code-svg')
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg)
        const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const link_el = document.createElement('a')
        link_el.href = url
        link_el.download = `${link.title.replace(/\s+/g, '-').toLowerCase()}-qr.svg`
        document.body.appendChild(link_el)
        link_el.click()
        document.body.removeChild(link_el)
        URL.revokeObjectURL(url)
        toast.success('QR code downloaded!')
      }
    } else {
      const canvas = canvasRef.current
      if (canvas) {
        const pngUrl = canvas.toDataURL('image/png')
        const link_el = document.createElement('a')
        link_el.href = pngUrl
        link_el.download = `${link.title.replace(/\s+/g, '-').toLowerCase()}-qr.png`
        document.body.appendChild(link_el)
        link_el.click()
        document.body.removeChild(link_el)
        toast.success('QR code downloaded!')
      }
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(publicUrl)
    toast.success('Profile URL copied!')
  }

  const qrCodeValue = publicUrl

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-dark rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">QR Code</h2>
            <p className="text-sm text-gray-400">{link.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* QR Code Preview */}
        <div className="flex justify-center mb-6 p-6 bg-white rounded-xl">
          {format === 'svg' ? (
            <QRCodeSVG
              id="qr-code-svg"
              value={qrCodeValue}
              size={size}
              bgColor={bgColor}
              fgColor={fgColor}
              level="H"
              includeMargin={true}
              imageSettings={includeLogo ? {
                src: '/logo.png',
                height: size * 0.2,
                width: size * 0.2,
                excavate: true,
              } : undefined}
            />
          ) : (
            <QRCodeCanvas
              ref={canvasRef}
              value={qrCodeValue}
              size={size}
              bgColor={bgColor}
              fgColor={fgColor}
              level="H"
              includeMargin={true}
              imageSettings={includeLogo ? {
                src: '/logo.png',
                height: size * 0.2,
                width: size * 0.2,
                excavate: true,
              } : undefined}
            />
          )}
        </div>

        {/* URL Display */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Link URL</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg">
              <FiLink className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-300 truncate">{publicUrl}</span>
            </div>
            <button
              onClick={copyLink}
              className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              title="Copy URL"
            >
              <FiCopy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Customization Options */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Format</label>
            <div className="flex gap-2">
              <button
                onClick={() => setFormat('svg')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  format === 'svg'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                SVG
              </button>
              <button
                onClick={() => setFormat('png')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  format === 'png'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                PNG
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Size: {size}px</label>
            <input
              type="range"
              min="128"
              max="512"
              step="64"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>128px</span>
              <span>512px</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Background</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Foreground</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={downloadQRCode}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <FiDownload className="w-5 h-5" />
          Download QR Code
        </motion.button>
      </motion.div>
    </div>
  )
}
