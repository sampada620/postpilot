'use client'
import { useState } from 'react'

const platforms = ['Blog', 'LinkedIn', 'Twitter/X', 'Instagram']
const tones = ['Professional', 'Casual', 'Witty', 'Inspirational']

export default function CreatePage() {
  const [topic, setTopic] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['LinkedIn', 'Twitter/X'])
  const [tone, setTone] = useState('Professional')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState('')
  const [error, setError] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  const [scheduled, setScheduled] = useState<Record<string, boolean>>({})
  const [scheduling, setScheduling] = useState(false)
  const [copied, setCopied] = useState(false)
  const [scheduleError, setScheduleError] = useState('')

  const togglePlatform = (p: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    )
  }

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic')
      return
    }
    if (selectedPlatforms.length === 0) {
      setError('Please select at least one platform')
      return
    }

    setLoading(true)
    setError('')
    setResults({})
    setScheduled({})

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platforms: selectedPlatforms, tone }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Generation failed')
        return
      }

      if (!data.content) {
        setError('No content returned')
        return
      }

      setResults(data.content)
      setActiveTab(selectedPlatforms[0])

      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(9, 0, 0, 0)
      setScheduleTime(tomorrow.toISOString().slice(0, 16))

    } catch (err: any) {
      setError('Network error — check your connection')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text: string) => {
    // Works on both HTTP and HTTPS
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    } else {
      // Fallback for HTTP localhost
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSchedule = async (platform: string) => {
    if (!scheduleTime) {
      setScheduleError('Please select a schedule time first')
      return
    }

    setScheduling(true)
    setScheduleError('')

    try {
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          scheduledAt: scheduleTime,
          content: results[platform],
          topic,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setScheduled(prev => ({ ...prev, [platform]: true }))
      } else {
        setScheduleError(data.error || 'Schedule failed')
      }
    } catch (err) {
      setScheduleError('Failed to schedule post')
    } finally {
      setScheduling(false)
    }
  }

  const handleScheduleAll = async () => {
    for (const platform of Object.keys(results)) {
      if (!scheduled[platform]) {
        await handleSchedule(platform)
      }
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Create Content</h1>
        <p className="text-slate-400 mt-1">
          Enter a topic — AI will write for every platform
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left — Input */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4">📝 Content Brief</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Topic *
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={3}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                placeholder="e.g. How AI is changing content marketing in 2025"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Tone</label>
              <div className="flex flex-wrap gap-2">
                {tones.map((t) => (
                  <button key={t} onClick={() => setTone(t)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      tone === t
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Platforms</label>
              <div className="flex flex-wrap gap-2">
                {platforms.map((p) => (
                  <button key={p} onClick={() => togglePlatform(p)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedPlatforms.includes(p)
                        ? 'bg-violet-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                📅 Schedule At
              </label>
              <input
                type="datetime-local"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                <p className="text-red-400 text-sm">❌ {error}</p>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={loading || !topic.trim() || selectedPlatforms.length === 0}
              className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  AI is writing...
                </>
              ) : (
                '✨ Generate Content'
              )}
            </button>
          </div>
        </div>

        {/* Right — Output */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4">🤖 AI Generated Content</h2>

          {Object.keys(results).length === 0 && !loading && (
            <div className="h-64 flex items-center justify-center text-center">
              <div>
                <p className="text-4xl mb-3">✨</p>
                <p className="text-slate-400">Your AI content will appear here</p>
                <p className="text-slate-500 text-sm mt-1">
                  Enter a topic and click Generate
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="w-10 h-10 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-400">Writing your content...</p>
                <p className="text-slate-500 text-sm mt-1">Takes about 10-15 seconds</p>
              </div>
            </div>
          )}

          {Object.keys(results).length > 0 && (
            <div>
              {/* Platform Tabs */}
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.keys(results).map((platform) => (
                  <button key={platform}
                    onClick={() => setActiveTab(platform)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === platform
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}>
                    {platform}
                    {scheduled[platform] && (
                      <span className="ml-1 text-green-400">✓</span>
                    )}
                  </button>
                ))}
              </div>

              {activeTab && results[activeTab] && (
                <div>
                  <textarea
                    value={results[activeTab]}
                    onChange={(e) =>
                      setResults(prev => ({ ...prev, [activeTab]: e.target.value }))
                    }
                    rows={11}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500 resize-none"
                  />
                  <p className="text-slate-500 text-xs mt-1 text-right">
                    {results[activeTab].length} characters
                  </p>

                  {scheduleError && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mt-2">
                      <p className="text-red-400 text-xs">❌ {scheduleError}</p>
                    </div>
                  )}

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleCopy(results[activeTab])}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 rounded-lg text-sm font-medium transition-colors">
                      {copied ? '✅ Copied!' : '📋 Copy'}
                    </button>
                    <button
                      onClick={() => handleSchedule(activeTab)}
                      disabled={scheduling || scheduled[activeTab]}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                        scheduled[activeTab]
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-50'
                      }`}>
                      {scheduled[activeTab]
                        ? '✅ Scheduled!'
                        : scheduling
                        ? 'Scheduling...'
                        : '📅 Schedule Post'}
                    </button>
                  </div>
                </div>
              )}

              {Object.keys(results).length > 1 && (
                <button
                  onClick={handleScheduleAll}
                  disabled={scheduling}
                  className="w-full mt-3 bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 border border-violet-500/30 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                  📅 Schedule All Platforms
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}