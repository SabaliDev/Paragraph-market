import { EmbedConfig, Market } from '../types/embed';

export const generateEmbedUrl = (marketId: string, config?: Partial<EmbedConfig>): string => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://auraclemarket.com';
  const params = new URLSearchParams();
  
  if (config) {
    Object.entries(config).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.set(key, value.toString());
      }
    });
  }
  
  const queryString = params.toString();
  return `${baseUrl}/embed/market/${marketId}${queryString ? `?${queryString}` : ''}`;
};

export const generateIframeCode = (marketId: string, config: EmbedConfig): string => {
  const embedUrl = generateEmbedUrl(marketId, config);
  
  return `<iframe 
  src="${embedUrl}"
  width="${config.width}" 
  height="${config.height}"
  style="border: none; border-radius: ${config.borderRadius}; overflow: hidden;"
  allow="clipboard-write"
  title="AuracleMarket Prediction"
></iframe>`;
};

export const generateShareUrl = (marketId: string): string => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://auraclemarket.com';
  return `${baseUrl}/market/${marketId}`;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand('copy');
      textArea.remove();
      return success;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

export const generateMarketImageUrl = (market: Market, template: string = 'default'): string => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://auraclemarket.com';
  const params = new URLSearchParams({
    question: market.question,
    optionA: market.optionA,
    optionB: market.optionB,
    category: market.category,
    template: template,
    oddsA: market.optionAOdds.toString(),
    oddsB: market.optionBOdds.toString()
  });
  
  return `${baseUrl}/api/generate-image/${market.id}?${params.toString()}`;
};

export const formatOdds = (odds: number): string => {
  return `${Math.round(odds / 100)}%`;
};

export const formatVolume = (volume: string): string => {
  const num = parseFloat(volume.replace(/[^0-9.-]+/g, ''));
  if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `$${(num / 1000).toFixed(1)}K`;
  } else {
    return `$${num.toFixed(0)}`;
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};