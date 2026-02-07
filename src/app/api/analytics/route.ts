import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWT } from '@/lib/jwt'

async function getUser(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  if (!token) return null
  return await verifyJWT(token)
}

export async function GET(req: NextRequest) {
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

    // Total clicks
    const totalClicks = await prisma.click.count({
      where: {
        userId: user.userId,
        createdAt: { gte: startDate },
      },
    })

    // Clicks per link
    const clicksPerLink = await prisma.link.findMany({
      where: { userId: user.userId },
      select: {
        id: true,
        title: true,
        _count: {
          select: {
            clicks: {
              where: {
                createdAt: { gte: startDate },
              },
            },
          },
        },
      },
    })

    // Device stats
    const deviceStats = await prisma.click.groupBy({
      by: ['device'],
      where: {
        userId: user.userId,
        createdAt: { gte: startDate },
      },
      _count: {
        device: true,
      },
    })

    // Browser stats
    const browserStats = await prisma.click.groupBy({
      by: ['browser'],
      where: {
        userId: user.userId,
        createdAt: { gte: startDate },
      },
      _count: {
        browser: true,
      },
    })

    // Timeline data
    const rawTimeline = await prisma.$queryRaw`
      SELECT DATE_TRUNC('day', "createdAt") as date, COUNT(*) as count
      FROM "clicks"
      WHERE "userId" = ${user.userId}
        AND "createdAt" >= ${startDate}
      GROUP BY DATE_TRUNC('day', "createdAt")
      ORDER BY date ASC
    ` as { date: Date; count: bigint }[]

    const timelineData = rawTimeline.map(item => ({
      date: item.date.toISOString().split('T')[0],
      count: Number(item.count),
    }))

    return NextResponse.json({
      totalClicks,
      clicksPerLink: clicksPerLink.map(link => ({
        linkId: link.id,
        title: link.title,
        count: link._count.clicks,
      })),
      deviceStats: deviceStats.map(stat => ({
        device: stat.device || 'Unknown',
        count: stat._count.device,
      })),
      browserStats: browserStats.map(stat => ({
        browser: stat.browser || 'Unknown',
        count: stat._count.browser,
      })),
      timelineData,
    })
  } catch (error) {
    console.error('Get analytics error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
