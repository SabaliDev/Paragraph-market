interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export default function Textarea({ 
  label, 
  error, 
  helperText, 
  className = '', 
  ...props 
}: TextareaProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-text-dark">
        {label}
        {props.required && <span className="text-red-400 ml-1">*</span>}
      </label>
      
      <textarea
        {...props}
        className={`
          w-full rounded-lg border border-white/10 bg-surface-dark/50 dark:bg-surface-dark 
          px-4 py-3 text-sm text-text-dark placeholder-text-muted-dark
          focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20
          transition-colors resize-vertical min-h-[100px]
          ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}
          ${className}
        `}
      />
      
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