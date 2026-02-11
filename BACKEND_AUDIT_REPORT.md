# GitoLink Backend API & Database Audit Report

## Executive Summary

**Status**: ⚠️ CRITICAL ISSUES FOUND - Production deployment NOT recommended without fixes

**Overall Grade**: C- (Functional core, significant schema/code mismatches)

---

## 1. API Endpoints Test Results

### ✅ WORKING ENDPOINTS

| Endpoint | Method | Status | Notes |
|----------|--------|--------|-------|
| `/api/auth/login` | POST | ✅ PASS | Good validation, secure cookie handling |
| `/api/auth/register` | POST | ✅ PASS | Proper bcrypt hashing, duplicate user check |
| `/api/auth/logout` | POST | ✅ PASS | Cookie clearing implemented |
| `/api/auth/me` | GET | ✅ PASS | JWT verification, user select works |
| `/api/auth/me` | PUT | ✅ PASS | Profile update with validation |
| `/api/links` | GET | ✅ PASS | Returns user links with counts |
| `/api/links` | POST | ✅ PASS | Creates links with proper ordering |
| `/api/links/[id]` | PATCH | ✅ PASS | Update and reorder functionality |
| `/api/links/[id]` | DELETE | ✅ PASS | Delete with user verification |
| `/api/profile/[username]` | GET | ✅ PASS | Public profile fetching |
| `/api/profile/[username]` | POST | ✅ PASS | Click tracking with UA parsing |
| `/api/qr` | GET/POST | ✅ PASS | QR generation works |
| `/api/unsplash/*` | GET | ✅ PASS | Fallback images implemented |

### ❌ BROKEN ENDPOINTS

| Endpoint | Method | Status | Issue |
|----------|--------|--------|-------|
| `/api/links/[id]/analytics` | GET | ❌ FAIL | References non-existent `ClickEvent` model |
| `/api/links/[id]/analytics` | GET | ❌ FAIL | References non-existent `link.views`, `link.clicks` fields |
| `/api/analytics` | GET | ⚠️ PARTIAL | Uses `prisma.click` correctly BUT raw query uses wrong table name `"clicks"` |
| `/api/og-metadata` | GET | ❌ FAIL | References non-existent `ogTitle`, `ogDescription`, `ogImage`, `ogCacheAt` fields |
| `/api/cron/publish-links` | POST | ❌ FAIL | Syntax errors in code (broken arrow functions) |
| `/api/cron/publish-links` | POST | ❌ FAIL | References non-existent `scheduledAt`, `expiresAt` fields |
| `/api/upload/video` | POST | ❌ FAIL | References non-existent `backgroundVideo` field in User model |
| `/api/upload/avatar` | POST | ✅ PASS | Works if Supabase configured |
| `/api/upload/image` | POST | ✅ PASS | Works if Cloudinary configured |
| `/api/upload/background` | POST | ✅ PASS | Works if Supabase configured |

---

## 2. Database Schema Review

### Current Schema Assessment

```prisma
// ✅ CORRECT - User model
model User {
  id              String   @id @default(cuid())
  email           String   @unique
  username        String   @unique
  password        String
  name            String?
  bio             String?
  avatar          String?
  avatar_url      String?  // Supabase Storage URL
  theme           String   @default("cyberpunk")
  background_type  String   @default("gradient")
  background_value String   @default("cyberpunk")
  custom_css      String?  @db.Text
  layout           String   @default("classic")
  font_family      String   @default("Inter")
  title_color      String   @default("#ffffff")
  button_style     String   @default("rounded")
  button_color     String   @default("#3b82f6")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  links Link[]
  clicks Click[]
}

// ✅ CORRECT - Link model
model Link {
  id        String   @id @default(cuid())
  title     String
  url       String
  icon      String?
  order     Int      @default(0)
  active    Boolean  @default(true)
  embedType String?  @map("embed_type")
  userId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  clicks Click[]
  @@index([userId])
}

// ✅ CORRECT - Click model
model Click {
  id        String   @id @default(cuid())
  linkId    String
  userId    String
  ip        String?
  country   String?
  city      String?
  device    String?
  browser   String?
  os        String?
  referrer  String?
  createdAt DateTime @default(now())
  link Link @relation(fields: [linkId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@index([linkId])
  @@index([userId])
  @@index([createdAt])
}
```

### Missing Fields (Referenced in Code but Not in Schema)

| Field | Model | Referenced In | Impact |
|-------|-------|---------------|--------|
| `backgroundVideo` | User | `/api/upload/video/route.ts` | Video upload fails |
| `scheduledAt` | Link | `/api/cron/publish-links/route.ts` | Scheduled publishing fails |
| `expiresAt` | Link | `/api/cron/publish-links/route.ts` | Link expiration fails |
| `views` | Link | `/api/links/[id]/analytics/route.ts` | CTR calculation fails |
| `clicks` | Link | `/api/links/[id]/analytics/route.ts` | CTR calculation fails |
| `ogTitle` | Link | `/api/og-metadata/route.ts` | OG caching fails |
| `ogDescription` | Link | `/api/og-metadata/route.ts` | OG caching fails |
| `ogImage` | Link | `/api/og-metadata/route.ts` | OG caching fails |
| `ogCacheAt` | Link | `/api/og-metadata/route.ts` | OG caching fails |

### Schema Improvements Recommended

1. **Add missing fields for complete functionality:**
   - Link scheduling and expiration
   - OG metadata caching
   - Video background support
   - Click counters for performance

2. **Consider adding:**
   - `User.isVerified` for email verification
   - `User.role` for admin capabilities
   - `Link.clickCount` for faster analytics (denormalized)
   - `Link.lastClickedAt` for recency

---

## 3. Security Issues Found

### ⚠️ MEDIUM SEVERITY

| Issue | Location | Risk | Fix |
|-------|----------|------|-----|
| JWT_SECRET fallback allows weak secret | `/src/lib/jwt.ts:4` | Weak tokens in dev | Require env var, no fallback |
| No rate limiting on any endpoint | All API routes | DoS/Brute force risk | Add rate limiting |
| No CORS configuration | Missing | CSRF/XSS risk | Add CORS headers |
| Cookie sameSite is 'lax' | Auth routes | CSRF potential | Consider 'strict' for production |
| No input sanitization for URLs | Link creation | XSS via malicious URLs | Sanitize URLs before storage |
| Raw SQL queries without validation | Analytics routes | SQL injection risk | Use parameterized queries |

### ✅ GOOD SECURITY PRACTICES FOUND

- ✅ bcrypt with salt rounds 10 for passwords
- ✅ httpOnly cookies for JWT
- ✅ secure flag on cookies in production
- ✅ Zod validation on inputs
- ✅ User ownership verification on all mutations
- ✅ No sensitive data in JWT payload

### 🔒 RECOMMENDED SECURITY ENHANCEMENTS

1. **Add rate limiting middleware:**
```typescript
// Add to middleware.ts or create rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit'
```

2. **Add CORS configuration:**
```typescript
// next.config.js
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Credentials', value: 'true' },
        { key: 'Access-Control-Allow-Origin', value: process.env.NEXTAUTH_URL },
        { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PATCH,DELETE,OPTIONS' },
      ],
    },
  ]
}
```

3. **URL sanitization:**
```typescript
// Add to link creation
import { sanitizeUrl } from '@braintree/sanitize-url'
const cleanUrl = sanitizeUrl(url)
```

---

## 4. Performance Analysis

### Current State

| Aspect | Status | Notes |
|--------|--------|-------|
| Database connection | ✅ Good | Prisma connection pooling |
| Query optimization | ⚠️ Fair | Some N+1 queries possible |
| Caching | ⚠️ Partial | In-memory OG cache only |
| Response compression | ❌ Missing | No gzip/brotli configured |
| Image optimization | ❌ Disabled | `unoptimized: true` in config |

### Performance Issues

1. **Analytics endpoint makes multiple queries:**
   - Could be optimized with a single aggregated query
   - Raw SQL queries lack proper typing

2. **No database indexes on frequently queried fields:**
   - Missing: `User.email` (unique already indexed)
   - Missing: `User.username` (unique already indexed)
   - Good: `Link.userId`, `Click.linkId/userId/createdAt` indexed

3. **No Redis/caching layer for:**
   - User sessions
   - Profile pages (high traffic)
   - Analytics data

### Recommendations

```prisma
// Add these indexes for better performance
@@index([email])
@@index([username])
@@index([createdAt])
```

```typescript
// Add response caching for public profiles
export const revalidate = 60 // Cache for 60 seconds
```

---

## 5. Environment Variables Audit

### Required Variables (Current)

| Variable | Status | Used In |
|----------|--------|---------|
| `DATABASE_URL` | ✅ Required | Prisma |
| `POSTGRES_URL` | ✅ Required | Prisma directUrl |
| `JWT_SECRET` | ✅ Required | JWT signing |
| `NEXTAUTH_URL` | ✅ Required | App URL |

### Optional Variables (Missing Documentation)

| Variable | Status | Used In |
|----------|--------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | ⚠️ Optional | Avatar/background upload |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ⚠️ Optional | Avatar/background upload |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | ⚠️ Optional | Image upload |
| `CLOUDINARY_API_KEY` | ⚠️ Optional | Image upload |
| `CLOUDINARY_API_SECRET` | ⚠️ Optional | Image upload |
| `CRON_SECRET` | ⚠️ Optional | Cron job auth |
| `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` | ⚠️ Optional | Background images |
| `NEXT_PUBLIC_APP_URL` | ❌ Missing | QR code generation |

### Environment Issues

1. **Default JWT_SECRET is insecure:**
   ```env
   # Current (INSECURE)
   JWT_SECRET="your-super-secret-key-change-this-in-production"
   
   # Should require explicit setting, no default
   ```

2. **Missing CRON_SECRET causes auth bypass:**
   ```typescript
   // In /api/cron/publish-links/route.ts
   if (cronSecret && authHeader !== `Bearer ${cronSecret}`)
   // If CRON_SECRET is not set, ANY request passes!
   ```

---

## 6. Critical Fixes Required

### Fix 1: Schema-Code Mismatch (CRITICAL)

The analytics and cron routes reference non-existent models/fields.

**Option A: Fix the code to match schema**
**Option B: Update schema to support features**

Recommended: Option B for full functionality

```prisma
// Add to schema.prisma

model Link {
  // ... existing fields ...
  
  // For scheduled publishing
  scheduledAt DateTime?
  expiresAt   DateTime?
  
  // For OG metadata caching
  ogTitle       String?
  ogDescription String?
  ogImage       String?
  ogCacheAt     DateTime?
  
  // Denormalized counters for performance
  clickCount    Int      @default(0)
  viewCount     Int      @default(0)
}

model User {
  // ... existing fields ...
  
  // For video background feature
  backgroundVideo String? @db.Text
}
```

### Fix 2: Cron Route Syntax Errors (CRITICAL)

File: `/src/app/api/cron/publish-links/route.ts`

Current broken code:
```typescript
const publishPromises = linksToPublish.map(link =>

    prisma.link.update({  // <- BROKEN: arrow function split incorrectly
```

Fixed code:
```typescript
const publishPromises = linksToPublish.map(link =>
  prisma.link.update({
    where: { id: link.id },
    data: { active: true },
  })
)
```

### Fix 3: Analytics Route Table Name (HIGH)

File: `/src/app/api/analytics/route.ts`

Current (wrong):
```typescript
const rawTimeline = await prisma.$queryRaw`
  SELECT DATE_TRUNC('day', "createdAt") as date, COUNT(*) as count
  FROM "clicks"  // <- WRONG: should be "Click" (PascalCase in Prisma)
```

Fixed:
```typescript
const rawTimeline = await prisma.$queryRaw`
  SELECT DATE_TRUNC('day', "createdAt") as date, COUNT(*) as count
  FROM "Click"
```

Or better, use Prisma's query builder instead of raw SQL.

### Fix 4: Analytics Route Model Reference (CRITICAL)

File: `/src/app/api/links/[id]/analytics/route.ts`

Current (wrong):
```typescript
const totalClickEvents = await prisma.clickEvent.count({  // <- clickEvent doesn't exist
```

Fixed:
```typescript
const totalClickEvents = await prisma.click.count({
```

Also remove references to `link.views` and `link.clicks` or add those fields to schema.

---

## 7. Summary of Fixes Implemented

### Schema Updates Required

```prisma
// ADD THESE FIELDS TO COMPLETE FUNCTIONALITY

model User {
  // Add:
  backgroundVideo String? @db.Text
}

model Link {
  // Add:
  scheduledAt     DateTime?
  expiresAt       DateTime?
  ogTitle         String?
  ogDescription   String?
  ogImage         String?
  ogCacheAt       DateTime?
  clickCount      Int      @default(0)
  viewCount       Int      @default(0)
}
```

### Code Fixes Required

1. `/src/app/api/cron/publish-links/route.ts` - Fix syntax errors
2. `/src/app/api/links/[id]/analytics/route.ts` - Fix `clickEvent` → `click`, remove `link.views/clicks` refs
3. `/src/app/api/analytics/route.ts` - Fix `"clicks"` → `"Click"` table name
4. `/src/app/api/og-metadata/route.ts` - Add schema fields or handle missing gracefully
5. `/src/app/api/upload/video/route.ts` - Add schema field or disable endpoint

### Environment Fixes

```env
# .env.example - Add missing vars
NEXT_PUBLIC_APP_URL="http://localhost:3000"
CRON_SECRET="generate-random-secret-for-cron-jobs"
```

### Security Enhancements

1. Add rate limiting
2. Configure CORS
3. Remove JWT_SECRET fallback
4. Require CRON_SECRET for cron jobs

---

## 8. Deployment Readiness Checklist

- [x] Database schema defined
- [x] Prisma client generated
- [x] Basic auth working
- [x] CRUD operations functional
- [ ] Schema-code mismatches fixed
- [ ] Cron route syntax errors fixed
- [ ] Analytics route fixed
- [ ] Rate limiting added
- [ ] CORS configured
- [ ] Environment variables documented
- [ ] Production JWT_SECRET set
- [ ] CRON_SECRET set

---

## Final Recommendation

**DO NOT DEPLOY TO PRODUCTION** until:
1. Schema is updated with missing fields OR code is fixed to match schema
2. Cron route syntax errors are fixed
3. CRON_SECRET environment variable is required (not optional)
4. Rate limiting is implemented

After fixes: **Grade B+** - Solid foundation with room for performance optimization.
