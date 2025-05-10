
import React from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard = ({ title, value, icon, trend, className }: StatCardProps) => {
  return (
    <div className={cn("stat-card", className)}>
      <div className="flex justify-between items-center">
        <span className="stat-title">{title}</span>
        <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
      <div className="stat-value">{value}</div>
      
      {trend && (
        <div className={cn(
          "flex items-center text-xs font-medium",
          trend.isPositive ? "text-finance-mint" : "text-destructive"
        )}>
          <span>{trend.isPositive ? '↑' : '↓'}</span>
          <span className="ml-1">{Math.abs(trend.value)}%</span>
          <span className="ml-1 text-muted-foreground">desde el último mes</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
