'use client';

import { useRef, useState } from 'react';
import { Market, IMAGE_TEMPLATES } from '../types/embed';
import { generateMarketImageUrl, copyToClipboard, formatOdds } from '../utils/embed';

interface MarketImageGeneratorProps {
  market: Market;
  onImageGenerated?: (imageUrl: string) => void;
}

export default function MarketImageGenerator({ market, onImageGenerated }: MarketImageGeneratorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState('default');
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateImage = async () => {
    setIsGenerating(true);
    
    try {
      // Create image using canvas
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size
      canvas.width = 800;
      canvas.height = 600;

      // Draw background based on template
      drawBackground(ctx, selectedTemplate);
      
      // Draw market content
      drawMarketContent(ctx, market, selectedTemplate);
      
      // Convert to blob and create URL
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setImageUrl(url);
          onImageGenerated?.(url);
        }
      }, 'image/png');
      
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const drawBackground = (ctx: CanvasRenderingContext2D, template: string) => {
    const { width, height } = ctx.canvas;
    
    switch (template) {
      case 'gradient':
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#101820');
        gradient.addColorStop(0.5, '#1D2939');
        gradient.addColorStop(1, '#101820');
        ctx.fillStyle = gradient;
        break;
      case 'bold':
        ctx.fillStyle = '#00FFF0';
        break;
      case 'minimal':
        ctx.fillStyle = '#FFFFFF';
        break;
      default:
        ctx.fillStyle = '#101820';
    }
    
    ctx.fillRect(0, 0, width, height);
    
    // Add border for non-bold templates
    if (template !== 'bold') {
      ctx.strokeStyle = '#00FFF0';
      ctx.lineWidth = 4;
      ctx.strokeRect(2, 2, width - 4, height - 4);
    }
  };

  const drawMarketContent = (ctx: CanvasRenderingContext2D, market: Market, template: string) => {
    const { width, height } = ctx.canvas;
    const textColor = template === 'minimal' ? '#101820' : '#E8E9EB';
    const accentColor = template === 'bold' ? '#101820' : '#00FFF0';
    
    ctx.textAlign = 'center';
    ctx.fillStyle = textColor;
    
    // Draw logo/brand
    ctx.font = 'bold 32px Inter';
    ctx.fillStyle = accentColor;
    ctx.fillText('ParagraphMarket', width / 2, 60);
    
    // Draw category
    ctx.font = '20px Inter';
    ctx.fillStyle = template === 'minimal' ? '#666666' : '#98A2B3';
    ctx.fillText(market.category.toUpperCase(), width / 2, 100);
    
    // Draw question (wrap text)
    ctx.font = 'bold 36px Inter';
    ctx.fillStyle = textColor;
    const maxWidth = width - 80;
    const words = market.question.split(' ');
    let line = '';
    let y = 160;
    
    for (const word of words) {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line !== '') {
        ctx.fillText(line, width / 2, y);
        line = word + ' ';
        y += 50;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, width / 2, y);
    
    // Draw options with odds
    const optionY = y + 100;
    const optionWidth = (width - 120) / 2;
    const optionHeight = 120;
    
    // Option A
    ctx.fillStyle = template === 'minimal' ? '#F0F0F0' : '#1D2939';
    ctx.fillRect(40, optionY, optionWidth, optionHeight);
    
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 28px Inter';
    ctx.fillText(formatOdds(market.optionAOdds), 40 + optionWidth / 2, optionY + 40);
    
    ctx.fillStyle = textColor;
    ctx.font = '20px Inter';
    ctx.fillText(market.optionA, 40 + optionWidth / 2, optionY + 75);
    
    // Option B
    ctx.fillStyle = template === 'minimal' ? '#F0F0F0' : '#1D2939';
    ctx.fillRect(width - 40 - optionWidth, optionY, optionWidth, optionHeight);
    
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 28px Inter';
    ctx.fillText(formatOdds(market.optionBOdds), width - 40 - optionWidth / 2, optionY + 40);
    
    ctx.fillStyle = textColor;
    ctx.font = '20px Inter';
    ctx.fillText(market.optionB, width - 40 - optionWidth / 2, optionY + 75);
    
    // Draw footer info
    ctx.font = '18px Inter';
    ctx.fillStyle = template === 'minimal' ? '#666666' : '#98A2B3';
    ctx.fillText(`${market.totalPredictions.toLocaleString()} predictions • ${market.totalVolume}`, width / 2, height - 40);
  };

  const handleCopyImage = async () => {
    if (imageUrl) {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ]);
        
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (error) {
        console.error('Failed to copy image:', error);
      }
    }
  };

  const downloadImage = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.download = `market-${market.id}-${selectedTemplate}.png`;
      link.href = imageUrl;
      link.click();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary">image</span>
        <h3 className="font-display text-xl font-bold text-text-dark">Generate Share Image</h3>
      </div>

      {/* Template Selection */}
      <div>
        <label className="text-sm font-medium text-text-dark mb-3 block">
          Image Template
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {IMAGE_TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                selectedTemplate === template.id
                  ? 'border-primary bg-primary/20 text-primary'
                  : 'border-white/10 bg-surface-dark/50 text-text-muted-dark hover:text-text-dark hover:bg-white/5'
              }`}
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generateImage}
        disabled={isGenerating}
        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-secondary text-background-dark text-sm font-bold rounded-lg shadow-lg shadow-secondary/20 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
            <span className="animate-spin material-symbols-outlined text-sm">refresh</span>
            Generating...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            Generate Image
          </>
        )}
      </button>

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Generated Image Preview */}
      {imageUrl && (
        <div className="space-y-4">
          <div className="border border-white/10 rounded-lg overflow-hidden">
            <img 
              src={imageUrl} 
              alt="Generated market image" 
              className="w-full h-auto"
            />
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleCopyImage}
              className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg hover:bg-primary/30 transition-colors flex-1"
            >
              <span className="material-symbols-outlined text-sm">
                {copySuccess ? 'check' : 'content_copy'}
              </span>
              {copySuccess ? 'Copied!' : 'Copy Image'}
            </button>
            
            <button
              onClick={downloadImage}
              className="flex items-center gap-2 px-4 py-2 bg-surface-dark border border-white/10 text-text-dark rounded-lg hover:bg-white/5 transition-colors flex-1"
            >
              <span className="material-symbols-outlined text-sm">download</span>
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
}