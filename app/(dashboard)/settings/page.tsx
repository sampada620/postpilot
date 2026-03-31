'use client'
import { useState, useEffect } from 'react'

type User = {
  id: string
  name: string
  email: string
  image?: string
}

const platforms = [
  {
    id: 'twitter',
    name: 'Twitter / X',
    icon: '🐦',
    color: 'bg-sky-500/10 border-sky-500/20',
    iconBg: 'bg-sky-500/20',
    description: 'Post tweets and threads automatically',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '💼',
    color: 'bg-blue-500/10 border-blue-500/20',
    iconBg: 'bg-blue-500/20',
    description: 'Publish posts and articles to your profile',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📸',
    color: 'bg-pink-500/10 border-pink-500/20',
    iconBg: 'bg-pink-500/20',
    description: 'Schedule feed posts with captions',
  },
  {
    id: 'wordpress',
    name: 'WordPress',
    icon: '📄',
    color: 'bg-green-500/10 border-green-500/20',
    iconBg: 'bg-green-500/20',
    description: 'Publish blog posts to your WordPress site',
  },
]

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [connected, setConnected] = useState<Record<string, boolean>>({})
  const [activeTab, setActiveTab] = useState<'profile' | 'platforms' | 'workspace' | 'notifications'>('profile')
  const [saved, setSaved] = useState(false)
  const [brandVoice, setBrandVoice] = useState('')
  const [name, setName] = useState('')

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
          setName(data.user.name || '')
        }
      })
  }, [])

  const handleConnect = (platformId: string) => {
    setConnected(prev => ({ ...prev, [platformId]: !prev[platformId] }))
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const tabs = [
    { id: 'profile',       label: 'Profile',       icon: '👤' },
    { id: 'platforms',     label: 'Platforms',     icon: '🔗' },
    { id: 'workspace',     label: 'Workspace',     icon: '🏢' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
  ] as const

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">
          Manage your account, connected platforms and workspace
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Tabs */}
        <div className="w-48 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  activeTab === tab.id
                    ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700'
                }`}>
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">

          {/* ── Profile Tab ── */}
          {activeTab === 'profile' && (
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h2 className="text-white font-semibold mb-6">Profile Settings</h2>

              {/* Avatar */}
              <div className="flex items-center gap-5 mb-6 pb-6 border-b border-slate-700">
                <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                  {user?.image
                    ? <img src={user.image} className="w-16 h-16 rounded-full" alt="avatar" />
                    : <span className="text-white text-2xl font-bold">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                      </span>
                  }
                </div>
                <div>
                  <p className="text-white font-medium">{user?.name || 'User'}</p>
                  <p className="text-slate-400 text-sm">{user?.email || ''}</p>
                  <button className="text-indigo-400 hover:text-indigo-300 text-sm mt-1 transition-colors">
                    Change avatar
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-slate-500 cursor-not-allowed"
                  />
                  <p className="text-slate-500 text-xs mt-1">
                    Email cannot be changed
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Leave blank to keep current"
                  />
                </div>

                <button
                  onClick={handleSave}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                  {saved ? '✅ Saved!' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* ── Platforms Tab ── */}
          {activeTab === 'platforms' && (
            <div className="space-y-4">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                <h2 className="text-white font-semibold mb-2">Connected Platforms</h2>
                <p className="text-slate-400 text-sm mb-6">
                  Connect your social accounts to enable auto-publishing
                </p>
                <div className="space-y-4">
                  {platforms.map((platform) => (
                    <div key={platform.id}
                      className={`border rounded-xl p-5 flex items-center justify-between ${platform.color}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 ${platform.iconBg} rounded-xl flex items-center justify-center text-xl`}>
                          {platform.icon}
                        </div>
                        <div>
                          <p className="text-white font-medium">{platform.name}</p>
                          <p className="text-slate-400 text-sm">{platform.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {connected[platform.id] && (
                          <span className="text-green-400 text-sm">✓ Connected</span>
                        )}
                        <button
                          onClick={() => handleConnect(platform.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            connected[platform.id]
                              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30'
                              : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                          }`}>
                          {connected[platform.id] ? 'Disconnect' : 'Connect'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                <p className="text-amber-300 text-sm">
                  ⚠️ Platform OAuth connections require API credentials. Configure them in your environment variables before connecting.
                </p>
              </div>
            </div>
          )}

          {/* ── Workspace Tab ── */}
          {activeTab === 'workspace' && (
            <div className="space-y-6">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                <h2 className="text-white font-semibold mb-6">Workspace Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Workspace Name
                    </label>
                    <input
                      type="text"
                      defaultValue="My Workspace"
                      className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Brand Voice
                    </label>
                    <textarea
                      value={brandVoice}
                      onChange={(e) => setBrandVoice(e.target.value)}
                      rows={4}
                      className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                      placeholder="Describe your brand voice..."
                    />
                    <p className="text-slate-500 text-xs mt-1">
                      This guides the AI when generating content for your brand
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Default Tone
                    </label>
                    <select className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors">
                      <option>Professional</option>
                      <option>Casual</option>
                      <option>Witty</option>
                      <option>Inspirational</option>
                    </select>
                  </div>
                  <button
                    onClick={handleSave}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                    {saved ? '✅ Saved!' : 'Save Workspace'}
                  </button>
                </div>
              </div>

              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
                <h2 className="text-red-400 font-semibold mb-2">Danger Zone</h2>
                <p className="text-slate-400 text-sm mb-4">
                  These actions are irreversible. Please be careful.
                </p>
                <button className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Delete Workspace
                </button>
              </div>
            </div>
          )}

          {/* ── Notifications Tab ── */}
          {activeTab === 'notifications' && (
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h2 className="text-white font-semibold mb-6">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { label: 'Post published successfully', desc: 'Get notified when a post goes live',         default: true  },
                  { label: 'Post failed to publish',      desc: 'Alert when a scheduled post fails',         default: true  },
                  { label: 'Usage quota warning',         desc: 'Notify at 80% of monthly post limit',       default: true  },
                  { label: 'Weekly performance summary',  desc: 'Weekly email with your top posts',          default: false },
                  { label: 'New features & updates',      desc: 'Product updates and new feature releases',  default: false },
                  { label: 'Team activity',               desc: 'When team members create or publish',       default: false },
                ].map((item, i) => (
                  <div key={i}
                    className="flex items-center justify-between py-3 border-b border-slate-700 last:border-0">
                    <div>
                      <p className="text-white text-sm font-medium">{item.label}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={item.default}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500" />
                    </label>
                  </div>
                ))}
                <button
                  onClick={handleSave}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium transition-colors mt-2">
                  {saved ? '✅ Saved!' : 'Save Preferences'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}