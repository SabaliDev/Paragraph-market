import { CreateMarketForm } from '../types/market';

interface MarketPreviewProps {
  formData: CreateMarketForm;
}

export default function MarketPreview({ formData }: MarketPreviewProps) {
  const formatDateTime = (date: string, time: string) => {
    if (!date || !time) return 'Not set';
    
    try {
      const dateTime = new Date(`${date}T${time}`);
      return dateTime.toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
    } catch {
      return 'Invalid date/time';
    }
  };

  const calculateResolutionTime = () => {
    if (!formData.endDate || !formData.endTime || !formData.resolutionDelay) {
      return 'Not set';
    }
    
    try {
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
      const resolutionDateTime = new Date(endDateTime.getTime() + (formData.resolutionDelay * 60 * 60 * 1000));
      
      return resolutionDateTime.toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
    } catch {
      return 'Invalid date/time';
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-surface-dark/50 dark:bg-surface-dark p-6">
      <div className="flex items-center gap-2 mb-6">
        <span className="material-symbols-outlined text-primary">visibility</span>
        <h3 className="font-display text-xl font-bold text-text-dark">Market Preview</h3>
      </div>

      {/* Market Card Preview */}
      <div className="rounded-lg border border-white/10 bg-background-dark/30 p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h4 className="font-display text-lg font-bold text-text-dark mb-2">
              {formData.question || 'Market question will appear here...'}
            </h4>
            {formData.description && (
              <p className="text-sm text-text-muted-dark line-clamp-2">
                {formData.description}
              </p>
            )}
          </div>
          {formData.category && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
              {formData.category}
            </span>
          )}
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col items-center justify-center p-4 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
            <div className="text-2xl font-bold text-text-dark mb-1">50%</div>
            <div className="text-sm font-medium text-text-dark text-center">
              {formData.optionA || 'Option A'}
            </div>
            <div className="text-xs text-text-muted-dark mt-1">0 predictions</div>
          </div>
          
          <div className="flex flex-col items-center justify-center p-4 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
            <div className="text-2xl font-bold text-text-dark mb-1">50%</div>
            <div className="text-sm font-medium text-text-dark text-center">
              {formData.optionB || 'Option B'}
            </div>
            <div className="text-xs text-text-muted-dark mt-1">0 predictions</div>
          </div>
        </div>

        {/* Market Details */}
        <div className="border-t border-white/10 pt-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-text-muted-dark">Betting ends:</span>
              <p className="text-text-dark font-medium">
                {formatDateTime(formData.endDate, formData.endTime)}
              </p>
            </div>
            <div>
              <span className="text-text-muted-dark">Resolution time:</span>
              <p className="text-text-dark font-medium">
                {calculateResolutionTime()}
              </p>
            </div>
            <div>
              <span className="text-text-muted-dark">Minimum bet:</span>
              <p className="text-text-dark font-medium">
                {formData.minBetAmount ? `${formData.minBetAmount} ETH` : 'Not set'}
              </p>
            </div>
            <div>
              <span className="text-text-muted-dark">Resolution delay:</span>
              <p className="text-text-dark font-medium">
                {formData.resolutionDelay ? `${formData.resolutionDelay} hours` : 'Not set'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Button Preview */}
        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-text-muted-dark">
              Total Volume: $0
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-background-dark text-sm font-bold rounded-lg shadow-lg shadow-secondary/20 hover:brightness-110 transition-all">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              Place Bet
            </button>
          </div>
        </div>
      </div>

      {/* Preview Note */}
      <div className="flex items-start gap-3 mt-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
        <span className="material-symbols-outlined text-primary text-sm mt-0.5">info</span>
        <div className="text-sm">
          <p className="text-text-dark font-medium">Preview</p>
          <p className="text-text-muted-dark">
            This is how your market will appear to users. Complete the form to see a full preview.
          </p>
        </div>
      </div>
    </div>
  );
}