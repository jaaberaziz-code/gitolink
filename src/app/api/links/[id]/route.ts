import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyJWT } from '@/lib/jwt'

const linkSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  url: z.string().url().optional(),
  icon: z.string().optional().nullable(),
  active: z.boolean().optional(),
  embedType: z.enum(['youtube', 'instagram', 'tiktok']).optional().nullable(),
})

const reorderSchema = z.object({
  linkIds: z.array(z.string()),
})

async function getUser(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  if (!token) return null
  return await verifyJWT(token)
}

export async function PATCH(
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

    const body = await req.json()

    // Handle reorder
    if (body.linkIds) {
      const { linkIds } = reorderSchema.parse(body)
      
      await prisma.$transaction(
        linkIds.map((id, index) =>
          prisma.link.updateMany({
            where: { id, userId: user.userId },
            data: { order: index },
          })
        )
      )

      return NextResponse.json({ success: true })
    }

    // Handle update
    const { title, url, icon, active, embedType } = linkSchema.parse(body)

    const link = await prisma.link.updateMany({
      where: { id: params.id, userId: user.userId },
      data: {
        ...(title && { title }),
        ...(url && { url }),
        ...(icon !== undefined && { icon }),
        ...(active !== undefined && { active }),
        ...(embedType !== undefined && { embedType }),
      },
    })

    if (link.count === 0) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      )
    }

    const updatedLink = await prisma.link.findUnique({
      where: { id: params.id },
    })

    return NextResponse.json({ link: updatedLink })
  } catch (error) {
    console.error('Update link error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}

export async function DELETE(
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

    await prisma.link.deleteMany({
      where: { id: params.id, userId: user.userId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete link error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
