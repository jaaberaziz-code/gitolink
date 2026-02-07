import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create client only if credentials are available
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Storage bucket names
export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  BACKGROUNDS: 'backgrounds',
} as const

// Maximum file sizes (in bytes)
export const FILE_LIMITS = {
  AVATAR: 2 * 1024 * 1024, // 2MB
  BACKGROUND: 5 * 1024 * 1024, // 5MB
}

// Allowed file types
export const ALLOWED_TYPES = {
  AVATAR: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  BACKGROUND: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
}

function getSupabaseClient() {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }
  return supabase
}

/**
 * Upload avatar to Supabase Storage
 */
export async function uploadAvatar(
  file: File,
  userId: string
): Promise<{ url: string; error?: string }> {
  try {
    const client = getSupabaseClient()

    // Validate file size
    if (file.size > FILE_LIMITS.AVATAR) {
      return { url: '', error: 'Avatar must be less than 2MB' }
    }

    // Validate file type
    if (!ALLOWED_TYPES.AVATAR.includes(file.type)) {
      return { url: '', error: 'Invalid file type. Use JPG, PNG, WebP, or GIF' }
    }

    // Create unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`

    // Upload to Supabase
    const { data, error } = await client.storage
      .from(STORAGE_BUCKETS.AVATARS)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return { url: '', error: error.message }
    }

    // Get public URL
    const { data: { publicUrl } } = client.storage
      .from(STORAGE_BUCKETS.AVATARS)
      .getPublicUrl(fileName)

    return { url: publicUrl }
  } catch (err: any) {
    console.error('Upload error:', err)
    return { url: '', error: err.message || 'Failed to upload avatar' }
  }
}

/**
 * Upload background image to Supabase Storage
 */
export async function uploadBackground(
  file: File,
  userId: string
): Promise<{ url: string; error?: string }> {
  try {
    const client = getSupabaseClient()

    // Validate file size
    if (file.size > FILE_LIMITS.BACKGROUND) {
      return { url: '', error: 'Background image must be less than 5MB' }
    }

    // Validate file type
    if (!ALLOWED_TYPES.BACKGROUND.includes(file.type)) {
      return { url: '', error: 'Invalid file type. Use JPG, PNG, WebP, or GIF' }
    }

    // Create unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`

    // Upload to Supabase
    const { data, error } = await client.storage
      .from(STORAGE_BUCKETS.BACKGROUNDS)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
      })

    if (error) {
      console.error('Supabase upload error:', error)
      return { url: '', error: error.message }
    }

    // Get public URL
    const { data: { publicUrl } } = client.storage
      .from(STORAGE_BUCKETS.BACKGROUNDS)
      .getPublicUrl(fileName)

    return { url: publicUrl }
  } catch (err: any) {
    console.error('Upload error:', err)
    return { url: '', error: err.message || 'Failed to upload background' }
  }
}

/**
 * Delete file from Supabase Storage
 */
export async function deleteFile(
  bucket: string,
  path: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const client = getSupabaseClient()
    
    const { error } = await client.storage
      .from(bucket)
      .remove([path])

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete file' }
  }
}

/**
 * Extract file path from public URL
 */
export function getFilePathFromUrl(url: string, bucket: string): string | null {
  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/')
    const bucketIndex = pathParts.indexOf(bucket)
    
    if (bucketIndex === -1 || bucketIndex >= pathParts.length - 1) {
      return null
    }
    
    return pathParts.slice(bucketIndex + 1).join('/')
  } catch {
    return null
  }
}