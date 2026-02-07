# GitoLink v3

<p align="center">
  <img src="https://raw.githubusercontent.com/jaaberaziz-code/gitolink/main/public/logo.png" alt="GitoLink Logo" width="120" />
</p>

<h1 align="center">GitoLink</h1>

<p align="center">
  <strong>Your Links, Your Brand, Your Analytics</strong>
</p>

<p align="center">
  <a href="https://gitolink.onrender.com">🚀 Live Demo</a> •
  <a href="https://github.com/jaaberaziz-code/gitolink">📁 GitHub</a> •
  <a href="#quick-start">📖 Docs</a>
</p>

<p align="center">
  <a href="https://render.com/deploy?repo=https://github.com/jaaberaziz-code/gitolink">
    <img src="https://render.com/images/deploy-to-render-button.svg" alt="Deploy to Render" height="32" />
  </a>
</p>

---

## ✨ What is GitoLink?

**GitoLink** is a professional, open-source link-in-bio platform designed for creators, influencers, and businesses who want full control over their online presence.

Unlike proprietary alternatives, GitoLink gives you:
- 🎨 Complete customization freedom
- 📊 Full analytics data ownership
- 🔓 Open-source transparency
- 🚀 Self-hosting capabilities
- 💰 Zero platform fees

Built with modern web technologies, GitoLink delivers a blazing-fast, SEO-friendly experience that looks stunning on any device.

---

## 🎯 Key Features

| Feature | Description |
|---------|-------------|
| 🔐 **Simple JWT Authentication** | Secure, stateless auth with httpOnly cookies |
| 🎨 **Customizable Themes** | 10+ beautiful gradient themes + dark/light modes |
| 📊 **Real-time Analytics** | Track clicks, devices, browsers, and timelines |
| 🚀 **Fast & SEO-friendly** | Next.js 14 App Router for optimal performance |
| 📱 **Mobile-responsive** | Perfect experience on all screen sizes |
| 🔗 **Unlimited Links** | Add as many links as you need |
| 🎭 **Custom Profile URLs** | Clean `/username` URLs for every profile |
| 📈 **Click Tracking** | Detailed analytics with IP, device & browser data |
| 🌙 **Dark Mode Support** | Built-in dark mode for the dashboard |
| 🔄 **Drag & Drop** | Reorder links with intuitive drag-and-drop |

---

## 🏆 Why GitoLink vs Competitors?

| Feature | GitoLink | Linktree | Beacons | Carrd |
|---------|----------|----------|---------|-------|
| **Free Custom Domain** | ✅ | ❌ | ❌ | ✅ |
| **Open Source** | ✅ | ❌ | ❌ | ❌ |
| **Analytics** | ✅ | Limited | ✅ | ❌ |
| **No Watermark** | ✅ | ❌ | ❌ | ✅ |
| **Full Data Control** | ✅ | ❌ | ❌ | ✅ |
| **Custom Themes** | ✅ | Limited | ✅ | Limited |
| **API Access** | ✅ | ❌ | ❌ | ❌ |
| **Self-Hosting** | ✅ | ❌ | ❌ | ❌ |

---

## 🛠️ Tech Stack

- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[PostgreSQL](https://www.postgresql.org/)** - Robust relational database
- **[Prisma ORM](https://prisma.io/)** - Type-safe database access
- **[JWT Auth](https://jwt.io/)** - Stateless authentication
- **[Chart.js](https://www.chartjs.org/)** - Beautiful analytics charts

---

## 📸 Screenshots

### Dashboard
<p align="center">
  <img src="https://raw.githubusercontent.com/jaaberaziz-code/gitolink/main/screenshots/dashboard.png" alt="Dashboard" width="800" />
</p>
*Manage your links with an intuitive drag-and-drop interface*

### Public Profile
<p align="center">
  <img src="https://raw.githubusercontent.com/jaaberaziz-code/gitolink/main/screenshots/profile.png" alt="Profile" width="400" />
</p>
*Beautiful, customizable public profiles with gradient themes*

### Analytics
<p align="center">
  <img src="https://raw.githubusercontent.com/jaaberaziz-code/gitolink/main/screenshots/analytics.png" alt="Analytics" width="800" />
</p>
*Comprehensive analytics with device, browser, and timeline insights*

### Mobile View
<p align="center">
  <img src="https://raw.githubusercontent.com/jaaberaziz-code/gitolink/main/screenshots/mobile.png" alt="Mobile" width="300" />
</p>
*Fully responsive design that looks great on all devices*

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/jaaberaziz-code/gitolink.git
   cd gitolink
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local`:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/gitolink"
   JWT_SECRET="your-super-secret-key-change-this-in-production"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

---

## 📦 Deployment

### Deploy to Render (Recommended)

Click the button below for one-click deployment:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/jaaberaziz-code/gitolink)

**Environment Variables for Production:**

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (auto-generated on Render) |
| `JWT_SECRET` | Secret key for JWT signing (auto-generated) |
| `NEXTAUTH_URL` | Your production URL |

### Self-Hosting with Docker

```bash
# Build the image
docker build -t gitolink .

# Run the container
docker run -p 3000:3000 \
  -e DATABASE_URL=postgresql://... \
  -e JWT_SECRET=your-secret \
  gitolink
```

---

## 🔧 Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | ✅ | - | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | - | Secret for JWT signing |
| `NEXTAUTH_URL` | ✅ | - | Application URL |
| `NODE_ENV` | ❌ | `development` | Environment mode |

---

## 📁 Project Structure

```
gitolink/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   ├── links/        # Link management API
│   │   │   ├── profile/      # Public profile API
│   │   │   └── analytics/    # Analytics API
│   │   ├── (auth)/           # Auth pages (login/register)
│   │   ├── dashboard/        # Dashboard page
│   │   ├── [username]/       # Public profile page
│   │   ├── page.tsx          # Landing page
│   │   └── layout.tsx        # Root layout
│   ├── components/
│   │   ├── dashboard/        # Dashboard components
│   │   ├── ui/              # UI components
│   │   └── profile/         # Profile components
│   ├── lib/
│   │   ├── prisma.ts        # Database client
│   │   ├── jwt.ts           # JWT utilities
│   │   └── utils.ts         # Helper functions
│   └── types/
│       └── index.ts         # TypeScript types
├── prisma/
│   └── schema.prisma        # Database schema
├── public/                  # Static assets
└── render.yaml             # Render deployment config
```

---

## 🗺️ Roadmap

### Phase 1: Core (Complete) ✅
- [x] User authentication (JWT)
- [x] Link management (CRUD)
- [x] Public profiles
- [x] Basic analytics
- [x] Theme customization

### Phase 2: Enhanced Features 🚧
- [ ] Custom domains
- [ ] More themes (user-uploaded backgrounds)
- [ ] Link scheduling (publish/unpublish dates)
- [ ] Link click limits
- [ ] Password-protected links

### Phase 3: Team & Enterprise 📋
- [ ] Team accounts
- [ ] Role-based access control
- [ ] Organization profiles
- [ ] Advanced analytics (funnels, retention)
- [ ] API documentation
- [ ] Webhooks

### Phase 4: Monetization 📋
- [ ] Built-in tipping/donations
- [ ] Premium themes
- [ ] White-label options

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read our [Contributing Guide](CONTRIBUTING.md) for details.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 💖 Support

If you find GitoLink helpful, please consider:

- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting features
- 🔧 Contributing code

---

## 🔗 Links

- 🌐 **Website**: [gitolink.onrender.com](https://gitolink.onrender.com)
- 📁 **GitHub**: [github.com/jaaberaziz-code/gitolink](https://github.com/jaaberaziz-code/gitolink)
- 🐛 **Issues**: [GitHub Issues](https://github.com/jaaberaziz-code/gitolink/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/jaaberaziz-code/gitolink/discussions)

---

<p align="center">
  Made with ❤️ by the open-source community
</p>
