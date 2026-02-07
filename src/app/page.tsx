import Link from 'next/link'
import { FiGithub, FiExternalLink, FiCheckCircle } from 'react-icons/fi'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900">
      {/* Navbar */}
      <nav className="glass-dark fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-white">
              <span className="text-blue-400">Gito</span>Link
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="https://github.com/jaaberaziz-code/gitolink"
                target="_blank"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FiGithub className="w-6 h-6" />
              </Link>
              <Link
                href="/login"
                className="text-gray-300 hover:text-white transition-colors px-3 py-2"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Your Links,{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Your Brand
            </span>
            , Your Analytics
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            The open-source link-in-bio platform for creators, influencers, and businesses. 
            Take control of your online presence with custom themes and powerful analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all transform hover:scale-105"
            >
              Create Your Profile
            </Link>
            <Link
              href="/demo"
              className="glass text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/10 transition-all"
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Everything You Need
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '🔐',
                title: 'Simple Authentication',
                desc: 'Secure JWT-based auth with httpOnly cookies',
              },
              {
                icon: '🎨',
                title: 'Customizable Themes',
                desc: 'Choose from 10+ beautiful gradient themes',
              },
              {
                icon: '📊',
                title: 'Real-time Analytics',
                desc: 'Track clicks, devices, browsers, and more',
              },
              {
                icon: '🚀',
                title: 'Fast & SEO-friendly',
                desc: 'Built with Next.js 14 for optimal performance',
              },
              {
                icon: '📱',
                title: 'Mobile-responsive',
                desc: 'Looks perfect on any device',
              },
              {
                icon: '🔗',
                title: 'Unlimited Links',
                desc: 'Add as many links as you want',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="glass-dark p-6 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Why Choose GitoLink?
          </h2>
          <div className="glass-dark rounded-xl overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-gray-400 font-medium">Feature</th>
                  <th className="text-center p-4 text-blue-400 font-bold">GitoLink</th>
                  <th className="text-center p-4 text-gray-400">Linktree</th>
                  <th className="text-center p-4 text-gray-400">Beacons</th>
                  <th className="text-center p-4 text-gray-400">Carrd</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Free Custom Domain', true, false, false, true],
                  ['Open Source', true, false, false, false],
                  ['Analytics', true, 'Limited', true, false],
                  ['No Watermark', true, false, false, true],
                  ['Full Data Control', true, false, false, true],
                  ['Custom Themes', true, 'Limited', true, 'Limited'],
                  ['API Access', true, false, false, false],
                ].map(([feature, gitolink, linktree, beacons, carrd]) => (
                  <tr key={feature as string} className="border-b border-white/10">
                    <td className="p-4 text-white">{feature as string}</td>
                    <td className="text-center p-4">
                      {gitolink === true ? (
                        <FiCheckCircle className="w-5 h-5 text-green-400 mx-auto" />
                      ) : (
                        <span className="text-gray-500">{gitolink}</span>
                      )}
                    </td>
                    <td className="text-center p-4 text-gray-500">
                      {linktree === true ? '✓' : linktree}
                    </td>
                    <td className="text-center p-4 text-gray-500">
                      {beacons === true ? '✓' : beacons}
                    </td>
                    <td className="text-center p-4 text-gray-500">
                      {carrd === true ? '✓' : carrd}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Take Control?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of creators who trust GitoLink for their link-in-bio needs.
          </p>
          <Link
            href="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all inline-block"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500">
            © 2024 GitoLink. Open source under MIT License.
          </p>
          <div className="flex gap-6">
            <Link
              href="https://github.com/jaaberaziz-code/gitolink"
              target="_blank"
              className="text-gray-500 hover:text-white transition-colors flex items-center gap-2"
            >
              <FiGithub className="w-5 h-5" />
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
