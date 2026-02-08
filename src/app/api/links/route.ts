import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyJWT } from '@/lib/jwt'

const linkSchema = z.object({
  title: z.string().min(1).max(100),
  url: z.string().url(),
  icon: z.string().optional(),
  embedType: z.enum(['youtube', 'instagram', 'tiktok']).optional().nullable(),
})

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

    const links = await prisma.link.findMany({
      where: { userId: user.userId },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { clicks: true },
        },
      },
    })

    return NextResponse.json({ links })
  } catch (error) {
    console.error('Get links error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUser(req)
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { title, url, icon, embedType } = linkSchema.parse(body)

    // Get max order
    const maxOrder = await prisma.link.findFirst({
      where: { userId: user.userId },
      orderBy: { order: 'desc' },
      select: { order: true },
    })

    const link = await prisma.link.create({
      data: {
        title,
        url,
        icon,
        embedType,
        userId: user.userId,
        order: (maxOrder?.order ?? -1) + 1,
      },
    })

    return NextResponse.json({ link })
  } catch (error) {
    console.error('Create link error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
