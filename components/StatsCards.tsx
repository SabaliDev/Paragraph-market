interface StatCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}

const statsData: StatCard[] = [
  {
    title: 'Total Predictions',
    value: '1,234,567',
    change: '+5.2% vs last month',
    trend: 'up'
  },
  {
    title: 'Total Volume',
    value: '$890.12k',
    change: '+12.8% vs last month',
    trend: 'up'
  },
  {
    title: 'Active Markets',
    value: '42',
    change: '-1.5% vs last month',
    trend: 'down'
  }
];

export default function StatsCards() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <div 
          key={index}
          className="flex flex-col gap-2 rounded-xl p-6 bg-surface-dark/50 dark:bg-surface-dark border border-white/10"
        >
          <p className="text-base font-medium text-text-muted-dark">
            {stat.title}
          </p>
          <p className="font-display tracking-tight text-3xl font-bold text-text-dark">
            {stat.value}
          </p>
          <p className={`text-sm font-medium ${
            stat.trend === 'up' ? 'text-primary' : 'text-[#fa5c38]'
          }`}>
            {stat.change}
          </p>
        </div>
      ))}
    </section>
  );
}