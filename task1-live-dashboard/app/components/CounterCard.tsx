interface CounterCardProps {
  title: string;
  value: number;
  icon: string;
  color: 'blue' | 'green' | 'purple';
}

const colorClasses = {
  blue: {
    bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    shadow: 'shadow-blue-500/25',
  },
  green: {
    bg: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    shadow: 'shadow-emerald-500/25',
  },
  purple: {
    bg: 'bg-gradient-to-br from-purple-500 to-purple-600',
    shadow: 'shadow-purple-500/25',
  },
};

export default function CounterCard({ title, value, icon, color }: CounterCardProps) {
  const colors = colorClasses[color];

  return (
    <div
      className={`${colors.bg} ${colors.shadow} rounded-2xl p-6 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white/80">{title}</p>
          <p className="mt-2 text-4xl font-bold text-white transition-all duration-500">
            {value.toLocaleString()}
          </p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
      <div className="mt-4 flex items-center text-sm text-white/70">
        <span className="mr-1">Live</span>
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
        </span>
      </div>
    </div>
  );
}
