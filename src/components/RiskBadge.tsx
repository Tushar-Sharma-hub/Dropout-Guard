import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  level: 'Low' | 'Medium' | 'High';
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

export const RiskBadge = ({ level, size = 'md', showPulse = false }: RiskBadgeProps) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const colorClasses = {
    Low: 'bg-risk-low-bg text-risk-low',
    Medium: 'bg-risk-medium-bg text-risk-medium',
    High: 'bg-risk-high-bg text-risk-high',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full transition-all',
        sizeClasses[size],
        colorClasses[level],
        showPulse && level === 'High' && 'animate-pulse-slow'
      )}
    >
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full',
          level === 'Low' && 'bg-risk-low',
          level === 'Medium' && 'bg-risk-medium',
          level === 'High' && 'bg-risk-high'
        )}
      />
      {level} Risk
    </span>
  );
};
