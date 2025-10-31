'use client';

import { useState } from 'react';
import { EmbedConfig, DEFAULT_EMBED_CONFIG, EMBED_SIZES } from '../types/embed';
import { generateIframeCode, copyToClipboard } from '../utils/embed';

interface IframeEmbedComponentProps {
  marketId: string;
}

export default function IframeEmbedComponent({ marketId }: IframeEmbedComponentProps) {
  const [config, setConfig] = useState<EmbedConfig>(DEFAULT_EMBED_CONFIG);
  const [copySuccess, setCopySuccess] = useState(false);
  const [previewMode, setPreviewMode] = useState<'code' | 'preview'>('code');

  const iframeCode = generateIframeCode(marketId, config);

  const handleConfigChange = (key: keyof EmbedConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleCopyCode = async () => {
    const success = await copyToClipboard(iframeCode);
    
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleSizePreset = (size: typeof EMBED_SIZES[0]) => {
    setConfig(prev => ({
      ...prev,
      width: size.width,
      height: size.height
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-primary">code</span>
        <h3 className="font-display text-xl font-bold text-text-dark">Iframe Embed</h3>
      </div>

      {/* Configuration Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings */}
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-text-dark mb-3">Size Presets</h4>
            <div className="grid grid-cols-2 gap-2">
              {EMBED_SIZES.map((size) => (
                <button
                  key={size.name}
                  onClick={() => handleSizePreset(size)}
                  className="p-2 text-xs rounded-lg bg-surface-dark border border-white/10 text-text-muted-dark hover:text-text-dark hover:bg-white/5 transition-colors"
                >
                  {size.name}
                  <div className="text-xs opacity-70 mt-1">{size.width} × {size.height}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-text-dark mb-2 block">
                Width
              </label>
              <input
                type="text"
                value={config.width}
                onChange={(e) => handleConfigChange('width', e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-surface-dark/50 dark:bg-surface-dark px-3 py-2 text-sm text-text-dark"
                placeholder="400px"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-text-dark mb-2 block">
                Height
              </label>
              <input
                type="text"
                value={config.height}
                onChange={(e) => handleConfigChange('height', e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-surface-dark/50 dark:bg-surface-dark px-3 py-2 text-sm text-text-dark"
                placeholder="250px"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-text-dark mb-2 block">
              Border Radius
            </label>
            <select
              value={config.borderRadius}
              onChange={(e) => handleConfigChange('borderRadius', e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-surface-dark/50 dark:bg-surface-dark px-3 py-2 text-sm text-text-dark"
            >
              <option value="0px">No Radius</option>
              <option value="4px">Small (4px)</option>
              <option value="8px">Medium (8px)</option>
              <option value="12px">Large (12px)</option>
              <option value="16px">Extra Large (16px)</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-text-dark mb-2 block">
              Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleConfigChange('theme', 'dark')}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                  config.theme === 'dark'
                    ? 'border-primary bg-primary/20 text-primary'
                    : 'border-white/10 bg-surface-dark/50 text-text-muted-dark hover:text-text-dark'
                }`}
              >
                Dark
              </button>
              <button
                onClick={() => handleConfigChange('theme', 'light')}
                className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                  config.theme === 'light'
                    ? 'border-primary bg-primary/20 text-primary'
                    : 'border-white/10 bg-surface-dark/50 text-text-muted-dark hover:text-text-dark'
                }`}
              >
                Light
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-text-dark mb-3">Display Options</h4>
            <div className="space-y-3">
              {[
                { key: 'showDescription', label: 'Show Description' },
                { key: 'showOdds', label: 'Show Odds' },
                { key: 'showVolume', label: 'Show Volume' },
                { key: 'showCreator', label: 'Show Creator' }
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={config[key as keyof EmbedConfig] as boolean}
                    onChange={(e) => handleConfigChange(key as keyof EmbedConfig, e.target.checked)}
                    className="w-4 h-4 text-primary bg-surface-dark border-white/10 rounded focus:ring-primary/20"
                  />
                  <span className="text-sm text-text-dark">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Preview/Code */}
        <div className="space-y-4">
          <div className="flex gap-2 p-1 bg-surface-dark rounded-lg">
            <button
              onClick={() => setPreviewMode('code')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                previewMode === 'code'
                  ? 'bg-primary text-background-dark'
                  : 'text-text-muted-dark hover:text-text-dark'
              }`}
            >
              Code
            </button>
            <button
              onClick={() => setPreviewMode('preview')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                previewMode === 'preview'
                  ? 'bg-primary text-background-dark'
                  : 'text-text-muted-dark hover:text-text-dark'
              }`}
            >
              Preview
            </button>
          </div>

          {previewMode === 'code' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-text-dark">
                  Iframe Code
                </label>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 px-3 py-1.5 bg-primary/20 text-primary border border-primary/30 rounded-md hover:bg-primary/30 transition-colors text-xs font-medium"
                >
                  <span className="material-symbols-outlined text-sm">
                    {copySuccess ? 'check' : 'content_copy'}
                  </span>
                  {copySuccess ? 'Copied!' : 'Copy'}
                </button>
              </div>
              
              <div className="relative">
                <textarea
                  value={iframeCode}
                  readOnly
                  rows={8}
                  className="w-full rounded-lg border border-white/10 bg-surface-dark/50 dark:bg-surface-dark px-4 py-3 text-sm text-text-dark font-mono resize-none"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="text-sm font-medium text-text-dark block">
                Live Preview
              </label>
              <div className="border border-white/10 rounded-lg p-4 bg-white/5">
                <div 
                  style={{ 
                    width: config.width === '100%' ? '100%' : config.width,
                    height: config.height === 'auto' ? 'auto' : config.height,
                    minHeight: '200px'
                  }}
                  className="border border-white/10 rounded-lg bg-surface-dark flex items-center justify-center"
                >
                  <div className="text-center text-text-muted-dark">
                    <span className="material-symbols-outlined text-4xl mb-2 block">widgets</span>
                    <p className="text-sm">Market Widget Preview</p>
                    <p className="text-xs mt-1">{config.width} × {config.height}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-primary text-sm mt-0.5">info</span>
          <div className="text-sm">
            <p className="text-text-dark font-medium mb-2">How to use this embed:</p>
            <ol className="text-text-muted-dark space-y-1 list-decimal list-inside">
              <li>Customize the settings above to match your needs</li>
              <li>Copy the iframe code from the Code tab</li>
              <li>Paste it into your blog, website, or CMS</li>
              <li>The widget will automatically load and stay updated</li>
            </ol>
            <p className="text-text-muted-dark mt-3">
              <strong>Note:</strong> The embed is responsive and will adapt to your site's styling.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => setConfig(DEFAULT_EMBED_CONFIG)}
          className="flex items-center gap-2 px-4 py-2 bg-surface-dark border border-white/10 text-text-dark rounded-lg hover:bg-white/5 transition-colors"
        >
          <span className="material-symbols-outlined text-sm">refresh</span>
          Reset to Defaults
        </button>
        
        <button
          onClick={handleCopyCode}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-background-dark rounded-lg hover:brightness-110 transition-all flex-1"
        >
          <span className="material-symbols-outlined text-sm">content_copy</span>
          Copy Embed Code
        </button>
      </div>
    </div>
  );
}