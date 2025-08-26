import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تواصل معنا | شروع',
  description: 'تواصل مع فريق شروع لأي استفسارات أو اقتراحات أو فرص تعاون. نحن هنا للاستماع إليك ومساعدتك.',
  keywords: 'تواصل معنا, اتصل بنا, شروع, استفسارات, تعاون, دعم',
  openGraph: {
    title: 'تواصل معنا | شروع',
    description: 'تواصل مع فريق شروع لأي استفسارات أو اقتراحات أو فرص تعاون',
    type: 'website',
    locale: 'ar_SA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'تواصل معنا | شروع',
    description: 'تواصل مع فريق شروع لأي استفسارات أو اقتراحات أو فرص تعاون',
  },
  alternates: {
    canonical: '/contact'
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
