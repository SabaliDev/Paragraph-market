interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  helperText?: string;
  icon?: string;
  options: { value: string; label: string }[];
}

export default function Select({ 
  label, 
  error, 
  helperText, 
  icon, 
  options,
  className = '', 
  ...props 
}: SelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-text-dark">
        {label}
        {props.required && <span className="text-red-400 ml-1">*</span>}
      </label>
      
      <div className="relative">
        {icon && (
          <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted-dark text-lg">
            {icon}
          </span>
        )}
        <select
          {...props}
          className={`
            w-full rounded-lg border border-white/10 bg-surface-dark/50 dark:bg-surface-dark 
            px-4 py-3 text-sm text-text-dark
            focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20
            transition-colors appearance-none cursor-pointer
            ${icon ? 'pl-11' : ''}
            ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}
            ${className}
          `}
        >
          <option value="" disabled className="text-text-muted-dark">
            Select an option...
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-surface-dark text-text-dark">
              {option.label}
            </option>
          ))}
        </select>
        <span className="material-symbols-outlined absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted-dark pointer-events-none">
          expand_more
        </span>
      </div>
      
      {error && (
        <p className="text-sm text-red-400 flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">error</span>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-text-muted-dark">
          {helperText}
        </p>
      )}
    </div>
  );
}