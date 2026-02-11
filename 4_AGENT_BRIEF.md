# GitoLink Final Polish - 4 Agent Brief

## Objective
Complete the Neo-brutalist design unification with professional onboarding, design customization with live preview, and stunning theme showcase.

---

## Agent 1: Onboarding Specialist
**Skill:** UX Flow Design, Step-by-Step Wizards, Animations

**Mission:** Redesign complete onboarding experience

**Files to Modify:**
- `/src/app/onboarding/page.tsx`
- `/src/components/onboarding/OnboardingWizard.tsx`
- `/src/components/onboarding/GoalSelector.tsx`
- `/src/components/onboarding/PlatformSelector.tsx`
- `/src/components/onboarding/ThemeSelector.tsx`
- `/src/components/onboarding/ProfileSetup.tsx`
- `/src/components/onboarding/Celebration.tsx`

**Requirements:**
1. **Neo-brutalist Design:**
   - Background: bg-black
   - Remove ALL rounded corners (rounded-none)
   - Remove glassmorphism (glass-card, backdrop-blur)
   - Colors: black/white/neon green only
   - Typography: font-mono for labels

2. **Step Indicator:**
   - Sharp steps (no rounded-full)
   - Active step: bg-white text-black
   - Completed step: bg-[#00FF41] text-black
   - Inactive: border border-gray-800
   - Progress bar: neon green fill

3. **Each Step Design:**
   - Large step number (01, 02, 03...)
   - Sharp bordered cards for options
   - Hover: border-[#00FF41]
   - Selected: bg-white text-black

4. **Animations:**
   - Slide transitions between steps
   - Fade in content
   - Celebration at end (confetti with neon green)

5. **Navigation:**
   - "BACK" button: border border-gray-800
   - "CONTINUE" button: bg-white text-black
   - "COMPLETE" button: bg-[#00FF41] text-black

---

## Agent 2: Design System Expert
**Skill:** UI Components, Live Preview Systems, Form Controls

**Mission:** Redesign DesignTab with mobile live preview

**Files to Modify:**
- `/src/components/dashboard/DesignTab.tsx`
- Create `/src/components/dashboard/MobilePreview.tsx`

**Requirements:**

### 1. Layout Redesign
```
[Sidebar: Sections]  [Main: Controls + Preview]
        280px              flex-1
```

**Sidebar Sections:**
- Layout
- Typography  
- Colors
- Buttons
- Background

Each section button:
```tsx
<button className="w-full text-left px-4 py-3 border-l-2 
  ${active ? 'border-[#00FF41] bg-white/5 text-white' : 'border-gray-800 text-gray-400'}">
  01 LAYOUT
</button>
```

### 2. Control Panels (Neo-brutalist)
- **Layout:** Sharp bordered cards, selected = white border + checkmark
- **Typography:** Font list with sharp borders, mono labels
- **Colors:** Color grid + hex input, selected = ring-2 ring-white
- **Buttons:** Style selector (sharp visual), color picker
- **Background:** Theme grid + custom upload

### 3. Mobile Preview Component (CRITICAL)
Create new component that shows real-time preview:

```tsx
// MobilePreview.tsx
interface MobilePreviewProps {
  design: {
    layout: string
    font_family: string
    title_color: string
    button_style: string
    button_color: string
    background_type: string
    background_value: string
  }
  links: Link[]
  user: { name: string, username: string, avatar?: string }
}
```

**Preview Features:**
- iPhone frame (notch, border)
- Real-time updates on design change
- Shows actual links with selected button style
- Live background/gradient preview
- Scrollable content

**Design:**
- Phone frame: border-4 border-gray-800 rounded-[2rem]
- Screen: reflects actual user design choices
- Notch: black bar at top
- Footer: "Made with GitoLink"

### 4. Save/Reset Actions
- "RESET" button: border border-gray-800
- "APPLY CHANGES" button: bg-[#00FF41] text-black
- Unsaved changes indicator: amber dot + text

---

## Agent 3: Theme Showcase Developer
**Skill:** Interactive Galleries, Visual Previews, CSS Effects

**Mission:** Redesign /themes page with unique style examples

**Files to Modify:**
- `/src/app/themes/page.tsx`

**Requirements:**

### 1. Hero Section
```
20+ UNIQUE
  STYLES
[neon green line]
```

### 2. Filter Bar
Categories: ALL | GAMING | PROFESSIONAL | CREATIVE | MINIMAL

Each filter:
```tsx
<button className="px-4 py-2 border border-gray-800 font-mono text-sm
  ${active ? 'bg-[#00FF41] text-black border-[#00FF41]' : 'text-gray-400 hover:border-gray-600'}">
  CATEGORY
</button>
```

### 3. Theme Grid with UNIQUE Examples
**CRITICAL:** Each theme card must show UNIQUE style, not just gradient.

**Card Design:**
- Aspect ratio: 3/4 (phone shape)
- Border: 2px gray-800
- Hover: border-[#00FF41]

**Inside Each Card (mock content showing theme):**
```tsx
// Different content per theme category:

// GAMING themes (cyberpunk, matrix, retro):
- Dark bg with grid pattern
- Neon accents
- Glitch text effect
- Game-style buttons

// PROFESSIONAL (corporate, executive, minimal):
- Clean white/gray
- Corporate avatar placeholder
- Simple clean buttons
- Subtle shadows

// CREATIVE (sunset, tropical, aurora, etc):
- Gradient backgrounds
- Artistic typography
- Creative button shapes
- Bold colors

// MINIMAL (minimal, glass):
- White/black only
- Ultra simple
- No decorations
- Clean typography
```

### 4. Theme Detail Modal
On click, open modal with:
- Large phone preview
- Theme name + category
- "Use This Theme" button (neon green)
- Theme features list

---

## Agent 4: Integration Lead
**Skill:** Code Review, Consistency Checks, Final Polish

**Mission:** Ensure all agents work is cohesive and consistent

**Files to Review:**
- All files modified by Agents 1-3
- `/src/app/globals.css` (update/remove glass utilities)
- `/src/components/ui/Skeleton.tsx` (update for Neo-brutalist)
- `/src/app/[username]/page.tsx` (ensure consistency)

**Tasks:**

### 1. Consistency Checklist
- [ ] No `bg-blue-600` buttons anywhere
- [ ] No `rounded-2xl` on cards (max 4px)
- [ ] No `glass-card`, `glass-dark`, `backdrop-blur`
- [ ] All backgrounds: black or near-black
- [ ] All borders: border-gray-800
- [ ] Typography: font-mono for UI labels
- [ ] Accent: only white or #00FF41

### 2. Update globals.css
Remove or replace:
```css
/* REMOVE or DEPRECATE */
.glass { }
.glass-card { }
.glass-dark { }
.backdrop-blur { }

/* ADD if needed */
.border-brutal {
  border: 1px solid #333;
}
```

### 3. Update Skeleton Loaders
Remove glass effects:
```tsx
// BEFORE
<div className="glass-card rounded-2xl animate-pulse" />

// AFTER  
<div className="bg-[#111] border border-gray-800 animate-pulse" />
```

### 4. Final Integration Test
- Test onboarding flow end-to-end
- Test design tab with all sections
- Test theme gallery filters
- Verify mobile preview works

### 5. Documentation
Create `/docs/DESIGN_SYSTEM.md`:
- Color tokens
- Typography rules
- Component patterns
- Do's and Don'ts

---

## Shared Requirements (ALL AGENTS)

### Color Palette (STRICT)
```
Background: #000000, #0a0a0a, #111111
Text: #ffffff, #a0a0a0, #666666
Accent: #00FF41 (neon green)
Borders: #333333, #444444
Error: #ff4444
```

### Typography
```
Headings: text-4xl font-bold tracking-tight
UI Labels: font-mono uppercase tracking-wider
Body: text-base or text-sm
```

### Buttons
```tsx
// Primary
<button className="px-6 py-3 bg-white text-black font-medium hover:bg-gray-200">

// Accent (CTA only)
<button className="px-6 py-3 bg-[#00FF41] text-black font-bold hover:bg-[#00CC33]">

// Secondary
<button className="px-6 py-3 border border-gray-700 text-white hover:border-gray-500">

// Ghost
<button className="px-4 py-2 text-gray-400 hover:text-white">
```

### Cards
```tsx
<div className="bg-[#0a0a0a] border border-gray-800 p-6">
  {/* Content */}
</div>
```

### No-Go List (NEVER USE)
- ❌ bg-blue-600, bg-purple-600, etc.
- ❌ rounded-xl, rounded-2xl (except phone mockup)
- ❌ glass, glass-card, glass-dark
- ❌ backdrop-blur, bg-white/5, bg-white/10
- ❌ shadow-lg, shadow-xl
- ❌ Gradient text (unless specifically requested)

---

## Deliverables

Each agent must provide:
1. Modified files with Neo-brutalist design
2. List of changes made
3. Screenshots/description of final result
4. Build passes: `npm run build`

Agent 4 additionally provides:
1. Design system documentation
2. Consistency report
3. Integration test results

---

## Reference Files (GOOD EXAMPLES)
- `/src/app/page.tsx` - Landing page (THE REFERENCE)
- `/src/app/(auth)/login/page.tsx` - Login (recently updated)
- `/src/app/dashboard/page.tsx` - Dashboard (recently updated)
- `/src/app/demo/page.tsx` - Demo page (good example)
- `/src/app/themes/page.tsx` - Themes (needs work)

Look at these for correct implementation patterns.
