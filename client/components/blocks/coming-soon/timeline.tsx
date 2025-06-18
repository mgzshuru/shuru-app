// Define the type for the data prop
interface TimelineData {
  header: {
    label: string;
    title: string;
    description: string;
  };
  phases: {
    phase: string;
    title: string;
    description: string;
    isCurrent?: boolean;
  }[];
}

export const Timeline = ({ data }: { data: TimelineData }) => {
  return (
    <section className="py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-24">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-6">
            {data.header.label}
          </div>
          <h2 className="text-4xl font-black text-gray-900 mb-8">{data.header.title}</h2>
          <p className="text-xl text-gray-600 max-w-2xl">
            {data.header.description}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {data.phases.map((phase, index) => (
            <div key={index} className="bg-white p-10 border-l-4 border-[#808080] relative">
              {phase.isCurrent && (
                <div className="absolute -top-4 right-6 bg-[#EF5B24] text-white px-4 py-2 text-sm font-heading tracking-normal">
                  المرحلة الحالية
                </div>
              )}
              <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 mb-6">
                المرحلة {phase.phase}
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-6">{phase.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {phase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 