# GitoLink Profile Customization

This document describes the profile customization features added to GitoLink.

## Features

### 1. Avatar Upload
- Users can upload a profile picture (JPG, PNG, WebP, GIF - max 2MB)
- Avatars are stored in Supabase Storage
- Old avatars are automatically deleted when a new one is uploaded

### 2. Background Customization
Three background types are supported:
- **Gradient**: Choose from pre-built gradient themes
- **Solid**: Pick a solid color using color picker or presets
- **Image**: Upload a custom background image (max 5MB)

### 3. Theme Grid
- Visual grid of all available themes
- Filter by category (Gaming, Lifestyle, Professional, etc.)
- Grid/List view toggle
- Live preview on hover

### 4. Custom CSS (Advanced)
- Add custom CSS to completely customize profile appearance
- Examples provided for common customizations
- CSS is injected into the public profile page

## Setup Instructions

### 1. Create a Supabase Project
1. Go to https://supabase.com and create a new project
2. Copy your project URL and anon key from Settings > API

### 2. Configure Environment Variables
Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
```

### 3. Set Up Storage Buckets
Run the SQL commands in `supabase/setup.sql` in your Supabase SQL Editor.

This will:
- Create the `avatars` and `backgrounds` buckets
- Set up storage policies for secure file access
- Configure file size limits and allowed mime types

### 4. Run Database Migration

```bash
# Push the schema changes to your database
npx prisma db push

# Or create a migration
npx prisma migrate dev --name add_profile_customization

# Generate Prisma client
npx prisma generate
```

## API Endpoints

### Avatar Upload
- **POST** `/api/upload/avatar` - Upload avatar image
- **DELETE** `/api/upload/avatar` - Delete avatar

### Background Upload
- **POST** `/api/upload/background` - Upload background image
- **PUT** `/api/upload/background` - Update background type/value

### Profile Updates
- **PUT** `/api/auth/me` - Update profile with new fields:
  - `name`, `bio`
  - `avatar_url`
  - `background_type`, `background_value`
  - `custom_css`

## Components

### Dashboard Components

#### ProfileImageUpload
Upload component for avatar images with drag-and-drop support.

```tsx
<ProfileImageUpload
  currentAvatar={user.avatar_url}
  userId={user.id}
  onUpload={(url) => handleAvatarUpload(url)}
  name={user.name || user.username}
/>
```

#### BackgroundCustomizer
Three-tab interface for customizing backgrounds.

```tsx
<BackgroundCustomizer
  currentType={user.background_type}
  currentValue={user.background_value}
  userId={user.id}
  onChange={(type, value) => handleBackgroundChange(type, value)}
/>
```

#### LivePreview
Phone mockup showing live preview of profile changes.

```tsx
<LivePreview
  user={user}
  links={links}
  previewTheme={selectedTheme}
  previewBackground={selectedBackground}
  previewAvatar={selectedAvatar}
/>
```

#### ThemeGrid
Visual grid of all themes with filtering.

```tsx
<ThemeGrid
  currentTheme={user.theme}
  onThemeChange={(themeId) => handleThemeChange(themeId)}
/>
```

#### CustomCSSEditor
Editor for custom CSS with examples and preview.

```tsx
<CustomCSSEditor
  value={customCSS}
  onChange={(css) => setCustomCSS(css)}
/>
```

## Database Schema

New fields added to the `User` model:

```prisma
model User {
  // ... existing fields
  
  avatar_url       String?  // Supabase Storage URL for avatar
  background_type  String   @default("gradient")
  background_value String   @default("cyberpunk")
  custom_css       String?  @db.Text
}
```

## Storage Policies

### Avatars Bucket
- Users can only upload/update/delete files in their own folder (`userId/filename`)
- Files are publicly readable
- Max file size: 2MB
- Allowed types: JPG, PNG, WebP, GIF

### Backgrounds Bucket
- Users can only upload/update/delete files in their own folder (`userId/filename`)
- Files are publicly readable
- Max file size: 5MB
- Allowed types: JPG, PNG, WebP, GIF

## Security Considerations

1. **File Upload Validation**: Both client-side and server-side validation for file types and sizes
2. **Storage Policies**: RLS policies ensure users can only access their own files
3. **Path Isolation**: Each user's files are stored in their own folder
4. **Public URLs**: Only public buckets are used for avatar/background access
5. **Custom CSS**: CSS is sanitized by the browser but users should be careful with custom CSS

## Troubleshooting

### Upload fails
- Check Supabase URL and anon key in environment variables
- Verify storage buckets exist in Supabase dashboard
- Check browser console for CORS errors

### Images not showing
- Verify the bucket is set to public
- Check that storage policies allow public access
- Ensure file was uploaded successfully (check Supabase Storage)

### Database errors
- Run `npx prisma db push` to sync schema
- Check that all new fields exist in the database
- Verify database connection string is correct