import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const payload = await verifyJWT(token)

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        bio: true,
        avatar: true,
        avatar_url: true,
        theme: true,
        background_type: true,
        background_value: true,
        custom_css: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Me error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('token')
  return response
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const payload = await verifyJWT(token)

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { 
      name, 
      bio, 
      theme, 
      avatar_url,
      background_type,
      background_value,
      custom_css 
    } = body

    const updateData: any = {}

    if (name !== undefined) updateData.name = name
    if (bio !== undefined) updateData.bio = bio
    if (theme !== undefined) updateData.theme = theme
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url
    if (background_type !== undefined) updateData.background_type = background_type
    if (background_value !== undefined) updateData.background_value = background_value
    if (custom_css !== undefined) updateData.custom_css = custom_css

    const user = await prisma.user.update({
      where: { id: payload.userId },
      data: updateData,
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        bio: true,
        avatar: true,
        avatar_url: true,
        theme: true,
        background_type: true,
        background_value: true,
        custom_css: true,
      },
    })

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}