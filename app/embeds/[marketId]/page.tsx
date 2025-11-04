'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAccount } from 'wagmi';
import Sidebar from '../../../components/Sidebar';
import MarketImageGenerator from '../../../components/MarketImageGenerator';
import UrlCopyComponent from '../../../components/UrlCopyComponent';
import IframeEmbedComponent from '../../../components/IframeEmbedComponent';
import { Market } from '../../../types/embed';
import { usePredictionMarketRead, formatTokenAmount } from '../../../hooks/useContracts';
import { bigIntToNumber, bigIntToString, safeStringify } from '../../../lib/utils';

// Mock data - replace with actual API calls
const mockMarkets: Market[] = [
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
  }
];

export default function MarketEmbedsPage() {
  const params = useParams();
  const { isConnected } = useAccount();
  const { marketCount, getMarketInfo } = usePredictionMarketRead();
  
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [activeTab, setActiveTab] = useState<'url' | 'iframe' | 'image'>('url');
  const [contractMarkets, setContractMarkets] = useState<Market[]>([]);
  
  // Get market ID from URL path parameter
  const marketIdFromUrl = params.marketId as string;
  
  // Get market data for the specified market ID
  const marketQuery = getMarketInfo(marketIdFromUrl ? parseInt(marketIdFromUrl) : 0);
  
  // Load real markets from contract or use mock data
  useEffect(() => {
    console.log('=== EMBEDS PAGE DEBUG ===');
    console.log('marketIdFromUrl:', marketIdFromUrl);
    console.log('isConnected:', isConnected);
    console.log('marketCount:', marketCount);
    console.log('marketQuery.data:', safeStringify(marketQuery.data));
    
    if (isConnected && marketCount && marketCount > BigInt(0)) {
      // Load contract markets
      if (marketQuery.data) {
        try {
          const marketData = marketQuery.data as unknown as any[];
          
          const market: Market = {
            id: marketIdFromUrl || '0',
            question: bigIntToString(marketData[1] || 'Loading...'),
            category: bigIntToString(marketData[2] || 'General'),
            description: '',
            optionA: bigIntToString(marketData[6] || 'Yes'),
            optionB: bigIntToString(marketData[7] || 'No'),
            optionAOdds: 50,
            optionBOdds: 50,
            totalPredictions: bigIntToNumber(marketData[8]) + bigIntToNumber(marketData[9]),
            totalVolume: `${formatTokenAmount((marketData[8] as bigint) + (marketData[9] as bigint))} PMT`,
            endTime: new Date(bigIntToNumber(marketData[3]) * 1000).toISOString(),
            resolutionTime: new Date(bigIntToNumber(marketData[4]) * 1000).toISOString(),
            status: marketData[10] ? 'resolved' : 'active',
            creator: bigIntToString(marketData[0] || '0x0000000000000000000000000000000000000000'),
            createdAt: new Date().toISOString()
          };
          
          console.log('Loaded contract market:', safeStringify(market));
          setContractMarkets([market]);
          setSelectedMarket(market);
        } catch (error) {
          console.error('Error processing market data:', error);
          setContractMarkets(mockMarkets);
          setSelectedMarket(mockMarkets[0]);
        }
      }
    } else {
      // Use mock data when not connected
      console.log('Using mock data');
      setContractMarkets(mockMarkets);
      setSelectedMarket(mockMarkets[0]);
    }
  }, [isConnected, marketCount, marketQuery.data, marketIdFromUrl]);
  
  // Use contract markets if available, otherwise use mock markets
  const availableMarkets = contractMarkets.length > 0 ? contractMarkets : mockMarkets;

  const tabs = [
    { id: 'url', name: 'Share URL', icon: 'link' },
    { id: 'iframe', name: 'Iframe Embed', icon: 'code' },
    { id: 'image', name: 'Image Generation', icon: 'image' }
  ] as const;

  return (
    <div className="relative flex min-h-screen w-full">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <header className="mb-8">
              <h1 className="font-display text-4xl font-bold tracking-tighter text-text-light dark:text-text-dark mb-2">
                Share Market
              </h1>
              <p className="text-base font-normal text-text-light/70 dark:text-text-dark/70">
                Generate embeddable widgets and shareable content for your market
              </p>
              {marketIdFromUrl && (
                <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">share</span>
                    <span className="text-sm font-medium text-primary">
                      Sharing Market ID: {marketIdFromUrl}
                    </span>
                  </div>
                </div>
              )}
            </header>


            {selectedMarket && (
              <>
                {/* Market Preview */}
                <div className="mb-8 p-6 rounded-xl border border-white/10 bg-surface-dark/50 dark:bg-surface-dark">
                  <h3 className="font-display text-lg font-bold text-text-dark mb-4">
                    Market Details
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-text-dark mb-2">{selectedMarket.question}</h4>
                      <p className="text-sm text-text-muted-dark mb-3">{selectedMarket.description}</p>
                      <div className="flex gap-4 text-sm">
                        <span className="text-text-muted-dark">Category: <span className="text-text-dark">{selectedMarket.category}</span></span>
                        <span className="text-text-muted-dark">Volume: <span className="text-text-dark">{selectedMarket.totalVolume}</span></span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-center">
                        <div className="text-lg font-bold text-primary">{selectedMarket.optionAOdds}%</div>
                        <div className="text-xs text-text-dark">{selectedMarket.optionA}</div>
                      </div>
                      <div className="p-3 bg-white/5 border border-white/10 rounded-lg text-center">
                        <div className="text-lg font-bold text-text-dark">{selectedMarket.optionBOdds}%</div>
                        <div className="text-xs text-text-dark">{selectedMarket.optionB}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="mb-8">
                  <div className="flex gap-1 p-1 bg-surface-dark rounded-lg w-fit">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                          activeTab === tab.id
                            ? 'bg-primary text-background-dark'
                            : 'text-text-muted-dark hover:text-text-dark'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                        {tab.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                <div className="rounded-xl border border-white/10 bg-surface-dark/50 dark:bg-surface-dark p-6">
                  {activeTab === 'url' && (
                    <UrlCopyComponent 
                      marketId={selectedMarket.id}
                      title={selectedMarket.question}
                      description={selectedMarket.description}
                    />
                  )}
                  
                  {activeTab === 'iframe' && (
                    <IframeEmbedComponent marketId={selectedMarket.id} />
                  )}
                  
                  {activeTab === 'image' && (
                    <MarketImageGenerator 
                      market={selectedMarket}
                      onImageGenerated={(url) => console.log('Image generated:', url)}
                    />
                  )}
                </div>
              </>
            )}

            {!selectedMarket && (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-6xl text-text-muted-dark mb-4 block">share</span>
                <h3 className="font-display text-xl font-bold text-text-dark mb-2">
                  Loading Market Data...
                </h3>
                <p className="text-text-muted-dark">
                  Please wait while we load the market information
                </p>
              </div>
            )}

            {/* Help Section */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-lg bg-primary/10 border border-primary/20">
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-symbols-outlined text-primary">link</span>
                  <h4 className="font-semibold text-text-dark">Share URLs</h4>
                </div>
                <p className="text-sm text-text-muted-dark">
                  Generate direct links to your markets with support for social media, markdown, and HTML formats.
                </p>
              </div>

              <div className="p-6 rounded-lg bg-secondary/10 border border-secondary/20">
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-symbols-outlined text-secondary">code</span>
                  <h4 className="font-semibold text-text-dark">Iframe Embeds</h4>
                </div>
                <p className="text-sm text-text-muted-dark">
                  Embed interactive market widgets directly into your website, blog, or CMS with full customization.
                </p>
              </div>

              <div className="p-6 rounded-lg bg-white/10 border border-white/20">
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-symbols-outlined text-text-dark">image</span>
                  <h4 className="font-semibold text-text-dark">Image Generation</h4>
                </div>
                <p className="text-sm text-text-muted-dark">
                  Create beautiful market preview images perfect for social media sharing and blog posts.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}