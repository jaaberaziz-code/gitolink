# GitoLink v3

<p align="center">
  <h1 align="center">🌟 GitoLink</h1>
</p>

<p align="center">
  <strong>Your Links, Your Brand, Your Analytics</strong>
</p>

<p align="center">
  <a href="https://gitolink.vercel.app">🚀 Live Demo</a> •
  <a href="https://github.com/jaaberaziz-code/gitolink">📁 GitHub</a> •
  <a href="#features">✨ Features</a> •
  <a href="#deploy">🚀 Deploy</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/PostgreSQL-15-blue?style=for-the-badge&logo=postgresql" />
  <img src="https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=for-the-badge&logo=tailwind-css" />
</p>

---

## ✨ What is GitoLink?

**GitoLink** is a professional, open-source link-in-bio platform that looks **better than Linktree**. Built for creators, influencers, and businesses who want stunning profiles with full control.

### 🎯 Why GitoLink?

| Feature | GitoLink | Linktree | Beacons |
|---------|----------|----------|---------|
| **20+ Professional Themes** | ✅ | ❌ Limited | ❌ Limited |
| **Live Theme Preview** | ✅ | ❌ | ❌ |
| **Open Source** | ✅ | ❌ | ❌ |
| **Custom Domains (Free)** | ✅ | ❌ Paid | ❌ Paid |
| **Full Analytics** | ✅ | Limited | ✅ |
| **No Watermark** | ✅ | ❌ | ❌ |
| **Glass Morphism UI** | ✅ | ❌ | ❌ |
| **Self-Hosting** | ✅ | ❌ | ❌ |

---

## 🚀 Live Demo

**🌐 https://gitolink.vercel.app**

Try it now:
1. Create an account
2. Add your links
3. Choose from 20+ themes
4. Share your profile!

---

## 🎨 20+ Professional Themes

### 🎮 Gaming
- **Cyberpunk Neon** - Electric blues & pinks
- **Matrix Code** - Classic hacker green

### 🌴 Travel
- **Sunset Beach** - Warm oranges & yellows
- **Tropical Paradise** - Fresh greens & teals
- **Desert Dunes** - Sandy golds

### 💼 Business
- **Corporate Blue** - Professional navy
- **Minimal White** - Clean & elegant
- **Executive Dark** - Sophisticated black

### 🎨 Creative
- **Aurora Borealis** - Northern lights colors
- **Cotton Candy** - Pastel pinks & blues
- **Retro Wave** - 80s synthwave vibes

### 🌿 Nature
- **Deep Forest** - Rich greens
- **Deep Ocean** - Ocean blues
- **Lavender Field** - Calming purples

### 💎 Premium
- **Luxury Gold** - Elegant gold tones
- **Rose Gold** - Modern metallic
- **Midnight Purple** - Deep royal purple

### ✨ Special
- **Glass Morphism** - Frosted glass effect
- **Pride Rainbow** - Rainbow gradients

---

## 🎯 Key Features

### Dashboard
- 📱 **Live Preview** - See your profile instantly on a phone mockup
- 🎨 **Theme Preview** - Hover over themes to preview before applying
- ✏️ **Inline Editing** - Edit links directly without modals
- 🎬 **Smooth Animations** - Framer Motion powered transitions
- 📊 **3-Column Layout** - Sidebar | Editor | Preview

### Profile Features
- 🔗 **Unlimited Links** - Add as many as you need
- 📱 **Mobile Optimized** - Perfect on all devices
- 🎨 **20+ Themes** - Professional gradient & solid themes
- 📊 **Analytics** - Track clicks, views, devices
- 🔗 **Custom URL** - `gitolink.vercel.app/yourname`

### Technical
- ⚡ **Next.js 14** - App Router for best performance
- 🔐 **JWT Auth** - Secure authentication
- 🗄️ **PostgreSQL** - Reliable database
- 🎨 **Tailwind CSS** - Beautiful styling
- 🎬 **Framer Motion** - Smooth animations

---

## 📸 Screenshots

### Dashboard with Live Preview
<p align="center">
  <img src="https://raw.githubusercontent.com/jaaberaziz-code/gitolink/main/screenshots/dashboard.png" alt="Dashboard" width="800" />
</p>

### Public Profile
<p align="center">
  <img src="https://raw.githubusercontent.com/jaaberaziz-code/gitolink/main/screenshots/profile.png" alt="Profile" width="400" />
</p>

### Theme Selection
<p align="center">
  <img src="https://raw.githubusercontent.com/jaaberaziz-code/gitolink/main/screenshots/themes.png" alt="Themes" width="800" />
</p>

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (or use Vercel Postgres)

### Local Development

```bash
# Clone repository
git clone https://github.com/jaaberaziz-code/gitolink.git
cd gitolink

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local

# Edit .env.local:
# DATABASE_URL="postgresql://..."
# POSTGRES_URL="postgresql://..." (for migrations)
# JWT_SECRET="your-secret-key"
# NEXTAUTH_URL="http://localhost:3000"

# Set up database
npx prisma db push

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🚀 Deploy

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jaaberaziz-code/gitolink)

1. Connect to GitHub
2. Add environment variables:
   - `DATABASE_URL` - Vercel Postgres pooled URL
   - `POSTGRES_URL` - Vercel Postgres direct URL
   - `JWT_SECRET` - Random secret
   - `NEXTAUTH_URL` - Your domain
3. Deploy!

### Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/jaaberaziz-code/gitolink)

---

## 🔧 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL pooled connection |
| `POSTGRES_URL` | ✅ | PostgreSQL direct connection (for Prisma) |
| `JWT_SECRET` | ✅ | Secret key for JWT signing |
| `NEXTAUTH_URL` | ✅ | Your app URL |

---

## 📁 Project Structure

```
gitolink/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   ├── auth/              # Login/Register pages
│   │   ├── dashboard/         # Dashboard with live preview
│   │   ├── demo/              # Demo profile page
│   │   ├── contact/           # Contact page
│   │   ├── [username]/        # Public profile page
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── dashboard/         # Dashboard components
│   │   │   ├── MobileMockup.tsx    # Phone preview
│   │   │   └── ThemePreview.tsx    # Theme selector
│   │   └── profile/           # Profile components
│   ├── lib/
│   │   ├── utils.ts           # 20+ theme definitions
│   │   └── auth.ts            # JWT utilities
│   └── types/
├── prisma/
│   └── schema.prisma          # Database schema
└── public/                    # Static assets
```

---

## 🛠️ Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **PostgreSQL** - Database (Vercel Postgres)
- **Prisma ORM** - Database access
- **Framer Motion** - Animations
- **JWT** - Authentication
- **React Icons** - Icon library

---

## 🗺️ Roadmap

### ✅ Completed
- [x] 20+ professional themes
- [x] Live theme preview
- [x] Mobile mockup preview
- [x] Glass morphism UI
- [x] JWT authentication
- [x] Link management
- [x] Public profiles
- [x] Analytics dashboard

### 🚧 Coming Soon
- [ ] Custom domains
- [ ] QR code generator
- [ ] Link scheduling
- [ ] Password-protected links
- [ ] More animations
- [ ] Team accounts

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file

---

## 🔗 Links

- 🌐 **Live Site**: [gitolink.vercel.app](https://gitolink.vercel.app)
- 📁 **GitHub**: [github.com/jaaberaziz-code/gitolink](https://github.com/jaaberaziz-code/gitolink)
- 🐛 **Issues**: [GitHub Issues](https://github.com/jaaberaziz-code/gitolink/issues)

---

<p align="center">
  Made with ❤️ by <strong>Jaze Izi</strong>
</p>

<p align="center">
  ⭐ Star this repo if you like it!
</p>