import { StrapiLink } from '@/components/custom/strapi-link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useRouter } from 'next/navigation';
import { HeaderData } from '@/lib/types';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getMagazineIssuesOptimized } from '@/lib/strapi-optimized';
import { getStrapiMedia } from '@/components/custom/strapi-image';
import Link from 'next/dist/client/link';
import { useAuth } from '@/hooks/use-auth';
import { logoutAction } from '@/app/actions/auth';
import { User, Settings, LogOut } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  headerData: HeaderData;
}

export default function MobileMenu({ isOpen, onClose, headerData }: MobileMenuProps) {
  const router = useRouter();
  const [latestIssue, setLatestIssue] = useState<any>(null);
  const { isAuthenticated, user, loading } = useAuth();

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

        {/* Authentication buttons in sheet */}
        <div className="px-4 pb-2 mb-20">
          {!loading && (
            <>
              {isAuthenticated && user ? (
                <div className="space-y-2">
                  {/* User Info */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
                    <User className="h-8 w-8 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">{user.username}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>

                  {/* Profile Button */}
                  <Button
                    variant="outline"
                    size="default"
                    className="justify-start mb-2 text-gray-900 border-gray-300 w-full"
                    onClick={() => {
                      router.push('/profile');
                      onClose();
                    }}
                  >
                    <User className="h-4 w-4 mr-2" />
                    {'الملف الشخصي'}
                  </Button>

                  {/* Settings Button */}
                  <Button
                    variant="outline"
                    size="default"
                    className="justify-start mb-2 text-gray-900 border-gray-300 w-full"
                    onClick={() => {
                      router.push('/auth/change-password');
                      onClose();
                    }}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {'الإعدادات'}
                  </Button>

                  {/* Logout Button */}
                  <Button
                    variant="outline"
                    size="default"
                    className="justify-start mb-4 text-red-600 border-red-300 w-full hover:bg-red-50"
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
                  className="justify-center mb-4 text-gray-900 border-gray-300 w-full"
                  onClick={handleLoginClick}
                >
                  {'تسجيل الدخول'}
                </Button>
              )}
            </>
          )}

          <Button
            variant="default"
            size="lg"
            className="justify-center text-black w-full bg-primary hover:bg-primary/90"
            onClick={handleSubscribeClick}
          >
            {'اشترك الآن'}
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
      </SheetContent>
    </Sheet>
  );
}