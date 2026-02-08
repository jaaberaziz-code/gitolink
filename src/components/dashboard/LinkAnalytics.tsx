'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { FiArrowUp, FiArrowDown, FiExternalLink, FiMousePointer } from 'react-icons/fi'
import { formatNumber } from '@/lib/utils'

interface LinkPerformance {
  linkId: string
  title: string
  count: number
  url?: string
  previousCount?: number
}

interface LinkAnalyticsProps {
  links: LinkPerformance[]
  totalClicks: number
  sortBy?: 'clicks' | 'name'
  sortOrder?: 'asc' | 'desc'
}

export default function LinkAnalytics({ 
  links, 
  totalClicks, 
  sortBy = 'clicks',
  sortOrder = 'desc'
}: LinkAnalyticsProps) {
  // Sort and calculate derived data
  const processedLinks = useMemo(() => {
    const sorted = [...links].sort((a, b) => {
      if (sortBy === 'clicks') {
        return sortOrder === 'desc' ? b.count - a.count : a.count - b.count
      }
      return sortOrder === 'desc' 
        ? b.title.localeCompare(a.title)
        : a.title.localeCompare(b.title)
    })

    return sorted.map(link => {
      const sharePercentage = totalClicks > 0 
        ? Math.round((link.count / totalClicks) * 100) 
        : 0
      
      // Calculate trend if previous data exists
      let trend: 'up' | 'down' | 'neutral' = 'neutral'
      let trendPercentage = 0
      
      if (link.previousCount !== undefined && link.previousCount > 0) {
        const diff = link.count - link.previousCount
        trendPercentage = Math.round((diff / link.previousCount) * 100)
        trend = diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral'
      }

      return {
        ...link,
        sharePercentage,
        trend,
        trendPercentage: Math.abs(trendPercentage)
      }
    })
  }, [links, totalClicks, sortBy, sortOrder])

  // Get top performer
  const topPerformer = processedLinks[0]

  if (processedLinks.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <FiMousePointer className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No link data available</p>
        <p className="text-gray-500 text-sm mt-1">Add links to see performance analytics</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-4"
        >
          <p className="text-gray-400 text-xs uppercase tracking-wider">Top Link</p>
          <p className="text-white font-semibold truncate mt-1">
            {topPerformer?.title || 'N/A'}
          </p>
          <p className="text-blue-400 text-sm">
            {formatNumber(topPerformer?.count || 0)} clicks
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card rounded-xl p-4"
        >
          <p className="text-gray-400 text-xs uppercase tracking-wider">Avg Clicks/Link</p>
          <p className="text-2xl font-bold text-white mt-1">
            {formatNumber(Math.round(totalClicks / links.length))}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-4"
        >
          <p className="text-gray-400 text-xs uppercase tracking-wider">Active Links</p>
          <p className="text-2xl font-bold text-white mt-1">{links.length}</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card rounded-xl p-4"
        >
          <p className="text-gray-400 text-xs uppercase tracking-wider">Engagement</p>
          <p className="text-2xl font-bold text-green-400 mt-1">
            {totalClicks > 0 ? 'High' : 'Low'}
          </p>
        </motion.div>
      </div>

      {/* Link Performance Cards */}
      <div className="space-y-3">
        {processedLinks.map((link, index) => (
          <motion.div
            key={link.linkId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-card rounded-xl p-4 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-4">
              {/* Rank */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                index === 0 
                  ? 'bg-yellow-500/20 text-yellow-400' 
                  : index === 1 
                    ? 'bg-gray-400/20 text-gray-300'
                    : index === 2
                      ? 'bg-orange-600/20 text-orange-400'
                      : 'bg-white/5 text-gray-500'
              }`}>
                {index + 1}
              </div>

              {/* Link Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-white font-medium truncate">{link.title}</h4>
                  {link.url && (
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-blue-400 transition-colors"
                    >
                      <FiExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                
                {/* Progress Bar */}
                <div className="mt-2">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${link.sharePercentage}%` }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className={`h-full rounded-full ${
                        index === 0 
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                          : 'bg-gradient-to-r from-blue-500 to-purple-500'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-xl font-bold text-white">
                    {formatNumber(link.count)}
                  </span>
                  
                  {/* Trend Indicator */}
                  {link.trend !== 'neutral' && (
                    <span className={`flex items-center text-xs ${
                      link.trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {link.trend === 'up' ? (
                        <FiArrowUp className="w-3 h-3" />
                      ) : (
                        <FiArrowDown className="w-3 h-3" />
                      )}
                      {link.trendPercentage}%
                    </span>
                  )}
                </div>
                
                {/* Share Percentage */}
                <p className="text-gray-400 text-sm">
                  {link.sharePercentage}% of total
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
