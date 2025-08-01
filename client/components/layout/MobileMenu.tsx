import { StrapiLink } from '@/components/custom/strapi-link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useRouter } from 'next/navigation';
import { HeaderData } from '@/lib/types';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getMagazineIssuesOptimized } from '@/lib/strapi-optimized';
import { getStrapiMedia } from '@/components/custom/strapi-image';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  headerData: HeaderData;
}

export default function MobileMenu({ isOpen, onClose, headerData }: MobileMenuProps) {
  const router = useRouter();
  const [latestIssue, setLatestIssue] = useState<any>(null);

  useEffect(() => {
    const fetchLatestIssue = async () => {
      try {
        const response = await getMagazineIssuesOptimized();
        if (response?.data && response.data.length > 0) {
          setLatestIssue(response.data[0]);
        }
      } catch (error) {
        console.error('Error fetching latest magazine issue:', error);
      }
    };

    if (isOpen) {
      fetchLatestIssue();
    }
  }, [isOpen]);

  const handleLinkClick = () => {
    onClose();
  };

  const handleLoginClick = () => {
    router.push(headerData.loginButton?.url || '/login');
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="space-y-1 p-2 z-[1100]">
        <SheetTitle className="sr-only">
          Menu
        </SheetTitle>

        {/* Menu items */}
        <div className="border-b border-gray-200 pb-4 mb-4 pt-8">
          {headerData.navigation.primaryMenuItems && headerData.navigation.primaryMenuItems.map((item) => (
            <StrapiLink
              key={item.order}
              href={item.url}
              isExternal={item.openInNewTab}
              className="block"
              onClick={handleLinkClick}
            >
              <Button
                variant="ghost"
                size="default"
                className="justify-start px-4 py-3 text-base font-medium text-gray-900 hover:bg-gray-100 text-right w-full"
              >
                {item.label}
              </Button>
            </StrapiLink>
          ))}
        </div>

        {/* Login button in sheet */}
        <div className="px-4 pb-2">
          <Button
            variant="outline"
            size="default"
            className="justify-center mb-4 text-gray-900 border-gray-300 w-full"
            onClick={handleLoginClick}
          >
            {headerData.loginButton?.text}
          </Button>
        </div>

        {/* Current Issue Section */}
        {latestIssue && (
          <div className="px-4 pb-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider font-['IBM_Plex_Sans_Arabic']">
              العدد الحالي
            </h3>
            <StrapiLink
              href="/magazine"
              className="block"
              onClick={handleLinkClick}
            >
              <div className="w-56 h-72 relative bg-gray-100 shadow-lg mx-auto hover:shadow-xl transition-shadow">
                <Image
                  src={getStrapiMedia(latestIssue.cover_image?.url) || '/placeholder-magazine.jpg'}
                  alt={latestIssue.cover_image?.alternativeText || latestIssue.title}
                  fill
                  className="object-cover"
                />
              </div>
            </StrapiLink>
          </div>
        )}

        {/* CTA in sheet */}
        {/* <div className="px-4">
          <StrapiLink
            href={headerData.subscription.url}
            className="block"
            onClick={handleLinkClick}
          >
            <Button
              variant="default"
              size="lg"
              className="justify-center text-black w-full bg-primary hover:bg-primary/90"
            >
              {headerData.subscription.text}
            </Button>
          </StrapiLink>
        </div> */}
      </SheetContent>
    </Sheet>
  );
}