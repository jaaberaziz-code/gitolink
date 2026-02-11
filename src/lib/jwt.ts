import { SignJWT, jwtVerify } from 'jose'

function getJWTSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET
  
  // Fallback for production builds - NOT recommended for real production
  // In production, always set JWT_SECRET environment variable
  if (!secret) {
    const fallbackSecret = 'gitolink-fallback-secret-change-in-production-32chars'
    console.warn('⚠️  WARNING: Using fallback JWT_SECRET. Set JWT_SECRET env var for security!')
    return new TextEncoder().encode(fallbackSecret)
  }
  
  return new TextEncoder().encode(secret)
}

export interface JWTPayload {
  userId: string
  email: string
  username: string
}

export async function signJWT(payload: JWTPayload): Promise<string> {
  const JWT_SECRET = getJWTSecret()
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const JWT_SECRET = getJWTSecret()
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as JWTPayload
  } catch {
    return null
  }
}
