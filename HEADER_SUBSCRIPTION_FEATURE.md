# ميزة إخفاء أزرار الاشتراك في الهيدر والموبايل منيو

## الوصف
تم تطوير الميزة لتشمل إخفاء أزرار الاشتراك في النشرة الإخبارية في جميع أنحاء التطبيق (الهيدر، الموبايل منيو، والملف الشخصي) إذا كان المستخدم مشترك مسبقاً.

## التغييرات المُنفذة

### 1. تحديث Header.tsx

**الملف**: `client/components/layout/Header.tsx`

#### إضافة الاستيرادات والـ State:
```typescript
import { checkSubscriptionStatus } from '@/lib/strapi-client';

const [isSubscribed, setIsSubscribed] = useState(false);
const [checkingSubscription, setCheckingSubscription] = useState(false);
```

#### إضافة useEffect للتحقق من حالة الاشتراك:
```typescript
useEffect(() => {
  const checkUserSubscription = async () => {
    if (isAuthenticated && user?.email && !loading) {
      setCheckingSubscription(true);
      try {
        const result = await checkSubscriptionStatus(user.email);
        setIsSubscribed(result.isSubscribed);
      } catch (error) {
        console.error('Error checking subscription status:', error);
        setIsSubscribed(false);
      } finally {
        setCheckingSubscription(false);
      }
    } else {
      setIsSubscribed(false);
    }
  };

  checkUserSubscription();
}, [isAuthenticated, user?.email, loading]);
```

#### إخفاء زر الاشتراك بناءً على حالة الاشتراك:
```typescript
{/* Show subscribe button only if user is not authenticated OR not subscribed */}
{(!isAuthenticated || !isSubscribed) && (
  <Link href="/subscribe" className="flex items-stretch">
    <Button
      variant="default"
      size="sm"
      className="text-black/90 rounded-none text-xs sm:text-sm lg:text-base px-2 sm:px-3 lg:px-6 h-full min-h-[40px] sm:min-h-[44px] lg:min-h-[50px] flex items-center"
    >
      {'اشترك الآن'}
    </Button>
  </Link>
)}
```

### 2. تحديث MobileMenu.tsx

**الملف**: `client/components/layout/MobileMenu.tsx`

#### تحديث الـ Interface:
```typescript
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  headerData: HeaderData;
  isUserSubscribed?: boolean;
}
```

#### تحديث الـ Function Signature:
```typescript
export default function MobileMenu({ isOpen, onClose, headerData, isUserSubscribed = false }: MobileMenuProps)
```

#### إخفاء زر الاشتراك في الموبايل منيو:
```typescript
{!isUserSubscribed && (
  <Button
    variant="default"
    size="default"
    className="justify-center text-black w-full bg-primary hover:bg-primary/90 text-sm py-2"
    onClick={handleSubscribeClick}
  >
    {'اشترك الآن'}
  </Button>
)}
```

#### تمرير المعلومات من الـ Header:
```typescript
<MobileMenu
  isOpen={isMenuOpen}
  onClose={() => setIsMenuOpen(false)}
  headerData={headerData}
  isUserSubscribed={isSubscribed}
/>
```

### 3. صفحة الملف الشخصي (تم سابقاً)

**الملف**: `client/app/profile/page.tsx`

تم تنفيذ نفس المنطق في صفحة الملف الشخصي كما هو موضح في الملف السابق.

## كيفية عمل الميزة

### 1. للمستخدمين غير المسجلين:
- يظهر زر "اشترك الآن" في الهيدر
- يظهر زر "اشترك الآن" في الموبايل منيو
- لا يوجد تحقق من حالة الاشتراك

### 2. للمستخدمين المسجلين وغير المشتركين:
- يظهر زر "اشترك الآن" في الهيدر
- يظهر زر "اشترك الآن" في الموبايل منيو
- يظهر زر "اشترك الآن" في الملف الشخصي

### 3. للمستخدمين المسجلين والمشتركين:
- **يختفي** زر "اشترك الآن" من الهيدر
- **يختفي** زر "اشترك الآن" من الموبايل منيو
- يظهر رسالة "مشترك بالفعل" في الملف الشخصي

## التحسينات المُضافة

### 1. الأداء:
- التحقق من حالة الاشتراك يحدث فقط للمستخدمين المسجلين
- استخدام useEffect مع dependency array محدد لتجنب الطلبات غير الضرورية

### 2. تجربة المستخدم:
- إخفاء الأزرار بدلاً من تعطيلها لتحسين الشكل البصري
- الحفاظ على نفس التصميم والتخطيط

### 3. التعامل مع الأخطاء:
- إذا فشل التحقق من حالة الاشتراك، يُعتبر المستخدم غير مشترك (للأمان)
- عرض الأزرار في حالة عدم اليقين

## الاختبار

### سيناريوهات الاختبار:

1. **مستخدم غير مسجل**:
   - ✅ يظهر زر الاشتراك في الهيدر
   - ✅ يظهر زر الاشتراك في الموبايل منيو

2. **مستخدم مسجل وغير مشترك**:
   - ✅ يظهر زر الاشتراك في الهيدر
   - ✅ يظهر زر الاشتراك في الموبايل منيو
   - ✅ يظهر زر الاشتراك في الملف الشخصي

3. **مستخدم مسجل ومشترك**:
   - ❌ لا يظهر زر الاشتراك في الهيدر
   - ❌ لا يظهر زر الاشتراك في الموبايل منيو
   - ✅ يظهر "مشترك بالفعل" في الملف الشخصي

### خطوات الاختبار:

1. سجل الدخول بحساب مستخدم
2. لاحظ وجود أزرار الاشتراك في الهيدر والموبايل منيو
3. اشترك في النشرة الإخبارية
4. ارجع إلى الصفحة الرئيسية وأعد تحميلها
5. تأكد من اختفاء أزرار الاشتراك
6. اذهب إلى الملف الشخصي وتأكد من رسالة "مشترك بالفعل"

## ملاحظات تقنية

- الوظيفة متوافقة مع Server-Side Rendering (SSR)
- تستخدم نفس API endpoint للتحقق من حالة الاشتراك
- متوافقة مع TypeScript بالكامل
- تحافظ على نفس أنماط التصميم والألوان

## متطلبات النظام

- صلاحيات "find" لـ Subscriber في Strapi
- المستخدم يجب أن يكون مسجل دخول لعمل التحقق
- اتصال إنترنت نشط للتحقق من حالة الاشتراك
