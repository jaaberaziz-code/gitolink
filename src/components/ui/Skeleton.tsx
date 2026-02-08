'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-white/10 rounded-lg',
        className
      )}
    />
  )
}

// Text skeleton with multiple lines
interface TextSkeletonProps extends SkeletonProps {
  lines?: number
  lineHeight?: string
  gap?: string
}

export function TextSkeleton({ 
  className, 
  lines = 3, 
  lineHeight = 'h-4',
  gap = 'gap-2'
}: TextSkeletonProps) {
  return (
    <div className={cn('flex flex-col', gap)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            lineHeight,
            i === lines - 1 && lines > 1 && 'w-3/4',
            className
          )}
        />
      ))}
    </div>
  )
}

// Card skeleton with optional header, content, and footer
interface CardSkeletonProps extends SkeletonProps {
  header?: boolean
  content?: boolean
  footer?: boolean
  avatar?: boolean
}

export function CardSkeleton({ 
  className,
  header = true,
  content = true,
  footer = false,
  avatar = false
}: CardSkeletonProps) {
  return (
    <div className={cn('glass-card rounded-2xl p-6 space-y-4', className)}>
      {header && (
        <div className="flex items-center gap-4">
          {avatar && (
            <Skeleton className="w-12 h-12 rounded-full" />
          )}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      )}
      {content && (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      )}
      {footer && (
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      )}
    </div>
  )
}

// Avatar skeleton in various sizes
interface AvatarSkeletonProps extends SkeletonProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

export function AvatarSkeleton({ className, size = 'md' }: AvatarSkeletonProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32'
  }
  
  return (
    <Skeleton
      className={cn(
        sizeClasses[size],
        'rounded-full',
        className
      )}
    />
  )
}

// Button skeleton
interface ButtonSkeletonProps extends SkeletonProps {
  width?: string
}

export function ButtonSkeleton({ className, width = 'w-32' }: ButtonSkeletonProps) {
  return (
    <Skeleton
      className={cn(
        'h-10 rounded-lg',
        width,
        className
      )}
    />
  )
}

// Stats card skeleton
export function StatsCardSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('glass-card rounded-2xl p-6 space-y-4', className)}>
      <Skeleton className="w-12 h-12 rounded-xl" />
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-4 w-20" />
    </div>
  )
}

// Link item skeleton
export function LinkItemSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn(
      'glass-card rounded-xl p-4 flex items-center gap-4',
      className
    )}>
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  )
}

// Theme grid skeleton
export function ThemeGridSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4', className)}>
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton
          key={i}
          className="aspect-[4/5] rounded-2xl"
        />
      ))}
    </div>
  )
}

// Platform grid skeleton
export function PlatformGridSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3', className)}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-gray-800/50 rounded-xl p-4 space-y-3"
        >
          <Skeleton className="w-12 h-12 rounded-xl mx-auto" />
          <Skeleton className="h-4 w-20 mx-auto" />
        </div>
      ))}
    </div>
  )
}

// Analytics chart skeleton
export function AnalyticsChartSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('glass-card rounded-2xl p-6 space-y-6', className)}>
      <Skeleton className="h-6 w-40" />
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="w-6 h-4" />
            <div className="flex-1">
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
            <Skeleton className="w-10 h-4" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Profile header skeleton
export function ProfileHeaderSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('text-center space-y-4', className)}>
      <AvatarSkeleton size="xl" className="mx-auto" />
      <div className="space-y-2">
        <Skeleton className="h-7 w-48 mx-auto" />
        <Skeleton className="h-4 w-32 mx-auto" />
      </div>
      <Skeleton className="h-4 w-64 mx-auto" />
    </div>
  )
}

// Sidebar skeleton for dashboard
export function SidebarSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('glass-card rounded-2xl p-6 space-y-6', className)}>
      <div className="text-center space-y-4">
        <AvatarSkeleton size="lg" className="mx-auto" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32 mx-auto" />
          <Skeleton className="h-3 w-24 mx-auto" />
        </div>
      </div>
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-xl" />
        ))}
      </div>
    </div>
  )
}

// Full page loading skeleton for dashboard
export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header skeleton */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-32 rounded-lg" />
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar skeleton */}
          <aside>
            <SidebarSkeleton />
          </aside>

          {/* Main content skeleton */}
          <main className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
            
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <LinkItemSkeleton key={i} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

// Full page loading skeleton for public profile
export function ProfilePageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <ProfileHeaderSkeleton className="mb-8" />
        
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

// Analytics tab skeleton
export function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Stats cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>

      {/* Chart skeleton */}
      <AnalyticsChartSkeleton />

      {/* Two column stats */}
      <div className="grid sm:grid-cols-2 gap-6">
        <CardSkeleton content />
        <CardSkeleton content />
      </div>
    </div>
  )
}

// Appearance tab skeleton
export function AppearanceSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>

      <div className="glass-card rounded-2xl p-6 space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

// Onboarding theme selector skeleton
export function OnboardingThemeSkeleton() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Skeleton className="h-10 w-64 mx-auto" />
        <Skeleton className="h-5 w-48 mx-auto" />
      </div>

      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-full" />
        ))}
      </div>

      <ThemeGridSkeleton />
    </div>
  )
}

// Onboarding platform selector skeleton
export function OnboardingPlatformSkeleton() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Skeleton className="h-10 w-64 mx-auto" />
        <Skeleton className="h-5 w-56 mx-auto" />
      </div>

      <Skeleton className="h-12 w-full rounded-xl" />

      <div className="flex flex-wrap justify-center gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-full" />
        ))}
      </div>

      <PlatformGridSkeleton />
    </div>
  )
}

// Onboarding profile setup skeleton
export function OnboardingProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Skeleton className="h-10 w-48 mx-auto" />
        <Skeleton className="h-5 w-64 mx-auto" />
      </div>

      <div className="glass-card rounded-2xl p-8 space-y-6">
        <div className="flex justify-center">
          <AvatarSkeleton size="2xl" />
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}
