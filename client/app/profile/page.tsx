export const dynamic = 'force-dynamic';

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
  Star,
  Bookmark
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
    <div className="min-h-screen bg-white" dir="rtl">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">الملف الشخصي</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">إدارة معلوماتك الشخصية وإعداداتك</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Profile Overview Card */}
          <div className="lg:col-span-1">
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-6">
                  <Avatar className="h-28 w-28 border-4 border-gray-100">
                    <AvatarImage src={user?.avatar || ""} alt={user?.username || "مستخدم"} />
                    <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 truncate max-w-full mb-3" title={user?.username || "مستخدم"}>
                  {user?.username || "مستخدم"}
                </CardTitle>
                <div className="flex justify-center">
                  <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1">
                    <User className="h-4 w-4" />
                    عضو نشط
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <span className="truncate flex-1" title={user?.email || "البريد الإلكتروني غير متوفر"}>
                      {user?.email || "البريد الإلكتروني غير متوفر"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <span>انضم في {joinDate}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                    <Clock className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <span>آخر نشاط: اليوم</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions Card */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Settings className="h-6 w-6 text-blue-600" />
                  </div>
                  إجراءات سريعة
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <Button asChild variant="outline" className="group h-auto p-0 border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 overflow-hidden">
                    <Link href="/auth/change-password">
                      <div className="flex items-center gap-4 text-right p-6 w-full">
                        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex-shrink-0 group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300">
                          <Shield className="h-7 w-7 text-blue-600" />
                        </div>
                        <div className="text-right flex-1 min-w-0">
                          <div className="font-bold text-gray-900 text-lg mb-1">تغيير كلمة المرور</div>
                          <div className="text-sm text-gray-500 leading-relaxed">تحديث كلمة المرور الخاصة بك</div>
                        </div>
                      </div>
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="group h-auto p-0 border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-300 overflow-hidden">
                    <Link href="/submit">
                      <div className="flex items-center gap-4 text-right p-6 w-full">
                        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl flex-shrink-0 group-hover:from-green-100 group-hover:to-green-200 transition-all duration-300">
                          <Edit3 className="h-7 w-7 text-green-600" />
                        </div>
                        <div className="text-right flex-1 min-w-0">
                          <div className="font-bold text-gray-900 text-lg mb-1">اكتب معنا</div>
                          {/* <div className="text-sm text-gray-500 leading-relaxed">شارك أفكارك ومقالاتك</div> */}
                        </div>
                      </div>
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="group h-auto p-0 border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-300 overflow-hidden">
                    <Link href="/profile/saved-articles">
                      <div className="flex items-center gap-4 text-right p-6 w-full">
                        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl flex-shrink-0 group-hover:from-purple-100 group-hover:to-purple-200 transition-all duration-300">
                          <Bookmark className="h-7 w-7 text-purple-600" />
                        </div>
                        <div className="text-right flex-1 min-w-0">
                          <div className="font-bold text-gray-900 text-lg mb-1">المقالات المحفوظة</div>
                          <div className="text-sm text-gray-500 leading-relaxed">المقالات التي قمت بحفظها</div>
                        </div>
                      </div>
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="group h-auto p-0 border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300 overflow-hidden">
                    <Link href="/magazine">
                      <div className="flex items-center gap-4 text-right p-6 w-full">
                        <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl flex-shrink-0 group-hover:from-indigo-100 group-hover:to-indigo-200 transition-all duration-300">
                          <BookOpen className="h-7 w-7 text-indigo-600" />
                        </div>
                        <div className="text-right flex-1 min-w-0">
                          <div className="font-bold text-gray-900 text-lg mb-1">المجلة</div>
                          <div className="text-sm text-gray-500 leading-relaxed">تصفح الأعداد السابقة</div>
                        </div>
                      </div>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Information Card */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  معلومات الحساب
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-6">
                  <div className="py-4 border-b border-gray-100">
                    <div className="min-w-0 flex-1">
                      <label className="text-sm font-semibold text-gray-700 block mb-2">اسم المستخدم</label>
                      <p className="text-gray-900 text-lg truncate" title={user?.username || "غير محدد"}>{user?.username || "غير محدد"}</p>
                    </div>
                  </div>

                  <div className="py-4 border-b border-gray-100">
                    <div className="min-w-0 flex-1">
                      <label className="text-sm font-semibold text-gray-700 block mb-2">البريد الإلكتروني</label>
                      <p className="text-gray-900 text-lg truncate" title={user?.email || "غير محدد"}>{user?.email || "غير محدد"}</p>
                    </div>
                  </div>

                  <div className="py-4">
                    <label className="text-sm font-semibold text-gray-700 block mb-3">حالة الحساب</label>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 px-3 py-1">
                        ✓ نشط
                      </Badge>
                      <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 px-3 py-1">
                        ✓ مُتحقق
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>


            {/* Logout Section */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardContent className="pt-6">
                <Separator className="mb-6" />
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">تسجيل الخروج</h3>
                    <p className="text-gray-600">إنهاء الجلسة الحالية والعودة إلى الصفحة الرئيسية</p>
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