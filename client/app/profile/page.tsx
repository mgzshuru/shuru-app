import Link from "next/link";
import React from "react";
import LogOutButton from "@/components/LogOutButton";
import { verifySession } from "@/lib/dal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Settings,
  Shield,
  Mail,
  Calendar,
  Edit3,
  FileText,
  BookOpen,
  Clock,
  Star
} from "lucide-react";

export default async function Profile() {
  const {
    session: { user },
  }: any = await verifySession();

  // Generate user initials for avatar
  const userInitials = user?.username
    ? user.username
        .split(' ')
        .map((name: string) => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  // Format join date (assuming user has a createdAt field, fallback to current date)
  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">الملف الشخصي</h1>
          <p className="text-gray-600">إدارة معلوماتك الشخصية وإعداداتك</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Overview Card */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user?.avatar || ""} alt={user?.username || "مستخدم"} />
                    <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {user?.username || "مستخدم"}
                </CardTitle>
                <div className="flex justify-center mt-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    عضو نشط
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="truncate">{user?.email || "البريد الإلكتروني غير متوفر"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>انضم في {joinDate}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>آخر نشاط: اليوم</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Quick Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  إجراءات سريعة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button asChild variant="outline" className="h-auto p-4 justify-start">
                    <Link href="/auth/change-password">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Shield className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="text-right">
                          <div className="font-medium">تغيير كلمة المرور</div>
                          <div className="text-sm text-gray-500">تحديث كلمة المرور الخاصة بك</div>
                        </div>
                      </div>
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="h-auto p-4 justify-start">
                    <Link href="/submit">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                          <Edit3 className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="text-right">
                          <div className="font-medium">اكتب معنا</div>
                          <div className="text-sm text-gray-500">شارك مقالاً أو فكرة</div>
                        </div>
                      </div>
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="h-auto p-4 justify-start">
                    <Link href="/subscribe">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 rounded-lg">
                          <Star className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="text-right">
                          <div className="font-medium">اشترك الآن</div>
                          <div className="text-sm text-gray-500">احصل على محتوى حصري</div>
                        </div>
                      </div>
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="h-auto p-4 justify-start">
                    <Link href="/magazine">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-50 rounded-lg">
                          <BookOpen className="h-5 w-5 text-orange-600" />
                        </div>
                        <div className="text-right">
                          <div className="font-medium">المجلة</div>
                          <div className="text-sm text-gray-500">تصفح الأعداد السابقة</div>
                        </div>
                      </div>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Information Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  معلومات الحساب
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div>
                      <label className="text-sm font-medium text-gray-700">اسم المستخدم</label>
                      <p className="text-gray-900">{user?.username || "غير محدد"}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div>
                      <label className="text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                      <p className="text-gray-900">{user?.email || "غير محدد"}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex justify-between items-center py-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">حالة الحساب</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          نشط
                        </Badge>
                        <Badge variant="outline" className="text-blue-600 border-blue-600">
                          مُتحقق
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>


            {/* Logout Section */}
            <Card>
              <CardContent className="pt-6">
                <Separator className="mb-6" />
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900">تسجيل الخروج</h3>
                    <p className="text-sm text-gray-600">إنهاء الجلسة الحالية والعودة إلى الصفحة الرئيسية</p>
                  </div>
                  <LogOutButton />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}