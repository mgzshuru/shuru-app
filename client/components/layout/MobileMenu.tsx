import { StrapiLink } from '@/components/custom/strapi-link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useRouter } from 'next/navigation';
import { HeaderData } from '@/lib/types';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getMagazineIssuesOptimized } from '@/lib/strapi-optimized';
import { getStrapiMedia } from '@/components/custom/strapi-image';
import { useAuth } from '@/hooks/use-auth';
import { logoutAction } from '@/app/actions/auth';
import { LogOut, ChevronDown } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  headerData: HeaderData;
}

export default function MobileMenu({ isOpen, onClose, headerData }: MobileMenuProps) {
  const router = useRouter();
  const [latestIssue, setLatestIssue] = useState<any>(null);
  const { isAuthenticated, user, loading } = useAuth();
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const toggleExpanded = (itemOrder: number) => {
    setExpandedItems(prev =>
      prev.includes(itemOrder)
        ? prev.filter(o => o !== itemOrder)
        : [...prev, itemOrder]
    );
  };

  const handleLogout = async () => {
    try {
      await logoutAction();
      onClose();
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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

  const handleSubscribeClick = () => {
    router.push('/subscribe');
    onClose();
  };
  const handleLoginClick = () => {
    router.push('/auth/login');
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="space-y-1 p-3 z-[1100] w-[280px] sm:w-[320px]">
        <SheetTitle className="sr-only">
          Menu
        </SheetTitle>

        {/* Menu items */}
        <div className="border-b border-gray-200 pb-3 mb-3 pt-4">
          {headerData.navigation.primaryMenuItems && headerData.navigation.primaryMenuItems
            .filter((item) => item.onSideBar)
            .map((item) => (
            <div key={item.id || item.order}>
              {item.subItems && item.subItems.length > 0 ? (
                <>
                  <Button
                    variant="ghost"
                    size="default"
                    className="justify-center px-3 py-3 text-base font-medium text-gray-900 hover:bg-gray-100 w-full flex items-center gap-2 min-h-[48px]"
                    onClick={() => toggleExpanded(item.order)}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        expandedItems.includes(item.order) ? 'rotate-180' : ''
                      }`}
                    />
                  </Button>
                  {expandedItems.includes(item.order) && (
                    <div className="space-y-1 mt-1 mb-2 bg-gray-50 rounded-md py-2 animate-in slide-in-from-top-2 duration-200">
                      {item.subItems
                        .sort((a, b) => a.order - b.order)
                        .map((subItem, index) => (
                        <StrapiLink
                          key={index}
                          href={subItem.url}
                          isExternal={subItem.openInNewTab}
                          className="block"
                          onClick={handleLinkClick}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="justify-center px-3 py-2.5 text-sm text-gray-700 hover:bg-white hover:text-gray-900 w-full min-h-[44px]"
                          >
                            {subItem.label}
                          </Button>
                        </StrapiLink>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <StrapiLink
                  href={item.url}
                  isExternal={item.openInNewTab}
                  className="block"
                  onClick={handleLinkClick}
                >
                  <Button
                    variant="ghost"
                    size="default"
                    className="justify-center px-3 py-3 text-base font-medium text-gray-900 hover:bg-gray-100 w-full min-h-[48px]"
                  >
                    {item.label}
                  </Button>
                </StrapiLink>
              )}
            </div>
          ))}
        </div>

        {/* Authentication buttons in sheet */}
        <div className="px-2 pb-2 mb-4">
          {!loading && (
            <>
              {isAuthenticated && user ? (
                <div className="space-y-2">
                  {/* Logout Button */}
                  <Button
                    variant="outline"
                    size="default"
                    className="justify-start mb-3 text-red-600 border-red-300 w-full hover:bg-red-50 text-sm py-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {'تسجيل الخروج'}
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="default"
                  className="justify-center mb-3 text-gray-900 border-gray-300 w-full text-sm py-2"
                  onClick={handleLoginClick}
                >
                  {'تسجيل الدخول'}
                </Button>
              )}
            </>
          )}

            <Button
              variant="default"
              size="default"
              className="justify-center text-black w-full bg-primary hover:bg-primary/90 text-sm py-2"
              onClick={handleSubscribeClick}
            >
              {'اشترك الآن'}
            </Button>
        </div>

        {/* Current Issue Section */}
        {latestIssue && (
          <div className="px-2 pb-4">
            <h3 className="text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
              العدد الحالي
            </h3>
            <StrapiLink
              href="/magazine"
              className="block"
              onClick={handleLinkClick}
            >
              <div className="w-40 h-52 relative bg-gray-100 shadow-lg mx-auto hover:shadow-xl transition-shadow rounded-none overflow-hidden">
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
      </SheetContent>
    </Sheet>
  );
}