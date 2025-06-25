import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Monitor, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

const appearanceOptions: { value: Appearance; icon: LucideIcon; label: string }[] = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'system', icon: Monitor, label: 'System' },
];

export default function AppearanceDropdown({ className = '' }: { className?: string }) {
  const { appearance, updateAppearance } = useAppearance();
  const active = appearanceOptions.find(opt => opt.value === appearance);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('text-foreground dark:text-white dark:hover:text-foreground gap-2', className)}
          
        >
          {active?.icon && <active.icon className="w-4 h-4" />}
          {active?.label ?? 'Appearance'}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-40 bg-background text-foreground">
        {appearanceOptions.map(({ value, icon: Icon, label }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => updateAppearance(value)}
            className={cn(
              'flex items-center gap-2 px-2 py-1.5',
              'bg-background text-foreground',
              'dark:text-white dark:hover:text-foreground data-[highlighted]:bg-sidebar-accent data-[highlighted]:text-background',
              appearance === value && 'font-semibold'
            )}
          >
            <Icon className="w-4 h-4 text-inherit" />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
