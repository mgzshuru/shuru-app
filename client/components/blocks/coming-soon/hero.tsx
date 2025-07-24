'use client';

import { ArrowRight } from 'lucide-react';

// Define the type for the data prop
interface HeroData {
  title: string;
  subtitle: string;
  description: string;
  stats: { label: string; value: string }[];
  cta: { text: string; target: string };
}

export const Hero = ({ data }: { data: HeroData }) => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-[#231f20] bg-opacity-95"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#CBD1F9]/10 to-transparent"></div>
      <div className="absolute inset-0">
        <div className="absolute inset-0"></div>
      </div>
      <div className="relative w-full max-w-7xl mx-auto px-6 py-16">
        <div className="max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-[0.9] tracking-tight animate-fade-in">
            {data.title}
          </h1>

          <div className="mb-8 space-y-4">
            <p className="text-2xl md:text-3xl text-[#CBD1F9] font-light mb-4 leading-tight animate-slide-up">
              {data.subtitle}
            </p>
            <p className="text-lg text-gray-300 max-w-2xl leading-relaxed animate-slide-up delay-100">
              {data.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-8 sm:space-x-reverse mb-8 animate-slide-up delay-200">
            {data.stats.map((stat, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/10">
                <div className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-2">
                  {stat.label}
                </div>
                <div className="text-2xl font-black text-[#CBD1F9]">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-600 pt-6 animate-slide-up delay-300">
            <button
              onClick={() => {
                document.getElementById(data.cta.target)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group bg-[#CBD1F9] text-black px-8 py-4 font-heading text-sm tracking-normal hover:bg-opacity-90 transition-all relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center space-x-4 space-x-reverse">
                <span>{data.cta.text}</span>
                <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};