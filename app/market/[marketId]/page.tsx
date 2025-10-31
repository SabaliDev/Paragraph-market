'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { usePredictionMarketRead, usePredictionMarketWrite, formatTokenAmount, calculateOddsPercentage } from '../../../hooks/useContracts';
import { bigIntToNumber, bigIntToString, formatAddress } from '../../../lib/utils';

interface MarketData {
  id: string;
  creator: string;
  question: string;
  category: string;
  endTime: Date;
  resolutionTime: Date;
  outcome: number;
  optionA: string;
  optionB: string;
  totalOptionABets: bigint;
  totalOptionBBets: bigint;
  resolved: boolean;
  creatorFeesCollected: bigint;
  platformFeesCollected: bigint;
}

export default function MarketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { getMarketInfo, getMarketOdds, getUserShares } = usePredictionMarketRead();
  const { buyShares, isPending, isConfirming, isConfirmed, error } = usePredictionMarketWrite();
  
  const [market, setMarket] = useState<MarketData | null>(null);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B'>('A');
  const [betAmount, setBetAmount] = useState('');
  const [odds, setOdds] = useState({ optionAOdds: 50, optionBOdds: 50 });
  const [userShares, setUserShares] = useState({ optionA: 0n, optionB: 0n, hasClaimed: false });
  const [loading, setLoading] = useState(true);
  
  const marketId = parseInt(params.marketId as string);
  
  // Fetch market data
  const marketQuery = getMarketInfo(marketId);
  const oddsQuery = getMarketOdds(marketId);
  const userSharesQuery = getUserShares(marketId);
  
  useEffect(() => {
    if (marketQuery.data) {
      try {
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
        ] = marketQuery.data;
        
        const marketData: MarketData = {
          id: marketId.toString(),
          creator,
          question,
          category,
          endTime: new Date(bigIntToNumber(endTime) * 1000),
          resolutionTime: new Date(bigIntToNumber(resolutionTime) * 1000),
          outcome: bigIntToNumber(outcome),
          optionA,
          optionB,
          totalOptionABets,
          totalOptionBBets,
          resolved,
          creatorFeesCollected,
          platformFeesCollected
        };
        
        setMarket(marketData);
        setLoading(false);
      } catch (error) {
        console.error('Error processing market data:', error);
        setLoading(false);
      }
    }
  }, [marketQuery.data, marketId]);
  
  useEffect(() => {
    if (oddsQuery.data) {
      const [optionAOdds, optionBOdds] = oddsQuery.data;
      setOdds({
        optionAOdds: bigIntToNumber(optionAOdds),
        optionBOdds: bigIntToNumber(optionBOdds)
      });
    }
  }, [oddsQuery.data]);
  
  useEffect(() => {
    if (userSharesQuery.data) {
      const [optionAShares, optionBShares, hasClaimed] = userSharesQuery.data;
      setUserShares({
        optionA: optionAShares,
        optionB: optionBShares,
        hasClaimed
      });
    }
  }, [userSharesQuery.data]);
  
  const handleSubmitPrediction = async () => {
    if (!betAmount || !isConnected || !market) return;
    
    try {
      await buyShares(
        marketId,
        selectedOption === 'A',
        betAmount
      );
    } catch (error) {
      console.error('Error submitting prediction:', error);
    }
  };
  
  const calculateTimeRemaining = () => {
    if (!market) return 'Loading...';
    const now = new Date();
    const timeDiff = market.endTime.getTime() - now.getTime();
    
    if (timeDiff <= 0) return 'Market ended';
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `Ends in ${days} days`;
    return `Ends in ${hours} hours`;
  };
  
  const getTotalVolume = () => {
    if (!market) return '$0';
    const total = market.totalOptionABets + market.totalOptionBBets;
    return `${formatTokenAmount(total)} BNB`;
  };
  
  const getTotalParticipants = () => {
    if (!market) return '0';
    // This is a simplified calculation - in a real app you'd track unique participants
    const totalBets = bigIntToNumber(market.totalOptionABets + market.totalOptionBBets);
    return Math.floor(totalBets / 100).toLocaleString(); // Rough estimate
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-text-muted-dark mb-4 block animate-pulse">trending_up</span>
          <h3 className="font-display text-xl font-bold text-text-dark mb-2">Loading Market...</h3>
          <p className="text-text-muted-dark">Please wait while we load the market data</p>
        </div>
      </div>
    );
  }
  
  if (!market) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-red-500 mb-4 block">error</span>
          <h3 className="font-display text-xl font-bold text-text-dark mb-2">Market Not Found</h3>
          <p className="text-text-muted-dark mb-4">The market you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 bg-primary text-background-dark rounded-lg font-bold hover:brightness-110 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background-dark">
      <div className="relative flex h-auto min-h-screen w-full flex-col items-center justify-center p-4 bg-background-dark/80 backdrop-blur-sm overflow-y-auto">
        {/* Expanded Widget Container */}
        <div className="layout-container flex h-full grow flex-col w-full max-w-4xl">
          <div className="layout-content-container flex flex-col flex-1 bg-background-dark border border-border-color rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
            
            {/* Header Section */}
            <div className="flex justify-between items-center gap-2 px-6 py-4 border-b border-border-color">
              <div className="flex items-center gap-4">
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-10 w-10 border-2 border-accent-cyan/50" 
                     style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAFjhR2y0SiY5InLit17Fyje-N3-9WuyYEfqM2Bx8AYJwQX7Sqvv-I0zPvq-5_OXA29F-L0sYht4GCHUl5PMcU9TYsj4xuCsFSJQn_uudx9YiywcG46zdwRLlwBq8F5sf7YgXRvHBcLs-sa1HVSbQm3o82cvgFmP1IBO9z4OkQ5vQDJeufBG4oqLvfsozhmIJ2YwCXmvzqAGSIO_3hHEpHcg8dR1laY-ROc_sn2ED1RWuq-0B2UCaK5fUIHGwqlTbxl8aTiygMyirY")'}} />
                <p className="text-text-muted-dark text-base font-normal leading-normal flex-1 truncate">
                  Created by {formatAddress(market.creator)}
                </p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => router.push(`/embeds/${marketId}`)}
                  className="p-2 text-text-muted-light hover:text-white transition-colors"
                  title="Share this market"
                >
                  <span className="material-symbols-outlined text-2xl">share</span>
                </button>
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="p-2 text-text-muted-light hover:text-white transition-colors"
                  title="Close and return to dashboard"
                >
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>
            </div>
            
            {/* Main Content Grid */}
            <div className="flex flex-col lg:flex-row gap-6 p-6">
              {/* Left Column: Participation & Info */}
              <div className="flex flex-col gap-6 lg:w-2/5">
                {/* Market Question */}
                <div className="flex flex-col gap-3">
                  <h1 className="text-white tracking-light text-2xl md:text-3xl font-bold leading-tight text-left">
                    {market.question}
                  </h1>
                  <div className="flex items-center gap-2 text-text-muted-light text-sm">
                    <span className="material-symbols-outlined text-base">timer</span>
                    <span>{calculateTimeRemaining()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-muted-light text-sm">
                    <span className="material-symbols-outlined text-base">category</span>
                    <span>{market.category}</span>
                  </div>
                </div>
                
                {/* Participation Module */}
                {!market.resolved && isConnected && (
                  <div className="flex flex-col gap-4 bg-surface-dark/50 p-4 rounded-lg border border-border-color">
                    <p className="text-white text-lg font-medium leading-normal">Make your prediction</p>
                    
                    {/* Segmented Buttons */}
                    <div className="flex">
                      <div className="flex h-12 flex-1 items-center justify-center rounded-lg bg-surface-dark p-1 border border-border-color">
                        <label className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 transition-all ${
                          selectedOption === 'A' 
                            ? 'bg-primary shadow-[0_0_8px_rgba(0,255,255,0.4)] text-background-dark' 
                            : 'text-text-dark hover:bg-white/10'
                        } text-base font-bold`}>
                          <span className="truncate">{market.optionA} {odds.optionAOdds}%</span>
                          <input 
                            checked={selectedOption === 'A'}
                            onChange={() => setSelectedOption('A')}
                            className="invisible w-0" 
                            name="prediction-choice" 
                            type="radio" 
                            value="A"
                          />
                        </label>
                        <label className={`flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-md px-2 transition-all ${
                          selectedOption === 'B' 
                            ? 'bg-secondary shadow-[0_0_8px_rgba(255,209,102,0.4)] text-background-dark' 
                            : 'text-text-dark hover:bg-white/10'
                        } text-base font-bold`}>
                          <span className="truncate">{market.optionB} {odds.optionBOdds}%</span>
                          <input 
                            checked={selectedOption === 'B'}
                            onChange={() => setSelectedOption('B')}
                            className="invisible w-0" 
                            name="prediction-choice" 
                            type="radio" 
                            value="B"
                          />
                        </label>
                      </div>
                    </div>
                    
                    {/* Input Field */}
                    <label className="flex flex-col min-w-40 flex-1">
                      <p className="text-text-dark text-base font-medium leading-normal pb-2">Enter prediction amount</p>
                      <div className="relative">
                        <input 
                          className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-white/20 bg-surface-dark h-14 placeholder:text-text-muted-dark p-4 pr-20 text-base font-normal leading-normal" 
                          placeholder="0.001" 
                          value={betAmount}
                          onChange={(e) => setBetAmount(e.target.value)}
                          type="number"
                          step="0.001"
                          min="0"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-dark font-bold">BNB</span>
                      </div>
                    </label>
                    
                    {/* CTA Button */}
                    <button
  onClick={handleSubmitPrediction}
  disabled={!betAmount || isPending || isConfirming || market.resolved}
  className="
    w-full h-12 flex items-center justify-center rounded-lg 
    bg-secondary text-background-dark font-bold text-base 
    transition-all duration-300
    hover:brightness-125 hover:shadow-[0_0_12px_rgba(255,255,255,0.4)]
    active:brightness-150 active:scale-[1.02]
    shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
  "
>
  {isPending || isConfirming ? 'Processing...' : 'Submit Prediction'}
</button>

                    
                    {error && (
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <p className="text-red-400 text-sm">Error: {error.message}</p>
                      </div>
                    )}
                    
                    {isConfirmed && (
                      <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <p className="text-green-400 text-sm">Prediction submitted successfully!</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* User's Current Position */}
                {isConnected && (userShares.optionA > 0n || userShares.optionB > 0n) && (
                  <div className="flex flex-col gap-3 bg-surface-dark/50 p-4 rounded-lg border border-border-color">
                    <p className="text-white text-lg font-medium">Your Position</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-center">
                        <div className="text-lg font-bold text-primary">{formatTokenAmount(userShares.optionA)} BNB</div>
                        <div className="text-xs text-text-dark">{market.optionA}</div>
                      </div>
                      <div className="p-3 bg-secondary/10 border border-secondary/20 rounded-lg text-center">
                        <div className="text-lg font-bold text-secondary">{formatTokenAmount(userShares.optionB)} BNB</div>
                        <div className="text-xs text-text-dark">{market.optionB}</div>
                      </div>
                    </div>
                  </div>
                )}
                
                {!isConnected && (
                  <div className="flex flex-col gap-4 bg-surface-dark/50 p-4 rounded-lg border border-border-color text-center">
                    <span className="material-symbols-outlined text-4xl text-text-muted-dark">account_balance_wallet</span>
                    <p className="text-white text-lg font-medium">Connect Wallet to Participate</p>
                    <p className="text-text-muted-dark text-sm">Connect your wallet to make predictions and earn rewards</p>
                  </div>
                )}
              </div>
              
              {/* Right Column: Data Viz & Community */}
              <div className="flex flex-col gap-6 lg:w-3/5">
                {/* Stats Panel */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-surface-dark/50 p-4 rounded-lg border border-border-color">
                    <p className="text-sm text-text-muted-light mb-1">Total Volume</p>
                    <p className="text-white text-xl font-bold">{getTotalVolume()}</p>
                  </div>
                  <div className="bg-surface-dark/50 p-4 rounded-lg border border-border-color">
                    <p className="text-sm text-text-muted-light mb-1">Participants</p>
                    <p className="text-white text-xl font-bold">{getTotalParticipants()}</p>
                  </div>
                  <div className="bg-surface-dark/50 p-4 rounded-lg border border-border-color col-span-2 md:col-span-1">
                    <p className="text-sm text-text-muted-light mb-1">Status</p>
                    <p className="text-white text-xl font-bold">{market.resolved ? 'Resolved' : 'Active'}</p>
                  </div>
                </div>
                
                {/* Current Odds Display */}
                <div className="bg-surface-dark/50 p-4 rounded-lg border border-border-color">
                  <p className="text-white text-lg font-medium mb-4">Current Odds</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg text-center">
                      <div className="text-2xl font-bold text-primary">{odds.optionAOdds}%</div>
                      <div className="text-sm text-text-dark mt-1">{market.optionA}</div>
                      <div className="text-xs text-text-muted-dark mt-2">{formatTokenAmount(market.totalOptionABets)} BNB</div>
                    </div>
                    <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-lg text-center">
                      <div className="text-2xl font-bold text-secondary">{odds.optionBOdds}%</div>
                      <div className="text-sm text-text-dark mt-1">{market.optionB}</div>
                      <div className="text-xs text-text-muted-dark mt-2">{formatTokenAmount(market.totalOptionBBets)} BNB</div>
                    </div>
                  </div>
                </div>
                
                {/* Market Info */}
                <div className="bg-surface-dark/50 p-4 rounded-lg border border-border-color">
                  <p className="text-white text-lg font-medium mb-4">Market Information</p>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-text-muted-light">Market ID:</span>
                      <span className="text-white font-mono">#{market.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted-light">Creator:</span>
                      <span className="text-white font-mono">{formatAddress(market.creator)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted-light">End Time:</span>
                      <span className="text-white">{market.endTime.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted-light">Resolution Time:</span>
                      <span className="text-white">{market.resolutionTime.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="px-6 py-3 border-t border-border-color text-center">
              <button 
                onClick={() => router.push('/dashboard')}
                className="text-text-muted-light text-sm hover:text-accent-cyan transition-colors"
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}