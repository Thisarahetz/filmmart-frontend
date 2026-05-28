import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-semibold',
        variant === 'default' && 'bg-yellow-400/20 text-yellow-300',
        variant === 'outline' && 'border border-white/30 text-gray-300',
        className
      )}
      {...props}
    />
  );
}
