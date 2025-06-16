شروع Design Guidelines
Fast Company Inspired Arabic Digital Magazine - Updated Implementation Guide

Table of Contents
Brand Identity
Color System
Typography
Layout & Grid System
Component Library
RTL Implementation
Content Structure
Accessibility
Performance Guidelines
Brand Identity
Mission
شروع is an Arabic digital magazine inspired by Fast Company's professional design aesthetic, focused on innovation, entrepreneurship, leadership, and digital transformation in the Arab world.

Design Philosophy
Fast Company Inspired: Clean, modern layout with orange accent color
Arabic-First: Proper RTL support with Cairo and Tajawal fonts
Content-Focused: Typography-driven design with clear hierarchy
Performance-Optimized: Next.js 15 with Tailwind CSS for optimal loading
Color System
Primary Colors (Current Implementation)
FC Orange (
#ef5b24)
css
--fc-orange: 16 89% 55%; /* Primary brand color */
Usage: CTAs, highlights, premium indicators, hover states
Classes: .text-fc-orange, .bg-fc-orange
FC Black (
#000000)
css
--fc-black: 0 0% 0%; /* Headlines and primary text */
Usage: Main headlines, navigation text, high-priority content
Classes: .text-black, .bg-black
FC Gray (
#777777)
css
--fc-gray: 0 0% 46.7%; /* Secondary text */
Usage: Body text, secondary navigation, metadata
Classes: .text-fc-gray, .text-gray-600
FC Accessible Gray (
#444444)
css
--fc-accessible-gray: 0 0% 26.7%; /* High contrast text */
Usage: Important secondary content, descriptions
Classes: .text-fc-accessible-gray, .text-gray-700
FC Light Gray (
#cccccc)
css
--fc-light-gray: 0 0% 80%; /* Borders and dividers */
Usage: Card borders, form inputs, separators
Classes: .border-fc-light-gray, .border-gray-200
FC Background Light (
#f4f4f4)
css
--fc-bg-light: 0 0% 95.7%; /* Subtle backgrounds */
Usage: Section backgrounds, muted areas
Classes: .bg-fc-light, .bg-gray-50
Special Colors
Premium Accent (
#CBD1F9)
css
--premium-color: #CBD1F9; /* Premium section accent */
Usage: Premium section buttons, highlights
Background: Dark (
#231f20) for premium sections
Typography
Font Implementation
Primary Font Stack (Arabic)
css
--font-arabic-primary: 'Cairo', 'Tajawal', system-ui, sans-serif;
Implementation: font-primary class
Usage: Headlines, UI elements, navigation
Weights: 300, 400, 500, 600, 700, 800, 900
Secondary Fonts
css
/* Noto Sans Arabic for body text */
--font-noto-sans: 'Noto Sans Arabic';

/* Amiri for serif content */
--font-amiri: 'Amiri';
Typography Classes (Current Implementation)
Headlines
css
.fc-headline {
  font-family: var(--font-display);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  line-height: 1.1;
}
Body Text
css
.fc-body {
  font-family: var(--font-serif);
  font-size: 1.1875rem; /* 19px */
  line-height: 2rem; /* 32px */
  font-weight: 300;
}
Labels & Captions
css
.fc-label {
  font-family: var(--font-primary);
  font-size: 0.75rem; /* 12px */
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1125rem;
}

.fc-caption {
  font-family: var(--font-primary);
  font-size: 0.8125rem; /* 13px */
  line-height: 1.0625rem; /* 17px */
  color: hsl(var(--fc-gray));
}
Navigation Links
css
.fc-nav-link {
  color: hsl(var(--fc-gray));
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.875rem;
  transition: color 0.2s ease;
  position: relative;
}

.fc-nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  right: 0;
  width: 0;
  height: 2px;
  background-color: hsl(var(--fc-orange));
  transition: width 0.3s ease;
}

.fc-nav-link:hover::after {
  width: 100%;
}
Arabic Typography Utilities
css
.arabic-text {
  font-family: var(--font-display);
  line-height: 1.6;
  text-align: right;
}

.arabic-body {
  font-family: var(--font-serif);
  line-height: 1.8;
  text-align: right;
}
Layout & Grid System
Container System
css
.container {
  max-width: 1280px; /* 80rem */
  margin: 0 auto;
  padding: 0 1.25rem; /* 20px mobile */
}

@media (min-width: 1024px) {
  .container {
    padding: 0 2.5rem; /* 40px desktop */
  }
}
Homepage Grid (Current Implementation)
css
/* 4-column desktop grid */
.grid-cols-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

/* Layout structure */
.homepage-grid {
  /* Column 1: Sidebar articles */
  /* Columns 2-3: Hero article */
  /* Column 4: Most read + ads */
}
Responsive Breakpoints
Mobile: < 768px - Single column
Tablet: 768px - 1023px - 2-3 columns
Desktop: ≥ 1024px - 4 columns
Component Library
Buttons (Current Implementation)
Primary Button
css
.btn-fc-primary {
  background-color: hsl(var(--fc-orange));
  color: hsl(var(--fc-white));
  padding: 0.5rem 1rem;
  border-radius: 0.1875rem; /* 3px */
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1125rem;
  transition: colors 0.2s ease;
}

.btn-fc-primary:hover {
  background-color: hsl(var(--fc-gray));
}
Outline Button (FC Style)
css
.btn-fc-outline {
  border: 2px solid hsl(var(--fc-gray));
  color: hsl(var(--fc-gray));
  padding: 0.75rem 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.76px;
  box-shadow: -3px 3px 0 0 hsl(var(--fc-gray));
  border-radius: 0.1875rem;
  transition: all 0.25s ease;
}

.btn-fc-outline:hover {
  border-color: hsl(var(--fc-orange));
  color: hsl(var(--fc-orange));
  box-shadow: -3px 3px 0 0 hsl(var(--fc-orange));
}
Cards (Current Implementation)
Article Card
css
.article-card {
  background: hsl(var(--fc-white));
  border: 1px solid hsl(var(--fc-light-gray));
  border-radius: 0.125rem; /* 2px */
  overflow: hidden;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.article-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
Forms (Current Implementation)
Input Fields
css
.fc-input {
  border: 1px solid hsl(var(--fc-light-gray));
  padding: 0.625rem;
  height: 40px;
  border-radius: 0.1875rem; /* 3px */
  font-family: var(--font-primary);
  transition: border-color 0.2s ease;
}

.fc-input:focus {
  outline: none;
  border-color: hsl(var(--fc-orange));
  box-shadow: 0 0 0 2px rgba(239, 91, 36, 0.2);
}
Navigation Components
Header Implementation
Fixed Position: fixed top-0 z-50
Transparent Background: bg-black/80
Collapsible Menu: Mobile sheet navigation
Search Overlay: Full-screen search interface
Footer Implementation
6-Column Grid: Desktop category navigation
Collapsible Sections: Mobile accordion
Background Logo: Transparent logo overlay
Social Media Icons: SVG icon integration
RTL Implementation
Direction & Text Alignment
css
html[dir="rtl"] {
  text-align: right;
}

[dir="rtl"] .prose ul,
[dir="rtl"] .prose ol {
  padding-right: 1.5rem;
  padding-left: 0;
}
RTL Utility Classes
css
.rtl-border-r {
  border-right-width: 1px;
  border-left-width: 0;
}

.rtl-border-l {
  border-left-width: 1px;
  border-right-width: 0;
}

.rtl-pr-4 {
  padding-right: 1rem;
  padding-left: 0;
}

.rtl-pl-4 {
  padding-left: 1rem;
  padding-right: 0;
}
Language Declaration
html
<html dir="rtl" lang="ar">
Content Structure
Article Card Variants (Current Implementation)
Hero Variant
Large Image: 16:9 aspect ratio
Prominent Headline: 20px mobile, 28px desktop
Description: Serif font, light weight
Category Badge: Premium indicator
Standard Variant
Medium Image: Responsive sizing
Headline: 14px mobile, 20px desktop
Metadata: Author, reading time
Hover Effects: Subtle transform
Compact Variant
Small Thumbnail: 120px fixed width
Numbered List: For "Most Read" sections
Dense Information: Minimal spacing
Text-Only Variant
No Image: Sidebar articles
Border Separators: Clean division
Category First: Visual hierarchy
Content Sections
Latest Topics
css
.homepage__latestTopics {
  /* Horizontal scroll on mobile */
  /* Pill-shaped tags */
  /* Orange hover states */
}
Premium Section
css
.premium-section {
  background-color: #231f20; /* Dark background */
  color: white;
  /* Tabbed navigation */
  /* Horizontal scroll cards */
  /* Premium accent color #CBD1F9 */
}
Most Read Section
css
.recommender__container {
  /* Tabbed interface */
  /* Numbered articles */
  /* Border styling */
}
Accessibility
Color Contrast
AA Compliance: All text meets 4.5:1 minimum
Orange on White: Passes accessibility tests
Gray Text: Sufficient contrast for secondary content
Keyboard Navigation
Focus Indicators: Custom orange focus rings
Tab Order: Logical RTL flow
Skip Links: "انتقل إلى المحتوى الرئيسي"
Screen Reader Support
html
<main id="main-content" role="main">
<section aria-labelledby="premium-section-title">
<button aria-label="قائمة التنقل">
RTL Accessibility
Language Declaration: lang="ar"
Reading Direction: dir="rtl"
Semantic HTML: Proper heading hierarchy
Performance Guidelines
Image Optimization
jsx
<Image
  src={image}
  alt={title}
  fill
  priority={priority}
  sizes="(max-width: 1023px) 90vw, 610px"
/>
Font Loading
css
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap');
CSS Optimization
Tailwind CSS: Utility-first approach
Custom Properties: CSS variables for theming
Minimal Bundle: Only necessary styles
Loading States
css
.loading-typing {
  /* Orange dot animation */
  /* Smooth transitions */
  /* Accessibility friendly */
}
Implementation Checklist
Design System
 Color variables implemented
 Typography classes created
 Component library built
 RTL styles implemented
 Responsive design complete
Content Components
 Article card variants
 Navigation components
 Form elements
 Premium section
 Advertisement containers
Performance
 Image optimization
 Font loading strategy
 CSS optimization
 Loading animations
 Accessibility features
Browser Support
 Modern browsers
 RTL languages
 Mobile devices
 Keyboard navigation
 Screen readers
Usage Examples
Creating Article Cards
jsx
<ArticleCard
  article={article}
  variant="hero" // or "standard", "compact", "text-only"
  className="additional-styles"
  priority={true} // for hero images
/>
Category Badges
jsx
<CategoryBadge
  category="premium"
  isPremium={true}
  size="md" // or "sm"
  href="/category/premium"
/>
Premium Section
jsx
<PremiumSection
  articles={premiumArticles}
  className="mt-8"
/>
Last Updated: May 2025
Version: 2.0 - Aligned with Current Implementation
Framework: Next.js 15 + Tailwind CSS + Strapi Cloud

