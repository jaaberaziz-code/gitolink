# Vercel Deployment Guide for GitoLink

## Prerequisites
1. Vercel account
2. Vercel Postgres database added to your project

## Deployment Steps

### 1. Environment Variables

Vercel automatically sets these when you add Postgres:
- `DATABASE_URL` - Pooled connection (for app queries)
- `POSTGRES_URL` - Direct connection (for migrations)
- `POSTGRES_PRISMA_URL` - Prisma-optimized connection

You need to manually set:
- `JWT_SECRET` - Generate a strong random string (run: `openssl rand -base64 32`)
- `NEXTAUTH_URL` - Your production URL (e.g., `https://your-app.vercel.app`)

### 2. Deploy to Vercel

#### Option A: Git Integration (Recommended)
1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy

The build will automatically:
- Run `prisma db push` to sync database schema
- Build the Next.js application

#### Option B: Vercel CLI
```bash
vercel --prod
```

### 3. First Deploy Database Setup

If the database tables don't exist on first deploy:

1. Go to Vercel Dashboard → Your Project → Storage → Postgres
2. Click "Connect" and ensure the database is linked
3. Redeploy the project

Or run manually from local:
```bash
# Set environment variables for direct connection
export POSTGRES_URL="your-vercel-postgres-direct-url"
npx prisma db push
```

### 4. Troubleshooting

**Error: Database tables not found**
- Make sure `POSTGRES_URL` is set (Vercel sets this automatically)
- Check that the build command is using `vercel-build` script
- Redeploy after ensuring database is connected

**Error: Connection pool timeout**
- The schema uses `directUrl = env("POSTGRES_URL")` for migrations
- Application queries use the pooled `DATABASE_URL`
- This configuration is already in place in `prisma/schema.prisma`

**Error: JWT errors**
- Ensure `JWT_SECRET` is set in environment variables
- Generate a secure secret: `openssl rand -base64 32`

## Local Development

```bash
# Copy environment file
cp .env.example .env

# Edit .env with your local database credentials
# DATABASE_URL="postgresql://user:password@localhost:5432/gitolink"
# POSTGRES_URL="postgresql://user:password@localhost:5432/gitolink"

# Install dependencies
npm install

# Setup database
npm run db:push

# Run development server
npm run dev
```

## Build Commands

- `npm run build` - Local build (no db push)
- `npm run vercel-build` - Vercel build (includes db push)
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio
