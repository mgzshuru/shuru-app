# Submit Page Content Management - Strapi 5 Integration

This document describes the complete implementation of dynamic content management for the article submission page using Strapi 5 as the backend CMS.

## Overview

The submit page content is now completely manageable through Strapi 5, allowing content managers to modify all text, validation messages, settings, and guidelines without requiring code changes.

## Architecture

### Backend (Strapi 5)

#### Single Type: `submit-page-content`
- **Collection Name**: `submit_page_contents`
- **API Endpoint**: `/api/submit-page-content`
- **Access**: Public read access

#### Components Created
1. **Guideline Item** (`shared.guideline-item`)
   - `itemText` (String, required, max 500 chars)

2. **Success Step** (`shared.success-step`)
   - `stepText` (String, required, max 300 chars)

#### Schema Fields

##### Page Header Section
- `pageTitle` (String, required, max 100 chars) - Main page title
- `pageSubtitle` (Rich Text) - Subtitle/description under main title
- `headerIcon` (Media, single image) - Icon for the header section

##### Steps Configuration
- `emailStepTitle` (String, required, max 100 chars)
- `emailStepDescription` (Text, max 500 chars)
- `authorStepTitle` (String, required, max 100 chars)
- `authorStepDescription` (Text, max 500 chars)
- `articleStepTitle` (String, required, max 100 chars)
- `articleStepDescription` (Text, max 500 chars)
- `reviewStepTitle` (String, required, max 100 chars)
- `reviewStepDescription` (Text, max 500 chars)

##### Success Page Content
- `successTitle` (String, required, max 200 chars)
- `successMessage` (Rich Text, required)
- `successSteps` (Component, repeatable: success-step)
- `returnButtonText` (String, required, max 50 chars)

##### Guidelines Section
- `guidelinesTitle` (String, required, max 100 chars)
- `contentCriteriaTitle` (String, required, max 100 chars)
- `contentCriteriaItems` (Component, repeatable: guideline-item)
- `reviewProcessTitle` (String, required, max 100 chars)
- `reviewProcessItems` (Component, repeatable: guideline-item)

##### Configuration
- `validationMessages` (JSON) - All form validation error messages
- `systemMessages` (JSON) - System error messages
- `enableEmailCheck` (Boolean, default: true)
- `minWordCount` (Integer, default: 50, range: 1-10000)
- `maxWordCount` (Integer, default: 5000, range: 50-50000)
- `maxFileSize` (Integer, default: 5, range: 1-50)
- `allowedFileTypes` (String, default: "jpg,jpeg,png,webp")
- `termsAndConditionsUrl` (String)
- `privacyPolicyUrl` (String)
- `seo` (Component: shared.seo)

### Frontend (Next.js)

#### API Integration
- **Client Function**: `getSubmitPageCached()` in `lib/strapi-optimized.tsx`
- **API Route**: `/api/submit-page-content`
- **Caching**: 15-minute cache for optimal performance

#### Dynamic Content Usage
1. **Page Headers**: All step titles and descriptions are dynamic
2. **Validation Messages**: All error messages come from Strapi
3. **Form Settings**: Word limits, file size limits, allowed file types
4. **Guidelines**: Publishing guidelines and review process steps
5. **Success Page**: Complete success flow content

#### Key Features
- **Loading States**: Shows loading spinner while fetching content
- **Error Handling**: Graceful fallback to default content if Strapi is unavailable
- **Performance**: Content is cached for 15 minutes to reduce API calls
- **Validation**: Dynamic validation based on Strapi settings

## Setup Instructions

### 1. Strapi Configuration

#### Install the Single Type
1. Copy the schema files to their respective locations in `server/src/`
2. Restart Strapi to register the new content type
3. The admin panel will automatically show the new single type

#### Set API Permissions
1. Go to Strapi Admin Panel
2. Navigate to **Settings** > **Users & Permissions Plugin** > **Roles**
3. Click on **"Public"**
4. Under **"Permissions"**, expand **"Submit-page-content"**
5. Check **"find"** permission
6. Save the role

#### Populate Content
1. Go to **Content Manager** > **Single Types** > **Submit Page Content**
2. Create a new entry using the default content from `submit-page-default-content.js`
3. Fill in all required fields
4. For JSON fields, use the provided structured data
5. Save and publish the entry

### 2. Frontend Integration

#### Import Types
```typescript
import type { SubmitPageData } from '@/lib/strapi-optimized';
```

#### Fetch Content
```typescript
const submitPageContent = await getSubmitPageCached();
```

#### Use Dynamic Content
```typescript
// Page title
{submitPageContent?.pageTitle || 'Default Title'}

// Validation message
getValidationMessage('author.emailRequired', 'Default message')

// Settings
const minWords = getMinWordCount();
const maxFileSize = getMaxFileSize();
```

## Content Management

### Validation Messages Structure

The `validationMessages` JSON field should follow this structure:

```json
{
  "author": {
    "nameMinLength": "الاسم يجب أن يكون على الأقل حرفين",
    "emailRequired": "البريد الإلكتروني مطلوب",
    "emailInvalid": "تنسيق البريد الإلكتروني غير صحيح"
  },
  "article": {
    "titleRequired": "عنوان المقال مطلوب",
    "contentMinWords": "محتوى المقال قصير جداً ({count} كلمة، الحد الأدنى {min} كلمة)"
  },
  "file": {
    "fileTooLarge": "حجم الصورة كبير جداً (الحد الأقصى {max} ميجابايت)"
  }
}
```

### System Messages Structure

```json
{
  "loading": "جاري التحميل...",
  "submitting": "جاري الإرسال...",
  "success": "تم بنجاح!",
  "error": "حدث خطأ، يرجى المحاولة مرة أخرى"
}
```

### Dynamic Placeholders

Some validation messages support dynamic placeholders:
- `{count}` - Current word count
- `{min}` - Minimum word count
- `{max}` - Maximum limit (words, file size, etc.)
- `{types}` - Allowed file types

## Performance Considerations

### Caching Strategy
- **Client-side**: 15-minute cache reduces API calls
- **Fallbacks**: Default content ensures the form always works
- **Loading States**: Smooth UX during content loading

### Bundle Size
- Only necessary content is fetched
- Rich text content is rendered safely
- JSON validation messages are efficiently structured

## Security

### Content Validation
- All user input is sanitized before submission
- Dynamic content from Strapi is validated
- File uploads respect dynamic size and type limits

### API Security
- Public read access only to the single type
- No sensitive data stored in the content type
- Validation rules enforced on both client and server

## Maintenance

### Content Updates
1. Access Strapi admin panel
2. Navigate to Submit Page Content
3. Modify any field as needed
4. Save and publish
5. Changes take effect within 15 minutes (cache duration)

### Adding New Validation Messages
1. Edit the `validationMessages` JSON field
2. Add new validation keys following the nested structure
3. Update the frontend code to use `getValidationMessage()`

### Performance Monitoring
- Monitor API response times
- Track cache hit rates
- Observe content loading errors

## Troubleshooting

### Common Issues

#### Content Not Loading
- Check Strapi server status
- Verify API permissions are set correctly
- Ensure the single type entry is published

#### Validation Messages Not Appearing
- Verify JSON structure in `validationMessages` field
- Check for syntax errors in JSON
- Ensure message keys match those used in code

#### Cache Issues
- Content updates may take up to 15 minutes to appear
- Force refresh by restarting the Next.js application
- Clear browser cache if needed

### Debug Mode
Enable debug logging by setting the environment variable:
```
DEBUG_SUBMIT_PAGE=true
```

This will log all content fetching and validation message resolution.

## Future Enhancements

### Planned Features
1. **Multi-language Support**: Add locale-specific content
2. **A/B Testing**: Support for content variants
3. **Analytics Integration**: Track content performance
4. **Advanced Validation**: More sophisticated validation rules

### Content Expansion
- Add more granular error messages
- Support for conditional content based on user type
- Integration with notification templates
- Dynamic form field configuration

## API Reference

### Endpoints

#### Get Submit Page Content
```
GET /api/submit-page-content
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "pageTitle": "إرسال مقال",
    "emailStepTitle": "التحقق من البريد الإلكتروني",
    // ... all other fields
  }
}
```

### Client Functions

#### `getSubmitPageCached()`
Returns cached submit page content with 15-minute TTL.

#### `getValidationMessage(key, fallback)`
Retrieves a validation message by key with fallback.

#### `getSystemMessage(key, fallback)`
Retrieves a system message by key with fallback.

#### `getMinWordCount()`, `getMaxWordCount()`
Returns word count limits from Strapi settings.

#### `getMaxFileSize()`
Returns maximum file size in MB from Strapi settings.

#### `getAllowedFileTypes()`
Returns array of allowed file extensions from Strapi settings.

---

## Files Modified/Created

### Strapi Backend
- `server/src/components/shared/guideline-item.json`
- `server/src/components/shared/success-step.json`
- `server/src/api/submit-page-content/content-types/submit-page-content/schema.json`
- `server/src/api/submit-page-content/routes/submit-page-content.ts`
- `server/src/api/submit-page-content/controllers/submit-page-content.ts`
- `server/src/api/submit-page-content/services/submit-page-content.ts`

### Next.js Frontend
- `client/lib/strapi-optimized.tsx` (updated)
- `client/app/api/submit-page-content/route.ts`
- `client/app/submit/page.tsx` (updated)

### Configuration/Documentation
- `server/scripts/submit-page-permissions.js`
- `server/scripts/submit-page-default-content.js`

This integration provides a complete content management solution for the article submission page, enabling non-technical users to manage all content through a user-friendly admin interface.
