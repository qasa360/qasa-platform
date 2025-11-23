import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0-100
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, showLabel = false, size = 'md', ...props }, ref) => {
    const heightClass = {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3',
    }[size];

    return (
      <div className={cn('space-y-1', className)} {...props} ref={ref}>
        {showLabel && (
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Progreso</span>
            <span className="font-medium">{Math.round(value)}%</span>
          </div>
        )}
        <div
          className={cn(
            'w-full overflow-hidden rounded-full bg-muted',
            heightClass
          )}
        >
          <div
            className={cn(
              'h-full bg-primary transition-all duration-300 ease-in-out',
              value === 100 && 'bg-green-500'
            )}
            style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          />
        </div>
      </div>
    );
  }
);
Progress.displayName = 'Progress';

export { Progress };
