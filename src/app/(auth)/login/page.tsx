'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

// SVG Icons
const Icons = {
  eye: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  eyeOff: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  ),
  arrowRight: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials')
      }

      toast.success('Welcome back!')
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to log in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            GitoLink
          </Link>
          <Link 
            href="/register"
            className="text-sm text-gray-400 hover:text-white transition-colors font-mono"
          >
            Don't have an account?
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 pt-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              WELCOME
              <span className="text-[#00FF41]"> BACK</span>
            </h1>
            <div className="w-16 h-[2px] bg-[#00FF41] mx-auto mb-4" />
            <p className="text-gray-400 font-mono text-sm">
              Sign in to manage your links
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-mono text-gray-500 mb-2 tracking-wider uppercase">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-0 py-4 bg-transparent border-b-2 border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-[#00FF41] transition-colors text-lg"
                placeholder="you@example.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-mono text-gray-500 mb-2 tracking-wider uppercase">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-0 py-4 bg-transparent border-b-2 border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-[#00FF41] transition-colors text-lg pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors p-2"
                >
                  {showPassword ? Icons.eyeOff : Icons.eye}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 px-6 py-4 bg-white text-black font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <span className="font-mono">AUTHENTICATING...</span>
              ) : (
                <>
                  <span>SIGN IN</span>
                  <span className="group-hover:translate-x-1 transition-transform">{Icons.arrowRight}</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 pt-8 border-t border-gray-900">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <Link 
                href="/register" 
                className="text-sm text-gray-500 hover:text-white transition-colors font-mono"
              >
                Create an account →
              </Link>
              
              <Link 
                href="https://github.com/jaaberaziz-code/gitolink"
                target="_blank"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-white transition-colors text-sm"
              >
                {Icons.github}
                <span className="font-mono">Star on GitHub</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Grid Background Decoration */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>
    </div>
  )
}
