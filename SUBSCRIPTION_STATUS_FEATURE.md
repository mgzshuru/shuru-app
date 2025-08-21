# ميزة إخفاء أزرار الاشتراك للمشتركين

## الوصف
تم تنفيذ ميزة جديدة لإخفاء أزرار الاشتراك في النشرة الإخبارية إذا كان المستخدم مشترك مسبقاً. بدلاً من إظهار زر "اشترك الآن"، سيظهر رسالة تفيد بأن المستخدم مشترك بالفعل.

## التغييرات المُنفذة

### 1. إضافة وظيفة التحقق من حالة الاشتراك

**الملف**: `client/lib/strapi-client.tsx`

```typescript
export async function checkSubscriptionStatus(email: string) {
  try {
    const response = await fetch(`${STRAPI_BASE_URL}/api/subscribers?filters[email][$eq]=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return { success: false, isSubscribed: false, error: `HTTP ${response.status}` };
    }

    const result = await response.json();
    const isSubscribed = result.data && result.data.length > 0;

    return {
      success: true,
      isSubscribed: isSubscribed,
      subscriber: isSubscribed ? result.data[0] : null
    };
  } catch (error: any) {
    return { success: false, isSubscribed: false, error: error.message };
  }
}
```

### 2. تعديل صفحة الملف الشخصي

**الملف**: `client/app/profile/page.tsx`

#### إضافة التحقق من حالة الاشتراك:
```typescript
// Check subscription status
let isSubscribed = false;
if (user?.email) {
  try {
    const subscriptionResult = await checkSubscriptionStatus(user.email);
    isSubscribed = subscriptionResult.isSubscribed;
  } catch (error) {
    console.error('Error checking subscription status:', error);
  }
}
```

#### إخفاء/إظهار أزرار الاشتراك بناءً على حالة الاشتراك:
```typescript
{!isSubscribed && (
  <Button asChild variant="outline" className="h-auto p-6 justify-start border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all">
    <Link href="/subscribe">
      <div className="flex items-center gap-4 text-right">
        <div className="p-3 bg-orange-100 rounded-xl flex-shrink-0">
          <Star className="h-6 w-6 text-orange-600" />
        </div>
        <div>
          <div className="font-semibold text-gray-900">اشترك الآن</div>
          <div className="text-sm text-gray-600 mt-1">في النشرة الاسبوعية</div>
        </div>
      </div>
    </Link>
  </Button>
)}

{isSubscribed && (
  <div className="h-auto p-6 justify-start bg-green-50 border-green-200 rounded-lg border">
    <div className="flex items-center gap-4 text-right">
      <div className="p-3 bg-green-100 rounded-xl flex-shrink-0">
        <Star className="h-6 w-6 text-green-600" />
      </div>
      <div>
        <div className="font-semibold text-green-900">مشترك بالفعل</div>
        <div className="text-sm text-green-600 mt-1">أنت مشترك في النشرة الاسبوعية</div>
      </div>
    </div>
  </div>
)}
```

## المتطلبات

### صلاحيات Strapi
يجب التأكد من أن دور "Authenticated" له صلاحية القراءة لـ `api::subscriber.subscriber`:

1. اذهب إلى Strapi Admin Panel
2. Settings → Users & Permissions plugin → Roles
3. اختر "Authenticated"
4. في قسم "Subscriber"، فعل صلاحية "find"

## كيفية عمل الميزة

1. **عند تحميل صفحة الملف الشخصي**:
   - يحصل التطبيق على بريد المستخدم من الجلسة
   - يستدعي وظيفة `checkSubscriptionStatus` للتحقق من حالة الاشتراك
   - يبحث في قاعدة البيانات عن مشترك بنفس البريد الإلكتروني

2. **إذا كان المستخدم مشترك**:
   - يخفي زر "اشترك الآن"
   - يظهر رسالة "مشترك بالفعل" بلون أخضر
   - يعدل تخطيط الشبكة لاستيعاب التغيير

3. **إذا لم يكن المستخدم مشترك**:
   - يظهر زر "اشترك الآن" العادي
   - يحافظ على التخطيط الأصلي

## الفوائد

- **تجربة مستخدم أفضل**: تجنب طلب الاشتراك من المشتركين بالفعل
- **تقليل الأخطاء**: منع محاولات الاشتراك المكررة
- **وضوح أكبر**: إعلام المستخدم بحالة اشتراكه الحالية

## الاختبار

1. سجل الدخول بحساب مستخدم
2. اذهب إلى صفحة الاشتراك (`/subscribe`) واشترك بالبريد الإلكتروني نفسه
3. اذهب إلى الملف الشخصي (`/profile`)
4. يجب أن ترى رسالة "مشترك بالفعل" بدلاً من زر "اشترك الآن"

## ملاحظات تقنية

- الوظيفة تستخدم `fetch` مع فلاتر Strapi للبحث بدقة عن البريد الإلكتروني
- تتعامل مع الأخطاء بسهولة وترجع القيم المناسبة
- متوافقة مع أنماط TypeScript الموجودة في المشروع
- تستخدم نفس أنماط التصميم (Tailwind CSS) للحفاظ على التناسق البصري
