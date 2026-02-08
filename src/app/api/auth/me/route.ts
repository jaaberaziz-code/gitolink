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
        layout: true,
        font_family: true,
        title_color: true,
        button_style: true,
        button_color: true,
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
      custom_css,
      // Design customization fields
      layout,
      font_family,
      title_color,
      button_style,
      button_color,
    } = body

    // Validation constants
    const validThemes = ['cyberpunk', 'matrix', 'sunset', 'tropical', 'desert', 'corporate', 'minimal', 'executive', 'aurora', 'cotton-candy', 'retro', 'forest', 'ocean', 'lavender', 'gold', 'rose-gold', 'midnight', 'glass', 'rainbow']
    const validLayouts = ['classic', 'hero', 'minimal']
    const validButtonStyles = ['rounded', 'pill', 'square', 'glass']
    const validBackgroundTypes = ['gradient', 'solid', 'image']
    
    // Validate inputs
    if (theme !== undefined && !validThemes.includes(theme)) {
      return NextResponse.json({ error: 'Invalid theme' }, { status: 400 })
    }
    if (layout !== undefined && !validLayouts.includes(layout)) {
      return NextResponse.json({ error: 'Invalid layout' }, { status: 400 })
    }
    if (button_style !== undefined && !validButtonStyles.includes(button_style)) {
      return NextResponse.json({ error: 'Invalid button style' }, { status: 400 })
    }
    if (background_type !== undefined && !validBackgroundTypes.includes(background_type)) {
      return NextResponse.json({ error: 'Invalid background type' }, { status: 400 })
    }
    // Validate hex colors
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/
    if (title_color !== undefined && !hexColorRegex.test(title_color)) {
      return NextResponse.json({ error: 'Invalid title color (must be hex #RRGGBB)' }, { status: 400 })
    }
    if (button_color !== undefined && !hexColorRegex.test(button_color)) {
      return NextResponse.json({ error: 'Invalid button color (must be hex #RRGGBB)' }, { status: 400 })
    }

    const updateData: any = {}

    if (name !== undefined) updateData.name = name
    if (bio !== undefined) updateData.bio = bio
    if (theme !== undefined) updateData.theme = theme
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url
    if (background_type !== undefined) updateData.background_type = background_type
    if (background_value !== undefined) updateData.background_value = background_value
    if (custom_css !== undefined) updateData.custom_css = custom_css
    
    // Design customization
    if (layout !== undefined) updateData.layout = layout
    if (font_family !== undefined) updateData.font_family = font_family
    if (title_color !== undefined) updateData.title_color = title_color
    if (button_style !== undefined) updateData.button_style = button_style
    if (button_color !== undefined) updateData.button_color = button_color

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
        layout: true,
        font_family: true,
        title_color: true,
        button_style: true,
        button_color: true,
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
