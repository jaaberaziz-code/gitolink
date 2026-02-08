import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { cookies } from 'next/headers'
import { verifyJWT } from '@/lib/jwt'

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = cookies().get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyJWT(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()
    const {
      url,
      size = 300,
      fgColor = '#000000',
      bgColor = '#ffffff',
      format = 'png',
      margin = 4,
      errorCorrectionLevel = 'M',
    } = body

    // Validate URL
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Validate size (max 1000 to prevent abuse)
    const validatedSize = Math.min(Math.max(parseInt(size) || 300, 100), 1000)

    // Validate error correction level
    const validLevels = ['L', 'M', 'Q', 'H'] as const
    const level = validLevels.includes(errorCorrectionLevel) ? errorCorrectionLevel : 'M'

    const qrOptions: QRCode.QRCodeToDataURLOptions = {
      width: validatedSize,
      margin: parseInt(margin) || 4,
      color: {
        dark: fgColor,
        light: bgColor,
      },
      errorCorrectionLevel: level,
    }

    if (format === 'svg') {
      // Generate SVG
      const svgString = await QRCode.toString(url, {
        type: 'svg',
        width: validatedSize,
        margin: parseInt(margin) || 4,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: level,
      })

      return NextResponse.json({
        success: true,
        format: 'svg',
        svg: svgString,
        url,
      })
    } else {
      // Generate PNG as data URL
      const dataUrl = await QRCode.toDataURL(url, qrOptions)

      return NextResponse.json({
        success: true,
        format: 'png',
        dataUrl,
        url,
      })
    }
  } catch (error) {
    console.error('QR generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    )
  }
}

// Also support GET for simple QR generation (authenticated)
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const token = cookies().get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = await verifyJWT(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const size = parseInt(searchParams.get('size') || '300')
    const fgColor = searchParams.get('fgColor') || '#000000'
    const bgColor = searchParams.get('bgColor') || '#ffffff'
    const format = searchParams.get('format') || 'png'
    const margin = parseInt(searchParams.get('margin') || '4')
    const errorCorrectionLevel = (searchParams.get('errorCorrectionLevel') || 'M') as 'L' | 'M' | 'Q' | 'H'

    // Validate size
    const validatedSize = Math.min(Math.max(size, 100), 1000)

    // Validate error correction level
    const validLevels = ['L', 'M', 'Q', 'H'] as const
    const level = validLevels.includes(errorCorrectionLevel) ? errorCorrectionLevel : 'M'

    if (format === 'svg') {
      const svgString = await QRCode.toString(url, {
        type: 'svg',
        width: validatedSize,
        margin,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: level,
      })

      return NextResponse.json({
        success: true,
        format: 'svg',
        svg: svgString,
        url,
      })
    } else {
      const dataUrl = await QRCode.toDataURL(url, {
        width: validatedSize,
        margin,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: level,
      })

      return NextResponse.json({
        success: true,
        format: 'png',
        dataUrl,
        url,
      })
    }
  } catch (error) {
    console.error('QR generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    )
  }
}
