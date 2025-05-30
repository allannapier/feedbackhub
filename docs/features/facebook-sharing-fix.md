# Facebook Sharing Fix

## Issue
Facebook is not showing the testimonial image when sharing - only showing a plain link preview.

## Root Cause
The Open Graph image URL needs to be an absolute URL, and the `NEXT_PUBLIC_APP_URL` environment variable needs to be properly set in Vercel.

## Solution

### 1. Set Environment Variable in Vercel
Add this environment variable in your Vercel project settings:
```
NEXT_PUBLIC_APP_URL=https://feedbackhub-git-main-hobby-projects-8e6b5aff.vercel.app
```

### 2. Implementation Updates Made:

1. **Added dedicated OG image route** (`/testimonial/[id]/og-image.tsx`)
   - Generates images using Next.js Image Response
   - More reliable than the API route approach

2. **Updated testimonial page metadata**
   - Uses relative URL for OG image
   - Simplified meta tags structure

3. **Enhanced Facebook sharing**
   - Ensures absolute URLs
   - Better user feedback with clipboard copy
   - Opens in popup window

### 3. Testing Facebook Sharing

1. **Clear Facebook's cache**:
   - Go to: https://developers.facebook.com/tools/debug/
   - Enter your testimonial URL
   - Click "Scrape Again" to refresh Facebook's cache

2. **Test the share**:
   - Generate a testimonial card
   - Click Facebook share
   - The image should now appear properly

### 4. Additional Debugging

If images still don't appear:

1. **Check the OG image directly**:
   ```
   https://your-domain.vercel.app/testimonial/test-id/og-image?feedback=Great%20service&rating=5&name=John%20Doe
   ```

2. **Verify environment variables**:
   - Check Vercel dashboard → Settings → Environment Variables
   - Ensure NEXT_PUBLIC_APP_URL is set correctly

3. **Check browser console**:
   - Look for any CORS or loading errors
   - Verify the testimonial page URL is correct

### 5. Alternative Solutions

If Facebook continues to have issues:

1. **Use static images**: Pre-generate testimonial images and host them
2. **Use a CDN**: Upload generated images to Cloudinary or similar
3. **Facebook SDK**: Implement Facebook's JS SDK for better control

The current implementation should work once the environment variable is set correctly in Vercel.
