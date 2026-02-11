'use client'

import { useState, useRef } from 'react'
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react'
import { motion } from 'framer-motion'
import type { Link } from '@/types'
import toast from 'react-hot-toast'

// SVG Icons
const Icons = {
  x: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  download: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  copy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="w-5 h-5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  image: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

interface QRCodeModalProps {
  link: Link
  onClose: () => void
}

export default function QRCodeModal({ link, onClose }: QRCodeModalProps) {
  const [size, setSize] = useState(256)
  const [format, setFormat] = useState<'png' | 'svg'>('svg')
  const [bgColor, setBgColor] = useState('#ffffff')
  const [fgColor, setFgColor] = useState('#000000')
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const publicUrl = `${baseUrl}/u/${link.userId || 'user'}`

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
        link_el.click()
        URL.revokeObjectURL(url)
        toast.success('QR downloaded!')
      }
    } else {
      const canvas = canvasRef.current
      if (canvas) {
        const pngUrl = canvas.toDataURL('image/png')
        const link_el = document.createElement('a')
        link_el.href = pngUrl
        link_el.download = `${link.title.replace(/\s+/g, '-').toLowerCase()}-qr.png`
        link_el.click()
        toast.success('QR downloaded!')
      }
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    toast.success('URL copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const presetColors = [
    { fg: '#000000', bg: '#ffffff', name: 'CLASSIC' },
    { fg: '#00FF41', bg: '#000000', name: 'MATRIX' },
    { fg: '#000000', bg: '#00FF41', name: 'NEON' },
    { fg: '#ffffff', bg: '#1f2937', name: 'DARK' },
  ]

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#0a0a0a] border border-gray-800 w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-bold">QR CODE</h2>
            <p className="text-sm text-gray-500 font-mono">{link.title}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-white">
            {Icons.x}
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* QR Preview */}
          <div className="flex justify-center p-6 bg-white">
            {format === 'svg' ? (
              <QRCodeSVG
                id="qr-code-svg"
                value={publicUrl}
                size={size}
                bgColor={bgColor}
                fgColor={fgColor}
                level="H"
                includeMargin={true}
              />
            ) : (
              <QRCodeCanvas
                ref={canvasRef}
                value={publicUrl}
                size={size}
                bgColor={bgColor}
                fgColor={fgColor}
                level="H"
                includeMargin={true}
              />
            )}
          </div>

          {/* URL */}
          <div>
            <label className="text-xs font-mono text-gray-500 mb-2 block uppercase">Link URL</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-black border border-gray-800">
                <span className="text-gray-600">{Icons.link}</span>
                <span className="text-sm text-gray-400 truncate font-mono">{publicUrl}</span>
              </div>
              <button
                onClick={copyLink}
                className="p-2 bg-[#00FF41] text-black hover:bg-[#00CC33]"
              >
                {copied ? Icons.check : Icons.copy}
              </button>
            </div>
          </div>

          {/* Format */}
          <div>
            <label className="text-xs font-mono text-gray-500 mb-2 block uppercase">Format</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setFormat('svg')}
                className={`flex items-center justify-center gap-2 px-3 py-2 text-sm transition-colors
                  ${format === 'svg'
                    ? 'bg-[#00FF41] text-black font-medium'
                    : 'bg-[#0a0a0a] text-gray-400 border border-gray-800'
                  }`}
              >
                {Icons.code}
                SVG
              </button>
              <button
                onClick={() => setFormat('png')}
                className={`flex items-center justify-center gap-2 px-3 py-2 text-sm transition-colors
                  ${format === 'png'
                    ? 'bg-[#00FF41] text-black font-medium'
                    : 'bg-[#0a0a0a] text-gray-400 border border-gray-800'
                  }`}
              >
                {Icons.image}
                PNG
              </button>
            </div>
          </div>

          {/* Size */}
          <div>
            <label className="text-xs font-mono text-gray-500 mb-2 block uppercase">Size: {size}px</label>
            <input
              type="range"
              min="128"
              max="512"
              step="64"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full h-2 bg-gray-800 appearance-none cursor-pointer accent-[#00FF41]"
            />
            <div className="flex justify-between text-xs text-gray-600 font-mono mt-1">
              <span>128px</span>
              <span>512px</span>
            </div>
          </div>

          {/* Color Presets */}
          <div>
            <label className="text-xs font-mono text-gray-500 mb-2 block uppercase">Presets</label>
            <div className="grid grid-cols-4 gap-2">
              {presetColors.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => { setFgColor(preset.fg); setBgColor(preset.bg) }}
                  className={`relative aspect-square overflow-hidden transition-all
                    ${fgColor === preset.fg && bgColor === preset.bg ? 'ring-2 ring-[#00FF41]' : ''}`}
                >
                  <div className="absolute inset-0" style={{ backgroundColor: preset.bg }} />
                  <div className="absolute inset-2" style={{ backgroundColor: preset.fg }} />
                </button>
              ))}
            </div>
          </div>

          {/* Custom Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-gray-500 mb-2 block uppercase">Background</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 bg-black border border-gray-800 px-2 py-1 text-sm font-mono uppercase"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-mono text-gray-500 mb-2 block uppercase">Foreground</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-10 h-10 bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="flex-1 bg-black border border-gray-800 px-2 py-1 text-sm font-mono uppercase"
                />
              </div>
            </div>
          </div>

          {/* Download */}
          <button
            onClick={downloadQRCode}
            className="w-full bg-white text-black py-3 font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            {Icons.download}
            DOWNLOAD QR CODE
          </button>
        </div>
      </motion.div>
    </div>
  )
}
