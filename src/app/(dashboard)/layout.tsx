// src/app/(dashboard)/layout.tsx
'use client';
import Image from 'next/image';
import logoImage from '@/assets/images/icons/logo.png';
import { FloatingChatbot } from '@/components/ui/floating-chatbot';
import { useState } from 'react';
import { useAnalytics } from '@/lib/hooks/use-analytics';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ThemeSwitcher } from '@/components/ui/theme-switcher';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  HomeIcon,
  ExclamationTriangleIcon,
  CreditCardIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
  BellIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: React.ReactNode;
};

const navigationBase: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Alerts', href: '/alerts', icon: ExclamationTriangleIcon },
  { name: 'Transactions', href: '/transactions', icon: CreditCardIcon },
  { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
  { name: 'Investigator', href: '/investigator', icon: MagnifyingGlassIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
];

const demoSession = {
  user: {
    name: 'Demo Fraud Analyst',
    email: 'demo@guardchain.ai',
    image: null,
    role: 'FRAUD_ANALYST'
  }
};


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const { analytics } = useAnalytics();
  // Alerts badge: show sum of high and critical alerts (all time)
  const alertsBadge = analytics?.highRiskAlerts && analytics.highRiskAlerts > 0 ? analytics.highRiskAlerts : undefined;
  const navigation = navigationBase.map(item =>
    item.name === 'Alerts' ? { ...item, badge: alertsBadge } : item
  );

  const handleLogout = () => {
    logout();
  };

  const getInitials = (name?: string | null) => {
    if (!name) return 'DA';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <div className={`lg:hidden ${sidebarOpen ? 'fixed inset-0 z-50' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/80" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-card border-r">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center space-x-2">
  <Image 
    src={logoImage} 
    alt="SI JagaDana Logo" 
    width={32} 
    height={32} 
    className="rounded-lg"
  />
  <span className="text-xl font-bold text-foreground">SI JagaDana</span>
</div>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <XMarkIcon className="h-6 w-6" />
            </Button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                  {item.badge !== undefined && (
                    <Badge variant="destructive" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow border-r border-border bg-card pt-5">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="flex items-center space-x-2">
  <Image 
    src={logoImage} 
    alt="SI JagaDana Logo" 
    width={32} 
    height={32} 
    className="rounded-lg"
  />
  <span className="text-xl font-bold text-foreground">SI JagaDana</span>
</div>
          </div>
          <div className="mt-8 flex flex-grow flex-col">
            <nav className="flex-1 space-y-1 px-2 pb-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                  {item.badge !== undefined && (
                    <Badge variant="destructive" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
            </nav>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top header */}
        <header className="bg-card shadow-sm border-b border-border">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Bars3Icon className="h-6 w-6" />
              </Button>
              
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-semibold text-foreground">
                  {navigation.find(item => item.href === pathname)?.name || 'Dashboard'}
                </h1>
                <Badge variant="outline" className="text-green-600 border-green-200 dark:text-green-400 dark:border-green-800">
                  Demo Mode
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Theme switcher */}
              <ThemeSwitcher />

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <BellIcon className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs">
                  3
                </Badge>
              </Button>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(demoSession.user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {demoSession.user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {demoSession.user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/settings')}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    
      {/* Floating Chatbot - tambahkan ini */}
      <FloatingChatbot />
    </div>
  );
}