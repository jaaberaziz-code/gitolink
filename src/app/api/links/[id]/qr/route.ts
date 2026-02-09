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
    const format = searchParams.get('format') || 'svg'
    const size = parseInt(searchParams.get('size') || '256')

    const link = await prisma.link.findFirst({
      where: { id: params.id, userId: user.userId },
      include: {
        user: {
          select: { username: true },
        },
      },
    })

    if (!link) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      )
    }

    // Build the public URL for this link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
    const linkUrl = `${baseUrl}/${link.user.username}`

    return NextResponse.json({
      link: {
        id: link.id,
        title: link.title,
        url: link.url,
        publicUrl: linkUrl,
      },
      qrOptions: {
        format,
        size,
        value: linkUrl,
      },
    })
  } catch (error) {
    console.error('Get QR code error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
