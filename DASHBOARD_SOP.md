# 🎛️ GitoLink Dashboard Design System
## Complete SOP (Standard Operating Procedure)

---

## 1. DASHBOARD ARCHITECTURE

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│  [LOGO]                    Dashboard    [Avatar ▼] [🔔]     │  ← Header (64px)
├──────────┬──────────────────────────────────────────────────┤
│          │                                                  │
│  LINKS   │   ┌─────────────┐  ┌─────────────┐             │
│  ANALYT  │   │  VIEWS      │  │  CLICKS     │             │  ← Stats Cards
│  SETTINGS│   │  12.5K      │  │  8.2K       │             │
│  THEMES  │   └─────────────┘  └─────────────┘             │
│          │                                                  │
│  [+] Add │   MY LINKS                          [+ New Link] │
│          │   ─────────                                   │
│          │                                                  │
│          │   ┌─────────────────────────────────────────┐   │
│          │   │ ⚫ Instagram  instagram.com/jaze    [⋮] │   │  ← Link List
│          │   │ ──────────────────────────────────────  │   │
│          │   │ ⚫ YouTube    youtube.com/c/jaze    [⋮] │   │
│          │   │ ──────────────────────────────────────  │   │
│          │   │ ⚫ Portfolio  jaze.dev              [⋮] │   │
│          │   └─────────────────────────────────────────┘   │
│          │                                                  │
│          │                                                  │
├──────────┤   ┌─────────────────┐                          │
│  PREVIEW │   │   📱 Preview    │                          │  ← Mobile Mockup
│          │   │                 │                          │
│          │   │  ┌───────────┐  │                          │
│          │   │  │  Avatar   │  │                          │
│          │   │  │  @jaze    │  │                          │
│          │   │  │           │  │                          │
│          │   │  │ [Links]   │  │                          │
│          │   │  │ [Links]   │  │                          │
│          │   │  │ [Links]   │  │                          │
│          │   │  └───────────┘  │                          │
│          │   └─────────────────┘                          │
│          │                                                  │
│          │   THEMES                                         │
│          │   ┌────┐ ┌────┐ ┌────┐ ┌────┐                  │  ← Theme Selector
│          │   │ 🔲 │ │ 🔲 │ │ 🔲 │ │ 🔲 │                  │
│          │   └────┘ └────┘ └────┘ └────┘                  │
│          │                                                  │
└──────────┴──────────────────────────────────────────────────┘
     240px                    Flex (remaining width)
```

---

## 2. DESIGN TOKENS

### Dashboard-Specific Colors
```css
:root {
  /* Dashboard Background Layers */
  --dash-bg-primary: #000000;
  --dash-bg-secondary: #0a0a0a;
  --dash-bg-tertiary: #111111;
  --dash-bg-card: #141414;
  
  /* Sidebar */
  --sidebar-bg: #0a0a0a;
  --sidebar-border: #1a1a1a;
  --sidebar-hover: #1a1a1a;
  --sidebar-active: #00FF41;
  --sidebar-active-bg: rgba(0, 255, 65, 0.1);
  
  /* Stats Cards */
  --stat-card-bg: #141414;
  --stat-card-border: #222222;
  --stat-card-hover: #1a1a1a;
  --stat-value: #FFFFFF;
  --stat-label: #6B7280;
  
  /* Links List */
  --link-item-bg: #141414;
  --link-item-border: #222222;
  --link-item-hover: #1a1a1a;
  --link-dragging: rgba(0, 255, 65, 0.05);
  
  /* Mobile Preview */
  --preview-bg: #1a1a1a;
  --preview-phone-bg: #000000;
  --preview-phone-border: #333333;
}
```

### Dashboard Typography Scale
```css
:root {
  /* Dashboard uses same fonts as main site */
  --dash-font-heading: var(--font-space-grotesk);
  --dash-font-body: var(--font-jetbrains-mono);
  
  /* Dashboard-specific sizes */
  --dash-text-xs: 0.6875rem;    /* 11px - Labels */
  --dash-text-sm: 0.75rem;      /* 12px - Secondary */
  --dash-text-base: 0.875rem;   /* 14px - Body */
  --dash-text-lg: 1rem;         /* 16px - Emphasis */
  --dash-text-xl: 1.125rem;     /* 18px - Headings */
  --dash-text-2xl: 1.25rem;     /* 20px - Large headings */
  --dash-text-3xl: 1.5rem;      /* 24px - Stats */
}
```

### Dashboard Spacing
```css
:root {
  /* Dashboard density */
  --dash-space-1: 0.25rem;   /* 4px */
  --dash-space-2: 0.5rem;    /* 8px */
  --dash-space-3: 0.75rem;   /* 12px */
  --dash-space-4: 1rem;      /* 16px */
  --dash-space-5: 1.25rem;   /* 20px */
  --dash-space-6: 1.5rem;    /* 24px */
  --dash-space-8: 2rem;      /* 32px */
  
  /* Sidebar width */
  --sidebar-width: 240px;
  --sidebar-collapsed: 64px;
  
  /* Header height */
  --header-height: 64px;
}
```

---

## 3. COMPONENT LIBRARY

### 3.1 Sidebar

```tsx
// components/dashboard/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const navItems = [
  { id: 'links', label: 'Links', icon: Icons.link, href: '/dashboard' },
  { id: 'analytics', label: 'Analytics', icon: Icons.chart, href: '/dashboard/analytics' },
  { id: 'themes', label: 'Themes', icon: Icons.palette, href: '/dashboard/themes' },
  { id: 'settings', label: 'Settings', icon: Icons.settings, href: '/dashboard/settings' },
]

export default function Sidebar() {
  const pathname = usePathname()
  
  return (
    <aside className="
      fixed left-0 top-[64px] bottom-0
      w-[240px]
      bg-[#0a0a0a]
      border-r border-[#1a1a1a]
      flex flex-col
      z-40
    ">
      {/* Main Nav */}
      <nav className="flex-1 py-6 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3
                    px-4 py-3
                    font-mono text-sm
                    transition-all duration-200
                    ${isActive 
                      ? 'text-[#00FF41] bg-[rgba(0,255,65,0.1)] border-l-2 border-[#00FF41]' 
                      : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                    }
                  `}
                >
                  <span className={isActive ? 'text-[#00FF41]' : ''}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      
      {/* Add Link Button */}
      <div className="p-4 border-t border-[#1a1a1a]">
        <button className="
          w-full flex items-center justify-center gap-2
          px-4 py-3
          bg-[#00FF41] text-black
          font-mono font-bold text-sm
          hover:bg-[#00CC33]
          transition-colors
        ">
          {Icons.plus}
          Add New Link
        </button>
      </div>
    </aside>
  )
}
```

### 3.2 Stats Cards

```tsx
// components/dashboard/StatsCard.tsx
'use client'

import { motion } from 'framer-motion'

interface StatsCardProps {
  label: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: React.ReactNode
}

export default function StatsCard({ label, value, change, changeType, icon }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        p-6
        bg-[#141414]
        border border-[#222222]
        hover:border-[#333333]
        transition-colors duration-200
      "
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-[#1a1a1a] text-gray-400">
          {icon}
        </div>
        
        {change && (
          <span className={`
            text-xs font-mono px-2 py-1
            ${changeType === 'positive' ? 'text-[#00FF41] bg-[#00FF41]/10' : ''}
            ${changeType === 'negative' ? 'text-red-400 bg-red-400/10' : ''}
            ${changeType === 'neutral' ? 'text-gray-500 bg-gray-800' : ''}
          `}>
            {change}
          </span>
        )}
      </div>
      
      <div className="text-3xl font-bold text-white mb-1">
        {value}
      </div>
      
      <div className="text-sm text-gray-500 font-mono">
        {label}
      </div>
    </motion.div>
  )
}
```

### 3.3 Link Item (Draggable)

```tsx
// components/dashboard/LinkItem.tsx
'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface LinkItemProps {
  id: string
  title: string
  url: string
  clicks: number
  icon?: string
}

export default function LinkItem({ id, title, url, clicks, icon }: LinkItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        group
        flex items-center gap-4
        p-4
        bg-[#141414]
        border border-[#222222]
        hover:border-[#333333]
        transition-all duration-200
        ${isDragging ? 'opacity-50 border-[#00FF41] bg-[rgba(0,255,65,0.05)]' : ''}
      `}
    >
      {/* Drag Handle */}
      <button
        {...attributes}
        {...listeners}
        className="
          p-2 text-gray-600 cursor-grab active:cursor-grabbing
          hover:text-gray-400
          opacity-0 group-hover:opacity-100
          transition-opacity
        "
      >
        {Icons.grip}
      </button>

      {/* Icon */}
      <div className="w-10 h-10 bg-[#1a1a1a] flex items-center justify-center text-xl">
        {icon || '⚫'}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-white truncate">{title}</h4>
        <p className="text-sm text-gray-500 font-mono truncate">{url}</p>
      </div>

      {/* Stats */}
      <div className="text-right">
        <div className="text-sm font-mono text-[#00FF41]">
          {clicks.toLocaleString()} clicks
        </div>
      </div>

      {/* Actions */}
      <button className="
        p-2 text-gray-600 hover:text-white
        opacity-0 group-hover:opacity-100
        transition-opacity
      ">
        {Icons.more}
      </button>
    </div>
  )
}
```

### 3.4 Mobile Preview

```tsx
// components/dashboard/MobilePreview.tsx
'use client'

import { motion } from 'framer-motion'
import { useUser } from '@/hooks/useUser'
import { useLinks } from '@/hooks/useLinks'

export default function MobilePreview() {
  const { user } = useUser()
  const { links, selectedTheme } = useLinks()

  return (
    <div className="bg-[#1a1a1a] p-6">
      <h3 className="text-sm font-mono text-gray-500 mb-4 uppercase tracking-wider">
        Live Preview
      </h3>
      
      {/* Phone Frame */}
      <div className="
        relative mx-auto w-[280px]
        bg-black
        rounded-[2.5rem]
        p-3
        border border-[#333333]
        shadow-2xl
      ">
        {/* Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full z-10" />
        
        {/* Screen */}
        <div className={`
          w-full aspect-[9/19]
          rounded-[2rem]
          overflow-hidden
          ${selectedTheme?.bgClass || 'bg-gradient-to-b from-gray-900 to-black'}
        `}
        >
          {/* Profile */}
          <div className="p-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full mx-auto mb-4 border-2 border-white/10" />
            
            <h4 className="font-bold text-white mb-1">{user?.name || '@username'}</h4>
            
            <p className="text-sm text-white/60">{user?.bio || 'Your bio here'}</p>
          </div>
          
          {/* Links */}
          <div className="px-4 space-y-3">
            {links.slice(0, 4).map((link) => (
              <div
                key={link.id}
                className="
                  p-4
                  bg-white/10 backdrop-blur-sm
                  border border-white/10
                  text-white text-sm font-medium
                  text-center
                "
              >
                {link.title}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* View Live Link */}
      <div className="mt-6 text-center">
        <Link 
          href={`/${user?.username}`}
          className="text-sm text-[#00FF41] font-mono hover:underline"
        >
          View live page →
        </Link>
      </div>
    </div>
  )
}
```

### 3.5 Theme Selector

```tsx
// components/dashboard/ThemeSelector.tsx
'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const themes = [
  { id: 'cyber', name: 'Cyber', colors: 'from-purple-600 to-pink-600' },
  { id: 'minimal', name: 'Minimal', colors: 'from-gray-100 to-white' },
  { id: 'midnight', name: 'Midnight', colors: 'from-gray-900 to-black' },
  { id: 'sunset', name: 'Sunset', colors: 'from-orange-500 to-red-500' },
  { id: 'ocean', name: 'Ocean', colors: 'from-blue-600 to-cyan-500' },
  { id: 'forest', name: 'Forest', colors: 'from-green-600 to-emerald-500' },
  { id: 'matrix', name: 'Matrix', colors: 'from-black to-green-900' },
  { id: 'gold', name: 'Gold', colors: 'from-yellow-600 to-amber-500' },
]

export default function ThemeSelector() {
  const [selected, setSelected] = useState('cyber')

  return (
    <div className="bg-[#141414] border border-[#222222] p-6">
      <h3 className="text-sm font-mono text-gray-500 mb-4 uppercase tracking-wider">
        Select Theme
      </h3>
      
      <div className="grid grid-cols-4 gap-3">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setSelected(theme.id)}
            className={`
              relative aspect-square
              bg-gradient-to-br ${theme.colors}
              border-2
              ${selected === theme.id ? 'border-[#00FF41]' : 'border-transparent'}
              hover:scale-105
              transition-all duration-200
            `}
          >
            {selected === theme.id && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <svg className="w-6 h-6 text-[#00FF41]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <span className="text-sm font-mono text-gray-400">
          {themes.find(t => t.id === selected)?.name}
        </span>
      </div>
    </div>
  )
}
```

---

## 4. DASHBOARD PAGE STRUCTURE

```tsx
// app/dashboard/page.tsx
'use client'

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useState } from 'react'

import Sidebar from '@/components/dashboard/Sidebar'
import Header from '@/components/dashboard/Header'
import StatsCard from '@/components/dashboard/StatsCard'
import LinkItem from '@/components/dashboard/LinkItem'
import MobilePreview from '@/components/dashboard/MobilePreview'
import ThemeSelector from '@/components/dashboard/ThemeSelector'

const Icons = {
  eye: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  cursor: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
    </svg>
  ),
  plus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export default function DashboardPage() {
  const [links, setLinks] = useState([
    { id: '1', title: 'Instagram', url: 'instagram.com/jaze', clicks: 4523, icon: '📸' },
    { id: '2', title: 'YouTube', url: 'youtube.com/c/jaze', clicks: 2891, icon: '▶️' },
    { id: '3', title: 'Portfolio', url: 'jaze.dev', clicks: 1234, icon: '💼' },
  ])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    
    if (active.id !== over.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id)
        const newIndex = items.findIndex(i => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="pt-16 flex">
        <Sidebar />
        
        <main className="flex-1 ml-[240px] p-8">
          <div className="max-w-7xl mx-auto">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatsCard
                label="Total Views"
                value="12.5K"
                change="+23%"
                changeType="positive"
                icon={Icons.eye}
              />
              <StatsCard
                label="Total Clicks"
                value="8.2K"
                change="+15%"
                changeType="positive"
                icon={Icons.cursor}
              />
              <StatsCard
                label="Click Rate"
                value="65.6%"
                change="-2%"
                changeType="negative"
                icon={Icons.chart}
              />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Links Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">My Links</h2>
                  
                  <button className="
                    flex items-center gap-2
                    px-4 py-2
                    bg-[#00FF41] text-black
                    font-mono font-bold text-sm
                    hover:bg-[#00CC33]
                    transition-colors
                  ">
                    {Icons.plus}
                    New Link
                  </button>
                </div>

                {/* Links List */}
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={links.map(l => l.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-3">
                      {links.map((link) => (
                        <LinkItem
                          key={link.id}
                          id={link.id}
                          {...link}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                <MobilePreview />
                <ThemeSelector />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
```

---

## 5. RESPONSIVE BEHAVIOR

### Breakpoints

| Breakpoint | Layout Changes |
|------------|----------------|
| **Desktop** (≥1024px) | Full sidebar (240px) + 3-column stats + preview visible |
| **Tablet** (768-1023px) | Collapsed sidebar (icons only) + 2-column stats |
| **Mobile** (<768px) | Hidden sidebar (hamburger menu) + stacked layout |

### Mobile Adaptations

```tsx
// Responsive sidebar
const [sidebarOpen, setSidebarOpen] = useState(false)

// In mobile:
<button onClick={() => setSidebarOpen(true)}>
  {Icons.menu}
</button>

<Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
  <SheetContent side="left" className="w-[280px] bg-[#0a0a0a]">
    <Sidebar />
  </SheetContent>
</Sheet>
```

---

## 6. INTERACTION PATTERNS

### Loading States
```tsx
// Skeleton loader for stats
<div className="animate-pulse">
  <div className="h-8 bg-gray-800 rounded w-24 mb-2" />
  <div className="h-4 bg-gray-800 rounded w-16" />
</div>
```

### Empty States
```tsx
// No links yet
<div className="text-center py-16 border border-dashed border-gray-800">
  <div className="text-4xl mb-4">🔗</div>
  <h3 className="font-bold mb-2">No links yet</h3>
  <p className="text-gray-500 mb-4">Add your first link to get started</p>
  <button className="bg-[#00FF41] text-black px-4 py-2 font-bold">
    Add Link
  </button>
</div>
```

### Success Feedback
```tsx
// Toast notification
toast.success('Link updated successfully', {
  icon: '✓',
  style: {
    background: '#00FF41',
    color: '#000',
  },
})
```

---

## 7. FILE STRUCTURE

```
src/
├── app/
│   └── dashboard/
│       ├── layout.tsx          # Dashboard layout with sidebar
│       ├── page.tsx            # Main dashboard
│       ├── analytics/
│       │   └── page.tsx        # Analytics page
│       ├── themes/
│       │   └── page.tsx        # Themes page
│       └── settings/
│           └── page.tsx        # Settings page
│
├── components/
│   └── dashboard/
│       ├── Sidebar.tsx         # Navigation sidebar
│       ├── Header.tsx          # Top header bar
│       ├── StatsCard.tsx       # Statistics cards
│       ├── LinkItem.tsx        # Draggable link item
│       ├── LinkList.tsx        # Container for links
│       ├── MobilePreview.tsx   # Phone mockup preview
│       ├── ThemeSelector.tsx   # Theme grid selector
│       ├── EmptyState.tsx      # Empty states
│       └── Skeleton.tsx        # Loading skeletons
│
├── hooks/
│   ├── useUser.ts              # User data hook
│   ├── useLinks.ts             # Links management hook
│   └── useAnalytics.ts         # Analytics data hook
│
└── lib/
    └── dashboard/
        ├── constants.ts        # Dashboard constants
        └── utils.ts            # Dashboard utilities
```

---

## 8. PERFORMANCE OPTIMIZATIONS

### Memoization
```tsx
const memoizedLinks = useMemo(() => {
  return links.filter(link => link.isActive)
}, [links])
```

### Virtualization (for 50+ links)
```tsx
import { VirtualList } from 'react-virtual'

<VirtualList
  items={links}
  renderItem={(link) => <LinkItem {...link} />}
  itemHeight={72}
/>
```

### Debounced Updates
```tsx
const debouncedSave = useMemo(
  () => debounce(saveToServer, 500),
  []
)
```

---

**Version:** 1.0  
**Last Updated:** 2026-02-10  
**Next Review:** 2026-03-10
