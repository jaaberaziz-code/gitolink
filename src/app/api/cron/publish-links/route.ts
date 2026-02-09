import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// This endpoint should be called by a cron job to publish scheduled links
export async function POST(req: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = req.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const now = new Date()

    // Find links that need to be published (scheduled time has passed and not yet active)
    const linksToPublish = await prisma.link.findMany({
      where: {
        scheduledAt: {
          lte: now,
        },
        active: false,
      },
    })

    // Find links that need to be expired
    const linksToExpire = await prisma.link.findMany({
      where: {
        expiresAt: {
          lte: now,
        },
        active: true,
      },
    })

    // Publish scheduled links
    const publishPromises = linksToPublish.map(link =

    prisma.link.update({
      where: { id: link.id },
      data: { active: true },
    }))

    // Expire expired links
    const expirePromises = linksToExpire.map(link =

    prisma.link.update({
      where: { id: link.id },
      data: { active: false },
    }))

    await Promise.all([...publishPromises, ...expirePromises])

    return NextResponse.json({
      success: true,
      published: linksToPublish.length,
      expired: linksToExpire.length,
      publishedIds: linksToPublish.map(l =

 l.id),
      expiredIds: linksToExpire.map(l =

 l.id),
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}

// Also support GET for simple cron job health checks
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
}
