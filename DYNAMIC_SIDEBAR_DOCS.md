# Article Grid Section - Dynamic Sidebar

The Article Grid Section now supports a dynamic sidebar that can be configured from the Strapi admin panel.

## Features

### Dynamic Sidebar Content
The sidebar now supports a dynamic zone that allows editors to add/remove different types of content:

1. **Event Cards** - Promotional cards for events with customizable content
2. **Ad Spaces** - Advertisement spaces with flexible dimensions and content

### Component Structure

#### Event Card (`shared.event-card`)
- **Title**: Event name
- **Description**: Event details
- **Date Text**: Event date and location
- **Image**: Event promotional image
- **CTA Text**: Call-to-action button text
- **CTA Link**: Call-to-action button link
- **Section Title**: Header title (e.g., "حفظ التاريخ")
- **Section Icon**: Header icon image

#### Ad Space (`shared.ad-space`)
- **Title**: Ad label (default: "إعلان")
- **Width/Height**: Custom dimensions
- **Image**: Advertisement image
- **Link**: Clickable link
- **Link Target**: Open in same/new window
- **Alt Text**: Accessibility text
- **Custom HTML**: Direct HTML content
- **Show Placeholder**: Display placeholder when no content
- **Placeholder Text**: Placeholder message

### Configuration

#### In Strapi Admin Panel
1. Go to Content-Type Builder
2. Find "Article Grid Section" component
3. Look for the "Sidebar Content" dynamic zone
4. Add Event Cards or Ad Spaces as needed
5. Configure each component with your content

#### Sidebar Settings
- **Show Sidebar**: Toggle sidebar visibility
- **Sidebar Content**: Dynamic zone for adding components

### Default Behavior
When no sidebar content is configured, the component will display default content:
- A default event card for "مهرجان شُرو للابتكار"
- A default ad space placeholder

### Usage Examples

#### Multiple Ads Configuration
```json
{
  "sidebarContent": [
    {
      "__component": "shared.ad-space",
      "title": "إعلان رئيسي",
      "width": 300,
      "height": 250,
      "image": { "url": "/ads/main-ad.jpg" },
      "link": "https://example.com"
    },
    {
      "__component": "shared.ad-space",
      "title": "إعلان ثانوي",
      "width": 300,
      "height": 200,
      "customHtml": "<div>Custom ad content</div>"
    }
  ]
}
```

#### Event Card Only
```json
{
  "sidebarContent": [
    {
      "__component": "shared.event-card",
      "title": "مؤتمر التكنولوجيا",
      "description": "مؤتمر سنوي للتكنولوجيا والابتكار",
      "dateText": "20-22 ديسمبر | دبي",
      "ctaText": "احجز مقعدك",
      "ctaLink": "/events/tech-conference"
    }
  ]
}
```

#### Mixed Content
```json
{
  "sidebarContent": [
    {
      "__component": "shared.event-card",
      "title": "معرض الابتكار",
      "dateText": "5-7 يناير | الرياض"
    },
    {
      "__component": "shared.ad-space",
      "width": 300,
      "height": 250
    },
    {
      "__component": "shared.ad-space",
      "width": 300,
      "height": 300,
      "customHtml": "<iframe src='https://ads.example.com'></iframe>"
    }
  ]
}
```

### Technical Implementation

#### Components Created
- `server/src/components/shared/event-card.json` - Strapi component schema
- `server/src/components/shared/ad-space.json` - Strapi component schema
- `client/components/blocks/shared/event-card.tsx` - React component
- `client/components/blocks/shared/ad-space.tsx` - React component

#### Updated Files
- `server/src/components/home/article-grid-section.json` - Added dynamic zone
- `client/components/blocks/home/article-grid-section.tsx` - Added sidebar rendering logic

### Benefits
1. **Flexibility**: Content editors can add/remove sidebar elements without code changes
2. **Reusability**: Event cards and ad spaces can be used in other sections
3. **Maintainability**: Centralized component definitions
4. **Scalability**: Easy to add new sidebar component types
5. **Backward Compatibility**: Displays default content when no dynamic content is configured
