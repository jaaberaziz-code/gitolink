# 💰 GitoLink Pricing Section

## Design System: Pricing Component

---

## 1. PRICING STRUCTURE

### Plans Overview
| Plan | Price | Target |
|------|-------|--------|
| **Free** | $0 | Beginners, testing |
| **Pro** | $6/month | Creators, professionals |

---

## 2. PRICING COMPONENT

### Full Pricing Section
```tsx
'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

const Icons = {
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  arrowRight: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

const plans = [
  {
    id: 'free',
    name: 'FREE',
    price: '$0',
    period: '/month',
    description: 'Perfect for getting started',
    features: [
      'Unlimited links',
      'All 20+ themes',
      'Basic analytics',
      'Mobile responsive',
      'Custom username',
      'QR codes',
      'Community support'
    ],
    cta: 'Get Started Free',
    popular: false,
    accent: false
  },
  {
    id: 'pro',
    name: 'PRO',
    price: '$6',
    period: '/month',
    description: 'For serious creators',
    features: [
      'Everything in Free',
      'Advanced analytics',
      'Custom domains',
      'Remove branding',
      'Priority support',
      'Scheduled links',
      'Link expiration',
      'API access',
      'Team collaboration'
    ],
    cta: 'Start Pro Trial',
    popular: true,
    accent: true
  }
]

export default function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  
  const yearlyDiscount = 17 // 17% off for yearly

  return (
    <section id="pricing" className="py-24 px-6 border-t border-gray-900 bg-black">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            SIMPLE PRICING
          </h2>
          <div className="w-16 h-[2px] bg-[#00FF41] mx-auto mb-6" />
          <p className="text-gray-400 font-mono max-w-md mx-auto">
            Start free. Upgrade when you need more power.
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 mt-8 p-1 bg-gray-900 border border-gray-800">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${
                billingCycle === 'yearly'
                  ? 'bg-[#00FF41] text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Yearly
              <span className="text-xs bg-gray-800 text-[#00FF41] px-2 py-0.5 rounded">
                -{yearlyDiscount}%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`
                relative
                p-8
                bg-gray-900
                border
                ${plan.popular 
                  ? 'border-[#00FF41] shadow-[0_0_30px_rgba(0,255,65,0.1)]' 
                  : 'border-gray-800'
                }
              `}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2">
                  <div className="bg-[#00FF41] text-black text-xs font-bold px-4 py-1 font-mono uppercase">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-8">
                <h3 className="text-sm font-mono text-gray-500 mb-2 tracking-wider">
                  {plan.name}
                </h3>
                
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-5xl font-bold">
                    {billingCycle === 'yearly' && plan.id === 'pro'
                      ? '$60'
                      : plan.price
                    }
                  </span>
                  <span className="text-gray-500 font-mono">
                    {billingCycle === 'yearly' && plan.id === 'pro'
                      ? '/year'
                      : plan.period
                    }
                  </span>
                </div>
                
                {billingCycle === 'yearly' && plan.id === 'pro' && (
                  <p className="text-sm text-[#00FF41] font-mono">
                    Save $12/year
                  </p>
                )}
                
                <p className="text-gray-400 mt-4">
                  {plan.description}
                </p>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className={plan.popular ? 'text-[#00FF41]' : 'text-gray-500'}>
                      {Icons.check}
                    </span>
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link
                href={plan.id === 'free' ? '/register' : '/register?plan=pro'}
                className={`
                  w-full
                  inline-flex items-center justify-center gap-2
                  px-6 py-4
                  font-bold
                  transition-all duration-200
                  ${plan.popular
                    ? 'bg-[#00FF41] text-black hover:bg-[#00CC33] hover:shadow-[0_0_20px_rgba(0,255,65,0.3)]'
                    : 'bg-white text-black hover:bg-gray-200'
                  }
                `}
              >
                {plan.cta}
                {Icons.arrowRight}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Trust Note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-gray-500 font-mono text-sm">
            No credit card required for Free. Cancel Pro anytime.
          </p>
          
          <div className="flex items-center justify-center gap-6 mt-6 text-xs text-gray-600 font-mono">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              SSL Secure
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Instant Access
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
```

---

## 3. STANDALONE PRICING PAGE

```tsx
// app/pricing/page.tsx
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function PricingPage() {
  const [annual, setAnnual] = useState(false)

  const plans = [
    {
      name: 'Free',
      description: 'Get started with the basics',
      monthlyPrice: 0,
      yearlyPrice: 0,
      features: [
        'Unlimited links',
        '20+ themes',
        'Basic analytics',
        'QR codes',
        'Mobile responsive',
        'Community support'
      ],
      cta: 'Start Free',
      href: '/register'
    },
    {
      name: 'Pro',
      description: 'For creators who need more',
      monthlyPrice: 6,
      yearlyPrice: 60,
      features: [
        'Everything in Free',
        'Custom domain',
        'Advanced analytics',
        'Remove GitoLink branding',
        'Scheduled links',
        'Link expiration',
        'API access',
        'Priority support',
        'Team features'
      ],
      cta: 'Start Pro Trial',
      href: '/register?plan=pro',
      popular: true
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">GitoLink</Link>
          <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
            Login
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              SIMPLE, TRANSPARENT
              <span className="text-[#00FF41]"> PRICING</span>
            </h1>
            <p className="text-gray-400 font-mono text-lg max-w-2xl mx-auto">
              Start free forever. Upgrade to Pro when you are ready to grow.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center gap-4 p-1 bg-gray-900 border border-gray-800">
              <button
                onClick={() => setAnnual(false)}
                className={`px-6 py-3 text-sm font-medium transition-colors ${
                  !annual ? 'bg-white text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`px-6 py-3 text-sm font-medium transition-colors flex items-center gap-3 ${
                  annual ? 'bg-[#00FF41] text-black' : 'text-gray-400 hover:text-white'
                }`}
              >
                Annual
                <span className="text-xs bg-gray-800 text-[#00FF41] px-2 py-1">
                  SAVE 17%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`
                  relative p-8
                  ${plan.popular 
                    ? 'bg-gray-900 border-2 border-[#00FF41]' 
                    : 'bg-gray-900/50 border border-gray-800'
                  }
                `}
              >
                {plan.popular && (
                  <div className="absolute -top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-[#00FF41] text-black text-xs font-bold px-4 py-1 font-mono">
                      RECOMMENDED
                    </span>
                  </div>
                )}

                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                  <p className="text-gray-400 text-sm">{plan.description}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-6xl font-bold">
                      ${annual ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-gray-500 font-mono">
                      /{annual ? 'year' : 'month'}
                    </span>
                  </div>
                  {annual && plan.yearlyPrice > 0 && (
                    <p className="text-[#00FF41] text-sm mt-2 font-mono">
                      You save $12/year
                    </p>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <svg 
                        className={`w-5 h-5 ${plan.popular ? 'text-[#00FF41]' : 'text-gray-500'}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`
                    block w-full text-center py-4 font-bold transition-colors
                    ${plan.popular
                      ? 'bg-[#00FF41] text-black hover:bg-[#00CC33]'
                      : 'bg-white text-black hover:bg-gray-200'
                    }
                  `}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* FAQ / Trust */}
          <div className="mt-24 text-center">
            <h3 className="text-2xl font-bold mb-8">Questions?</h3>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-left">
              <div>
                <h4 className="font-bold mb-2">Can I change plans?</h4>
                <p className="text-gray-400 text-sm font-mono">
                  Yes, upgrade or downgrade anytime. Prorated charges apply.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-2">What's the refund policy?</h4>
                <p className="text-gray-400 text-sm font-mono">
                  14-day money-back guarantee. No questions asked.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-2">Can I cancel anytime?</h4>
                <p className="text-gray-400 text-sm font-mono">
                  Absolutely. Cancel in one click, no hidden fees.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
```

---

## 4. FEATURE COMPARISON TABLE

```tsx
// components/pricing/FeatureComparison.tsx

const features = [
  { name: 'Unlimited links', free: true, pro: true },
  { name: '20+ themes', free: true, pro: true },
  { name: 'Basic analytics', free: true, pro: true },
  { name: 'QR codes', free: true, pro: true },
  { name: 'Custom domain', free: false, pro: true },
  { name: 'Advanced analytics', free: false, pro: true },
  { name: 'Remove branding', free: false, pro: true },
  { name: 'Scheduled links', free: false, pro: true },
  { name: 'Link expiration', free: false, pro: true },
  { name: 'API access', free: false, pro: true },
  { name: 'Priority support', free: false, pro: true },
  { name: 'Team collaboration', free: false, pro: true }
]

export default function FeatureComparison() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="text-left py-4 px-6 font-mono text-gray-500">Feature</th>
            <th className="text-center py-4 px-6 font-bold">Free</th>
            <th className="text-center py-4 px-6 font-bold text-[#00FF41]">Pro</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature) => (
            <tr key={feature.name} className="border-b border-gray-900">
              <td className="py-4 px-6">{feature.name}</td>
              <td className="text-center py-4 px-6">
                {feature.free ? (
                  <svg className="w-5 h-5 mx-auto text-[#00FF41]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-gray-600">—</span>
                )}
              </td>
              <td className="text-center py-4 px-6">
                <svg className="w-5 h-5 mx-auto text-[#00FF41]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

---

## 5. DESIGN TOKENS (Pricing Specific)

```css
/* Pricing Card */
.pricing-card {
  background: var(--color-gray-900);
  border: 1px solid var(--color-gray-800);
  padding: 2rem;
}

.pricing-card.popular {
  border: 2px solid var(--color-accent);
  box-shadow: 0 0 30px rgba(0, 255, 65, 0.1);
}

/* Price Display */
.price-amount {
  font-size: var(--text-6xl);
  font-weight: var(--font-bold);
  line-height: 1;
}

.price-period {
  font-family: var(--font-body);
  color: var(--color-gray-500);
}

/* Popular Badge */
.popular-badge {
  background: var(--color-accent);
  color: var(--color-black);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  padding: 0.25rem 1rem;
}
```

---

## 6. USAGE EXAMPLE

```tsx
// Add to landing page
import PricingSection from '@/components/landing/PricingSection'

export default function LandingPage() {
  return (
    <div>
      <Hero />
      <Features />
      <Themes />
      <PricingSection /> {/* Add here */}
      <Footer />
    </div>
  )
}
```

---

**Version:** 1.0  
**Plans:** Free ($0) + Pro ($6/month or $60/year)  
**Discount:** 17% off yearly
