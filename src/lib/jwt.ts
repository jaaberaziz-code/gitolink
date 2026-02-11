import { SignJWT, jwtVerify } from 'jose'

// Ensure JWT_SECRET is set
const secret = process.env.JWT_SECRET
if (!secret) {
  throw new Error(
    'JWT_SECRET environment variable is not set. ' +
    'Please set a strong random secret (at least 32 characters) in your .env file.'
  )
}

const JWT_SECRET = new TextEncoder().encode(secret)

export interface JWTPayload {
  userId: string
  email: string
  username: string
}

export async function signJWT(payload: JWTPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as JWTPayload
  } catch {
    return null
  }
}
