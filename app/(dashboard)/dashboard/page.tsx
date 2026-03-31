export default function DashboardPage() {
  const stats = [
    { label: 'Posts Created', value: '0', icon: '📝', color: 'indigo' },
    { label: 'Scheduled', value: '0', icon: '📅', color: 'violet' },
    { label: 'Published', value: '0', icon: '✅', color: 'green' },
    { label: 'Total Reach', value: '0', icon: '📈', color: 'blue' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Welcome back! Here's your content overview.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label}
            className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{s.icon}</span>
            </div>
            <p className="text-3xl font-bold text-white">{s.value}</p>
            <p className="text-slate-400 text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick action */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-500/20 rounded-2xl p-8 text-center">
        <h2 className="text-xl font-bold text-white mb-2">Ready to create content?</h2>
        <p className="text-slate-400 mb-6">Enter a topic and let AI do the heavy lifting</p>
        <a href="/create"
          className="inline-flex bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
           Create New Content
        </a>
      </div>
    </div>
  )
}