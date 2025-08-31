# OAuth Troubleshooting Guide - 500 Internal Server Error

## Problem Analysis

You're getting a **500 Internal Server Error** when accessing:
- `https://cms.shuru.sa/api/connect/google`
- `https://cms.shuru.sa/api/connect/linkedin`

This indicates a server-side configuration issue in your Strapi instance.

## Step-by-Step Solution

### 1. **Check Strapi Admin Panel Configuration**

Log into your Strapi admin panel at `https://cms.shuru.sa/admin` and navigate to:
**Settings** → **Users & Permissions plugin** → **Providers**

For each provider (Google & LinkedIn), ensure:

#### Google Configuration:
- ✅ **Enabled**: Toggle should be ON
- ✅ **Client ID**: Your Google OAuth 2.0 client ID
- ✅ **Client Secret**: Your Google OAuth 2.0 client secret
- ✅ **Callback URL**: `https://cms.shuru.sa/api/auth/google/callback`

#### LinkedIn Configuration:
- ✅ **Enabled**: Toggle should be ON
- ✅ **Client ID**: Your LinkedIn app client ID
- ✅ **Client Secret**: Your LinkedIn app client secret
- ✅ **Callback URL**: `https://cms.shuru.sa/api/auth/linkedin/callback`

### 2. **Verify OAuth App Settings**

#### Google Developer Console:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project → APIs & Services → Credentials
3. Click on your OAuth 2.0 Client ID
4. In **Authorized redirect URIs**, add:
   ```
   https://cms.shuru.sa/api/auth/google/callback
   ```

#### LinkedIn Developer Portal:
1. Go to [LinkedIn Developer Portal](https://developer.linkedin.com/)
2. Select your app → Auth tab
3. In **Authorized redirect URLs for your app**, add:
   ```
   https://cms.shuru.sa/api/auth/linkedin/callback
   ```

### 3. **Check Strapi Server Logs**

Access your Strapi server logs to see the detailed error:

```bash
# If using PM2
pm2 logs

# If using Docker
docker logs [strapi-container-name]

# If running directly
# Check the terminal where Strapi is running
```

Look for error messages related to OAuth or missing environment variables.

### 4. **Environment Variables Check**

Ensure your Strapi server has these environment variables properly set:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
```

### 5. **Strapi Users & Permissions Plugin**

Ensure the Users & Permissions plugin is properly installed and up to date:

```bash
# In your Strapi project directory
npm ls @strapi/plugin-users-permissions
```

If not installed or outdated:
```bash
npm install @strapi/plugin-users-permissions@latest
```

### 6. **Database Check**

The OAuth providers configuration is stored in your database. Check if the `up_permissions_providers` table exists and has the correct data.

### 7. **Restart Strapi Server**

After making configuration changes, restart your Strapi server:

```bash
# If using PM2
pm2 restart [app-name]

# If using Docker
docker restart [container-name]

# If running directly
# Stop the process and run again
npm run develop
# or
npm run start
```

## Testing Tools

### 1. **OAuth Diagnostic Page**
Visit: `https://www.shuru.sa/auth/oauth-diagnostic`

This page will help you test the OAuth endpoints and identify issues.

### 2. **Manual Testing**

Test the OAuth endpoints directly:

```bash
# Test Google endpoint
curl -I https://cms.shuru.sa/api/connect/google

# Test LinkedIn endpoint
curl -I https://cms.shuru.sa/api/connect/linkedin
```

Expected response should be a redirect (3xx status), not 500.

## Common Error Patterns

### Missing Environment Variables
```
Error: Missing required environment variable GOOGLE_CLIENT_ID
```
**Solution**: Add the missing environment variable and restart Strapi.

### Invalid Callback URL
```
Error: redirect_uri_mismatch
```
**Solution**: Ensure callback URLs match exactly between your OAuth provider and Strapi configuration.

### Plugin Not Loaded
```
Error: Cannot read property 'providers' of undefined
```
**Solution**: Ensure Users & Permissions plugin is properly installed and enabled.

## Quick Fix Checklist

- [ ] OAuth providers are enabled in Strapi admin
- [ ] Client ID and Secret are correctly configured
- [ ] Callback URLs match in both OAuth provider and Strapi
- [ ] Environment variables are set on the server
- [ ] Strapi server has been restarted after configuration changes
- [ ] Users & Permissions plugin is installed and up to date
- [ ] Server logs show no configuration errors

## Next Steps

1. Start with the Strapi admin panel configuration
2. Check server logs for specific error messages
3. Verify OAuth provider settings
4. Use the diagnostic page to test connectivity
5. Contact your server administrator if needed

If you continue to have issues, please share the specific error messages from your Strapi server logs.
