import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWT } from '@/lib/jwt'

async function getUser(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  if (!token) return null
  return await verifyJWT(token)
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

    const formData = await req.formData()
    const file = formData.get('video') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only MP4, WebM, and MOV are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // Convert file to base64 for storage
    // In production, you'd upload to S3/Cloudinary instead
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`

    // Update user's background video
    await prisma.user.update({
      where: { id: user.userId },
      data: { backgroundVideo: dataUrl }
    })

    return NextResponse.json({ 
      success: true, 
      videoUrl: dataUrl,
      message: 'Video uploaded successfully'
    })
  } catch (error) {
    console.error('Video upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload video' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getUser(req)
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Remove background video
    await prisma.user.update({
      where: { id: user.userId },
      data: { backgroundVideo: null }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Video removed successfully'
    })
  } catch (error) {
    console.error('Video delete error:', error)
    return NextResponse.json(
      { error: 'Failed to remove video' },
      { status: 500 }
    )
  }
}
