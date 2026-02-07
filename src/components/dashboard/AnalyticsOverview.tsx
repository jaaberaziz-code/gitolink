'use client'

import { useState, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Line, Bar, Pie } from 'react-chartjs-2'
import { formatNumber } from '@/lib/utils'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export default function AnalyticsOverview() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(30)

  useEffect(() => {
    fetchAnalytics()
  }, [days])

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`/api/analytics?days=${days}`)
      if (res.ok) {
        const analyticsData = await res.json()
        setData(analyticsData)
      }
    } catch {
      console.error('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="glass-dark rounded-xl p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="glass-dark rounded-xl p-12 text-center">
        <p className="text-gray-400">Failed to load analytics</p>
      </div>
    )
  }

  const timelineChartData = {
    labels: data.timelineData.map((d: any) => d.date),
    datasets: [
      {
        label: 'Clicks',
        data: data.timelineData.map((d: any) => d.count),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const linkChartData = {
    labels: data.clicksPerLink.map((l: any) =>
      l.title.length > 20 ? l.title.slice(0, 20) + '...' : l.title
    ),
    datasets: [
      {
        label: 'Clicks',
        data: data.clicksPerLink.map((l: any) => l.count),
        backgroundColor: [
          '#3b82f6',
          '#8b5cf6',
          '#ec4899',
          '#10b981',
          '#f59e0b',
          '#ef4444',
        ],
      },
    ],
  }

  const deviceChartData = {
    labels: data.deviceStats.map((d: any) => d.device),
    datasets: [
      {
        data: data.deviceStats.map((d: any) => d.count),
        backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'],
      },
    ],
  }

  const browserChartData = {
    labels: data.browserStats.map((b: any) => b.browser),
    datasets: [
      {
        data: data.browserStats.map((b: any) => b.count),
        backgroundColor: [
          '#3b82f6',
          '#8b5cf6',
          '#ec4899',
          '#10b981',
          '#f59e0b',
          '#ef4444',
        ],
      },
    ],
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-dark rounded-xl p-6">
          <p className="text-gray-400 text-sm">Total Clicks</p>
          <p className="text-3xl font-bold text-white">{formatNumber(data.totalClicks)}</p>
        </div>
        <div className="glass-dark rounded-xl p-6">
          <p className="text-gray-400 text-sm">Active Links</p>
          <p className="text-3xl font-bold text-white">{data.clicksPerLink.length}</p>
        </div>
        <div className="glass-dark rounded-xl p-6">
          <p className="text-gray-400 text-sm">Avg. Daily Clicks</p>
          <p className="text-3xl font-bold text-white">
            {formatNumber(Math.round(data.totalClicks / days))}
          </p>
        </div>
        <div className="glass-dark rounded-xl p-6">
          <p className="text-gray-400 text-sm">Time Period</p>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="mt-2 bg-gray-800 border border-gray-700 rounded px-3 py-1 text-white"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Timeline Chart */}
      {data.timelineData.length > 0 && (
        <div className="glass-dark rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Click Timeline</h3>
          <div className="h-64">
            <Line
              data={timelineChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { color: '#9ca3af' },
                    grid: { color: 'rgba(255,255,255,0.1)' },
                  },
                  x: {
                    ticks: { color: '#9ca3af' },
                    grid: { display: false },
                  },
                },
              }}
            />
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Clicks per Link */}
        {data.clicksPerLink.length > 0 && (
          <div className="glass-dark rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Clicks per Link</h3>
            <div className="h-64">
              <Bar
                data={linkChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { color: '#9ca3af' },
                      grid: { color: 'rgba(255,255,255,0.1)' },
                    },
                    x: {
                      ticks: { color: '#9ca3af' },
                      grid: { display: false },
                    },
                  },
                }}
              />
            </div>
          </div>
        )}

        {/* Device Stats */}
        {data.deviceStats.length > 0 && (
          <div className="glass-dark rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Device Breakdown</h3>
            <div className="h-64 flex items-center justify-center">
              <Pie
                data={deviceChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { color: '#9ca3af' },
                    },
                  },
                }}
              />
            </div>
          </div>
        )}

        {/* Browser Stats */}
        {data.browserStats.length > 0 && (
          <div className="glass-dark rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Browser Stats</h3>
            <div className="h-64 flex items-center justify-center">
              <Pie
                data={browserChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { color: '#9ca3af' },
                    },
                  },
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
