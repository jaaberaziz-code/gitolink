'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HexColorPicker } from 'react-colorful'
import toast from 'react-hot-toast'
import {
  FiX,
  FiDownload,
  FiCopy,
  FiPrinter,
  FiSmartphone,
  FiCheck,
  FiRefreshCw,
  FiShare2,
  FiImage,
  FiCode,
} from 'react-icons/fi'

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
  const qrRef = useRef<HTMLDivElement>(null)

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

      if (!response.ok) throw new Error('Failed to generate QR code')

      const data = await response.json()
      
      if (settings.format === 'png') {
        setQrDataUrl(data.dataUrl)
        setSvgContent('')
      } else {
        setSvgContent(data.svg)
        setQrDataUrl('')
      }
    } catch (error) {
      toast.error('Failed to generate QR code')
    } finally {
      setIsGenerating(false)
    }
  }, [profileUrl, settings])

  useEffect(() => {
    if (isOpen) {
      generateQR()
    }
  }, [isOpen, generateQR])

  const handleDownload = () => {
    if (settings.format === 'png' && qrDataUrl) {
      const link = document.createElement('a')
      link.href = qrDataUrl
      link.download = `gitolink-${username}-qr.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('QR code downloaded!')
    } else if (settings.format === 'svg' && svgContent) {
      const blob = new Blob([svgContent], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `gitolink-${username}-qr.svg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      toast.success('QR code downloaded!')
    }
  }

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      toast.success('Profile URL copied!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy URL')
    }
  }

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const qrContent = settings.format === 'png' 
      ? `<img src="${qrDataUrl}" style="max-width: 100%; height: auto;" />`
      : svgContent

    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Code - ${username}</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              font-family: system-ui, -apple-system, sans-serif;
              background: white;
            }
            .qr-container {
              padding: 40px;
              text-align: center;
            }
            .qr-code {
              margin: 20px 0;
            }
            .username {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .url {
              font-size: 14px;
              color: #666;
              word-break: break-all;
            }
            .footer {
              margin-top: 30px;
              font-size: 12px;
              color: #999;
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <div class="username">@${username}</div>
            <div class="qr-code">${qrContent}</div>
            <div class="url">${profileUrl}</div>
            <div class="footer">Scan to visit my GitoLink profile</div>
          </div>
          <script>window.print(); window.close();</script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        // Convert data URL to blob for sharing
        const response = await fetch(qrDataUrl)
        const blob = await response.blob()
        const file = new File([blob], `gitolink-${username}-qr.png`, { type: 'image/png' })
        
        await navigator.share({
          title: `My GitoLink Profile - @${username}`,
          text: `Check out my GitoLink profile: ${profileUrl}`,
          url: profileUrl,
          files: [file],
        })
      } catch (error) {
        // User cancelled or share failed
      }
    } else {
      handleCopyUrl()
    }
  }

  const presetColors = [
    { fg: '#000000', bg: '#ffffff', name: 'Classic' },
    { fg: '#2563eb', bg: '#ffffff', name: 'Blue' },
    { fg: '#7c3aed', bg: '#ffffff', name: 'Purple' },
    { fg: '#059669', bg: '#ffffff', name: 'Green' },
    { fg: '#dc2626', bg: '#ffffff', name: 'Red' },
    { fg: '#000000', bg: '#dbeafe', name: 'Light Blue' },
    { fg: '#000000', bg: '#f3e8ff', name: 'Light Purple' },
    { fg: '#ffffff', bg: '#1f2937', name: 'Dark' },
  ]

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="glass-card w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <FiSmartphone className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">QR Code Generator</h2>
                <p className="text-sm text-gray-400">Share your profile with a scan</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setActiveTab('customize')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'customize'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <FiRefreshCw className="w-4 h-4" />
                Customize
              </span>
            </button>
            <button
              onClick={() => setActiveTab('share')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'share'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <FiShare2 className="w-4 h-4" />
                Share
              </span>
            </button>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Left Panel - Preview */}
            <div className="flex-1 p-6 flex flex-col items-center justify-center bg-black/20 min-h-[400px]">
              <div
                ref={qrRef}
                className="relative p-6 rounded-2xl bg-white shadow-2xl"
                style={{
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                }}
              >
                {isGenerating ? (
                  <div className="w-[300px] h-[300px] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
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
                  />
                ) : null}
                
                {/* GitoLink branding on QR */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-1 rounded-full">
                  <span className="text-xs font-bold text-white">GitoLink</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-white font-medium">@{username}</p>
                <p className="text-gray-400 text-sm mt-1">{profileUrl}</p>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={handleDownload}
                  disabled={isGenerating || (!qrDataUrl && !svgContent)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <FiDownload className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={handlePrint}
                  disabled={isGenerating || (!qrDataUrl && !svgContent)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <FiPrinter className="w-4 h-4" />
                  Print
                </button>
                {navigator.share && (
                  <button
                    onClick={handleShare}
                    disabled={isGenerating || !qrDataUrl}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    <FiShare2 className="w-4 h-4" />
                    Share
                  </button>
                )}
              </div>
            </div>

            {/* Right Panel - Settings */}
            <div className="w-full lg:w-80 p-6 border-t lg:border-t-0 lg:border-l border-white/10 overflow-y-auto max-h-[400px]">
              {activeTab === 'customize' ? (
                <div className="space-y-6">
                  {/* Format */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Format</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSettings((s) => ({ ...s, format: 'png' }))}
                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                          settings.format === 'png'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        <FiImage className="w-4 h-4" />
                        PNG
                      </button>
                      <button
                        onClick={() => setSettings((s) => ({ ...s, format: 'svg' }))}
                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                          settings.format === 'svg'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        <FiCode className="w-4 h-4" />
                        SVG
                      </button>
                    </div>
                  </div>

                  {/* Size */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Size</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['small', 'medium', 'large'] as QRSize[]).map((size) => (
                        <button
                          key={size}
                          onClick={() => setSettings((s) => ({ ...s, size }))}
                          className={`px-3 py-2 rounded-lg text-sm capitalize transition-colors ${
                            settings.size === size
                              ? 'bg-blue-600 text-white'
                              : 'bg-white/5 text-gray-400 hover:bg-white/10'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Presets */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Color Presets</label>
                    <div className="grid grid-cols-4 gap-2">
                      {presetColors.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() =>
                            setSettings((s) => ({
                              ...s,
                              fgColor: preset.fg,
                              bgColor: preset.bg,
                            }))
                          }
                          className={`group relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                            settings.fgColor === preset.fg && settings.bgColor === preset.bg
                              ? 'border-blue-500'
                              : 'border-transparent hover:border-white/20'
                          }`}
                          title={preset.name}
                        >
                          <div
                            className="absolute inset-0"
                            style={{ backgroundColor: preset.bg }}
                          />
                          <div
                            className="absolute inset-2 rounded"
                            style={{ backgroundColor: preset.fg }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Colors */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Custom Colors</label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400 w-12">FG</span>
                        <div className="flex-1">
                          <HexColorPicker
                            color={settings.fgColor}
                            onChange={(color) => setSettings((s) => ({ ...s, fgColor: color }))}
                            style={{ width: '100%', height: '80px' }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400 w-12">BG</span>
                        <div className="flex-1">
                          <HexColorPicker
                            color={settings.bgColor}
                            onChange={(color) => setSettings((s) => ({ ...s, bgColor: color }))}
                            style={{ width: '100%', height: '80px' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Error Correction */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Error Correction</label>
                    <select
                      value={settings.errorCorrectionLevel}
                      onChange={(e) =>
                        setSettings((s) => ({ ...s, errorCorrectionLevel: e.target.value as any }))
                      }
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="L">Low (~7%)</option>
                      <option value="M">Medium (~15%)</option>
                      <option value="Q">Quartile (~25%)</option>
                      <option value="H">High (~30%)</option>
                    </select>
                  </div>

                  {/* Margin Toggle */}
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-300">Include Margin</label>
                    <button
                      onClick={() => setSettings((s) => ({ ...s, includeMargin: !s.includeMargin }))}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.includeMargin ? 'bg-blue-600' : 'bg-white/20'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          settings.includeMargin ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Regenerate Button */}
                  <button
                    onClick={generateQR}
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white rounded-lg transition-colors"
                  >
                    <FiRefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                    Regenerate
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Profile URL */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Profile URL</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={profileUrl}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none"
                      />
                      <button
                        onClick={handleCopyUrl}
                        className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        title="Copy URL"
                      >
                        {copied ? <FiCheck className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Share Options */}
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Share Options</label>
                    <div className="space-y-2">
                      <button
                        onClick={handleCopyUrl}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left"
                      >
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                          <FiCopy className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Copy Link</p>
                          <p className="text-gray-400 text-sm">Copy profile URL to clipboard</p>
                        </div>
                      </button>

                      <button
                        onClick={handleDownload}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left"
                      >
                        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                          <FiDownload className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Download QR</p>
                          <p className="text-gray-400 text-sm">Save as PNG or SVG file</p>
                        </div>
                      </button>

                      <button
                        onClick={handlePrint}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left"
                      >
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          <FiPrinter className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Print QR Code</p>
                          <p className="text-gray-400 text-sm">Print with custom branding</p>
                        </div>
                      </button>

                      {navigator.share && (
                        <button
                          onClick={handleShare}
                          className="w-full flex items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-left"
                        >
                          <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                            <FiShare2 className="w-5 h-5 text-orange-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">Share</p>
                            <p className="text-gray-400 text-sm">Share via device options</p>
                          </div>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="p-4 bg-blue-500/10 rounded-xl">
                    <p className="text-sm text-blue-300">
                      <strong className="text-blue-400">Tip:</strong> Use high error correction levels
                      if you plan to add a logo or image to your QR code.
                    </p>
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
