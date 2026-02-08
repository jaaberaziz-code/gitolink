'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { FiArrowRight, FiExternalLink, FiCopy, FiCheck } from 'react-icons/fi'

interface CelebrationProps {
  onComplete: () => void
}

export function Celebration({ onComplete }: CelebrationProps) {
  const [copied, setCopied] = useState(false)
  const [profileUrl, setProfileUrl] = useState('')

  useEffect(() => {
    // Get the username from URL or localStorage
    const username = typeof window !== 'undefined' 
      ? window.location.pathname.split('/').pop() || 'your-profile'
      : 'your-profile'
    setProfileUrl(`${window.location.origin}/${username}`)

    // Trigger confetti burst
    const duration = 3000
    const end = Date.now() + duration

    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b']

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
        disableForReducedMotion: true,
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
        disableForReducedMotion: true,
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }

    // Initial burst
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors,
      disableForReducedMotion: true,
    })

    // Continuous burst
    frame()

    // Additional bursts
    const bursts = setInterval(() => {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: colors,
        disableForReducedMotion: true,
      })
    }, 800)

    return () => clearInterval(bursts)
  }, [])

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }, [profileUrl])

  return (
    <div className="text-center space-y-8 py-8">
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          type: 'spring',
          stiffness: 200,
          damping: 15,
          delay: 0.1 
        }}
        className="relative inline-flex"
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/30">
          <motion.svg
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="w-12 h-12 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </motion.svg>
        </div>

        {/* Orbiting particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 rounded-full"
            style={{
              background: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444'][i],
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.2,
            }}
            initial={{
              x: Math.cos((i * Math.PI) / 3) * 60,
              y: Math.sin((i * Math.PI) / 3) * 60,
            }}
          />
        ))}
      </motion.div>

      {/* Congratulations Text */}
      <div className="space-y-2">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl sm:text-5xl font-bold text-white"
        >
          Welcome to{' '}
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            GitoLink!
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-gray-400"
        >
          Your profile is ready to share 🎉
        </motion.p>
      </div>

      {/* Profile Link Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 max-w-md mx-auto"
      >
        <p className="text-gray-400 text-sm mb-3">Your profile link</p>
        
        <div className="flex items-center gap-2 bg-gray-900 rounded-xl p-3">
          <div className="flex-1 text-left overflow-hidden">
            <p className="text-blue-400 font-medium truncate">
              {profileUrl}
            </p>
          </div>
          
          <button
            onClick={handleCopyLink}
            className={`
              p-2 rounded-lg transition-all flex-shrink-0
              ${copied 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }
            `}
            title={copied ? 'Copied!' : 'Copy link'}
          >
            {copied ? <FiCheck className="w-5 h-5" /> : <FiCopy className="w-5 h-5" />}
          </button>
        </div>

        {copied && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-green-400 text-sm mt-2"
          >
            Link copied to clipboard!
          </motion.p>
        )}
      </motion.div>

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-3 gap-4 max-w-lg mx-auto"
      >
        {[
          { icon: '✨', title: 'Customize', desc: 'Themes & colors' },
          { icon: '🔗', title: 'Add Links', desc: 'All your content' },
          { icon: '📊', title: 'Analytics', desc: 'Track visits' },
        ].map((tip, index) => (
          <motion.div
            key={tip.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            className="text-center p-4 bg-gray-800/50 rounded-xl border border-gray-700/50"
          >
            <div className="text-2xl mb-2">{tip.icon}</div>
            <p className="text-white font-medium text-sm">{tip.title}</p>
            <p className="text-gray-500 text-xs">{tip.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <button
          onClick={onComplete}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
        >
          Go to Dashboard
          <FiArrowRight className="w-5 h-5" />
        </button>

        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all border border-gray-700"
        >
          View Profile
          <FiExternalLink className="w-5 h-5" />
        </a>
      </motion.div>
    </div>
  )
}
