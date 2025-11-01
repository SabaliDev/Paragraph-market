'use client';

import { useState } from 'react';
import { copyToClipboard, generateShareUrl } from '../utils/embed';

interface UrlCopyComponentProps {
  marketId: string;
  title?: string;
  description?: string;
}

export default function UrlCopyComponent({ marketId, title, description }: UrlCopyComponentProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'url' | 'markdown' | 'html'>('url');
  
  const shareUrl = generateShareUrl(marketId);
  
  const formatOptions = [
    { id: 'url', name: 'URL', icon: 'link' },
    { id: 'markdown', name: 'Markdown', icon: 'code' },
    { id: 'html', name: 'HTML', icon: 'code_blocks' }
  ] as const;

  const getFormattedContent = () => {
    const marketTitle = title || 'Prediction Market';
    const marketDescription = description || 'Check out this prediction market on ParagraphMarket';
    
    switch (selectedFormat) {
      case 'markdown':
        return `[${marketTitle}](${shareUrl})\n\n${marketDescription}`;
      case 'html':
        return `<a href="${shareUrl}" target="_blank" rel="noopener noreferrer">${marketTitle}</a>\n<p>${marketDescription}</p>`;
      default:
        return shareUrl;
    }
  };

  const handleCopy = async () => {
    const content = getFormattedContent();
    const success = await copyToClipboard(content);
    
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleSocialShare = (platform: 'twitter' | 'facebook' | 'linkedin' | 'reddit') => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title || 'Check out this prediction market!');
    const encodedDescription = encodeURIComponent(description || 'ParagraphMarket - Embedded prediction markets for content creators');
    
    let shareUrl_platform = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl_platform = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'facebook':
        shareUrl_platform = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl_platform = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`;
        break;
      case 'reddit':
        shareUrl_platform = `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`;
        break;
    }
    
    window.open(shareUrl_platform, '_blank', 'width=600,height=400');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary">share</span>
        <h3 className="font-display text-xl font-bold text-text-dark">Share Market URL</h3>
      </div>

      {/* Format Selection */}
      <div>
        <label className="text-sm font-medium text-text-dark mb-3 block">
          Copy Format
        </label>
        <div className="grid grid-cols-3 gap-3">
          {formatOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedFormat(option.id)}
              className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-colors ${
                selectedFormat === option.id
                  ? 'border-primary bg-primary/20 text-primary'
                  : 'border-white/10 bg-surface-dark/50 text-text-muted-dark hover:text-text-dark hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{option.icon}</span>
              {option.name}
            </button>
          ))}
        </div>
      </div>

      {/* URL Display and Copy */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-text-dark block">
          {selectedFormat === 'url' ? 'Share URL' : `${formatOptions.find(f => f.id === selectedFormat)?.name} Code`}
        </label>
        
        <div className="relative">
          <textarea
            value={getFormattedContent()}
            readOnly
            rows={selectedFormat === 'url' ? 1 : 3}
            className="w-full rounded-lg border border-white/10 bg-surface-dark/50 dark:bg-surface-dark px-4 py-3 text-sm text-text-dark font-mono resize-none"
          />
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1.5 bg-primary/20 text-primary border border-primary/30 rounded-md hover:bg-primary/30 transition-colors text-xs font-medium"
          >
            <span className="material-symbols-outlined text-sm">
              {copySuccess ? 'check' : 'content_copy'}
            </span>
            {copySuccess ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Social Media Sharing */}
      <div>
        <label className="text-sm font-medium text-text-dark mb-3 block">
          Share on Social Media
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => handleSocialShare('twitter')}
            className="flex items-center gap-2 p-3 rounded-lg bg-[#1DA1F2]/20 border border-[#1DA1F2]/30 text-[#1DA1F2] hover:bg-[#1DA1F2]/30 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">share</span>
            Twitter
          </button>
          
          <button
            onClick={() => handleSocialShare('facebook')}
            className="flex items-center gap-2 p-3 rounded-lg bg-[#4267B2]/20 border border-[#4267B2]/30 text-[#4267B2] hover:bg-[#4267B2]/30 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">share</span>
            Facebook
          </button>
          
          <button
            onClick={() => handleSocialShare('linkedin')}
            className="flex items-center gap-2 p-3 rounded-lg bg-[#0077B5]/20 border border-[#0077B5]/30 text-[#0077B5] hover:bg-[#0077B5]/30 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">share</span>
            LinkedIn
          </button>
          
          <button
            onClick={() => handleSocialShare('reddit')}
            className="flex items-center gap-2 p-3 rounded-lg bg-[#FF4500]/20 border border-[#FF4500]/30 text-[#FF4500] hover:bg-[#FF4500]/30 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">share</span>
            Reddit
          </button>
        </div>
      </div>

      {/* Quick Copy Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => {
            setSelectedFormat('url');
            setTimeout(handleCopy, 100);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-surface-dark border border-white/10 text-text-dark rounded-lg hover:bg-white/5 transition-colors flex-1"
        >
          <span className="material-symbols-outlined text-sm">link</span>
          Copy URL
        </button>
        
        <button
          onClick={() => {
            setSelectedFormat('markdown');
            setTimeout(handleCopy, 100);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-surface-dark border border-white/10 text-text-dark rounded-lg hover:bg-white/5 transition-colors flex-1"
        >
          <span className="material-symbols-outlined text-sm">code</span>
          Copy Markdown
        </button>
      </div>

      {/* Share Tips */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-primary text-sm mt-0.5">lightbulb</span>
          <div className="text-sm">
            <p className="text-text-dark font-medium mb-1">Sharing Tips:</p>
            <ul className="text-text-muted-dark space-y-1">
              <li>• Use the URL format for direct links</li>
              <li>• Markdown format works great for blogs and GitHub</li>
              <li>• HTML format is perfect for websites and newsletters</li>
              <li>• Social sharing opens in a new window for convenience</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}