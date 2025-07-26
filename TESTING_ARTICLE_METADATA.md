# Testing Article Metadata Implementation

## ✅ What Has Been Implemented

Your article pages now have comprehensive SEO metadata including:

### 🏷️ **Basic Meta Tags**
- Dynamic page titles: `Article Title | Site Name`
- Meta descriptions extracted from article content
- Keywords from article SEO settings or category-based defaults
- Author information and publisher details

### 📱 **Social Media Optimization**
- **Open Graph** for Facebook/LinkedIn sharing with article-specific images
- **Twitter Cards** with large image previews
- **Article-specific metadata** (published time, author, section)

### 🏗️ **Structured Data (Schema.org)**
- **Article Schema** for rich search results
- **Breadcrumb Schema** for navigation context
- **Author and Publisher information**
- **Content categorization and language specification**

### 🔧 **Technical SEO**
- Canonical URLs for each article
- Proper robots meta tags
- Error handling and fallbacks
- Arabic language support

## 🧪 How to Test Your Implementation

### 1. **Manual Testing**

#### Check a Live Article:
1. Build and start your application:
   ```bash
   cd client
   npm run build
   npm start
   ```

2. Visit an article page: `http://localhost:3000/articles/[article-slug]`

3. View page source (Ctrl+U or Cmd+U) and look for:
   ```html
   <title>Article Title | شروع</title>
   <meta name="description" content="Article description...">
   <meta property="og:type" content="article">
   <meta property="og:title" content="Article Title | شروع">
   ```

#### Verify Structured Data:
Look for JSON-LD scripts in the page source:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Your Article Title"
}
</script>
```

### 2. **Automated Testing Script**

Use the provided SEO test script:

```bash
# Test a specific article
node scripts/test-seo.js your-article-slug

# Test with production URL
NEXT_PUBLIC_SITE_URL=https://www.shurumag.com node scripts/test-seo.js article-slug
```

The script will analyze:
- ✅ All meta tags presence
- ✅ Open Graph tags
- ✅ Twitter Card tags
- ✅ Structured data presence
- ✅ SEO best practices compliance

### 3. **Online Validation Tools**

#### Social Media Preview:
- **Facebook**: [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
  - Enter: `https://www.shurumag.com/articles/your-article-slug`
  - Check if image, title, and description appear correctly

- **Twitter**: [Twitter Card Validator](https://cards-dev.twitter.com/validator)
  - Test how your articles will appear when shared on Twitter

- **LinkedIn**: Share an article link in a LinkedIn post to see the preview

#### SEO Validation:
- **Google Rich Results**: [Rich Results Test](https://search.google.com/test/rich-results)
  - Test your article URLs to see if structured data is valid

- **Schema Markup**: [Schema.org Validator](https://validator.schema.org/)
  - Paste your article HTML to validate schema markup

#### Performance Testing:
- **Google PageSpeed**: [PageSpeed Insights](https://pagespeed.web.dev/)
  - Test article page loading speed and Core Web Vitals

### 4. **Google Search Console Testing**

Once your site is live:

1. **Submit Individual Articles**:
   - Go to Google Search Console
   - Use "URL Inspection" tool
   - Enter article URL: `https://www.shurumag.com/articles/article-slug`
   - Click "Request Indexing"

2. **Monitor Performance**:
   - Check "Coverage" report for indexed articles
   - Monitor "Performance" for article click-through rates
   - Review "Core Web Vitals" for article pages

## 🎯 Expected Results

### In Search Results:
Your articles should appear with:
- ✅ Proper titles and descriptions
- ✅ Author information (if configured)
- ✅ Published dates
- ✅ Breadcrumb navigation
- ✅ Rich snippet features

### On Social Media:
When shared, articles will show:
- ✅ Article cover image (or fallback OG image)
- ✅ Compelling title and description
- ✅ Source attribution (شروع)
- ✅ Article metadata (author, date)

### Technical Benefits:
- ✅ Faster indexing by search engines
- ✅ Better understanding of content context
- ✅ Improved search rankings potential
- ✅ Enhanced social media engagement

## 🚨 Common Issues and Solutions

### Issue: "Missing meta description"
**Solution**: Ensure articles have either:
- `SEO.meta_description` field in Strapi
- `description` field in article
- Content in the first rich-text block

### Issue: "Image not showing in social previews"
**Solutions**:
1. Check if `getStrapiMedia()` returns valid URLs
2. Ensure images are publicly accessible
3. Verify image dimensions (recommended: 1200x630)
4. Check if fallback OG image exists at `/og-image.svg`

### Issue: "Structured data errors"
**Solutions**:
1. Test with Google's Rich Results tool
2. Ensure all required fields are present
3. Check for invalid JSON in structured data
4. Verify schema.org markup compliance

### Issue: "Metadata not updating"
**Solutions**:
1. Clear browser cache
2. Rebuild the application (`npm run build`)
3. Check if Strapi API is returning updated data
4. Verify environment variables are set correctly

## 📊 Monitoring Article SEO Performance

### Google Search Console Metrics:
- **Impressions**: How often articles appear in search
- **Clicks**: Actual visits from search results
- **CTR**: Click-through rate (aim for >2% for articles)
- **Average Position**: Search ranking position

### Analytics to Track:
1. **Organic traffic growth** to article pages
2. **Social shares** and referral traffic
3. **Time on page** and engagement metrics
4. **Internal link clicks** between articles

## 🔄 Ongoing Optimization

### Monthly Tasks:
- [ ] Review article performance in Google Search Console
- [ ] Update underperforming titles and descriptions
- [ ] Add internal links between related articles
- [ ] Optimize images for better loading speed
- [ ] Create new articles targeting relevant keywords

### Content Guidelines:
- Write compelling, unique titles (50-60 characters)
- Create informative descriptions (150-160 characters)
- Use relevant Arabic keywords naturally
- Include high-quality, relevant images
- Structure content with proper headings (H2, H3)
- Add internal links to related articles

Your article SEO implementation is now comprehensive and follows current best practices for Arabic content and international SEO standards.
