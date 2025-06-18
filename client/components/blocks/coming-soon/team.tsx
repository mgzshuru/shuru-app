import { Users, BookOpen, TrendingUp } from 'lucide-react';

const iconMap = {
  Users,
  BookOpen,
  TrendingUp
};

// Define the type for the data prop
interface TeamData {
  header: {
    label: string;
    title: string;
    description: string;
  };
  teams: {
    icon: string;
    title: string;
    description: string;
  }[];
}

export const Team = ({ data }: { data: TeamData }) => {
  return (
    <section className="py-32 bg-[#D3D3D3]">
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {data.teams.map((team, index) => {
            const Icon = iconMap[team.icon as keyof typeof iconMap];
            return (
              <div key={index} className="bg-white p-10">
                <div className="w-16 h-16 bg-[#808080] flex items-center justify-center mb-8">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-6">{team.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {team.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}; 