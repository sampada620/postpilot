'use client'
import { useEffect, useState } from 'react'

type AnalyticsData = {
  totalPosts: number
  totalScheduled: number
  totalPublished: number
  platformBreakdown: Record<string, number>
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>({
    totalPosts: 0,
    totalScheduled: 0,
    totalPublished: 0,
    platformBreakdown: {},
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analytics')
      .then(r => r.json())
      .then(d => {
        setData(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const stats = [
    { label: 'Total Created',  value: data.totalPosts,      icon: '📝', color: 'indigo' },
    { label: 'Scheduled',      value: data.totalScheduled,  icon: '📅', color: 'violet' },
    { label: 'Published',      value: data.totalPublished,  icon: '✅', color: 'green'  },
  ]

  const platforms = [
    { name: 'LinkedIn',  icon: '💼', color: 'bg-blue-500'  },
    { name: 'Twitter/X', icon: '🐦', color: 'bg-sky-500'   },
    { name: 'Instagram', icon: '📸', color: 'bg-pink-500'  },
    { name: 'Blog',      icon: '📄', color: 'bg-green-500' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-slate-400 mt-1">Track your content performance</p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading analytics...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.label}
                className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <div className="text-3xl mb-3">{s.icon}</div>
                <p className="text-3xl font-bold text-white">{s.value}</p>
                <p className="text-slate-400 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Platform Breakdown */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h2 className="text-white font-semibold mb-6">Posts by Platform</h2>
            <div className="space-y-4">
              {platforms.map((p) => {
                const count = data.platformBreakdown[p.name] || 0
                const max = Math.max(...Object.values(data.platformBreakdown), 1)
                const pct = Math.round((count / max) * 100)
                return (
                  <div key={p.name}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span>{p.icon}</span>
                        <span className="text-slate-300 text-sm">{p.name}</span>
                      </div>
                      <span className="text-slate-400 text-sm">{count} posts</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className={`${p.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-6">
            <h2 className="text-white font-semibold mb-3">💡 AI Insights</h2>
            {data.totalPublished === 0 ? (
              <p className="text-slate-400 text-sm">
                Publish your first post to start getting AI-powered insights about your best performing content and optimal posting times.
              </p>
            ) : (
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>• Your LinkedIn posts get the most engagement — keep posting there!</li>
                <li>• Try posting between 8-9am for maximum reach</li>
                <li>• Consistent posting 3x/week improves reach by up to 2x</li>
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}