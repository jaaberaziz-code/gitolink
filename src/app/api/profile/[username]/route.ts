import { NextRequest, NextResponse } from 'next/server'
import UAParser from 'ua-parser-js'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { username: params.username },
      select: {
        id: true,
        username: true,
        name: true,
        bio: true,
        avatar: true,
        theme: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const links = await prisma.link.findMany({
      where: {
        userId: user.id,
        active: true,
      },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        url: true,
        icon: true,
      },
    })

    return NextResponse.json({
      user: {
        username: user.username,
        name: user.name,
        bio: user.bio,
        avatar: user.avatar,
        theme: user.theme,
      },
      links,
    })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { linkId } = await req.json()

    const user = await prisma.user.findUnique({
      where: { username: params.username },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const link = await prisma.link.findFirst({
      where: {
        id: linkId,
        userId: user.id,
        active: true,
      },
    })

    if (!link) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      )
    }

    // Parse user agent
    const userAgent = req.headers.get('user-agent') || ''
    const parser = new UAParser(userAgent)
    const device = parser.getDevice().type || 'desktop'
    const browser = parser.getBrowser().name || 'Unknown'
    const os = parser.getOS().name || 'Unknown'

    // Get IP and location info
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 
               req.headers.get('x-real-ip') || 
               'unknown'
    
    const referrer = req.headers.get('referer') || null

    // Create click record
    await prisma.click.create({
      data: {
        linkId,
        userId: user.id,
        ip,
        device,
        browser,
        os,
        referrer,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Track click error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
