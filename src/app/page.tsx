'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

// SVG Icons (no emojis)
const Icons = {
  arrowRight: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  play: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M3 3v18h18M18 17V9M12 17V5M6 17v-5" />
    </svg>
  ),
  palette: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  qr: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#00FF41] selection:text-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            GitoLink
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#themes" className="text-sm text-gray-400 hover:text-white transition-colors">
              Themes
            </Link>
            <Link href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link 
              href="/login" 
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link 
              href="/register"
              className="px-4 py-2 bg-white text-black text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Get Started
            </Link>
          </div>

          <button 
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black border-b border-gray-800 px-6 py-4 space-y-4">
            <Link href="#features" className="block text-gray-400 hover:text-white">Features</Link>
            <Link href="#themes" className="block text-gray-400 hover:text-white">Themes</Link>
            <Link href="#pricing" className="block text-gray-400 hover:text-white">Pricing</Link>
            <Link href="/login" className="block text-gray-400 hover:text-white">Login</Link>
            <Link href="/register" className="block text-white font-medium">Get Started</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6">
                YOUR LINKS
                <br />
                <span className="text-gray-500">YOUR BRAND</span>
                <br />
                <span className="text-[#00FF41]">YOUR ANALYTICS</span>
              </h1>
              
              <div className="w-24 h-[2px] bg-gray-700 mb-6" />
              
              <p className="text-lg text-gray-400 font-mono mb-8 max-w-md">
                One link. Infinite possibilities. Professional link-in-bio platform for creators who demand more.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/register"
                  className="group inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-medium hover:bg-gray-200 transition-colors"
                >
                  Get Started Free
                  <span className="group-hover:translate-x-1 transition-transform">{Icons.arrowRight}</span>
                </Link>
                
                <button className="inline-flex items-center gap-2 px-6 py-3 border border-gray-700 text-white hover:border-gray-500 transition-colors">
                  {Icons.play}
                  Watch Demo
                </button>
              </div>

              {/* Trust badge */}
              <div className="mt-12 inline-flex items-center gap-3 px-4 py-2 border border-gray-800 font-mono text-sm text-gray-500">
                <span className="w-2 h-2 bg-[#00FF41] rounded-full animate-pulse" />
                Trusted by 50,000+ creators
              </div>
            </motion.div>

            {/* Right: Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="relative mx-auto w-[300px] h-[600px] bg-gray-900 rounded-[3rem] p-3 border border-gray-800">
                {/* Phone screen */}
                <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden">
                  {/* Mock UI */}
                  <div className="p-6 h-full flex flex-col">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full mx-auto mb-4" />
                    <div className="h-4 w-32 bg-gray-800 rounded mx-auto mb-2" />
                    <div className="h-3 w-24 bg-gray-800 rounded mx-auto mb-8" />
                    
                    <div className="space-y-3">
                      <div className="h-12 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg" />
                      <div className="h-12 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg" />
                      <div className="h-12 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg" />
                      <div className="h-12 bg-gradient-to-r from-[#00FF41]/20 to-gray-900 rounded-lg border border-[#00FF41]/30" />
                    </div>
                  </div>
                </div>
                
                {/* Notch */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full" />
              </div>

              {/* Floating elements */}
              <motion.div 
                className="absolute -top-4 -right-4 px-3 py-1 bg-gray-900 border border-gray-800 text-xs font-mono"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                +1,234 clicks
              </motion.div>
              
              <motion.div 
                className="absolute -bottom-4 -left-4 px-3 py-1 bg-gray-900 border border-gray-800 text-xs font-mono"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                Live analytics
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 border-t border-gray-900">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">WHY GITOLINK?</h2>
            <div className="w-16 h-[2px] bg-[#00FF41]" />
          </motion.div>

          <div className="space-y-24">
            {/* Feature 1: Analytics */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                className="relative aspect-video bg-gray-900 border border-gray-800 overflow-hidden group"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-transparent" />
                <div className="absolute top-4 left-4 text-[120px] font-bold text-gray-800/30 font-mono leading-none select-none">
                  01
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-32 bg-gray-800 rounded-lg p-4">
                    <div className="flex items-end justify-between h-full gap-2">
                      <div className="w-8 h-16 bg-[#00FF41]/60 rounded" />
                      <div className="w-8 h-24 bg-[#00FF41]/80 rounded" />
                      <div className="w-8 h-20 bg-[#00FF41]/60 rounded" />
                      <div className="w-8 h-28 bg-[#00FF41] rounded" />
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[#00FF41]">{Icons.chart}</span>
                  <span className="text-sm font-mono text-gray-500">01</span>
                </div>
                <h3 className="text-3xl font-bold mb-4">DEEP ANALYTICS</h3>
                <p className="text-gray-400 font-mono leading-relaxed">
                  Track every click. Know your audience. Real-time data on devices, locations, and engagement patterns.
                </p>
              </motion.div>
            </div>

            {/* Feature 2: Themes */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                className="order-2 lg:order-1"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[#00FF41]">{Icons.palette}</span>
                  <span className="text-sm font-mono text-gray-500">02</span>
                </div>
                <h3 className="text-3xl font-bold mb-4">STUNNING THEMES</h3>
                <p className="text-gray-400 font-mono leading-relaxed">
                  20+ premium designs. From brutalist minimalism to cyberpunk neon. Zero coding required.
                </p>
              </motion.div>
              
              <motion.div 
                className="relative aspect-video bg-gray-900 border border-gray-800 overflow-hidden order-1 lg:order-2"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="absolute top-4 right-4 text-[120px] font-bold text-gray-800/30 font-mono leading-none select-none">
                  02
                </div>
                <div className="absolute inset-0 flex items-center justify-center gap-4">
                  <div className="w-16 h-24 bg-gradient-to-b from-purple-500 to-pink-500 rounded" />
                  <div className="w-16 h-24 bg-gradient-to-b from-blue-500 to-cyan-500 rounded" />
                  <div className="w-16 h-24 bg-gradient-to-b from-gray-700 to-black border border-gray-600 rounded" />
                </div>
              </motion.div>
            </div>

            {/* Feature 3: QR Codes */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                className="relative aspect-video bg-gray-900 border border-gray-800 overflow-hidden"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="absolute top-4 left-4 text-[120px] font-bold text-gray-800/30 font-mono leading-none select-none">
                  03
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 border-2 border-[#00FF41] p-2">
                    <div className="w-full h-full grid grid-cols-5 grid-rows-5 gap-1">
                      {[...Array(25)].map((_, i) => (
                        <div 
                          key={i} 
                          className={`${Math.random() > 0.5 ? 'bg-[#00FF41]' : 'bg-transparent'}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[#00FF41]">{Icons.qr}</span>
                  <span className="text-sm font-mono text-gray-500">03</span>
                </div>
                <h3 className="text-3xl font-bold mb-4">QR CODES</h3>
                <p className="text-gray-400 font-mono leading-relaxed">
                  Instant sharing. Offline to online. Every link gets a unique QR code. Download as PNG or SVG.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 border-t border-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              READY TO UPGRADE
              <br />
              <span className="text-[#00FF41]">YOUR LINK?</span>
            </h2>
            <p className="text-gray-400 font-mono mb-8 max-w-lg mx-auto">
              Join 50,000+ creators who trust GitoLink. Free forever.
            </p>
            <Link 
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#00FF41] text-black font-bold text-lg hover:bg-[#00FF41]/90 transition-colors"
            >
              Create Your Link
              {Icons.arrowRight}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-bold text-lg mb-4">GITOLINK</h3>
              <p className="text-gray-500 font-mono text-sm">
                One link. Your brand. Your analytics.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-gray-500 font-mono">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#themes" className="hover:text-white transition-colors">Themes</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-gray-500 font-mono">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4 text-sm">Connect</h4>
              <div className="flex gap-4">
                <a href="https://twitter.com" className="text-gray-500 hover:text-white transition-colors">
                  {Icons.twitter}
                </a>
                <a href="https://github.com" className="text-gray-500 hover:text-white transition-colors">
                  {Icons.github}
                </a>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 font-mono text-sm">
              © 2026 GitoLink. Open source forever.
            </p>
            <div className="flex gap-6 text-sm text-gray-600 font-mono">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
