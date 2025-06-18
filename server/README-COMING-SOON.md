# Coming Soon Page Components (Blocks-Based)

This document describes the Strapi components created for the coming soon page of the Shuru application using a **blocks-based approach**.

## Overview

The coming soon page now uses a **Dynamic Zone** with blocks, making it extremely flexible and easy to manage. Content managers can:
- **Add** new sections easily
- **Remove** sections without touching code
- **Reorder** sections by drag-and-drop
- **Duplicate** sections if needed
- **Hide/Show** sections conditionally

## Blocks Structure

The page is built using a `blocks` dynamic zone that can contain any of these components:

### 1. Hero Block (`coming-soon.hero`)
- **Logo**: Media component for the main logo
- **Title**: Main heading text
- **Subtitle**: Secondary heading text
- **Description**: Rich text description
- **Stats**: Array of stat items (label/value pairs)
- **CTA**: Call-to-action button with text, target, and variant

### 2. Features Grid Block (`coming-soon.features-grid`)
- **Main Feature**: Section with label, title, description, and features list
- **Stats**: Statistics section with label and items
- **Specialties**: Specialties section with label and items array

### 3. Team Block (`coming-soon.team`)
- **Header**: Section header with label, title, and description
- **Teams**: Array of team items with icon, title, and description

### 4. Newsletter Block (`coming-soon.newsletter`)
- **Header**: Section header
- **Form**: Form configuration with email placeholder and submit button
- **Messages**: Success and privacy messages

### 5. Timeline Block (`coming-soon.timeline`)
- **Header**: Section header
- **Phases**: Array of timeline phases with phase number, title, description, and current status

### 6. Why Block (`coming-soon.why`)
- **Header**: Section header
- **Features**: Array of feature items with icon, title, and description

### 7. Footer Block (`coming-soon.footer`)
- **Copyright Text**: Copyright information
- **Logo**: Footer logo with text and images
- **Social Media**: Array of social media links
- **Bottom Links**: Array of footer navigation links

## Content Type

### Coming Soon (`api::coming-soon.coming-soon`)
A single type content with:
- `blocks`: Dynamic zone containing any combination of the above blocks
- `seo`: SEO metadata

## API Endpoint

The coming soon data is available at:
```
GET /api/coming-soon
```

This endpoint returns all the coming soon page data with proper population of nested components and media files.

## Admin Panel Usage

### Adding Blocks
1. Go to **Content Manager** → **Coming Soon**
2. Click **Edit** on the existing entry
3. In the **Blocks** section, click **Add another item**
4. Select the block type you want to add
5. Fill in the content
6. Save and publish

### Reordering Blocks
1. In the **Blocks** section, use the drag handle (⋮⋮) to reorder blocks
2. The order in the admin panel determines the order on the page

### Removing Blocks
1. Click the **Delete** button (🗑️) on any block
2. Confirm deletion
3. Save and publish

### Duplicating Blocks
1. Click the **Duplicate** button (📋) on any block
2. Modify the duplicated content as needed
3. Save and publish

## Frontend Implementation

### Basic Usage
```typescript
const response = await fetch('/api/coming-soon');
const comingSoonData = await response.json();

// Render blocks in order
comingSoonData.blocks.forEach(block => {
  switch (block.__component) {
    case 'coming-soon.hero':
      renderHero(block);
      break;
    case 'coming-soon.features-grid':
      renderFeaturesGrid(block);
      break;
    case 'coming-soon.team':
      renderTeam(block);
      break;
    case 'coming-soon.newsletter':
      renderNewsletter(block);
      break;
    case 'coming-soon.timeline':
      renderTimeline(block);
      break;
    case 'coming-soon.why':
      renderWhy(block);
      break;
    case 'coming-soon.footer':
      renderFooter(block);
      break;
  }
});
```

### Advanced Usage with Strapi Client
```typescript
import { getStrapiURL } from '@/lib/utils';

const comingSoonData = await fetchAPI('/api/coming-soon', {
  populate: {
    blocks: {
      populate: {
        // Hero block
        logo: { populate: '*' },
        stats: true,
        cta: true,
        // Features grid block
        mainFeature: { populate: { features: true } },
        stats: { populate: { items: true } },
        specialties: true,
        // Team block
        header: true,
        teams: true,
        // Newsletter block
        form: { populate: { submitButton: true } },
        messages: true,
        // Timeline block
        phases: true,
        // Why block
        features: true,
        // Footer block
        logo: { 
          populate: { 
            image: { populate: '*' },
            mobileImage: { populate: '*' }
          }
        },
        socialMedia: true,
        bottomLinks: true
      }
    },
    seo: true
  }
});
```

## Benefits of Blocks Approach

### For Content Managers
- **No Code Required**: Add/remove/reorder sections without developer help
- **Flexible Layout**: Create different page layouts for different purposes
- **A/B Testing**: Easily create variations by duplicating and modifying blocks
- **Conditional Content**: Show/hide sections based on conditions

### For Developers
- **Modular Components**: Each block is a self-contained component
- **Reusable**: Blocks can be used in other parts of the application
- **Type Safe**: Full TypeScript support for all block types
- **Maintainable**: Easy to add new block types or modify existing ones

## Adding New Block Types

To add a new block type:

1. **Create the component** in `src/components/coming-soon/`
2. **Add to schema** in `src/api/coming-soon/content-types/coming-soon/schema.json`
3. **Update controller** to handle population
4. **Update seed script** if needed
5. **Add to frontend** renderer

Example new block:
```json
{
  "collectionName": "components_coming_soon_testimonial",
  "info": {
    "displayName": "Testimonial",
    "icon": "message-circle"
  },
  "attributes": {
    "quote": { "type": "text", "required": true },
    "author": { "type": "string", "required": true },
    "position": { "type": "string" },
    "avatar": { "type": "component", "component": "shared.media" }
  }
}
```

## Seeding Data

The blocks come with a seed script that populates the content with the existing JSON data:

```bash
cd server
npm run seed
```

This creates a default layout with all blocks in the original order.

## Best Practices

1. **Block Naming**: Use descriptive names for blocks in the admin panel
2. **Content Organization**: Group related content in the same block
3. **Performance**: Keep blocks lightweight and avoid deeply nested structures
4. **Accessibility**: Ensure each block has proper semantic HTML structure
5. **Responsive Design**: Design blocks to work on all screen sizes

## Troubleshooting

### Common Issues
- **Block not showing**: Check if the block is published
- **Media not loading**: Ensure media files are uploaded and linked
- **Order issues**: Verify block order in the admin panel
- **API errors**: Check the controller population settings

### Debug Tips
- Use browser dev tools to inspect API responses
- Check Strapi logs for server-side errors
- Verify component names match between frontend and backend

## Component Relationships

The components are designed with the following relationships:

- **Shared Components**: Uses existing `shared.media` and `shared.seo` components
- **Nested Components**: Each main component can contain multiple sub-components
- **Repeatable Components**: Many components support multiple instances (e.g., stats, features, team members)

## Customization

To customize the components:

1. **Add New Fields**: Edit the component JSON files in `src/components/coming-soon/`
2. **Modify Structure**: Update the content type schema in `src/api/coming-soon/content-types/coming-soon/schema.json`
3. **Update API**: Modify the controller to handle new fields
4. **Regenerate Types**: Run `npm run build` to regenerate TypeScript types

## Media Management

The components support media files through the `shared.media` component. When seeding:
1. Upload logo files to the Media Library
2. Link them to the appropriate components
3. The API will return proper media URLs

## Permissions

The coming soon API is configured with public read permissions, allowing frontend applications to fetch the data without authentication. 