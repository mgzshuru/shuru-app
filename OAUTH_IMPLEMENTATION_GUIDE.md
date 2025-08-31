# OAuth Implementation with Google and LinkedIn

This implementation adds OAuth authentication support for Google and LinkedIn using Strapi as the backend authentication provider.

## Files Created/Modified

### New Files Created:

1. **`/components/auth/OAuthButtons.tsx`** - OAuth button components for Google and LinkedIn
2. **`/app/api/auth/oauth/callback/[provider]/route.ts`** - API route handler for OAuth callbacks
3. **`/app/auth/oauth/callback/[provider]/page.tsx`** - Frontend callback page for OAuth redirects

### Modified Files:

1. **`/app/auth/login/page.tsx`** - Added OAuth buttons and error handling
2. **`/app/auth/signup/page.tsx`** - Added OAuth buttons

## Strapi Configuration Required

You mentioned that OAuth providers are already configured in your Strapi admin dashboard under **Users & Permissions plugin -> Providers**. Make sure the following are configured:

### Google OAuth Configuration:
1. Go to Strapi Admin → Settings → Users & Permissions plugin → Providers
2. Enable Google provider
3. Configure:
   - **Client ID**: Your Google OAuth client ID
   - **Client Secret**: Your Google OAuth client secret
   - **Callback URL**: `{STRAPI_URL}/api/auth/google/callback`

### LinkedIn OAuth Configuration:
1. In the same Providers section, enable LinkedIn
2. Configure:
   - **Client ID**: Your LinkedIn OAuth client ID
   - **Client Secret**: Your LinkedIn OAuth client secret
   - **Callback URL**: `{STRAPI_URL}/api/auth/linkedin/callback`

## Environment Variables

Make sure your frontend has the correct Strapi URL configured:

```env
NEXT_PUBLIC_STRAPI_API_URL=your-strapi-url
```

## How It Works

### Authentication Flow:

1. **User clicks OAuth button** → Component redirects to `{STRAPI_URL}/api/connect/{provider}`
2. **Strapi redirects to OAuth provider** → User authenticates with Google/LinkedIn
3. **OAuth provider redirects back to Strapi** → Strapi handles the callback and creates user/session
4. **Strapi redirects to frontend** → Frontend API route (`/api/auth/oauth/callback/[provider]`) receives the authentication data
5. **Frontend creates session** → User is logged in and redirected to profile page

### Key Features:

- **Automatic user creation**: If user doesn't exist, Strapi creates a new user account
- **Session management**: Uses the same session system as regular login
- **Error handling**: Displays authentication errors to users
- **Responsive design**: OAuth buttons match your existing UI design
- **Arabic RTL support**: Buttons text and layout support Arabic

### OAuth Button Usage:

```tsx
import OAuthButtons from "@/components/auth/OAuthButtons";

// Use in login/signup forms
<OAuthButtons redirectTo="/profile" />
```

## Testing

1. Ensure OAuth providers are properly configured in Strapi admin
2. Test Google login flow
3. Test LinkedIn login flow
4. Verify user data is properly synced between OAuth provider and Strapi
5. Check that sessions are created correctly

## Troubleshooting

### Common Issues:

1. **Callback URL mismatch**: Ensure the callback URLs in your OAuth provider settings match exactly with Strapi's expected format
2. **CORS errors**: Make sure your Strapi instance allows requests from your frontend domain
3. **Environment variables**: Verify `NEXT_PUBLIC_STRAPI_API_URL` is correctly set
4. **OAuth provider setup**: Double-check client IDs and secrets in both Strapi and your OAuth provider dashboards

### Debug Information:

The implementation includes console logging for debugging OAuth issues. Check browser console and server logs for detailed error information.
