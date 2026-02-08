import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UAParser } from 'ua-parser-js'

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
        avatar_url: true,
        theme: true,
        background_type: true,
        background_value: true,
        custom_css: true,
        layout: true,
        font_family: true,
        title_color: true,
        button_style: true,
        button_color: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      )
    }

    const links = await prisma.link.findMany({
      where: { 
        userId: user.id,
        active: true 
      },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        url: true,
        icon: true,
        order: true,
        active: true,
      },
    })

    return NextResponse.json({ user, links })
  } catch (error) {
    console.error('Profile fetch error:', error)
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

    if (!linkId) {
      return NextResponse.json(
        { error: 'Link ID required' },
        { status: 400 }
      )
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { username: params.username },
      select: { id: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get link to verify it belongs to user
    const link = await prisma.link.findFirst({
      where: { 
        id: linkId,
        userId: user.id
      }
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
    const browser = parser.getBrowser().name
    const os = parser.getOS().name

    // Get IP info
    const ip = req.headers.get('x-forwarded-for') || 
               req.headers.get('x-real-ip') || 
               'unknown'
    
    // Track click
    await prisma.click.create({
      data: {
        linkId,
        userId: user.id,
        ip: ip.split(',')[0].trim(),
        device,
        browser,
        os,
        referrer: req.headers.get('referer') || null,
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Click tracking error:', error)
    return NextResponse.json(
      { error: 'Failed to track click' },
      { status: 500 }
    )
  }
}
