import { Award, Globe, Shield, Clock, Users, CheckCircle } from 'lucide-react';

const iconMap = {
  Award,
  Globe,
  Shield,
  Clock,
  Users,
  CheckCircle
};

// Define the type for the data prop
interface WhyData {
  header: {
    label: string;
    title: string;
    description: string;
  };
  features: {
    icon: string;
    title: string;
    description: string;
  }[];
}

export const Why = ({ data }: { data: WhyData }) => {
  return (
    <section className="relative py-32">
      <div className="absolute inset-0 bg-black bg-opacity-90"></div>
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="mb-24">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">
            {data.header.label}
          </div>
          <h2 className="text-4xl font-black text-[#CBD1F9] mb-8">{data.header.title}</h2>
          <p className="text-xl text-gray-300 max-w-2xl">
            {data.header.description}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {data.features.map((feature, index) => {
            const Icon = iconMap[feature.icon as keyof typeof iconMap];
            return (
              <div key={index}>
                <div className="w-16 h-16 border-2 border-[#CBD1F9] flex items-center justify-center mb-8">
                  <Icon className="w-8 h-8 text-[#CBD1F9]" />
                </div>
                <h3 className="text-2xl font-black text-[#CBD1F9] mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}; 