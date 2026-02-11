'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

// SVG Icons
const Icons = {
  arrowRight: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  arrowLeft: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="w-6 h-6">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-8 h-8">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  briefcase: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-8 h-8">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  sparkles: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-8 h-8">
      <path d="M12 3L14.5 8.5L20 11L14.5 13.5L12 19L9.5 13.5L4 11L9.5 8.5L12 3Z" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  camera: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  )
}

export type OnboardingGoal = 'creator' | 'business' | 'personal'

export interface OnboardingData {
  goal: OnboardingGoal | null
  platforms: string[]
  theme: string
  profile: {
    name: string
    bio: string
  }
}

const STORAGE_KEY = 'gitolink_onboarding_progress'

const initialData: OnboardingData = {
  goal: null,
  platforms: [],
  theme: 'cyberpunk',
  profile: {
    name: '',
    bio: '',
  },
}

const goals = [
  { id: 'creator' as OnboardingGoal, label: 'CREATOR', description: 'Share content \u0026 grow audience', icon: Icons.sparkles },
  { id: 'business' as OnboardingGoal, label: 'BUSINESS', description: 'Professional presence', icon: Icons.briefcase },
  { id: 'personal' as OnboardingGoal, label: 'PERSONAL', description: 'Connect with friends', icon: Icons.user },
]

const platforms = [
  { id: 'twitter', label: 'Twitter', icon: Icons.twitter },
  { id: 'instagram', label: 'Instagram', icon: Icons.instagram },
  { id: 'youtube', label: 'YouTube', icon: Icons.youtube },
  { id: 'github', label: 'GitHub', icon: Icons.github },
  { id: 'linkedin', label: 'LinkedIn', icon: Icons.linkedin },
  { id: 'tiktok', label: 'TikTok', icon: Icons.tiktok },
]

const themes = [
  { id: 'cyberpunk', name: 'CYBERPUNK', gradient: 'from-pink-500 via-purple-500 to-cyan-500' },
  { id: 'matrix', name: 'MATRIX', gradient: 'from-green-400 to-black' },
  { id: 'minimal', name: 'MINIMAL', gradient: 'from-gray-100 to-white' },
  { id: 'sunset', name: 'SUNSET', gradient: 'from-orange-500 via-red-500 to-purple-500' },
  { id: 'midnight', name: 'MIDNIGHT', gradient: 'from-indigo-900 via-purple-900 to-black' },
  { id: 'executive', name: 'EXECUTIVE', gradient: 'from-slate-700 to-slate-900' },
]

export function OnboardingWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<OnboardingData>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setData(parsed.data || initialData)
        setCurrentStep(parsed.step || 1)
      } catch {}
    }
  }, [])

  useEffect(() => {
    if (!isCompleted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        step: currentStep,
        data,
        timestamp: Date.now(),
      }))
    }
  }, [currentStep, data, isCompleted])

  const updateData = useCallback((updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }))
  }, [])

  const togglePlatform = (platformId: string) => {
    setData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(p => p !== platformId)
        : [...prev.platforms, platformId]
    }))
  }

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(prev => prev + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1)
  }

  const handleComplete = async () => {
    setIsLoading(true)
    
    try {
      const profileRes = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.profile.name,
          bio: data.profile.bio,
          theme: data.theme,
        }),
      })

      if (!profileRes.ok) throw new Error('Failed to save profile')

      if (data.platforms.length > 0) {
        for (const platformId of data.platforms) {
          await fetch('/api/links', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: platformId.charAt(0).toUpperCase() + platformId.slice(1),
              url: '',
              icon: platformId,
            }),
          })
        }
      }

      localStorage.removeItem(STORAGE_KEY)
      setIsCompleted(true)
      toast.success('Welcome to GitoLink!')
    } catch (error) {
      toast.error('Failed to complete setup')
    } finally {
      setIsLoading(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return data.goal !== null
      case 2: return true
      case 3: return data.theme !== ''
      case 4: return data.profile.name.trim().length > 0
      default: return true
    }
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-[#00FF41] flex items-center justify-center mx-auto mb-8">
            <span className="text-black">{Icons.check}</span>
          </div>
          
          <h1 className="text-5xl font-bold mb-4">
            YOU'RE
            <span className="text-[#00FF41]"> READY</span>
          </h1>
          
          <p className="text-gray-400 font-mono mb-8">Your link page is live!</p>
          
          <button
            onClick={() => router.push('/dashboard')}
            className="px-8 py-4 bg-[#00FF41] text-black font-bold hover:bg-[#00CC33] transition-colors"
          >
            GO TO DASHBOARD
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Progress Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xl font-bold">GITOLINK</span>
            <span className="font-mono text-sm text-gray-500">
              STEP 0{currentStep} / 05
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`h-1 flex-1 transition-colors ${
                  step <= currentStep ? 'bg-[#00FF41]' : 'bg-gray-800'
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {/* STEP 1: GOAL */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-4xl font-bold mb-2">
                  WHAT BRINGS
                  <span className="text-[#00FF41]"> YOU HERE?</span>
                </h2>
                <p className="text-gray-400 font-mono mb-8">Select your primary goal</p>
                
                <div className="grid grid-cols-3 gap-4">
                  {goals.map((goal) => (
                    <button
                      key={goal.id}
                      onClick={() => updateData({ goal: goal.id })}
                      className={`p-6 border-2 text-center transition-all ${
                        data.goal === goal.id
                          ? 'border-[#00FF41] bg-[#00FF41]/5'
                          : 'border-gray-800 hover:border-gray-600'
                      }`}
                    >
                      <div className={`mb-4 ${data.goal === goal.id ? 'text-[#00FF41]' : 'text-gray-400'}`}>
                        {goal.icon}
                      </div>
                      <p className="font-bold mb-1">{goal.label}</p>
                      <p className="text-xs text-gray-500">{goal.description}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: PLATFORMS */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-4xl font-bold mb-2">
                  WHERE ARE YOU
                  <span className="text-[#00FF41]"> ACTIVE?</span>
                </h2>
                <p className="text-gray-400 font-mono mb-8">Select platforms (optional)</p>
                
                <div className="grid grid-cols-3 gap-4">
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      className={`p-4 border-2 flex items-center gap-3 transition-all ${
                        data.platforms.includes(platform.id)
                          ? 'border-[#00FF41] bg-[#00FF41]/5'
                          : 'border-gray-800 hover:border-gray-600'
                      }`}
                    >
                      <span className={data.platforms.includes(platform.id) ? 'text-[#00FF41]' : 'text-gray-400'}>
                        {platform.icon}
                      </span>
                      <span className="font-medium">{platform.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 3: THEME */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-4xl font-bold mb-2">
                  PICK YOUR
                  <span className="text-[#00FF41]"> STYLE</span>
                </h2>
                <p className="text-gray-400 font-mono mb-8">Choose a theme for your page</p>
                
                <div className="grid grid-cols-3 gap-4">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => updateData({ theme: theme.id })}
                      className={`relative h-32 border-2 overflow-hidden transition-all ${
                        data.theme === theme.id ? 'border-[#00FF41]' : 'border-gray-800 hover:border-gray-600'
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`} />
                      <span className="absolute bottom-0 left-0 right-0 p-2 bg-black/80 font-mono text-sm">
                        {theme.name}
                      </span>
                      
                      {data.theme === theme.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-[#00FF41] flex items-center justify-center">
                          <span className="text-black">{Icons.check}</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 4: PROFILE */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-4xl font-bold mb-2">
                  TELL US ABOUT
                  <span className="text-[#00FF41]"> YOU</span>
                </h2>
                <p className="text-gray-400 font-mono mb-8">Complete your profile</p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-mono text-gray-500 mb-2 uppercase">Display Name *</label>
                    <input
                      type="text"
                      value={data.profile.name}
                      onChange={(e) => updateData({ profile: { ...data.profile, name: e.target.value } })}
                      className="w-full bg-transparent border-b-2 border-gray-800 py-3 text-white focus:border-[#00FF41] focus:outline-none text-lg"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-mono text-gray-500 mb-2 uppercase">Bio (optional)</label>
                    <textarea
                      value={data.profile.bio}
                      onChange={(e) => updateData({ profile: { ...data.profile, bio: e.target.value } })}
                      className="w-full bg-[#0a0a0a] border border-gray-800 p-4 text-white focus:border-[#00FF41] focus:outline-none resize-none"
                      rows={3}
                      placeholder="Tell people about yourself..."
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Navigation Footer */}
      <footer className="border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              currentStep === 1
                ? 'text-gray-700 cursor-not-allowed'
                : 'text-gray-400 hover:text-white border border-gray-800 hover:border-gray-600'
            }`}
          >
            {Icons.arrowLeft}
            BACK
          </button>

          {currentStep === 4 ? (
            <button
              onClick={handleComplete}
              disabled={!canProceed() || isLoading}
              className={`flex items-center gap-2 px-8 py-3 font-bold transition-colors ${
                canProceed() && !isLoading
                  ? 'bg-[#00FF41] text-black hover:bg-[#00CC33]'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? 'SAVING...' : 'COMPLETE'}
              {!isLoading && Icons.check}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-8 py-3 font-bold transition-colors ${
                canProceed()
                  ? 'bg-white text-black hover:bg-gray-200'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              CONTINUE
              {Icons.arrowRight}
            </button>
          )}
        </div>
      </footer>
    </div>
  )
}

export default OnboardingWizard
