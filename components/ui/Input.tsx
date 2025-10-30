interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  icon?: string;
}

export default function Input({ 
  label, 
  error, 
  helperText, 
  icon, 
  className = '', 
  ...props 
}: InputProps) {
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
        <input
          {...props}
          className={`
            w-full rounded-lg border border-white/10 bg-surface-dark/50 dark:bg-surface-dark 
            px-4 py-3 text-sm text-text-dark placeholder-text-muted-dark
            focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20
            transition-colors
            ${icon ? 'pl-11' : ''}
            ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}
            ${className}
          `}
        />
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