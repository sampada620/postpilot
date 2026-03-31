import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="text-white font-bold text-xl">PostPilot</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login"
            className="text-slate-300 hover:text-white transition-colors">
            Login
          </Link>
          <Link href="/signup"
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors font-medium">
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-8 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-2 mb-8">
          <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
          <span className="text-indigo-300 text-sm font-medium">AI-Powered Content Automation</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          One topic.
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
            {' '}Every platform.
          </span>
        </h1>

        <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          PostPilot researches your topic, writes platform-optimised content,
          and schedules it across Twitter, LinkedIn, Instagram and your blog — automatically.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link href="/signup"
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg shadow-indigo-500/25">
            Start for Free →
          </Link>
          <Link href="/login"
            className="border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors">
            Sign In
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: '🔍', title: 'AI Research', desc: 'Fetches latest info and facts automatically' },
            { icon: '✍️', title: 'Multi-Format Writing', desc: 'Blog, LinkedIn, Twitter & Instagram in one click' },
            { icon: '📅', title: 'Auto Schedule', desc: 'Posts at the best time for maximum reach' },
          ].map((f) => (
            <div key={f.title}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 text-left hover:bg-white/10 transition-colors">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}