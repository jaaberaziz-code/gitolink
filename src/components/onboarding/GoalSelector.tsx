'use client'

import { motion } from 'framer-motion'
import { FiUser, FiBriefcase, FiHeart, FiUsers, FiTrendingUp, FiGlobe } from 'react-icons/fi'
import type { OnboardingGoal } from './OnboardingWizard'

interface GoalOption {
  id: OnboardingGoal
  title: string
  description: string
  icon: React.ReactNode
  features: string[]
  color: string
}

const goals: GoalOption[] = [
  {
    id: 'creator',
    title: 'Content Creator',
    description: 'Share your content and grow your audience across platforms',
    icon: <FiTrendingUp className="w-8 h-8" />,
    features: ['Link all your social profiles', 'Track audience engagement', 'Showcase your content'],
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'business',
    title: 'Business',
    description: 'Promote your brand and drive traffic to your products',
    icon: <FiBriefcase className="w-8 h-8" />,
    features: ['Professional branding', 'Product showcase', 'Analytics insights'],
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'personal',
    title: 'Personal',
    description: 'Create a simple page to share with friends and family',
    icon: <FiHeart className="w-8 h-8" />,
    features: ['Easy to share', 'Personal branding', 'Keep it simple'],
    color: 'from-emerald-500 to-teal-500',
  },
]

interface GoalSelectorProps {
  selected: OnboardingGoal | null
  onSelect: (goal: OnboardingGoal) => void
}

export function GoalSelector({ selected, onSelect }: GoalSelectorProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-bold text-white"
        >
          What's your goal?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 text-lg"
        >
          We'll customize your experience based on your needs
        </motion.p>
      </div>

      {/* Goal Options */}
      <div className="grid gap-4">
        {goals.map((goal, index) => (
          <motion.button
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(goal.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative w-full p-6 rounded-2xl text-left transition-all duration-300
              ${selected === goal.id
                ? 'bg-gray-800 ring-2 ring-blue-500 shadow-lg shadow-blue-500/20'
                : 'bg-gray-800/50 hover:bg-gray-800 ring-1 ring-gray-700 hover:ring-gray-600'
              }
            `}
          >
            <div className="flex items-start gap-5">
              {/* Icon */}
              <div className={`
                w-16 h-16 rounded-xl bg-gradient-to-br ${goal.color}
                flex items-center justify-center text-white flex-shrink-0
                ${selected === goal.id ? 'shadow-lg' : ''}
              `}>
                {goal.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-semibold text-white mb-1">
                  {goal.title}
                </h3>
                <p className="text-gray-400 mb-3">
                  {goal.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {goal.features.map((feature) => (
                    <span
                      key={feature}
                      className={`
                        text-xs px-3 py-1 rounded-full font-medium
                        ${selected === goal.id
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-gray-700/50 text-gray-400'
                        }
                      `}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Selection Indicator */}
              <div className={`
                w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1
                ${selected === goal.id
                  ? 'bg-blue-500 border-blue-500'
                  : 'border-gray-600'
                }
              `}>
                {selected === goal.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-3 h-3 bg-white rounded-full"
                  />
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Stats / Social Proof */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center justify-center gap-8 pt-4"
      >
        <div className="flex items-center gap-2 text-gray-500">
          <FiUsers className="w-5 h-5" />
          <span className="text-sm">10K+ Creators</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <FiGlobe className="w-5 h-5" />
          <span className="text-sm">Worldwide</span>
        </div>
      </motion.div>
    </div>
  )
}
