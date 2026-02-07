-- This is your Prisma migration file for PostgreSQL
-- Run this manually in Vercel Postgres dashboard or using Vercel CLI

-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" TEXT UNIQUE NOT NULL,
    "username" TEXT UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "bio" TEXT,
    "avatar" TEXT,
    "theme" TEXT NOT NULL DEFAULT 'gradient-1',
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Link table
CREATE TABLE IF NOT EXISTS "Link" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Click table
CREATE TABLE IF NOT EXISTS "Click" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "linkId" TEXT NOT NULL REFERENCES "Link"("id") ON DELETE CASCADE,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "ip" TEXT,
    "country" TEXT,
    "city" TEXT,
    "device" TEXT,
    "browser" TEXT,
    "os" TEXT,
    "referrer" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "Link_userId_idx" ON "Link"("userId");
CREATE INDEX IF NOT EXISTS "Click_linkId_idx" ON "Click"("linkId");
CREATE INDEX IF NOT EXISTS "Click_userId_idx" ON "Click"("userId");
CREATE INDEX IF NOT EXISTS "Click_createdAt_idx" ON "Click"("createdAt");

-- Enable Row Level Security (optional, for security)
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Link" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Click" ENABLE ROW LEVEL SECURITY;