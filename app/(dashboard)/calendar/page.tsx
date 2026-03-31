'use client'
import { useEffect, useState } from 'react'

type Post = {
  id: string
  platform: string
  scheduledAt: string
  status: string
  variant: {
    body: string
    contentItem: { topic: string }
  }
  publishedPost?: {
    url: string
    publishedAt: string
  }
}

const platformColors: Record<string, string> = {
  'LinkedIn':  'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Twitter/X': 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  'Instagram': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  'Blog':      'bg-green-500/20 text-green-400 border-green-500/30',
}

const platformIcons: Record<string, string> = {
  'LinkedIn':  '💼',
  'Twitter/X': '🐦',
  'Instagram': '📸',
  'Blog':      '📄',
}

export default function CalendarPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)
  const [publishResult, setPublishResult] = useState('')

  const fetchPosts = () => {
    setLoading(true)
    fetch('/api/schedule')
      .then(r => r.json())
      .then(data => {
        setPosts(data.posts || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handlePublishNow = async () => {
    setPublishing(true)
    setPublishResult('')
    try {
      const res = await fetch('/api/publish', { method: 'POST' })
      const data = await res.json()
      if (data.published > 0) {
        setPublishResult(`✅ Published ${data.published} post(s) successfully!`)
        fetchPosts()
      } else {
        setPublishResult('ℹ️ No posts due for publishing yet')
      }
    } catch {
      setPublishResult('❌ Publishing failed')
    } finally {
      setPublishing(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const pendingPosts   = posts.filter(p => p.status === 'pending')
  const publishedPosts = posts.filter(p => p.status === 'published')

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Content Calendar</h1>
          <p className="text-slate-400 mt-1">
            {posts.length} total · {pendingPosts.length} pending · {publishedPosts.length} published
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handlePublishNow}
            disabled={publishing || pendingPosts.length === 0}
            className="bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
            {publishing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Publishing...
              </>
            ) : (
              '🚀 Publish Due Posts'
            )}
          </button>
          <a href="/create"
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            + New Post
          </a>
        </div>
      </div>

      {/* Publish Result Banner */}
      {publishResult && (
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 mb-6">
          <p className="text-slate-300 text-sm">{publishResult}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading posts...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && posts.length === 0 && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-12 text-center">
          <p className="text-4xl mb-4">📅</p>
          <h2 className="text-white font-semibold text-lg mb-2">
            No scheduled posts yet
          </h2>
          <p className="text-slate-400 mb-6">
            Create content and schedule it to see it here
          </p>
          <a href="/create"
            className="inline-flex bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            Create Your First Post
          </a>
        </div>
      )}

      {/* Posts List */}
      {!loading && posts.length > 0 && (
        <div className="space-y-8">

          {/* Pending */}
          {pendingPosts.length > 0 && (
            <div>
              <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-400 rounded-full inline-block"></span>
                Scheduled ({pendingPosts.length})
              </h2>
              <div className="space-y-3">
                {pendingPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl p-5 transition-colors">
                    <div className="flex items-start gap-4">
                      <span className="text-2xl flex-shrink-0">
                        {platformIcons[post.platform] || '📱'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${platformColors[post.platform] || 'bg-slate-700 text-slate-300 border-slate-600'}`}>
                            {post.platform}
                          </span>
                          <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-md text-xs font-medium">
                            ⏳ Scheduled
                          </span>
                        </div>
                        <p className="text-white font-medium text-sm truncate">
                          {post.variant?.contentItem?.topic || 'Untitled'}
                        </p>
                        <p className="text-slate-400 text-xs mt-1">
                          📅 {formatDate(post.scheduledAt)}
                        </p>
                        {post.variant?.body && (
                          <p className="text-slate-500 text-xs mt-2 line-clamp-2">
                            {post.variant.body.substring(0, 120)}...
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Published */}
          {publishedPosts.length > 0 && (
            <div>
              <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>
                Published ({publishedPosts.length})
              </h2>
              <div className="space-y-3">
                {publishedPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-slate-800 border border-green-500/20 rounded-xl p-5">
                    <div className="flex items-start gap-4">
                      <span className="text-2xl flex-shrink-0">
                        {platformIcons[post.platform] || '📱'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${platformColors[post.platform] || 'bg-slate-700 text-slate-300 border-slate-600'}`}>
                            {post.platform}
                          </span>
                          <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-md text-xs font-medium">
                            ✓ Published
                          </span>
                        </div>
                        <p className="text-white font-medium text-sm truncate">
                          {post.variant?.contentItem?.topic || 'Untitled'}
                        </p>
                        <p className="text-slate-400 text-xs mt-1">
                          ✅ {formatDate(post.scheduledAt)}
                        </p>
                        {post.publishedPost?.url && (
                          <a
                          
                            href={post.publishedPost.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-400 hover:text-indigo-300 text-xs mt-1 inline-block transition-colors">
                            🔗 View post →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  )
}