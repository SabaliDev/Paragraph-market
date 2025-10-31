'use client';

import { useAccount } from 'wagmi';
import Sidebar from '../../components/Sidebar';
import StatsCards from '../../components/StatsCards';
import RecentMarketsTable from '../../components/RecentMarketsTable';
import ConnectWallet from '../../components/ConnectWallet';
import { usePredictionMarketRead } from '../../hooks/useContracts';

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const { marketCount, getCreatorStats } = usePredictionMarketRead();
  
  // Get creator stats if connected
  const creatorStatsQuery = getCreatorStats(address || '');
  
  return (
    <div className="relative flex min-h-screen w-full">
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
              <div className="flex flex-col gap-1">
                <h1 className="font-display text-4xl font-bold tracking-tighter text-text-light dark:text-text-dark">
                  Dashboard
                </h1>
                <p className="text-base font-normal text-text-light/70 dark:text-text-dark/70">
                  {isConnected ? `Welcome back, ${address?.slice(0, 6)}...${address?.slice(-4)}!` : 'Welcome back, Developer!'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <ConnectWallet />
                <a 
                  href="/create-market"
                  className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-secondary text-background-dark text-sm font-bold shadow-lg shadow-secondary/20 hover:brightness-110 transition-all"
                >
                  <span className="material-symbols-outlined">add</span>
                  <span className="truncate">Create Market</span>
                </a>
              </div>
            </header>

            {/* Connection Status */}
            {!isConnected && (
              <div className="mb-8 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-yellow-500">warning</span>
                  <div>
                    <p className="text-text-dark font-medium">Wallet not connected</p>
                    <p className="text-text-muted-dark text-sm">Connect your wallet to view your markets and stats</p>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <StatsCards 
              marketCount={marketCount} 
              creatorStats={creatorStatsQuery.data}
              isConnected={isConnected}
            />

            {/* Recent Markets Table */}
            <RecentMarketsTable 
              isConnected={isConnected}
              userAddress={address}
            />
          </div>
        </div>
      </main>
    </div>
  );
}