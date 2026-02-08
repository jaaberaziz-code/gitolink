'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { FiArrowRight, FiArrowLeft, FiCheck } from 'react-icons/fi'
import { GoalSelector } from './GoalSelector'
import { PlatformSelector } from './PlatformSelector'
import { ThemeSelector } from './ThemeSelector'
import { ProfileSetup } from './ProfileSetup'
import { Celebration } from './Celebration'

export type OnboardingGoal = 'creator' | 'business' | 'personal'

export interface OnboardingData {
  goal: OnboardingGoal | null
  platforms: string[]
  theme: string
  profile: {
    name: string
    bio: string
    avatar: string | null
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
    avatar: null,
  },
}

export function OnboardingWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<OnboardingData>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  // Load progress from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setData(parsed.data || initialData)
        setCurrentStep(parsed.step || 1)
      } catch {
        // Invalid saved data, start fresh
      }
    }
  }, [])

  // Save progress to localStorage whenever data or step changes
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

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    
    try {
      // Save profile data to backend
      const profileRes = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.profile.name,
          bio: data.profile.bio,
          avatar_url: data.profile.avatar,
          theme: data.theme,
        }),
      })

      if (!profileRes.ok) {
        throw new Error('Failed to save profile')
      }

      // Save platforms as links
      if (data.platforms.length > 0) {
        const platformLinks = data.platforms.map((platformId, index) => ({
          title: platformId.charAt(0).toUpperCase() + platformId.slice(1),
          url: '', // User will fill this in dashboard
          icon: platformId,
          order: index,
        }))

        for (const link of platformLinks) {
          await fetch('/api/links', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(link),
          })
        }
      }

      // Clear onboarding progress
      localStorage.removeItem(STORAGE_KEY)
      
      setIsCompleted(true)
      setCurrentStep(5)
      toast.success('Welcome to GitoLink!')
    } catch (error) {
      toast.error('Failed to complete setup. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoToDashboard = () => {
    router.push('/dashboard')
    router.refresh()
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return data.goal !== null
      case 2:
        return true // Platforms are optional
      case 3:
        return data.theme !== ''
      case 4:
        return data.profile.name.trim().length > 0
      default:
        return true
    }
  }

  const steps = [
    { number: 1, title: 'Goal', description: 'What brings you here?' },
    { number: 2, title: 'Platforms', description: 'Where are you active?' },
    { number: 3, title: 'Theme', description: 'Pick your style' },
    { number: 4, title: 'Profile', description: 'Tell us about you' },
    { number: 5, title: 'Done', description: 'Ready to go!' },
  ]

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Progress Header */}
      {!isCompleted && (
        <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
          <div className="max-w-4xl mx-auto px-4 py-6">
            {/* Progress Steps */}
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={false}
                      animate={{
                        backgroundColor: currentStep >= step.number ? '#3b82f6' : '#374151',
                        scale: currentStep === step.number ? 1.1 : 1,
                      }}
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        font-semibold text-sm transition-colors
                        ${currentStep >= step.number ? 'text-white' : 'text-gray-400'}
                      `}
                    >
                      {currentStep > step.number ? (
                        <FiCheck className="w-5 h-5" />
                      ) : (
                        step.number
                      )}
                    </motion.div>
                    <span className={`
                      mt-2 text-xs font-medium hidden sm:block
                      ${currentStep >= step.number ? 'text-blue-400' : 'text-gray-500'}
                    `}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`
                      w-12 sm:w-24 h-1 mx-2 sm:mx-4 rounded-full transition-colors
                      ${currentStep > step.number ? 'bg-blue-500' : 'bg-gray-700'}
                    `} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <GoalSelector
                  selected={data.goal}
                  onSelect={(goal) => updateData({ goal })}
                />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <PlatformSelector
                  selected={data.platforms}
                  onChange={(platforms) => updateData({ platforms })}
                />
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ThemeSelector
                  selected={data.theme}
                  onSelect={(theme) => updateData({ theme })}
                />
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ProfileSetup
                  data={data.profile}
                  onChange={(profile) => updateData({ profile })}
                />
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Celebration onComplete={handleGoToDashboard} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Footer */}
      {!isCompleted && currentStep < 5 && (
        <div className="bg-gray-800/50 backdrop-blur-sm border-t border-gray-700">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors
                ${currentStep === 1
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }
              `}
            >
              <FiArrowLeft className="w-5 h-5" />
              Back
            </button>

            {currentStep === 4 ? (
              <button
                onClick={handleComplete}
                disabled={!canProceed() || isLoading}
                className={`
                  flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all
                  ${canProceed() && !isLoading
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Complete
                    <FiCheck className="w-5 h-5" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`
                  flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all
                  ${canProceed()
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/25'
                    : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                Continue
                <FiArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
