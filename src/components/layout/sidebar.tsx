'use client';

import Link from 'next/link';
import { Home, BrainCircuit, BookOpenCheck, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { AppLogo } from '../icons/app-logo';

const navItems = [
  { href: '/', icon: Home, label: 'Dashboard' },
  { href: '/mind-map', icon: BrainCircuit, label: 'Mind Map' },
  { href: '/study', icon: BookOpenCheck, label: 'Study' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <aside className="w-20 bg-card hidden md:flex flex-col items-center py-6 px-2 border-r border-border fixed inset-y-0 left-0 z-20">
        <div className="mb-8">
            <Link href="/" aria-label="Home">
                <AppLogo />
            </Link>
        </div>
        <nav className="flex flex-col items-center gap-4 flex-grow">
          {navItems.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link href={item.href} passHref>
                  <Button
                    variant={pathname === item.href ? 'default' : 'ghost'}
                    size="icon"
                    className={cn(
                      'rounded-lg h-12 w-12',
                      pathname !== item.href && 'text-muted-foreground'
                    )}
                    aria-label={item.label}
                  >
                    <item.icon className="w-6 h-6" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>
        <div className="mt-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg h-12 w-12 text-muted-foreground"
                aria-label="Settings"
              >
                <Settings className="w-6 h-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}
