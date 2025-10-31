import { formatTokenAmount } from '../hooks/useContracts';
import type { CreatorStats } from '../lib/contracts';

interface StatCard {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down';
}

interface StatsCardsProps {
  marketCount?: bigint;
  creatorStats?: CreatorStats;
  isConnected: boolean;
}

export default function StatsCards({ marketCount, creatorStats, isConnected }: StatsCardsProps) {
  const statsData: StatCard[] = [
    {
      title: 'Total Markets',
      value: marketCount ? marketCount.toString() : '0',
    },
    {
      title: 'Your Markets',
      value: isConnected && creatorStats?.marketsCreated ? creatorStats.marketsCreated.toString() : '0',
    },
    {
      title: 'Total Volume',
      value: isConnected && creatorStats?.totalVolume ? `${formatTokenAmount(creatorStats.totalVolume)} BNB` : '0 BNB',
    },
    {
      title: 'Available Fees',
      value: isConnected && creatorStats?.availableFees ? `${formatTokenAmount(creatorStats.availableFees)} BNB` : '0 BNB',
    }
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          {stat.change && (
            <p className={`text-sm font-medium ${
              stat.trend === 'up' ? 'text-primary' : 'text-[#fa5c38]'
            }`}>
              {stat.change}
            </p>
          )}
        </div>
      ))}
    </section>
  );
}