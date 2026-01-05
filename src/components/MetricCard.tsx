import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  variant?: 'default' | 'risk-low' | 'risk-medium' | 'risk-high';
}

export const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
}: MetricCardProps) => {
  const variantClasses = {
    default: 'bg-card border-border',
    'risk-low': 'bg-risk-low-bg/30 border-risk-low/20',
    'risk-medium': 'bg-risk-medium-bg/30 border-risk-medium/20',
    'risk-high': 'bg-risk-high-bg/30 border-risk-high/20',
  };

  const iconClasses = {
    default: 'bg-primary/10 text-primary',
    'risk-low': 'bg-risk-low/10 text-risk-low',
    'risk-medium': 'bg-risk-medium/10 text-risk-medium',
    'risk-high': 'bg-risk-high/10 text-risk-high',
  };

  return (
    <div
      className={cn(
        'p-5 rounded-xl border shadow-card hover:shadow-card-hover transition-all duration-300 animate-scale-in',
        variantClasses[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {trend && (
              <span
                className={cn(
                  'text-xs font-medium',
                  trend.positive ? 'text-risk-low' : 'text-risk-high'
                )}
              >
                {trend.positive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={cn('p-2.5 rounded-lg', iconClasses[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
};
