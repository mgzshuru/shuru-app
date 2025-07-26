import { ComingSoonBlocksRenderer, fetchComingSoonData } from '@/lib/coming-soon-blocks';

// Force static generation
export const dynamic = 'force-static'
export const revalidate = 3600 // Revalidate every hour

export default async function Home() {
  try {
    const data = await fetchComingSoonData();
    return (
      <main className="min-h-screen bg-white">
        <ComingSoonBlocksRenderer data={data} />
      </main>
    );
  } catch (error) {
    console.error('Error loading home page:', error);
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">عذراً</h1>
          <p className="text-gray-600">حدث خطأ في تحميل الصفحة</p>
        </div>
      </main>
    );
  }
}