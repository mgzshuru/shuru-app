# Strapi Home Page Sample Data (Dynamic Blocks)

## Step 1: Access Strapi Admin
1. Go to http://localhost:1337/admin
2. Login or create an admin account
3. Navigate to Content Manager → Single Types → Home Page

## Step 2: Configure API Permissions
1. Go to Settings → Users & Permissions Plugin → Roles → Public
2. Find "Home-page" and check the "find" permission
3. Save

## Step 3: Add Home Page Dynamic Blocks

The home page now uses dynamic blocks like the coming soon page. You can add/remove/reorder sections.

### Available Block Types:
1. **home.hero-section** - Main hero section
2. **home.hero-complex-section** - Complex hero with featured article, sidebar, and most read widget (Fast Company style)
3. **home.featured-section** - Featured articles grid
4. **home.trending-section** - Trending articles
5. **home.categories-section** - Categories showcase
6. **home.newsletter-section** - Newsletter signup### How to Add Blocks:
1. In the Home Page editor, click "Add a component to blocks"
2. Select the block type you want
3. Fill in the block configuration
4. You can reorder blocks by dragging them
5. You can delete blocks you don't need

### Block Configuration Examples:

#### 1. Hero Section Block
- **Component**: home.hero-section
- **Title**: "أحدث الابتكارات في إدارة المشاريع"
- **Subtitle**: "اكتشف أفضل الممارسات والاتجاهات الحديثة في عالم الأعمال"
- **Show Latest Articles**: ✅ True
- **Max Articles**: 6
- **Featured Article**: Select an article (optional)
- **Secondary Articles**: Select multiple articles (optional)

#### 2. Hero Complex Section Block (Fast Company Style)
- **Component**: home.hero-complex-section
- **Title**: "آخر الأخبار والتحليلات" (optional)
- **Subtitle**: "أحدث المقالات والاتجاهات في عالم الأعمال" (optional)
- **Featured Article**: Select the main article to highlight
- **Sidebar Articles**: Select 2-3 articles for the sidebar (optional)
- **Most Read Articles**: Select 4-6 trending articles (optional)
- **Show Most Read**: ✅ True
- **Max Sidebar Articles**: 3
- **Max Most Read Articles**: 4

#### 3. Featured Section Block
- **Component**: home.featured-section
- **Title**: "المقالات المميزة"
- **Subtitle**: "مختارات من أفضل المحتوى لدينا"
- **Show Featured Only**: ✅ True
- **Max Articles**: 6
- **Layout Style**: grid
- **Featured Articles**: Select specific articles (optional)

#### 4. Trending Section Block
- **Component**: home.trending-section
- **Title**: "الأكثر قراءة هذا الأسبوع"
- **Subtitle**: "المقالات التي حازت على أكبر اهتمام من قرائنا"
- **Show Most Viewed**: ✅ True
- **Max Articles**: 6
- **Timeframe**: week
- **Articles**: Select specific articles (optional)

#### 5. Categories Section Block
- **Component**: home.categories-section
- **Title**: "استكشف فئات المحتوى"
- **Subtitle**: "تصفح المحتوى حسب المجالات المختلفة"
- **Show All Categories**: ❌ False
- **Max Categories**: 6
- **Layout Style**: grid
- **Categories**: Select specific categories (optional)

#### 6. Newsletter Section Block
- **Component**: home.newsletter-section
- **Title**: "اشترك في النشرة البريدية"
- **Description**: "احصل على أحدث المقالات والنصائح المهنية مباشرة في بريدك الإلكتروني"
- **Button Text**: "اشترك الآن"
- **Placeholder Text**: "أدخل بريدك الإلكتروني"
- **Background Color**: "#f8fafc"
- **Show In Footer**: ❌ False
- **Background Image**: Upload an image (optional)

## Step 4: Create Sample Articles

### Article 1 (Featured)
- **Title**: "مستقبل إدارة المشاريع الرقمية"
- **Description**: "كيف تؤثر التقنيات الحديثة على طرق إدارة المشاريع والفرق"
- **Slug**: "digital-project-management-future"
- **Is Featured**: ✅ True
- **Cover Image**: Upload a professional business/tech image
- **Category**: إدارة المشاريع
- **Author**: Select an existing author

### Article 2 (Featured)
- **Title**: "استراتيجيات القيادة الحديثة في بيئة العمل الهجين"
- **Description**: "دليل شامل لقيادة الفرق في عصر العمل المرن والهجين"
- **Slug**: "modern-leadership-hybrid-work"
- **Is Featured**: ✅ True
- **Cover Image**: Upload a leadership/team image
- **Category**: القيادة
- **Author**: Select an existing author

### Article 3 (Featured)
- **Title**: "التحول الرقمي: من التخطيط إلى التنفيذ"
- **Description**: "خطوات عملية لتنفيذ مشاريع التحول الرقمي بنجاح"
- **Slug**: "digital-transformation-guide"
- **Is Featured**: ✅ True
- **Cover Image**: Upload a digital transformation image
- **Category**: التحول الرقمي
- **Author**: Select an existing author

### Article 4 (Trending)
- **Title**: "أدوات إدارة المشاريع الأساسية لعام 2025"
- **Description**: "مراجعة شاملة لأفضل الأدوات والمنصات المتاحة"
- **Slug**: "project-management-tools-2025"
- **Is Featured**: ❌ False
- **Cover Image**: Upload a tools/software image
- **Category**: أدوات وتقنيات

### Article 5 (Trending)
- **Title**: "كيفية بناء ثقافة الابتكار في المؤسسات"
- **Description**: "استراتيجيات عملية لتعزيز الإبداع والابتكار في بيئة العمل"
- **Slug**: "innovation-culture-organizations"
- **Is Featured**: ❌ False
- **Cover Image**: Upload an innovation/creativity image
- **Category**: الابتكار

### Article 6 (Regular)
- **Title**: "إدارة المخاطر في المشاريع التقنية"
- **Description**: "أفضل الممارسات لتحديد وإدارة المخاطر في المشاريع"
- **Slug**: "risk-management-tech-projects"
- **Is Featured**: ❌ False
- **Cover Image**: Upload a risk management image
- **Category**: إدارة المخاطر

## Step 5: Create Categories

### Category 1: إدارة المشاريع
- **Name**: إدارة المشاريع
- **Slug**: project-management
- **Description**: "كل ما يتعلق بإدارة المشاريع الحديثة والطرق المبتكرة"
- **Image**: Upload a project management icon/image

### Category 2: القيادة
- **Name**: القيادة
- **Slug**: leadership
- **Description**: "مهارات وتقنيات القيادة الفعالة في بيئات العمل المختلفة"
- **Image**: Upload a leadership icon/image

### Category 3: التحول الرقمي
- **Name**: التحول الرقمي
- **Slug**: digital-transformation
- **Description**: "استراتيجيات وتطبيقات التحول الرقمي في المؤسسات"
- **Image**: Upload a digital transformation icon/image

### Category 4: الابتكار
- **Name**: الابتكار
- **Slug**: innovation
- **Description**: "أحدث الاتجاهات والممارسات في مجال الابتكار"
- **Image**: Upload an innovation icon/image

### Category 5: أدوات وتقنيات
- **Name**: أدوات وتقنيات
- **Slug**: tools-tech
- **Description**: "مراجعات وشروحات لأفضل الأدوات والتقنيات المتاحة"
- **Image**: Upload a tools icon/image

### Category 6: إدارة المخاطر
- **Name**: إدارة المخاطر
- **Slug**: risk-management
- **Description**: "طرق وأساليب إدارة المخاطر في بيئات الأعمال"
- **Image**: Upload a risk management icon/image

## Step 6: Create Authors (if needed)

### Author 1
- **Name**: "د. أحمد محمد"
- **Email**: "ahmed@example.com"
- **Job Title**: "خبير إدارة المشاريع"
- **Organization**: "مؤسسة شروع"
- **Bio**: "خبير في إدارة المشاريع التقنية مع أكثر من 15 سنة من الخبرة"

### Author 2
- **Name**: "سارة عبدالله"
- **Email**: "sara@example.com"
- **Job Title**: "مستشارة القيادة التنفيذية"
- **Organization**: "مؤسسة شروع"
- **Bio**: "متخصصة في تطوير القيادات وإدارة التغيير المؤسسي"

## Step 7: Link Content in Home Page

After creating the content above:

1. **Hero Section**:
   - Set "Featured Article" to Article 1
   - Set "Secondary Articles" to Articles 2, 3, 4, 5

2. **Featured Section**:
   - Set "Featured Articles" to Articles 1, 2, 3, 4

3. **Trending Section**:
   - Set "Articles" to Articles 4, 5, 6

4. **Categories Section**:
   - Add all 6 categories created above

5. **Newsletter Section**:
   - Leave as configured in Step 3

## Step 8: Test the Home Page

1. Save and publish the Home Page content
2. Go to http://localhost:3000
3. Verify all sections display correctly with the content you added

## Notes:
- Make sure all articles have cover images for best visual appearance
- Set appropriate publish dates for articles
- You can upload placeholder images initially and replace them later
- The home page will automatically fall back to default content if any sections are empty
