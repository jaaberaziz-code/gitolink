import { SignJWT, jwtVerify } from 'jose'

function getJWTSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error(
      'JWT_SECRET environment variable is not set. ' +
      'Please set a strong random secret (at least 32 characters) in your .env file.'
    )
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
