# GitoLink Design Unification Brief
## Goal: Unify All Pages Under Neo-Brutalist Luxury Design System

---

## Executive Summary

**Current Problem:**
- Landing page uses Neo-brutalist (black/white/sharp/monospace)
- Login/Register use mixed glassmorphism + gray
- Dashboard uses completely different glassmorphism (blue/purple/rounded/blur)

**Target:** Unify ALL pages under the Neo-brutalist Luxury style from the landing page

**Reference Style:** `/src/app/page.tsx` (Landing page - Neo-brutalist)

---

## Design System Tokens (STRICT - Use These Exactly)

### Colors
```
Background Primary:   #000000 (black)
Background Secondary: #0a0a0a (near-black)
Background Card:      #111111 or #1a1a1a
Border:              #333333 or #444444
Text Primary:        #ffffff (white)
Text Secondary:      #a0a0a0 (gray-400)
Text Muted:          #666666 (gray-600)
Accent:              #00FF41 (neon green)
Accent Hover:        #00CC33 (darker green)
Error:               #ff4444
Success:             #00FF41
```

### Typography
```
Headings:   font-bold, tracking-tight
Body:       font-mono (JetBrains Mono style)
Sizes:
  H1: text-5xl md:text-6xl lg:text-7xl
  H2: text-4xl md:text-5xl
  H3: text-2xl md:text-3xl
  Body: text-sm (for mono text)
  UI: text-base
```

### Borders & Corners
```
NO rounded-xl, NO rounded-2xl on cards
Use: rounded-none (sharp) OR rounded-sm (max 4px)
Borders: border border-gray-800 (1px solid)
Focus: focus:ring-2 focus:ring-[#00FF41]
```

### Buttons (CRITICAL - Match Landing Page)
```
Primary:
  - bg-white text-black hover:bg-gray-200
  - px-6 py-3 (or px-4 py-2 for small)
  - font-medium
  - NO rounded-full, use sharp or 4px max
  
Secondary:
  - border border-gray-700 text-white hover:border-gray-500
  - bg-transparent
  - Same sizing
  
Accent (CTA):
  - bg-[#00FF41] text-black hover:bg-[#00CC33]
  - Use sparingly for main CTAs only
```

### Cards/Containers
```
NO glass-card, NO backdrop-blur, NO glassmorphism
Use:
  - bg-gray-900 or bg-[#111]
  - border border-gray-800
  - rounded-none or rounded-sm
  - NO shadow-lg (use subtle shadows only)
```

### Icons
```
Use SVG icons (no emojis)
Stroke width: 1.5 or 2
Sizes: w-5 h-5 (standard), w-6 h-6 (large)
```

---

## Agent 1: Auth Pages Redesign

**Files to Modify:**
1. `/src/app/(auth)/login/page.tsx`
2. `/src/app/(auth)/register/page.tsx`

**Current Issues:**
- Uses `bg-gray-900`, `glass-dark`, `rounded-xl`
- Blue buttons (`bg-blue-600`)
- Rounded inputs

**Required Changes:**
1. Change background to `bg-black` or `bg-[#0a0a0a]`
2. Remove all `glass-dark`, `backdrop-blur`, `glass-card`
3. Replace `bg-blue-600` buttons with `bg-white text-black`
4. Change inputs from `rounded-lg bg-gray-800` to sharp/faint borders
5. Typography: Use `font-mono` for labels, standard for headings
6. Add Neo-brutalist decorative elements (grid lines, monospace labels)
7. Match the login form style to landing page buttons

**Input Style (CRITICAL):**
```tsx
// BEFORE (wrong):
<input className="bg-gray-800 border border-gray-700 rounded-lg ..." />

// AFTER (correct):
<input className="bg-transparent border-b border-gray-700 focus:border-[#00FF41] ..." />
// OR
<input className="bg-[#111] border border-gray-800 px-4 py-3 ..." />
```

---

## Agent 2: Dashboard Redesign

**Files to Modify:**
1. `/src/app/dashboard/page.tsx` (main file)
2. `/src/components/dashboard/LinkList.tsx`
3. `/src/components/dashboard/AddLinkModal.tsx`
4. `/src/components/dashboard/DesignTab.tsx`
5. `/src/components/dashboard/LinkAnalytics.tsx`
6. `/src/components/qr/QRCodeGenerator.tsx`

**Current Issues:**
- Uses `bg-[#0a0a0f]`, heavy `glass-card`, `backdrop-blur-xl`
- Blue/purple accent everywhere
- Rounded-2xl on everything
- Glassmorphism sidebar

**Required Changes:**
1. **Background:** Change `bg-[#0a0a0f]` to `bg-black`
2. **Remove ALL glass effects:**
   - Remove `glass-card` class usage
   - Remove `backdrop-blur`
   - Remove `bg-white/5`, `bg-white/10`
3. **Buttons:** Replace `bg-blue-600` with `bg-white text-black` or `bg-[#00FF41]`
4. **Cards:** Replace glass cards with solid `bg-[#111] border border-gray-800`
5. **Sidebar:** Remove glass, use solid `bg-[#0a0a0a] border-r border-gray-800`
6. **Rounded corners:** Change `rounded-2xl` to `rounded-none` or `rounded-sm`
7. **Analytics charts:** Replace blue gradients with neon green or grayscale
8. **Modal:** Redesign AddLinkModal to match Neo-brutalist (sharp, black/white)
9. **QR Generator:** Remove glass, use solid cards

**Sidebar Style:**
```tsx
// BEFORE:
<div className="glass-card rounded-2xl ...">

// AFTER:
<div className="bg-[#0a0a0a] border border-gray-800 ...">
```

**Tab Buttons:**
```tsx
// BEFORE:
<button className={`${active ? 'bg-blue-600' : ''} rounded-xl ...`}>

// AFTER:
<button className={`${active ? 'bg-white text-black' : 'text-gray-400'} ...`}>
```

---

## Agent 3: Components & Global Polish

**Files to Modify:**
1. `/src/components/onboarding/OnboardingWizard.tsx`
2. `/src/app/onboarding/page.tsx`
3. `/src/components/ui/Skeleton.tsx`
4. `/src/app/globals.css` (update glass utilities)
5. `/src/app/contact/page.tsx` (if exists)
6. `/src/components/dashboard/DesignTab.tsx` (shared)
7. `/src/components/embeds/*.tsx` (YouTube, Instagram, TikTok embeds)

**Required Changes:**

### Onboarding Wizard
- Complete redesign to Neo-brutalist
- Sharp steps/progress indicator (not rounded pills)
- Black/white/neon green color scheme
- Monospace labels
- No glassmorphism

### Skeleton Loaders
- Remove glass effects
- Use `bg-gray-800` or `bg-[#1a1a1a]` for skeletons
- Sharp corners

### Global CSS Updates
- Remove or deprecate `.glass`, `.glass-card`, `.glass-dark` utilities
- Add Neo-brutalist utilities if needed

### Embeds (YouTube, Instagram, TikTok)
- Ensure they work on black backgrounds
- Style container to match Neo-brutalist

---

## Reference Implementation

**Look at these files for CORRECT style:**
- `/src/app/page.tsx` - Landing page (THE REFERENCE)
- `/src/app/demo/page.tsx` - Demo page (also correct)
- `/src/app/themes/page.tsx` - Themes page (also correct)

**Key patterns from landing page:**
```tsx
// Navigation
<nav className="bg-black/80 backdrop-blur-md border-b border-gray-800">

// Section headers
<div className="w-16 h-[2px] bg-[#00FF41]" />
<h2 className="text-4xl md:text-5xl font-bold">TITLE</h2>

// Buttons
<Link className="px-6 py-3 bg-white text-black font-medium hover:bg-gray-200">
<Link className="px-6 py-3 bg-[#00FF41] text-black font-bold hover:bg-[#00CC33]">

// Cards
<div className="p-8 bg-gray-900 border border-gray-800">

// Text with mono
<p className="text-gray-400 font-mono">
```

---

## Quality Checklist

Before submitting, verify:
- [ ] No `bg-blue-600` or `bg-blue-500` buttons remain
- [ ] No `rounded-xl` or `rounded-2xl` on cards (max 4px)
- [ ] No `glass-card`, `glass-dark`, or `backdrop-blur` classes
- [ ] Background is `bg-black` or `bg-[#0a0a0a]` (not gray-900)
- [ ] All buttons use white/black or neon green
- [ ] Typography uses `font-mono` for secondary text
- [ ] Borders are `border-gray-800` (not lighter)
- [ ] Inputs have sharp or minimal rounding
- [ ] No purple/blue gradient accents (use neon green or grayscale)

---

## Output

Each agent must:
1. Read their assigned files
2. Apply Neo-brutalist design system
3. Ensure consistency with landing page
4. Run build check: `npm run build`
5. Report changes made with before/after summary

**Goal:** Every page should feel like it's part of the same website.
