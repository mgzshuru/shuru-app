// Define the type for the data prop
interface FeaturesGridData {
  mainFeature: {
    label: string;
    title: string;
    description: string;
    features: { title: string; description: string }[];
  };
  stats: {
    label: string;
    items: { value: string; label: string }[];
  };
  specialties: {
    label: string;
    items: string[];
  };
}

export const FeaturesGrid = ({ data }: { data: FeaturesGridData }) => {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
          
          {/* Main Feature */}
          <div className="lg:col-span-2 border-b border-gray-200 pb-16 lg:border-b-0 lg:pb-0 lg:border-l lg:border-gray-200 lg:pl-24">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-8">
              {data.mainFeature.label}
            </div>
            <h2 className="text-5xl font-black text-gray-900 mb-12 leading-tight">
              {data.mainFeature.title}
            </h2>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              {data.mainFeature.description}
            </p>
            <div className="space-y-8">
              {data.mainFeature.features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-6 space-x-reverse">
                  <div className="w-3 h-16 bg-[#808080] flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-16">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-8">
                {data.stats.label}
              </div>
              <div className="space-y-8">
                {data.stats.items.map((stat, index) => (
                  <div key={index}>
                    <div className="text-4xl font-black text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-12">
              <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-8">
                {data.specialties.label}
              </div>
              <div className="space-y-4 text-gray-600">
                {data.specialties.items.map((specialty, index) => (
                  <div key={index} className="text-lg">• {specialty}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 