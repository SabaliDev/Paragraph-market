'use client';

import { useState, useEffect } from 'react';
import { Market, EmbedConfig } from '../types/embed';
import { formatOdds, formatVolume, truncateText } from '../utils/embed';

interface MarketWidgetProps {
  market: Market;
  config?: Partial<EmbedConfig>;
  isEmbedded?: boolean;
}

export default function MarketWidget({ 
  market, 
  config = {}, 
  isEmbedded = false 
}: MarketWidgetProps) {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);

  const widgetConfig = {
    theme: 'dark',
    showDescription: true,
    showOdds: true,
    showVolume: true,
    showCreator: true,
    width: '400px',
    height: 'auto',
    borderRadius: '12px',
    ...config
  };

  useEffect(() => {
    const updateTimeRemaining = () => {
      const endTime = new Date(market.endTime);
      const now = new Date();
      const diff = endTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining('Ended');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m`);
      } else {
        setTimeRemaining(`${minutes}m`);
      }
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [market.endTime]);

  const handleOptionClick = (option: 'A' | 'B') => {
    if (market.status !== 'active') return;
    setSelectedOption(option);
    
    if (isEmbedded) {
      // In embedded mode, open the full market page
      window.open(`/market/${market.id}`, '_blank');
    }
  };

  const containerClasses = `
    ${widgetConfig.theme === 'dark' ? 'bg-[#101820] text-[#E8E9EB]' : 'bg-white text-[#101820]'}
    ${isEmbedded ? 'max-w-none' : 'max-w-md'}
    border ${widgetConfig.theme === 'dark' ? 'border-white/10' : 'border-gray-200'}
    overflow-hidden font-sans
  `;

  const cardClasses = `
    ${widgetConfig.theme === 'dark' ? 'bg-[#1D2939]' : 'bg-gray-50'}
    rounded-lg p-4
  `;

  return (
    <div 
      className={containerClasses}
      style={{
        borderRadius: widgetConfig.borderRadius,
        width: isEmbedded ? '100%' : widgetConfig.width,
        minHeight: '200px'
      }}
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                widgetConfig.theme === 'dark' ? 'bg-[#00FFF0]/20 text-[#00FFF0]' : 'bg-blue-100 text-blue-800'
              }`}>
                {market.category}
              </span>
              {market.status === 'active' && timeRemaining && (
                <span className="text-xs opacity-70">
                  {timeRemaining} left
                </span>
              )}
            </div>
            <h3 className="font-semibold text-sm leading-tight mb-1">
              {truncateText(market.question, 80)}
            </h3>
            {widgetConfig.showDescription && market.description && (
              <p className="text-xs opacity-70 leading-relaxed">
                {truncateText(market.description, 100)}
              </p>
            )}
          </div>
          <div className="flex-shrink-0">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              market.status === 'active' 
                ? (widgetConfig.theme === 'dark' ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-800')
                : (widgetConfig.theme === 'dark' ? 'bg-gray-500/20 text-gray-400' : 'bg-gray-100 text-gray-600')
            }`}>
              {market.status}
            </span>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => handleOptionClick('A')}
            disabled={market.status !== 'active'}
            className={`
              ${cardClasses}
              ${market.status === 'active' ? 'hover:brightness-110 cursor-pointer' : 'opacity-60 cursor-not-allowed'}
              ${selectedOption === 'A' ? 'ring-2 ring-[#00FFF0]' : ''}
              transition-all text-center
            `}
          >
            {widgetConfig.showOdds && (
              <div className={`text-lg font-bold mb-1 ${
                widgetConfig.theme === 'dark' ? 'text-[#00FFF0]' : 'text-blue-600'
              }`}>
                {formatOdds(market.optionAOdds)}
              </div>
            )}
            <div className="text-sm font-medium">
              {truncateText(market.optionA, 20)}
            </div>
          </button>

          <button
            onClick={() => handleOptionClick('B')}
            disabled={market.status !== 'active'}
            className={`
              ${cardClasses}
              ${market.status === 'active' ? 'hover:brightness-110 cursor-pointer' : 'opacity-60 cursor-not-allowed'}
              ${selectedOption === 'B' ? 'ring-2 ring-[#00FFF0]' : ''}
              transition-all text-center
            `}
          >
            {widgetConfig.showOdds && (
              <div className={`text-lg font-bold mb-1 ${
                widgetConfig.theme === 'dark' ? 'text-[#00FFF0]' : 'text-blue-600'
              }`}>
                {formatOdds(market.optionBOdds)}
              </div>
            )}
            <div className="text-sm font-medium">
              {truncateText(market.optionB, 20)}
            </div>
          </button>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between text-xs opacity-70">
          <div className="flex items-center gap-3">
            {widgetConfig.showVolume && (
              <span>{formatVolume(market.totalVolume)} volume</span>
            )}
            <span>{market.totalPredictions.toLocaleString()} predictions</span>
          </div>
          {widgetConfig.showCreator && (
            <span>by {market.creator.slice(0, 6)}...{market.creator.slice(-4)}</span>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="p-4 pt-0">
        <button
          onClick={() => {
            if (isEmbedded) {
              window.open(`/market/${market.id}`, '_blank');
            }
          }}
          className={`
            w-full py-2 px-4 rounded-lg text-sm font-medium transition-all
            ${widgetConfig.theme === 'dark' 
              ? 'bg-[#FFD166] text-[#101820] hover:brightness-110' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
            }
          `}
        >
          {market.status === 'active' ? 'Place Bet' : 'View Market'}
        </button>
      </div>

      {/* Branding */}
      {isEmbedded && (
        <div className="px-4 pb-3">
          <div className="flex items-center justify-center gap-2 text-xs opacity-50">
            <span>Powered by</span>
            <span className="font-semibold">ParagraphMarket</span>
          </div>
        </div>
      )}
    </div>
  );
}