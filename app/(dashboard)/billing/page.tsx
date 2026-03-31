'use client'
import { useState, useEffect } from 'react'

type User = {
  id: string
  name: string
  email: string
}

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    color: 'border-slate-700',
    badge: null,
    features: [
      '10 posts/month',
      '2 platforms',
      '1 workspace',
      'Basic AI generation',
      'Email support',
    ],
    cta: 'Current Plan',
    current: true,
    key: 'free',
  },
  {
    name: 'Starter',
    price: '$12',
    period: '/month',
    color: 'border-slate-700',
    badge: null,
    features: [
      '50 posts/month',
      '4 platforms',
      '1 workspace',
      'Full AI generation',
      'Priority support',
      '14-day free trial',
    ],
    cta: 'Upgrade to Starter',
    current: false,
    key: 'starter',
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    color: 'border-indigo-500',
    badge: 'MOST POPULAR',
    features: [
      '200 posts/month',
      '4 platforms',
      '3 workspaces',
      '5 team members',
      'Analytics + AI insights',
      'Approval workflow',
      '14-day free trial',
    ],
    cta: 'Upgrade to Pro',
    current: false,
    key: 'pro',
  },
  {
    name: 'Agency',
    price: '$79',
    period: '/month',
    color: 'border-slate-700',
    badge: null,
    features: [
      'Unlimited posts',
      '4 platforms',
      'Unlimited workspaces',
      '15 team members',
      'White-label ready',
      'Dedicated support',
      '14-day free trial',
    ],
    cta: 'Upgrade to Agency',
    current: false,
    key: 'agency',
  },
]

const faqs = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes, you can cancel your subscription at any time. You will retain access until the end of your billing period.',
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes! Starter, Pro and Agency plans come with a 14-day free trial. No credit card required.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept all major credit/debit cards, UPI, and net banking via Razorpay.',
  },
  {
    q: 'Can I switch plans?',
    a: 'Absolutely. You can upgrade or downgrade at any time. Changes take effect immediately.',
  },
]

export default function BillingPage() {
  const [user, setUser] = useState<User | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('')

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.user) setUser(data.user)
      })
  }, [])

  const handleUpgrade = (planName: string) => {
    setSelectedPlan(planName)
    setShowModal(true)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Billing & Plans</h1>
        <p className="text-slate-400 mt-1">
          Choose the plan that fits your needs. Upgrade or downgrade anytime.
        </p>
      </div>

      {/* Current Plan Banner */}
      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-5 mb-8 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
            <span className="text-xl">💳</span>
          </div>
          <div>
            <p className="text-white font-semibold">You are on the Free Plan</p>
            <p className="text-slate-400 text-sm mt-0.5">
              0 of 10 posts used this month
              {user?.email && (
                <span className="text-slate-500"> · {user.email}</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-32 bg-slate-700 rounded-full h-2">
            <div className="bg-indigo-500 h-2 rounded-full w-0" />
          </div>
          <span className="text-slate-400 text-sm">0%</span>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {plans.map((plan) => (
          <div key={plan.name}
            className={`relative bg-slate-800 border ${plan.color} rounded-2xl p-6 flex flex-col ${
              plan.badge ? 'shadow-lg shadow-indigo-500/20' : ''
            }`}>
            {/* Badge */}
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                  {plan.badge}
                </span>
              </div>
            )}

            {/* Plan name + price */}
            <div className="mb-5">
              <h3 className="text-white font-bold text-lg">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                <span className="text-slate-400 text-sm">{plan.period}</span>
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-2.5 flex-1 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <button
              onClick={() => !plan.current && handleUpgrade(plan.name)}
              className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${
                plan.current
                  ? 'bg-slate-700 text-slate-400 cursor-default'
                  : plan.badge
                  ? 'bg-indigo-500 hover:bg-indigo-600 text-white hover:scale-105'
                  : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}>
              {plan.current ? '✓ Current Plan' : plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Feature Comparison Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-8">
        <h2 className="text-white font-semibold mb-6">Feature Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-slate-400 pb-3 font-medium">Feature</th>
                <th className="text-center text-slate-400 pb-3 font-medium">Free</th>
                <th className="text-center text-slate-400 pb-3 font-medium">Starter</th>
                <th className="text-center text-indigo-400 pb-3 font-medium">Pro</th>
                <th className="text-center text-slate-400 pb-3 font-medium">Agency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {[
                ['Posts per month',   '10',  '50',  '200',       'Unlimited'],
                ['Platforms',         '2',   '4',   '4',         '4'],
                ['Workspaces',        '1',   '1',   '3',         'Unlimited'],
                ['Team members',      '1',   '1',   '5',         '15'],
                ['AI research',       '✓',   '✓',   '✓',         '✓'],
                ['AI writing',        '✓',   '✓',   '✓',         '✓'],
                ['Analytics',         '✗',   '✗',   '✓',         '✓'],
                ['Approval workflow', '✗',   '✗',   '✓',         '✓'],
                ['Priority support',  '✗',   '✓',   '✓',         '✓'],
                ['White-label',       '✗',   '✗',   '✗',         '✓'],
              ].map(([feature, free, starter, pro, agency]) => (
                <tr key={feature}>
                  <td className="py-3 text-slate-300">{feature}</td>
                  {[free, starter, pro, agency].map((val, i) => (
                    <td key={i} className={`py-3 text-center ${
                      val === '✓' ? 'text-green-400' :
                      val === '✗' ? 'text-slate-600' :
                      i === 2 ? 'text-indigo-400 font-medium' :
                      'text-slate-300'
                    }`}>
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-slate-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-700/50 transition-colors">
                <span className="text-white font-medium text-sm">{faq.q}</span>
                <span className="text-slate-400 text-lg ml-4">
                  {openFaq === i ? '−' : '+'}
                </span>
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4">
                  <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="text-white font-bold text-xl">
                Upgrade to {selectedPlan}
              </h3>
              <p className="text-slate-400 mt-2 text-sm">
                Payment gateway integration is coming soon.
                We will notify you when it is ready!
              </p>
            </div>

            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mb-6">
              <p className="text-indigo-300 text-sm text-center">
                💡 This is a portfolio demo. Payment processing will be
                connected via Razorpay before production launch.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-semibold transition-colors">
                Close
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl font-semibold transition-colors">
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}