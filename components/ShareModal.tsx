'use client';

import { useState, useRef, useEffect } from 'react';
import { Market } from '../types/embed';
import UrlCopyComponent from './UrlCopyComponent';
import IframeEmbedComponent from './IframeEmbedComponent';
import MarketImageGenerator from './MarketImageGenerator';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  market: Market;
}

export default function ShareModal({ isOpen, onClose, market }: ShareModalProps) {
  const [activeTab, setActiveTab] = useState<'url' | 'iframe' | 'image'>('url');
  const modalRef = useRef<HTMLDivElement>(null);

  // Debug: Log when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log('ShareModal opened with market:', market);
    }
  }, [isOpen, market]);

  const tabs = [
    { id: 'url', name: 'Share URL', icon: 'link' },
    { id: 'iframe', name: 'Embed Code', icon: 'code' },
    { id: 'image', name: 'Generate Image', icon: 'image' }
  ] as const;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  console.log('=== SHAREMODAL RENDER DEBUG ===');
  console.log('ShareModal props:', { isOpen, market: market?.id });
  console.log('ShareModal isOpen:', isOpen);
  
  if (!isOpen) {
    console.log('ShareModal not rendering - isOpen is false');
    return null;
  }
  
  console.log('ShareModal IS rendering!');

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        ref={modalRef}
        className="bg-surface-dark rounded-xl border border-white/10 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="font-display text-xl font-bold text-text-dark">
              Share Market
            </h2>
            <p className="text-sm text-text-muted-dark mt-1">
              {market.question}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-text-muted-dark hover:text-text-dark hover:bg-white/5 transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Market Preview */}
        <div className="px-6 py-4 border-b border-white/10 bg-background-dark/30">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                  {market.category}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  market.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {market.status}
                </span>
              </div>
              <h3 className="font-medium text-text-dark text-sm mb-1">
                {market.question}
              </h3>
              {market.description && (
                <p className="text-xs text-text-muted-dark">
                  {market.description}
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-text-dark">{market.totalVolume}</div>
              <div className="text-xs text-text-muted-dark">{market.totalPredictions.toLocaleString()} predictions</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="p-6 pb-0">
          <div className="flex gap-1 p-1 bg-background-dark rounded-lg w-fit">
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
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'url' && (
            <UrlCopyComponent 
              marketId={market.id}
              title={market.question}
              description={market.description}
            />
          )}
          
          {activeTab === 'iframe' && (
            <IframeEmbedComponent marketId={market.id} />
          )}
          
          {activeTab === 'image' && (
            <MarketImageGenerator 
              market={market}
              onImageGenerated={(url) => console.log('Image generated:', url)}
            />
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          <div className="flex items-center justify-between">
            <div className="text-sm text-text-muted-dark">
              Choose how you want to share this market with your audience
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-surface-dark border border-white/10 text-text-dark rounded-lg hover:bg-white/5 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}