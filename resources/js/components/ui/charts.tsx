import { ReactNode } from "react";
import { Tooltip, TooltipProps } from "recharts";

interface ChartContainerProps {
  children: ReactNode;
  className?: string;
}

export function ChartContainer({ children, className = "" }: ChartContainerProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      {children}
    </div>
  );
}

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export function ChartTooltipContent({ active, payload, label }: ChartTooltipContentProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-neutral-800 p-3 rounded-lg shadow-lg border border-sidebar-border/70 dark:border-sidebar-border">
        <p className="text-sm font-medium mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} className="text-sm">
            <span className="font-medium">{entry.name}</span>: {entry.value}
          </p>
        ))}
      </div>
    );
  }

  return null;
}

export const ChartTooltip = Tooltip; 