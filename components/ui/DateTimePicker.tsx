interface DateTimePickerProps {
  dateLabel: string;
  timeLabel: string;
  dateValue: string;
  timeValue: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  dateError?: string;
  timeError?: string;
  required?: boolean;
  minDate?: string;
}

export default function DateTimePicker({
  dateLabel,
  timeLabel,
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  dateError,
  timeError,
  required = false,
  minDate
}: DateTimePickerProps) {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  const minimumDate = minDate || today;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Date Input */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-text-dark">
          {dateLabel}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
        
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted-dark text-lg">
            calendar_today
          </span>
          <input
            type="date"
            value={dateValue}
            onChange={(e) => onDateChange(e.target.value)}
            min={minimumDate}
            required={required}
            className={`
              w-full rounded-lg border border-white/10 bg-surface-dark/50 dark:bg-surface-dark 
              pl-11 pr-4 py-3 text-sm text-text-dark
              focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20
              transition-colors
              ${dateError ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}
            `}
          />
        </div>
        
        {dateError && (
          <p className="text-sm text-red-400 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">error</span>
            {dateError}
          </p>
        )}
      </div>

      {/* Time Input */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-text-dark">
          {timeLabel}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
        
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted-dark text-lg">
            schedule
          </span>
          <input
            type="time"
            value={timeValue}
            onChange={(e) => onTimeChange(e.target.value)}
            required={required}
            className={`
              w-full rounded-lg border border-white/10 bg-surface-dark/50 dark:bg-surface-dark 
              pl-11 pr-4 py-3 text-sm text-text-dark
              focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20
              transition-colors
              ${timeError ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}
            `}
          />
        </div>
        
        {timeError && (
          <p className="text-sm text-red-400 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">error</span>
            {timeError}
          </p>
        )}
      </div>
    </div>
  );
}