"use client"

import Link from "next/link"
import Image from "next/image"
import type { MagazineArchive } from "./types-magazine"

// Define the current magazine data
const currentMagazine = {
  id: "current-issue-2024",
  title: "العدد الحالي",
  issue: "العدد 16",
  season: "صيف 2024",
  coverImage: "/maCover.jpg",
}

// Magazine archive data
const magazineArchiveData: MagazineArchive[] = [
  {
    id: "ai-revolution-spring-2024",
    title: "ثورة الذكاء الاصطناعي",
    season: "ربيع 2024",
    image: "/Magacover.webp",
    colorBar: "bg-blue-500",
  },
  {
    id: "future-work-winter-2023",
    title: "مستقبل العمل",
    season: "شتاء 2023",
    image: "/magazine-covers/future-work.jpg",
    colorBar: "bg-purple-500",
  },
  {
    id: "climate-tech-fall-2023",
    title: "حلول تكنولوجيا المناخ",
    season: "خريف 2023",
    image: "/magazine-covers/climate-tech.jpg",
    colorBar: "bg-emerald-500",
  },
  {
    id: "startup-nation-summer-2023",
    title: "أمة الشركات الناشئة",
    season: "صيف 2023",
    image: "/magazine-covers/startup-nation.jpg",
    colorBar: "bg-yellow-500",
  },
]

export function MagazinePageContent() {
  return (
    <div className="bg-white min-h-screen">
      {/* Magazine Title */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="font-bold text-[28px] sm:text-[32px] md:text-[36px] uppercase leading-tight tracking-[4px] sm:tracking-[6px] text-black text-center mb-2">
          مجلة فاست كومباني
        </h1>
        <p className="text-gray-400 text-sm tracking-[2px] uppercase text-center">
          {currentMagazine.issue}، {currentMagazine.season}
        </p>
      </div>
      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left - Current Issue Cover */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-[320px] md:max-w-[360px]">
              <Link href={`/magazine/${currentMagazine.id}`} className="group block">
                <Image
                  src={currentMagazine.coverImage || "/placeholder.svg"}
                  alt={`غلاف مجلة فاست كومباني - ${currentMagazine.title}`}
                  width={360}
                  height={480}
                  className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-300"
                />
              </Link>
            </div>
          </div>

          {/* Right - Subscription Section */}
          <div className="flex justify-center lg:justify-start items-center">
            <div className="relative w-full max-w-[400px] h-[280px] md:h-[320px]">
              {/* Background gradient shape */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-green-400 to-blue-400 transform -skew-x-12 rounded-lg"></div>

              {/* Simplified Decorative Elements */}
              <div className="absolute top-6 right-8 w-12 h-12 bg-green-500 rounded-full opacity-80"></div>
              <div className="absolute bottom-6 left-6 w-8 h-8 bg-green-500 rounded-full opacity-60"></div>
              <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-green-700 rounded-full"></div>

              {/* Plus Icon */}
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">+</span>
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
                <h2 className="font-bold text-black text-[28px] md:text-[32px] mb-3 tracking-wide">اشترك</h2>
                <p className="font-bold text-black text-[15px] md:text-[16px] tracking-[1px] uppercase">في المجلة!</p>
                <button className="mt-6 bg-black text-white px-6 py-2 rounded-none font-medium text-sm hover:bg-gray-800 transition-colors uppercase tracking-wide">
                  اشترك الآن
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Separator Line */}

      <div className="border-t-2 border-black w-1/2 mx-auto"></div>

      {/* Magazine Archives Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="font-bold text-[28px] sm:text-[32px] md:text-[36px] uppercase leading-tight tracking-[4px] sm:tracking-[6px] text-black text-center mb-4">
          أرشيف مجلة فاست كومباني
        </h2>
        <p className="text-gray-400 text-sm tracking-[2px] uppercase text-center mb-12">
          تصفح أعداد المجلة السابقة
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {magazineArchiveData.map((magazine) => (
            <Link key={magazine.id} href={`/magazine/${magazine.id}`} className="group">
              <div className="text-center">
                {/* Updated image container to match current issue proportions */}
                <div className="w-full aspect-[3/4] mb-4"> {/* 3:4 aspect ratio */}
                  <Image
                    src={magazine.image || "/placeholder.svg"}
                    alt={magazine.title}
                    width={360}
                    height={480}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>
                <h3 className="font-bold text-black text-[16px] md:text-[18px] leading-tight mb-2 uppercase tracking-wide">
                  {magazine.title}
                </h3>
                <div className="text-gray-500 text-sm">
                  <span>{magazine.season}</span>
                  <span className="mx-2 text-orange-500">|</span>
                  <span className="text-orange-500 font-medium">العدد الكامل</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {/* Show More Button */}
      <div className="text-center">
        <button className="bg-orange-500 text-white px-8 py-3 rounded-none font-medium text-sm hover:bg-orange-600 transition-colors uppercase tracking-wide">
          عرض المزيد
        </button>
      </div>
    </div>
  )
}
