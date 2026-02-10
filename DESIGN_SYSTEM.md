# 🎨 GitoLink Design System
## Frontend Architecture & Style Guide

---

## 1. PHILOSOPHY

### Core Principle: "Neo-Brutalist Luxury"
- **Bold** typography over subtle gradients
- **High contrast** over soft shadows
- **Sharp edges** over rounded corners
- **Real content** over placeholder text
- **Motion with purpose** over decorative animations

---

## 2. DESIGN TOKENS

### Colors
```css
:root {
  /* Primary */
  --color-black: #000000;
  --color-white: #FFFFFF;
  --color-accent: #00FF41; /* Neon Green */
  
  /* Grays */
  --color-gray-100: #F3F4F6;
  --color-gray-200: #E5E7EB;
  --color-gray-300: #D1D5DB;
  --color-gray-400: #9CA3AF;
  --color-gray-500: #6B7280;
  --color-gray-600: #4B5563;
  --color-gray-700: #374151;
  --color-gray-800: #1F2937;
  --color-gray-900: #111827;
  
  /* Semantic */
  --color-background: var(--color-black);
  --color-text-primary: var(--color-white);
  --color-text-secondary: var(--color-gray-400);
  --color-border: var(--color-gray-800);
  --color-accent-hover: #00CC33;
}
```

### Typography
```css
:root {
  /* Font Families */
  --font-heading: 'Space Grotesk', system-ui, sans-serif;
  --font-body: 'JetBrains Mono', monospace;
  
  /* Font Sizes */
  --text-xs: 0.75rem;      /* 12px - Labels */
  --text-sm: 0.875rem;     /* 14px - Body small */
  --text-base: 1rem;       /* 16px - Body */
  --text-lg: 1.125rem;     /* 18px - Lead */
  --text-xl: 1.25rem;      /* 20px - H4 */
  --text-2xl: 1.5rem;      /* 24px - H3 */
  --text-3xl: 1.875rem;    /* 30px - H2 small */
  --text-4xl: 2.25rem;     /* 36px - H2 */
  --text-5xl: 3rem;        /* 48px - H1 small */
  --text-6xl: 3.75rem;     /* 60px - H1 */
  --text-7xl: 4.5rem;      /* 72px - Display */
  
  /* Font Weights */
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  
  /* Line Heights */
  --leading-tight: 1.1;
  --leading-snug: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
}
```

### Spacing
```css
:root {
  /* Base unit: 4px */
  --space-0: 0;
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
  --space-32: 8rem;     /* 128px */
}
```

### Border Radius
```css
:root {
  --radius-none: 0;
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;
  
  /* Default: Sharp corners */
  --radius-default: var(--radius-none);
}
```

### Shadows
```css
:root {
  /* Minimal shadows - prefer borders */
  --shadow-none: none;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  
  /* Glow effect for accent elements */
  --shadow-glow: 0 0 20px rgba(0, 255, 65, 0.3);
}
```

### Transitions
```css
:root {
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  
  --transition-default: all var(--duration-normal) var(--ease-out);
  --transition-fast: all var(--duration-fast) var(--ease-out);
}
```

---

## 3. COMPONENT LIBRARY

### Buttons

#### Primary Button
```tsx
// Usage: Main CTAs, important actions
<button className="
  inline-flex items-center gap-2
  px-6 py-3
  bg-white text-black
  font-semibold
  border-0
  hover:bg-gray-200
  active:scale-[0.98]
  transition-all duration-200
  cursor-pointer
">
  Button Text
  <ArrowIcon />
</button>
```

#### Secondary Button
```tsx
// Usage: Secondary actions, alternatives
<button className="
  inline-flex items-center gap-2
  px-6 py-3
  bg-transparent text-white
  border border-gray-700
  font-semibold
  hover:border-gray-500
  hover:bg-gray-900
  active:scale-[0.98]
  transition-all duration-200
  cursor-pointer
">
  Button Text
</button>
```

#### Accent Button
```tsx
// Usage: Special CTAs, highlights
<button className="
  inline-flex items-center gap-2
  px-6 py-3
  bg-[#00FF41] text-black
  font-bold
  border-0
  hover:bg-[#00CC33]
  hover:shadow-[0_0_20px_rgba(0,255,65,0.3)]
  active:scale-[0.98]
  transition-all duration-200
  cursor-pointer
">
  Button Text
</button>
```

### Cards

#### Feature Card
```tsx
<div className="
  relative
  p-8
  bg-gray-900
  border border-gray-800
  overflow-hidden
  group
  hover:border-gray-700
  transition-colors duration-300
">
  {/* Background number */}
  <span className="
    absolute top-4 left-4
    text-[120px] font-bold
    text-gray-800/30
    font-mono
    leading-none
    select-none
  ">
    01
  </span>
  
  {/* Content */}
  <div className="relative z-10">
    <Icon className="w-6 h-6 text-[#00FF41] mb-4" />
    <h3 className="text-2xl font-bold mb-2">Title</h3>
    <p className="text-gray-400 font-mono">Description</p>
  </div>
</div>
```

#### Theme Card
```tsx
<div className="
  relative
  aspect-[3/4]
  bg-gray-900
  border border-gray-800
  overflow-hidden
  cursor-pointer
  group
  hover:border-[#00FF41]/50
  transition-all duration-300
">
  {/* Preview */}
  <div className="absolute inset-4 bg-gradient-to-b from-purple-500 to-pink-500">
    {/* Theme preview content */}
  </div>
  
  {/* Label */}
  <div className="
    absolute bottom-0 left-0 right-0
    p-4
    bg-black/80
    backdrop-blur-sm
  ">
    <span className="font-mono text-sm uppercase tracking-wider">
      Theme Name
    </span>
  </div>
</div>
```

### Forms

#### Input Field
```tsx
<div className="space-y-2">
  <label className="
    block
    text-sm font-medium
    text-gray-300
    font-mono
  ">
    Label
  </label>
  <input
    type="text"
    className="
      w-full
      px-4 py-3
      bg-gray-900
      border border-gray-800
      text-white
      font-mono
      placeholder:text-gray-600
      focus:border-[#00FF41]
      focus:outline-none
      transition-colors duration-200
    "
    placeholder="Placeholder..."
  />
</div>
```

#### Textarea
```tsx
<textarea
  className="
    w-full
    px-4 py-3
    bg-gray-900
    border border-gray-800
    text-white
    font-mono
    placeholder:text-gray-600
    focus:border-[#00FF41]
    focus:outline-none
    transition-colors duration-200
    resize-none
  "
  rows={4}
/>
```

### Navigation

#### Navbar
```tsx
<nav className="
  fixed top-0 left-0 right-0 z-50
  bg-black/80
  backdrop-blur-md
  border-b border-gray-800
">
  <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
    {/* Logo */}
    <Link href="/" className="text-xl font-bold tracking-tight">
      GitoLink
    </Link>
    
    {/* Links */}
    <div className="hidden md:flex items-center gap-8">
      <Link className="text-sm text-gray-400 hover:text-white transition-colors">
        Features
      </Link>
      {/* More links... */}
    </div>
    
    {/* CTA */}
    <Link className="px-4 py-2 bg-white text-black text-sm font-medium hover:bg-gray-200 transition-colors">
      Get Started
    </Link>
  </div>
</nav>
```

### Icons

#### SVG Icon Standards
```tsx
// All icons: 24x24 viewBox, stroke-width 1.5-2
const IconName = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    {/* Paths */}
  </svg>
)
```

**Icon Sizes:**
- `w-4 h-4` - Small (16px) - Inline, buttons
- `w-5 h-5` - Medium (20px) - Default
- `w-6 h-6` - Large (24px) - Features, navigation

---

## 4. LAYOUT SYSTEM

### Container
```css
.container {
  max-width: 1280px; /* 7xl */
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem; /* 24px */
  padding-right: 1.5rem; /* 24px */
}
```

### Grid System
```tsx
// 2-column asymmetric
<div className="grid lg:grid-cols-2 gap-12 items-center">
  <div>Content</div>
  <div>Image/Mockup</div>
</div>

// 3-column grid
<div className="grid md:grid-cols-3 gap-6">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>

// Feature grid (alternating)
<div className="space-y-24">
  {features.map((feature, i) => (
    <div 
      key={feature.id}
      className={`grid lg:grid-cols-2 gap-12 items-center ${
        i % 2 === 1 ? 'lg:direction-rtl' : ''
      }`}
    >
      {/* Content */}
      {/* Image */}
    </div>
  ))}
</div>
```

### Spacing Scale
```tsx
// Section padding
<section className="py-24 px-6"> {/* 96px vertical */} </section>

// Content spacing
<div className="space-y-8"> {/* 32px between children */} </div>

// Component gaps
<div className="flex gap-4"> {/* 16px gap */} </div>
```

---

## 5. ANIMATION SYSTEM

### Motion Principles
1. **Purposeful** - Every animation serves a function
2. **Fast** - 150-300ms for micro-interactions
3. **Smooth** - Use `cubic-bezier(0.22, 1, 0.36, 1)`
4. **Subtle** - Opacity + transform only (no layout shifts)

### Animation Variants
```tsx
// Framer Motion variants
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
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
```

### Hover Effects
```tsx
// Button hover
<button className="
  hover:bg-gray-200
  active:scale-[0.98]
  transition-all duration-200
">

// Card hover
<div className="
  hover:border-gray-700
  transition-colors duration-300
">

// Link hover
<a className="
  hover:text-white
  transition-colors duration-200
">
```

### Scroll Animations
```tsx
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
>
  Content
</motion.div>
```

---

## 6. PAGE STRUCTURE

### Landing Page Sections
```tsx
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <Navbar />
      
      {/* Hero */}
      <HeroSection />
      
      {/* Features */}
      <FeaturesSection />
      
      {/* Themes */}
      <ThemesSection />
      
      {/* Pricing */}
      <PricingSection />
      
      {/* CTA */}
      <CTASection />
      
      {/* Footer */}
      <Footer />
    </div>
  )
}
```

### Dashboard Layout
```tsx
export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Sidebar />
      
      <main className="ml-64 p-8">
        <Header />
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <StatsOverview />
            <LinkList />
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            <MobilePreview />
            <ThemeSelector />
          </div>
        </div>
      </main>
    </div>
  )
}
```

---

## 7. FILE STRUCTURE

```
src/
├── app/
│   ├── layout.tsx           # Root layout with fonts
│   ├── page.tsx             # Landing page
│   ├── globals.css          # Global styles + CSS vars
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── api/
│
├── components/
│   ├── ui/                  # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Icon.tsx
│   │
│   ├── dashboard/           # Dashboard-specific
│   │   ├── LinkEditor.tsx
│   │   ├── MobileMockup.tsx
│   │   ├── ThemeSelector.tsx
│   │   └── AnalyticsChart.tsx
│   │
│   └── landing/             # Landing page sections
│       ├── Hero.tsx
│       ├── Features.tsx
│       ├── Themes.tsx
│       └── Pricing.tsx
│
├── lib/
│   ├── utils.ts             # Utility functions
│   ├── constants.ts         # Design tokens
│   └── animations.ts        # Framer Motion variants
│
├── styles/
│   └── design-tokens.css    # CSS custom properties
│
└── types/
    └── index.ts             # TypeScript types
```

---

## 8. BEST PRACTICES

### DO ✅
- Use **Space Grotesk** for headings
- Use **JetBrains Mono** for body/UI text
- Keep **sharp corners** (border-radius: 0)
- Use **high contrast** (black/white/neon)
- Add **cursor-pointer** to all interactive elements
- Use **real screenshots** instead of stock images
- Keep animations **under 300ms**
- Test at **375px, 768px, 1024px, 1440px**

### DON'T ❌
- Use **Inter, Roboto, or system fonts**
- Use **purple gradients** or generic SaaS colors
- Use **emojis** as icons (SVG only)
- Use **border-radius** above 4px
- Use **scale transforms** on hover (causes layout shift)
- Use **low contrast** text (below 4.5:1 ratio)
- Use **decorative animations** without purpose
- Use **placeholder content** in production

---

## 9. ACCESSIBILITY

### Requirements
- **Color contrast**: 4.5:1 minimum
- **Focus states**: Visible outline on all interactive elements
- **Alt text**: Descriptive text for all images
- **Semantic HTML**: Proper heading hierarchy, landmarks
- **Keyboard navigation**: All features accessible via keyboard

### Focus Styles
```tsx
<button className="
  focus:outline-none
  focus:ring-2
  focus:ring-[#00FF41]
  focus:ring-offset-2
  focus:ring-offset-black
">
```

---

## 10. RESPONSIVE BREAKPOINTS

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

### Mobile-First Approach
```tsx
// Base: Mobile styles
<div className="grid grid-cols-1 gap-4">
  
{/* Tablet: 2 columns */}
<div className="md:grid-cols-2">
  
{/* Desktop: 3 columns */}
<div className="lg:grid-cols-3">
```

---

## 11. PERFORMANCE

### Image Optimization
- Use **Next.js Image** component
- Lazy load below-fold images
- Use WebP format when possible
- Specify width/height to prevent CLS

### Code Splitting
- Use dynamic imports for heavy components
- Lazy load modals and charts
- Preload critical assets

### Animation Performance
- Use `transform` and `opacity` only
- Add `will-change` sparingly
- Use CSS animations for simple effects
- Reserve Framer Motion for complex sequences

---

**Version:** 1.0  
**Last Updated:** 2026-02-10  
**Owner:** GitoLink Frontend Team
