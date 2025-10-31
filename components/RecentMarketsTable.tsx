'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Market } from '../types/embed';
import { usePredictionMarketRead, formatTokenAmount, calculateOddsPercentage } from '../hooks/useContracts';
import { bigIntToNumber, bigIntToString } from '../lib/utils';
import type { Market as ContractMarket } from '../lib/contracts';
import Link from 'next/link';

interface MarketRow {
  id: string;
  title: string;
  status: 'active' | 'resolved';
  predictions: number;
  volume: string;
}

const marketsData: Market[] = [
  {
    id: '1',
    question: 'Will ETH reach $4k by end of Q3?',
    category: 'Crypto',
    description: 'Ethereum price prediction for Q3 2024',
    optionA: 'Yes',
    optionB: 'No',
    optionAOdds: 6500,
    optionBOdds: 3500,
    totalPredictions: 12450,
    totalVolume: '$150.2k',
    endTime: '2024-09-30T23:59:59Z',
    resolutionTime: '2024-10-01T23:59:59Z',
    status: 'active',
    creator: '0x1234...5678',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    question: 'AI model "Genesis" to be released in 2024?',
    category: 'Technology',
    description: 'Prediction about the Genesis AI model release timeline',
    optionA: 'Yes, in 2024',
    optionB: 'No, delayed',
    optionAOdds: 4200,
    optionBOdds: 5800,
    totalPredictions: 8932,
    totalVolume: '$95.8k',
    endTime: '2024-12-31T23:59:59Z',
    resolutionTime: '2025-01-07T23:59:59Z',
    status: 'active',
    creator: '0x1234...5678',
    createdAt: '2024-02-01T14:30:00Z'
  },
  {
    id: '3',
    question: 'Next US President Election Winner',
    category: 'Politics',
    description: 'Prediction for the 2024 US Presidential Election',
    optionA: 'Democratic Candidate',
    optionB: 'Republican Candidate',
    optionAOdds: 5100,
    optionBOdds: 4900,
    totalPredictions: 256789,
    totalVolume: '$1.2M',
    endTime: '2024-11-05T23:59:59Z',
    resolutionTime: '2024-11-12T23:59:59Z',
    status: 'resolved',
    creator: '0x1234...5678',
    createdAt: '2024-01-01T12:00:00Z'
  },
  {
    id: '4',
    question: 'Global temperature rise above 1.5°C in 2025?',
    category: 'Science',
    description: 'Climate change prediction for 2025',
    optionA: 'Yes, above 1.5°C',
    optionB: 'No, below 1.5°C',
    optionAOdds: 7200,
    optionBOdds: 2800,
    totalPredictions: 42101,
    totalVolume: '$431.5k',
    endTime: '2025-01-01T00:00:00Z',
    resolutionTime: '2025-01-07T00:00:00Z',
    status: 'resolved',
    creator: '0x1234...5678',
    createdAt: '2024-01-10T09:00:00Z'
  }
];

function StatusBadge({ status }: { status: 'active' | 'resolved' }) {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  
  if (status === 'active') {
    return (
      <span className={`${baseClasses} bg-primary/20 text-primary`}>
        Active
      </span>
    );
  }
  
  return (
    <span className={`${baseClasses} bg-gray-500/20 text-gray-400`}>
      Resolved
    </span>
  );
}

interface RecentMarketsTableProps {
  isConnected: boolean;
  userAddress?: string;
}

export default function RecentMarketsTable({ isConnected, userAddress }: RecentMarketsTableProps) {
  const router = useRouter();
  const [markets, setMarkets] = useState<Market[]>([]);
  const { marketCount, getCreatorMarkets, getMarketInfo } = usePredictionMarketRead();
  
  // Get user's markets if connected
  const userMarketsQuery = getCreatorMarkets(userAddress || '');
  
  // Get market info for market ID 0 (first market) if there are markets
  const firstMarketQuery = getMarketInfo(0);
  
  useEffect(() => {
    console.log('=== MARKETS UPDATE DEBUG ===');
    console.log('isConnected:', isConnected);
    console.log('marketCount:', marketCount);
    console.log('firstMarketQuery.data:', firstMarketQuery.data);
    console.log('firstMarketQuery loading state:', firstMarketQuery.isLoading);
    console.log('firstMarketQuery error:', firstMarketQuery.error);
    
    if (!isConnected) {
      // Show mock data when not connected
      console.log('Not connected - using mock data');
      setMarkets(marketsData);
    } else {
      // Show real markets from contract
      const contractMarkets: Market[] = [];
      
      // If we have market data from the contract, convert it to our Market format
      console.log('Checking market data conditions:');
      console.log('- firstMarketQuery.data exists:', !!firstMarketQuery.data);
      console.log('- marketCount exists:', !!marketCount);
      console.log('- marketCount > 0:', marketCount && marketCount > 0n);
      
      if (firstMarketQuery.data && marketCount && marketCount > 0n) {
        console.log('✅ All conditions met - processing market data');
        try {
          const marketData = firstMarketQuery.data as any;
          console.log('Raw market data:', marketData);
          
          // Access the tuple fields by index or destructure
          const [
            creator,
            question,
            category,
            endTime,
            resolutionTime,
            outcome,
            optionA,
            optionB,
            totalOptionABets,
            totalOptionBBets,
            resolved,
            creatorFeesCollected,
            platformFeesCollected
          ] = marketData;
          
          // Safely convert all values to avoid BigInt serialization issues
          const optionABets = bigIntToNumber(totalOptionABets);
          const optionBBets = bigIntToNumber(totalOptionBBets);
          const endTimeSeconds = bigIntToNumber(endTime);
          const resolutionTimeSeconds = bigIntToNumber(resolutionTime);
          
          const totalPredictions = optionABets + optionBBets;
          const totalVolumeWei = BigInt(optionABets) + BigInt(optionBBets);
          
          const market: Market = {
            id: '0',
            question: question || 'Loading...',
            category: category || 'General',
            description: '',
            optionA: optionA || 'Yes',
            optionB: optionB || 'No',
            optionAOdds: 5000, // Default 50/50 - will calculate real odds later
            optionBOdds: 5000,
            totalPredictions: totalPredictions,
            totalVolume: `${formatTokenAmount(totalVolumeWei)} BNB`,
            endTime: endTimeSeconds > 0 ? new Date(endTimeSeconds * 1000).toISOString() : new Date().toISOString(),
            resolutionTime: resolutionTimeSeconds > 0 ? new Date(resolutionTimeSeconds * 1000).toISOString() : new Date().toISOString(),
            status: resolved ? 'resolved' : 'active',
            creator: creator || '0x0000000000000000000000000000000000000000',
            createdAt: new Date().toISOString()
          };
          
          contractMarkets.push(market);
          console.log('✅ Successfully created market object:', market);
        } catch (error) {
          console.error('❌ Error processing market data:', error);
          // Don't add the market if there's an error processing it
        }
      } else {
        console.log('❌ Market data conditions not met - no market will be displayed');
      }
      
      console.log('Setting contractMarkets (length):', contractMarkets.length);
      console.log('contractMarkets:', contractMarkets);
      setMarkets(contractMarkets);
    }
    console.log('=== END MARKETS UPDATE ===');
  }, [isConnected, userMarketsQuery.data, firstMarketQuery.data, marketCount]);

  const handleShare = (market: Market) => {
    console.log('🚀 Navigating to embeds page with market:', market.id);
    
    // Navigate to embeds page with market ID as parameter
    router.push(`/embeds/${market.id}`);

  };

  return (
    <section>
      <h2 className="font-display text-2xl font-bold tracking-tight text-text-light dark:text-text-dark px-1 pb-4 pt-2">
        Recent Markets
      </h2>
      <div className="rounded-xl border border-white/10 overflow-hidden bg-surface-dark/50 dark:bg-surface-dark">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase text-text-muted-dark border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-medium" scope="col">
                  Market Title
                </th>
                <th className="px-6 py-4 font-medium" scope="col">
                  Status
                </th>
                <th className="px-6 py-4 font-medium text-right" scope="col">
                  Total Predictions
                </th>
                <th className="px-6 py-4 font-medium text-right" scope="col">
                  Volume
                </th>
                <th className="px-6 py-4 font-medium text-center" scope="col">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {markets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <span className="material-symbols-outlined text-text-muted-dark text-4xl">
                        {isConnected ? 'trending_up' : 'account_balance_wallet'}
                      </span>
                      <div>
                        <p className="text-text-dark font-medium">
                          {isConnected ? 'No markets created yet' : 'Connect wallet to view your markets'}
                        </p>
                        <p className="text-text-muted-dark text-sm">
                          {isConnected ? 'Create your first prediction market to get started' : 'Connect your wallet to see your created markets'}
                        </p>
                      </div>
                      {isConnected && (
                        <a 
                          href="/create-market"
                          className="mt-2 flex items-center gap-2 px-4 py-2 bg-primary text-background-dark text-sm font-bold rounded-lg hover:brightness-110 transition-all"
                        >
                          <span className="material-symbols-outlined text-sm">add</span>
                          Create Market
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                markets.map((market, index) => (
                  <tr 
                    key={market.id}
                    className={`${
                      index < markets.length - 1 ? 'border-b border-white/10' : ''
                    } hover:bg-white/5`}
                  >
                    <th 
                      className="px-6 py-4 font-medium whitespace-nowrap text-text-dark" 
                      scope="row"
                    >
                      {market.question}
                    </th>
                    <td className="px-6 py-4">
                      <StatusBadge status={market.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {market.totalPredictions.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {market.totalVolume}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <Link href={`/market/${market.id}`}>
                          <button className="font-medium text-secondary hover:underline transition-colors">
                            View
                          </button>
                        </Link>
                        
                        <Link href={`/embeds/${market.id}`}>
                          <button 
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-red-600 transition-all z-10 relative cursor-pointer"
                            title="Share this market with your audience - Key Platform Feature!"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-base">share</span>
                            Share Market
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </section>
  );
}