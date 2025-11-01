'use client';

import { useAccount } from 'wagmi';
import RecentMarketsTable from '../../components/RecentMarketsTable';

export default function MarketsPage() {
  const { address, isConnected } = useAccount();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold tracking-tight text-text-light dark:text-text-dark mb-2">
          All Markets
        </h1>
        <p className="text-text-muted-dark">
          Explore all available prediction markets and place your bets
        </p>
      </div>
      
      <RecentMarketsTable isConnected={isConnected} userAddress={address} showAllMarkets={true} />
    </div>
  );
}