import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWT } from '@/lib/jwt'

async function getUser(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  if (!token) return null
  return await verifyJWT(token)
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser(req)
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get('days') || '30')
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get link details
    const link = await prisma.link.findFirst({
      where: { id: params.id, userId: user.userId },
    })

    if (!link) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      )
    }

    // Get total click events for this link
    const totalClickEvents = await prisma.click.count({
      where: {
        linkId: params.id,
        createdAt: { gte: startDate },
      },
    })

    // Get timeline data
    const rawTimeline = await prisma.$queryRaw`
      SELECT DATE_TRUNC('day', "createdAt") as date, COUNT(*) as count
      FROM "Click"
      WHERE "linkId" = ${params.id}
        AND "createdAt" >= ${startDate}
      GROUP BY DATE_TRUNC('day', "createdAt")
      ORDER BY date ASC
    ` as { date: Date; count: bigint }[]

    const timelineData = rawTimeline.map(item => ({
      date: item.date.toISOString().split('T')[0],
      count: Number(item.count),
    }))

    // Get device stats
    const deviceStats = await prisma.click.groupBy({
      by: ['device'],
      where: {
        linkId: params.id,
        createdAt: { gte: startDate },
      },
      _count: {
        device: true,
      },
    })

    // Get browser stats
    const browserStats = await prisma.click.groupBy({
      by: ['browser'],
      where: {
        linkId: params.id,
        createdAt: { gte: startDate },
      },
      _count: {
        browser: true,
      },
    })

    // Get referrer stats
    const referrerStats = await prisma.click.groupBy({
      by: ['referrer'],
      where: {
        linkId: params.id,
        createdAt: { gte: startDate },
      },
      _count: {
        referrer: true,
      },
    })

    // Get hourly distribution (for heatmap)
    const hourlyDistribution = await prisma.$queryRaw`
      SELECT EXTRACT(HOUR FROM "createdAt") as hour, COUNT(*) as count
      FROM "Click"
      WHERE "linkId" = ${params.id}
        AND "createdAt" >= ${startDate}
      GROUP BY EXTRACT(HOUR FROM "createdAt")
      ORDER BY hour ASC
    ` as { hour: number; count: bigint }[]

    // Calculate CTR using denormalized counters
    const ctr = link.viewCount > 0 ? (link.clickCount / link.viewCount) * 100 : 0

    return NextResponse.json({
      link: {
        id: link.id,
        title: link.title,
        url: link.url,
        views: link.viewCount,
        clicks: link.clickCount,
        ctr: Math.round(ctr * 100) / 100,
      },
      totalClickEvents,
      timelineData,
      deviceStats: deviceStats.map(stat => ({
        device: stat.device || 'Unknown',
        count: stat._count.device,
      })),
      browserStats: browserStats.map(stat => ({
        browser: stat.browser || 'Unknown',
        count: stat._count.browser,
      })),
      referrerStats: referrerStats.map(stat => ({
        referrer: stat.referrer || 'Direct',
        count: stat._count.referrer,
      })),
      hourlyDistribution: hourlyDistribution.map(item => ({
        hour: Number(item.hour),
        count: Number(item.count),
      })),
    })
  } catch (error) {
    console.error('Get link analytics error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
