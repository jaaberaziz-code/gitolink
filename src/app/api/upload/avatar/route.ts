import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/jwt'
import { prisma } from '@/lib/prisma'
import { uploadAvatar, deleteFile, STORAGE_BUCKETS, getFilePathFromUrl } from '@/lib/supabase'

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

    // Get current user to check for existing avatar
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { avatar_url: true }
    })

    // Delete old avatar if exists
    if (user?.avatar_url) {
      const oldPath = getFilePathFromUrl(user.avatar_url, STORAGE_BUCKETS.AVATARS)
      if (oldPath) {
        await deleteFile(STORAGE_BUCKETS.AVATARS, oldPath)
      }
    }

    // Upload new avatar
    const { url, error } = await uploadAvatar(file, payload.userId)

    if (error) {
      return NextResponse.json(
        { error },
        { status: 400 }
      )
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: payload.userId },
      data: { avatar_url: url },
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
    console.error('Avatar upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload avatar' },
      { status: 500 }
    )
  }
}

// Delete avatar
export async function DELETE(req: NextRequest) {
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

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { avatar_url: true }
    })

    // Delete from storage if exists
    if (user?.avatar_url) {
      const path = getFilePathFromUrl(user.avatar_url, STORAGE_BUCKETS.AVATARS)
      if (path) {
        await deleteFile(STORAGE_BUCKETS.AVATARS, path)
      }
    }

    // Update user to remove avatar
    const updatedUser = await prisma.user.update({
      where: { id: payload.userId },
      data: { avatar_url: null },
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
    console.error('Avatar delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete avatar' },
      { status: 500 }
    )
  }
}