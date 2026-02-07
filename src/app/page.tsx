'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  FiGithub, 
  FiExternalLink, 
  FiCheckCircle, 
  FiZap, 
  FiImage, 
  FiBarChart2, 
  FiShield, 
  FiSmartphone, 
  FiLink,
  FiArrowRight,
  FiStar,
  FiHeart,
  FiTrendingUp
} from 'react-icons/fi'
import { FaTwitter, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa'

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5 }
}

const features = [
  {
    icon: FiZap,
    title: 'Lightning Fast',
    desc: 'Built with Next.js 14 for optimal performance and instant page loads.',
    color: 'from-yellow-400 to-orange-500'
  },
  {
    icon: FiImage,
    title: '20+ Premium Themes',
    desc: 'Stunning gradient and solid themes including glass morphism effects.',
    color: 'from-pink-400 to-rose-500'
  },
  {
    icon: FiBarChart2,
    title: 'Deep Analytics',
    desc: 'Track clicks, devices, browsers, and geographic data in real-time.',
    color: 'from-blue-400 to-cyan-500'
  },
  {
    icon: FiShield,
    title: 'Secure & Private',
    desc: 'JWT-based auth with httpOnly cookies. Your data stays yours.',
    color: 'from-green-400 to-emerald-500'
  },
  {
    icon: FiSmartphone,
    title: 'Mobile Perfect',
    desc: 'Responsive design that looks stunning on any device size.',
    color: 'from-purple-400 to-violet-500'
  },
  {
    icon: FiLink,
    title: 'Unlimited Links',
    desc: 'Add as many links as you want. No restrictions, ever.',
    color: 'from-indigo-400 to-blue-500'
  }
]

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      'Unlimited links',
      'All 20+ themes',
      'Basic analytics',
      'Mobile responsive',
      'Custom username'
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/month',
    description: 'For serious creators',
    features: [
      'Everything in Free',
      'Advanced analytics',
      'Priority support',
      'Custom domains',
      'API access',
      'Remove branding'
    ],
    cta: 'Start Pro Trial',
    popular: true
  },
  {
    name: 'Team',
    price: '$29',
    period: '/month',
    description: 'For teams & businesses',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Admin dashboard',
      'SSO integration',
      'Dedicated support',
      'Custom contracts'
    ],
    cta: 'Contact Sales',
    popular: false
  }
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Digital Artist',
    content: 'GitoLink transformed how I share my portfolio. The themes are gorgeous!',
    avatar: 'SC',
    color: 'from-pink-400 to-rose-500'
  },
  {
    name: 'Marcus Johnson',
    role: 'Content Creator',
    content: 'The analytics help me understand my audience better than any other platform.',
    avatar: 'MJ',
    color: 'from-blue-400 to-cyan-500'
  },
  {
    name: 'Emily Davis',
    role: 'Small Business Owner',
    content: 'Finally, a link-in-bio tool that respects my privacy and data.',
    avatar: 'ED',
    color: 'from-green-400 to-emerald-500'
  }
]

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-500/10 rounded-full blur-[150px]" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      {/* Navbar */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div 
                whileHover={{ rotate: 10 }}
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
              >
                <FiLink className="w-4 h-4 text-white" />
              </motion.div>
              <span className="text-xl font-bold">
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Gito</span>
                <span className="text-white">Link</span>
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">Features</Link>
              <Link href="#pricing" className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</Link>
              <Link href="/demo" className="text-gray-400 hover:text-white transition-colors text-sm">Demo</Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</Link>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="https://github.com/jaaberaziz-code/gitolink"
                target="_blank"
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <FiGithub className="w-5 h-5" />
              </Link>
              <Link
                href="/login"
                className="hidden sm:block text-gray-300 hover:text-white transition-colors px-3 py-2 text-sm"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-lg hover:shadow-blue-500/25"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
            >
              <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-gray-300">Open Source & Free Forever</span>
              <FiArrowRight className="w-4 h-4 text-gray-400" />
            </motion.div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="text-white">Your Links.</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Your Brand.
              </span>
              <br />
              <span className="text-white">Your Analytics.</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              The professional link-in-bio platform that puts you in control. 
              Beautiful themes, powerful analytics, and complete data ownership.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/register"
                  className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all hover:shadow-2xl hover:shadow-blue-500/25"
                >
                  Create Your Profile
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/demo"
                  className="inline-flex items-center gap-2 glass text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-all border border-white/20"
                >
                  <FiExternalLink className="w-5 h-5" />
                  View Demo
                </Link>
              </motion.div>
            </div>

            {/* Social Proof */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-[#0a0a0f] flex items-center justify-center">
                    <FaTwitter className="w-4 h-4 text-gray-300" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-[#0a0a0f] flex items-center justify-center">
                    <FaInstagram className="w-4 h-4 text-gray-300" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-[#0a0a0f] flex items-center justify-center">
                    <FaYoutube className="w-4 h-4 text-gray-300" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-[#0a0a0f] flex items-center justify-center">
                    <FaTiktok className="w-4 h-4 text-gray-300" />
                  </div>
                </div>
                <span className="text-gray-400 text-sm ml-2">Trusted by 10,000+ creators</span>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
                <span className="text-gray-400 text-sm ml-2">4.9/5 from 500+ reviews</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-20 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent z-10 pointer-events-none" />
            <div className="relative mx-auto max-w-4xl">
              <div className="glass-card rounded-2xl p-2 shadow-2xl shadow-blue-500/10">
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-8">
                  {/* Mock Dashboard Preview */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-white/10 rounded" />
                          <div className="h-3 w-20 bg-white/5 rounded" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        {[...Array(4)].map((_, i) => (
                          <motion.div 
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                            className="h-12 glass rounded-lg flex items-center px-4 gap-3"
                          >
                            <div className="w-8 h-8 rounded bg-white/10" />
                            <div className="h-3 w-40 bg-white/20 rounded" />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    <div className="glass rounded-xl p-4 space-y-4">
                      <div className="h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                        <FiSmartphone className="w-12 h-12 text-white/40" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-8 w-full bg-white/10 rounded" />
                        <div className="h-8 w-full bg-white/10 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
              Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything You Need to
              <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Grow Your Brand
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Powerful features designed for creators, influencers, and businesses who want more control.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={fadeInUp}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative glass-card rounded-2xl p-8 h-full">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Theme Showcase Section */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-purple-500/5" />
        <div className="max-w-7xl mx-auto relative">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-4">
              Themes
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              20+ Stunning Themes
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              From cyberpunk neon to corporate elegance, find the perfect look for your brand.
            </p>
          </motion.div>

          {/* Theme Previews */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              { name: 'Cyberpunk', gradient: 'from-pink-500 via-purple-500 to-cyan-400' },
              { name: 'Sunset', gradient: 'from-orange-400 via-pink-500 to-purple-600' },
              { name: 'Ocean', gradient: 'from-cyan-600 via-blue-700 to-indigo-800' },
              { name: 'Forest', gradient: 'from-emerald-500 via-teal-600 to-green-700' },
              { name: 'Gold', gradient: 'from-yellow-400 via-yellow-500 to-amber-600' },
              { name: 'Aurora', gradient: 'from-green-300 via-blue-500 to-purple-600' },
              { name: 'Retro', gradient: 'from-purple-600 via-pink-500 to-orange-400' },
              { name: 'Cotton Candy', gradient: 'from-pink-300 via-purple-300 to-indigo-400' },
              { name: 'Midnight', gradient: 'from-indigo-900 via-purple-900 to-slate-900' },
              { name: 'Rose Gold', gradient: 'from-rose-300 via-pink-400 to-purple-400' },
            ].map((theme, index) => (
              <motion.div
                key={theme.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group cursor-pointer"
              >
                <div className={`h-24 rounded-xl bg-gradient-to-br ${theme.gradient} mb-2 shadow-lg group-hover:shadow-xl transition-shadow`} />
                <p className="text-center text-sm text-gray-400 group-hover:text-white transition-colors">{theme.name}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link 
              href="/demo" 
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              See all themes in action
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-32 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium mb-4">
              Comparison
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose GitoLink?
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              See how we stack up against the competition.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-6 text-gray-400 font-medium">Feature</th>
                    <th className="text-center p-6">
                      <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent font-bold">GitoLink</span>
                    </th>
                    <th className="text-center p-6 text-gray-400">Linktree</th>
                    <th className="text-center p-6 text-gray-400">Beacons</th>
                    <th className="text-center p-6 text-gray-400">Carrd</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Free Custom Domain', true, false, false, true],
                    ['Open Source', true, false, false, false],
                    ['Unlimited Links', true, true, true, false],
                    ['Deep Analytics', true, 'Limited', true, false],
                    ['No Watermark', true, false, false, true],
                    ['Full Data Control', true, false, false, true],
                    ['20+ Themes', true, 'Limited', true, 'Limited'],
                    ['API Access', true, false, false, false],
                    ['Self-Host Option', true, false, false, false],
                  ].map(([feature, gitolink, linktree, beacons, carrd], idx) => (
                    <tr key={idx} className="border-b border-white/10 last:border-0">
                      <td className="p-6 text-white font-medium">{feature as string}</td>
                      <td className="text-center p-6">
                        {gitolink === true ? (
                          <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                            <FiCheckCircle className="w-4 h-4 text-green-400" />
                          </div>
                        ) : (
                          <span className="text-gray-500">{gitolink as string}</span>
                        )}
                      </td>
                      <td className="text-center p-6 text-gray-500">
                        {linktree === true ? '✓' : linktree}
                      </td>
                      <td className="text-center p-6 text-gray-500">
                        {beacons === true ? '✓' : beacons}
                      </td>
                      <td className="text-center p-6 text-gray-500">
                        {carrd === true ? '✓' : carrd}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-sm font-medium mb-4">
              Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Loved by Creators
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              See what our users have to say about GitoLink.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="glass-card rounded-2xl p-8"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="text-white font-medium">{testimonial.name}</p>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />
        <div className="max-w-7xl mx-auto relative">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
              Pricing
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Start free, upgrade when you need more. No hidden fees.
            </p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                variants={scaleIn}
                whileHover={{ y: -10 }}
                className={`relative rounded-2xl p-1 ${plan.popular ? 'bg-gradient-to-b from-blue-500 to-purple-600' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className={`h-full rounded-xl p-8 ${plan.popular ? 'bg-[#0a0a0f]' : 'glass-card'}`}>
                  <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-gray-300 text-sm">
                        <FiCheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/register"
                    className={`block text-center py-3 rounded-xl font-medium transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
            
            <div className="relative px-8 py-20 md:px-16 md:py-24 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                  Ready to Take Control?
                </h2>
                <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                  Join thousands of creators who trust GitoLink for their link-in-bio needs.
                  Start building your brand today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/register"
                      className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Get Started Free
                      <FiArrowRight className="w-5 h-5" />
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/demo"
                      className="inline-flex items-center gap-2 bg-white/20 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/30 transition-colors backdrop-blur-sm"
                    >
                      <FiExternalLink className="w-5 h-5" />
                      View Demo
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <FiLink className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold">
                  <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Gito</span>
                  <span className="text-white">Link</span>
                </span>
              </Link>
              <p className="text-gray-400 max-w-sm mb-6">
                The open-source link-in-bio platform that puts creators first. 
                Beautiful, fast, and fully under your control.
              </p>
              <div className="flex items-center gap-4">
                <a href="https://github.com/jaaberaziz-code/gitolink" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                  <FiGithub className="w-5 h-5" />
                </a>
                <a href="https://twitter.com" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                  <FaTwitter className="w-5 h-5" />
                </a>
                <a href="https://instagram.com" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                  <FaInstagram className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-3">
                <li><Link href="/demo" className="text-gray-400 hover:text-white transition-colors">Demo</Link></li>
                <li><Link href="#features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-3">
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                <li><a href="https://github.com/jaaberaziz-code/gitolink" target="_blank" className="text-gray-400 hover:text-white transition-colors">GitHub</a></li>
                <li><Link href="/register" className="text-gray-400 hover:text-white transition-colors">Get Started</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 GitoLink. Open source under MIT License.
            </p>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <FiHeart className="w-4 h-4 text-red-400" />
              <span>Made with love for creators</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
