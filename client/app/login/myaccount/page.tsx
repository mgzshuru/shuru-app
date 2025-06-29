'use client'
import React, { useState } from 'react';
import { 
  User, Mail, Edit, Save, X, Heart, Bookmark, 
  Share, Calendar, Facebook, Apple, CheckCircle
} from 'lucide-react';

const ProfileDashboard = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: 'يوسف',
    lastName: 'حمدي',
    email: 'yh6940717@gmail.com',
    jobRole: 'مطور برمجيات',
    country: 'مصر',
    newsletter: true
  });

  const [editProfile, setEditProfile] = useState({ ...profile });

  const tabs = [
    { id: 'Profile', name: 'الملف الشخصي' },
    { id: 'SavedArticles', name: 'المقالات المحفوظة' }
  ];

  const savedArticles = [
    {
      id: 1,
      title: 'مستقبل الذكاء الاصطناعي في ريادة الأعمال',
      category: 'التكنولوجيا',
      date: '2024-01-15',
      readTime: '5 دقائق',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400',
      excerpt: 'كيف يغير الذكاء الاصطناعي طريقة عمل الشركات الناشئة وما هي التحديات والفرص المتاحة في هذا المجال الواعد...',
      isLiked: true,
      isSaved: true
    },
    {
      id: 2,
      title: 'استراتيجيات النمو للشركات الناشئة في 2024',
      category: 'الأعمال',
      date: '2024-01-10',
      readTime: '8 دقائق',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
      excerpt: 'أهم الاستراتيجيات التي تحتاجها الشركات الناشئة للنمو والتوسع في السوق المحلي والعالمي خلال العام الجاري...',
      isLiked: false,
      isSaved: true
    },
    {
      id: 3,
      title: 'قصص نجاح رواد الأعمال العرب',
      category: 'الإلهام',
      date: '2024-01-08',
      readTime: '12 دقيقة',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400',
      excerpt: 'تعرف على قصص ملهمة من رواد الأعمال العرب الناجحين وكيف تغلبوا على التحديات لبناء إمبراطوريات تجارية...',
      isLiked: true,
      isSaved: true
    }
  ];

  const handleSaveProfile = () => {
    setProfile({ ...editProfile });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditProfile({ ...profile });
    setIsEditing(false);
  };

interface Profile {
    firstName: string;
    lastName: string;
    email: string;
    jobRole: string;
    country: string;
    newsletter: boolean;
}

interface Tab {
    id: string;
    name: string;
}

interface Article {
    id: number;
    title: string;
    category: string;
    date: string;
    readTime: string;
    image: string;
    excerpt: string;
    isLiked: boolean;
    isSaved: boolean;
}

const toggleArticleLike = (articleId: number): void => {
    console.log(`Toggle like for article ${articleId}`);
};

  const removeFromSaved = (articleId: number) => {
    console.log(`Remove article ${articleId} from saved`);
  };

  const renderProfileContent = () => (
    <div className="space-y-8">
      {/* Profile Information */}
      <div className="bg-white border border-gray-300 p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="w-16 h-16 bg-black flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-black">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-gray-600">{profile.jobRole}</p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors border border-gray-300"
          >
            <Edit className="w-4 h-4" />
            <span>{isEditing ? 'إلغاء' : 'تعديل'}</span>
          </button>
        </div>

        {/* Profile Form */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">الاسم الأول</label>
              <input
                type="text"
                value={isEditing ? editProfile.firstName : profile.firstName}
                onChange={(e) => setEditProfile({ ...editProfile, firstName: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">اسم العائلة</label>
              <input
                type="text"
                value={isEditing ? editProfile.lastName : profile.lastName}
                onChange={(e) => setEditProfile({ ...editProfile, lastName: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                value={isEditing ? editProfile.email : profile.email}
                onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">المسمى الوظيفي</label>
              <input
                type="text"
                value={isEditing ? editProfile.jobRole : profile.jobRole}
                onChange={(e) => setEditProfile({ ...editProfile, jobRole: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-black mb-2">البلد</label>
              <input
                type="text"
                value={isEditing ? editProfile.country : profile.country}
                onChange={(e) => setEditProfile({ ...editProfile, country: e.target.value })}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-black disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="newsletter"
                checked={isEditing ? editProfile.newsletter : profile.newsletter}
                onChange={(e) => setEditProfile({ ...editProfile, newsletter: e.target.checked })}
                disabled={!isEditing}
                className="w-4 h-4 text-black border-gray-300 focus:ring-black focus:ring-2"
              />
              <label htmlFor="newsletter" className="text-sm text-black">
                اشتراك في النشرة الإخبارية اليومية
              </label>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleSaveProfile}
              className="flex items-center space-x-2 px-6 py-3 bg-black hover:bg-gray-800 text-white transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>حفظ التغييرات</span>
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white transition-colors"
            >
              <X className="w-4 h-4" />
              <span>إلغاء</span>
            </button>
          </div>
        )}
      </div>

      {/* Password Section */}
      <div className="bg-white border border-gray-300 p-8">
        <h3 className="text-xl font-bold text-black mb-6">كلمة المرور</h3>
        <button className="text-blue-600 hover:text-blue-800 underline font-medium">
          انقر هنا لإضافة كلمة مرور
        </button>
      </div>

      {/* Social Accounts */}
      <div className="bg-white border border-gray-300 p-8">
        <h3 className="text-xl font-bold text-black mb-6">الحسابات الاجتماعية</h3>
        <div className="space-y-4">
          {[
            { name: 'Apple', icon: <Apple className="w-5 h-5" />, connected: false },
            { name: 'Facebook', icon: <Facebook className="w-5 h-5 text-blue-600" />, connected: false },
            { name: 'Google', icon: <div className="w-5 h-5"><svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg></div>, connected: true }
          ].map((account) => (
            <div key={account.name} className="flex items-center justify-between p-4 border border-gray-300">
              <div className="flex items-center space-x-3">
                {account.icon}
                <span className="font-medium text-black">{account.name}</span>
              </div>
              {account.connected ? (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">متصل</span>
                </div>
              ) : (
                <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm transition-colors">
                  ربط الحساب
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSavedArticles = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-black mb-4 md:mb-0">المقالات المحفوظة</h2>
      </div>

      <div className="space-y-6">
        {savedArticles.map((article) => (
          <div key={article.id} className="bg-white border border-gray-300 overflow-hidden hover:border-black transition-colors">
            <div className="md:flex">
              <div className="md:w-1/3">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-48 md:h-full object-cover"
                />
              </div>
              <div className="md:w-2/3 p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-gray-100 text-black text-xs font-semibold uppercase">
                    {article.category}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleArticleLike(article.id)}
                      className={`p-2 border border-gray-300 transition-colors ${
                        article.isLiked 
                          ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                          : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${article.isLiked ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => removeFromSaved(article.id)}
                      className="p-2 bg-white text-gray-600 hover:bg-red-50 hover:text-red-600 border border-gray-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-white text-gray-600 hover:bg-gray-50 border border-gray-300 transition-colors">
                      <Share className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-black mb-3 line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                  <button className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors text-sm uppercase">
                    قراءة المقال
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-black">حسابي</h1>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-black flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-black font-medium">{profile.firstName}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs Navigation */}
        <div className="bg-white border border-gray-300 mb-8 overflow-hidden">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${
                  activeTab === tab.id
                    ? 'border-black text-black bg-gray-50'
                    : 'border-transparent text-gray-500 hover:text-black hover:bg-gray-50'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="transition-all duration-300">
          {activeTab === 'Profile' && renderProfileContent()}
          {activeTab === 'SavedArticles' && renderSavedArticles()}
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;