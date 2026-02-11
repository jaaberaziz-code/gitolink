'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="w-5 h-5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  print: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
  refresh: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  ),
  share: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
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
  ),
  loader: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 animate-spin">
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
    </svg>
  )
}

interface QRCodeGeneratorProps {
  username: string
  isOpen: boolean
  onClose: () => void
}

type QRSize = 'small' | 'medium' | 'large'
type QRFormat = 'png' | 'svg'

interface QRSettings {
  size: QRSize
  format: QRFormat
  fgColor: string
  bgColor: string
  includeMargin: boolean
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H'
}

const sizeMap: Record<QRSize, number> = {
  small: 200,
  medium: 300,
  large: 400,
}

const presetColors = [
  { fg: '#000000', bg: '#ffffff', name: 'CLASSIC' },
  { fg: '#00FF41', bg: '#000000', name: 'MATRIX' },
  { fg: '#000000', bg: '#00FF41', name: 'NEON' },
  { fg: '#ffffff', bg: '#1f2937', name: 'DARK' },
  { fg: '#3b82f6', bg: '#ffffff', name: 'BLUE' },
  { fg: '#8b5cf6', bg: '#ffffff', name: 'PURPLE' },
  { fg: '#000000', bg: '#f3f4f6', name: 'LIGHT' },
]

export default function QRCodeGenerator({ username, isOpen, onClose }: QRCodeGeneratorProps) {
  const [settings, setSettings] = useState<QRSettings>({
    size: 'medium',
    format: 'png',
    fgColor: '#000000',
    bgColor: '#ffffff',
    includeMargin: true,
    errorCorrectionLevel: 'M',
  })
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const [svgContent, setSvgContent] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'customize' | 'share'>('customize')

  const profileUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://gitolink.vercel.app'}/${username}`

  const generateQR = useCallback(async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: profileUrl,
          size: sizeMap[settings.size],
          fgColor: settings.fgColor,
          bgColor: settings.bgColor,
          format: settings.format,
          margin: settings.includeMargin ? 4 : 0,
          errorCorrectionLevel: settings.errorCorrectionLevel,
        }),
      })

      if (!response.ok) throw new Error('Failed to generate QR')

      const data = await response.json()
      
      if (settings.format === 'png') {
        setQrDataUrl(data.dataUrl)
        setSvgContent('')
      } else {
        setSvgContent(data.svg)
        setQrDataUrl('')
      }
    } catch {
      toast.error('Failed to generate QR code')
    } finally {
      setIsGenerating(false)
    }
  }, [profileUrl, settings])

  useEffect(() => {
    if (isOpen) generateQR()
  }, [isOpen, generateQR])

  const handleDownload = () => {
    if (settings.format === 'png' && qrDataUrl) {
      const link = document.createElement('a')
      link.href = qrDataUrl
      link.download = `gitolink-${username}-qr.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('QR downloaded!')
    } else if (settings.format === 'svg' && svgContent) {
      const blob = new Blob([svgContent], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `gitolink-${username}-qr.svg`
      link.click()
      URL.revokeObjectURL(url)
      toast.success('QR downloaded!')
    }
  }

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      toast.success('URL copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-[#0a0a0a] border border-gray-800 w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00FF41] flex items-center justify-center">
                <span className="text-black">{Icons.phone}</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">QR CODE GENERATOR</h2>
                <p className="text-sm text-gray-500 font-mono">Share your profile</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-gray-500 hover:text-white">
              {Icons.x}
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-800">
            {(['customize', 'share'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-4 py-3 text-sm font-medium font-mono transition-colors
                  ${activeTab === tab
                    ? 'text-[#00FF41] border-b-2 border-[#00FF41]'
                    : 'text-gray-500 hover:text-white'
                  }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Preview Panel */}
            <div className="flex-1 p-8 flex flex-col items-center justify-center bg-black min-h-[400px]">
              <div className="relative p-6 bg-white shadow-2xl">
                {isGenerating ? (
                  <div className="w-[300px] h-[300px] flex items-center justify-center">
                    {Icons.loader}
                  </div>
                ) : settings.format === 'png' && qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="QR Code"
                    className="max-w-full h-auto"
                    style={{ maxWidth: sizeMap[settings.size], maxHeight: sizeMap[settings.size] }}
                  />
                ) : settings.format === 'svg' && svgContent ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: svgContent }}
                    style={{ width: sizeMap[settings.size], height: sizeMap[settings.size] }}
                  /
                ) : null}
                
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black px-4 py-1">
                  <span className="text-xs font-mono text-white">GITOLINK</span>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="font-bold">@{username}</p>
                <p className="text-gray-500 text-sm mt-1 font-mono">{profileUrl}</p>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={handleDownload}
                  disabled={isGenerating || (!qrDataUrl && !svgContent)}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-black font-medium hover:bg-gray-200 disabled:opacity-50"
                >
                  {Icons.download}
                  DOWNLOAD
                </button>
                <button
                  onClick={() => window.print()}
                  disabled={isGenerating || (!qrDataUrl && !svgContent)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-50"
                >
                  {Icons.print}
                  PRINT
                </button>
              </div>
            </div>

            {/* Settings Panel */}
            <div className="w-full lg:w-80 p-6 border-t lg:border-t-0 lg:border-l border-gray-800 overflow-y-auto max-h-[400px]">
              {activeTab === 'customize' ? (
                <div className="space-y-6">
                  {/* Format */}
                  <div>
                    <label className="text-xs font-mono text-gray-500 mb-2 block uppercase">Format</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['png', 'svg'] as const).map((fmt) => (
                        <button
                          key={fmt}
                          onClick={() => setSettings(s => ({ ...s, format: fmt }))}
                          className={`flex items-center justify-center gap-2 px-3 py-2 text-sm transition-colors
                            ${settings.format === fmt
                              ? 'bg-[#00FF41] text-black font-medium'
                              : 'bg-[#0a0a0a] text-gray-400 border border-gray-800 hover:border-gray-600'
                            }`}
                        >
                          {fmt === 'png' ? Icons.image : Icons.code}
                          {fmt.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size */}
                  <div>
                    <label className="text-xs font-mono text-gray-500 mb-2 block uppercase">Size</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['small', 'medium', 'large'] as QRSize[]).map((size) => (
                        <button
                          key={size}
                          onClick={() => setSettings(s => ({ ...s, size }))}
                          className={`px-3 py-2 text-sm font-mono uppercase transition-colors
                            ${settings.size === size
                              ? 'bg-[#00FF41] text-black'
                              : 'bg-[#0a0a0a] text-gray-400 border border-gray-800 hover:border-gray-600'
                            }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Presets */}
                  <div>
                    <label className="text-xs font-mono text-gray-500 mb-2 block uppercase">Color Presets</label>
                    <div className="grid grid-cols-4 gap-2">
                      {presetColors.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() => setSettings(s => ({ ...s, fgColor: preset.fg, bgColor: preset.bg }))}
                          className={`group relative w-full aspect-square overflow-hidden transition-all
                            ${settings.fgColor === preset.fg && settings.bgColor === preset.bg
                              ? 'ring-2 ring-[#00FF41]' : ''}`}
                          title={preset.name}
                        >
                          <div className="absolute inset-0" style={{ backgroundColor: preset.bg }} />
                          <div className="absolute inset-2" style={{ backgroundColor: preset.fg }} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Colors */}
                  <div>
                    <label className="text-xs font-mono text-gray-500 mb-2 block uppercase">Custom Colors</label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-gray-500 w-8">FG</span>
                        <input
                          type="color"
                          value={settings.fgColor}
                          onChange={(e) => setSettings(s => ({ ...s, fgColor: e.target.value }))}
                          className="w-8 h-8 bg-transparent border-0 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.fgColor}
                          onChange={(e) => setSettings(s => ({ ...s, fgColor: e.target.value }))}
                          className="flex-1 bg-black border border-gray-800 px-2 py-1 text-sm font-mono uppercase"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-gray-500 w-8">BG</span>
                        <input
                          type="color"
                          value={settings.bgColor}
                          onChange={(e) => setSettings(s => ({ ...s, bgColor: e.target.value }))}
                          className="w-8 h-8 bg-transparent border-0 cursor-pointer"
                        />
                        <input
                          type="text"
                          value={settings.bgColor}
                          onChange={(e) => setSettings(s => ({ ...s, bgColor: e.target.value }))}
                          className="flex-1 bg-black border border-gray-800 px-2 py-1 text-sm font-mono uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Margin Toggle */}
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-gray-500 uppercase">Include Margin</label>
                    <button
                      onClick={() => setSettings(s => ({ ...s, includeMargin: !s.includeMargin }))}
                      className={`relative w-12 h-6 transition-colors ${
                        settings.includeMargin ? 'bg-[#00FF41]' : 'bg-gray-800'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-black transition-transform ${
                          settings.includeMargin ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Regenerate */}
                  <button
                    onClick={generateQR}
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-50"
                  >
                    <span className={isGenerating ? 'animate-spin' : ''}>{Icons.refresh}</span>
                    REGENERATE
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Profile URL */}
                  <div>
                    <label className="text-xs font-mono text-gray-500 mb-2 block uppercase">Profile URL</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={profileUrl}
                        readOnly
                        className="flex-1 bg-black border border-gray-800 px-3 py-2 text-sm font-mono"
                      />
                      <button
                        onClick={handleCopyUrl}
                        className="p-2 bg-[#00FF41] text-black hover:bg-[#00CC33]"
                      >
                        {copied ? Icons.check : Icons.copy}
                      </button>
                    </div>
                  </div>

                  {/* Share Options */}
                  <div>
                    <label className="text-xs font-mono text-gray-500 mb-2 block uppercase">Share Options</label>
                    <div className="space-y-2">
                      <button
                        onClick={handleCopyUrl}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-[#0a0a0a] border border-gray-800 hover:border-gray-600 transition-colors text-left"
                      >
                        <div className="w-10 h-10 bg-white/10 flex items-center justify-center">{Icons.copy}</div>
                        <div>
                          <p className="font-medium">Copy Link</p>
                          <p className="text-xs text-gray-500 font-mono">Copy to clipboard</p>
                        </div>
                      </button>

                      <button
                        onClick={handleDownload}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-[#0a0a0a] border border-gray-800 hover:border-gray-600 transition-colors text-left"
                      >
                        <div className="w-10 h-10 bg-[#00FF41] text-black flex items-center justify-center">{Icons.download}</div>
                        <div>
                          <p className="font-medium">Download QR</p>
                          <p className="text-xs text-gray-500 font-mono">PNG or SVG</p>
                        </div>
                      </button>

                      {navigator.share && (
                        <button
                          onClick={() => navigator.share({ title: username, url: profileUrl })}
                          className="w-full flex items-center gap-3 px-4 py-3 bg-[#0a0a0a] border border-gray-800 hover:border-gray-600 transition-colors text-left"
                        >
                          <div className="w-10 h-10 bg-white/10 flex items-center justify-center">{Icons.share}</div>
                          <div>
                            <p className="font-medium">Share</p>
                            <p className="text-xs text-gray-500 font-mono">Native share</p>
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
