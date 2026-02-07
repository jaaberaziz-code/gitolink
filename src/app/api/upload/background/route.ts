import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'
import { uploadBackground, deleteFile, STORAGE_BUCKETS, getFilePathFromUrl } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
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

    // Parse form data
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Get current user to check for existing background
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { background_value: true, background_type: true }
    })

    // Delete old background if it was an image
    if (user?.background_type === 'image' && user?.background_value) {
      const oldPath = getFilePathFromUrl(user.background_value, STORAGE_BUCKETS.BACKGROUNDS)
      if (oldPath) {
        await deleteFile(STORAGE_BUCKETS.BACKGROUNDS, oldPath)
      }
    }

    // Upload new background
    const { url, error } = await uploadBackground(file, payload.userId)

    if (error) {
      return NextResponse.json(
        { error },
        { status: 400 }
      )
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: payload.userId },
      data: { 
        background_type: 'image',
        background_value: url 
      },
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
      }
    })

    return NextResponse.json({ 
      success: true, 
      url,
      user: updatedUser
    })
  } catch (error) {
    console.error('Background upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload background' },
      { status: 500 }
    )
  }
}

// Update background (for non-image types)
export async function PUT(req: NextRequest) {
  try {
    // Verify authentication
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
    const { type, value } = body

    if (!type || !value) {
      return NextResponse.json(
        { error: 'Type and value are required' },
        { status: 400 }
      )
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { background_type: true, background_value: true }
    })

    // Delete old background if it was an image and switching away from image type
    if (user?.background_type === 'image' && type !== 'image' && user?.background_value) {
      const oldPath = getFilePathFromUrl(user.background_value, STORAGE_BUCKETS.BACKGROUNDS)
      if (oldPath) {
        await deleteFile(STORAGE_BUCKETS.BACKGROUNDS, oldPath)
      }
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: payload.userId },
      data: { 
        background_type: type,
        background_value: value 
      },
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
      }
    })

    return NextResponse.json({ 
      success: true,
      user: updatedUser
    })
  } catch (error) {
    console.error('Background update error:', error)
    return NextResponse.json(
      { error: 'Failed to update background' },
      { status: 500 }
    )
  }
}