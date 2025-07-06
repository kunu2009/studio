'use client';

import Link from 'next/link';
import { Home, BrainCircuit, BookOpenCheck } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/', icon: Home, label: 'Dashboard' },
  { href: '/mind-map', icon: BrainCircuit, label: 'Mind Map' },
  { href: '/study', icon: BookOpenCheck, label: 'Study' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-2 flex justify-around md:hidden z-10">
      {navItems.map((item) => (
        <Link href={item.href} key={item.href} passHref>
          <Button
            variant={pathname === item.href ? 'secondary' : 'ghost'}
            className="flex flex-col h-auto items-center justify-center p-2 flex-1"
            aria-label={item.label}
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span className="text-xs">{item.label}</span>
          </Button>
        </Link>
      ))}
    </nav>
  );
}
