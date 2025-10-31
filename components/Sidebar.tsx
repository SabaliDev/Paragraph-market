'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface NavItem {
  name: string;
  icon: string;
  href: string;
  active?: boolean;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', icon: 'dashboard', href: '/dashboard', active: true },
  { name: 'Markets', icon: 'monitoring', href: '/markets' },
  { name: 'Embeds', icon: 'code', href: '/embeds' },
  { name: 'Settings', icon: 'settings', href: '/settings' },
];

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const { address, isConnected } = useAccount();
  const pathname = usePathname();

  // Update active item based on current pathname
  useEffect(() => {
    const currentPage = navigation.find(item => item.href === pathname);
    if (currentPage) {
      setActiveItem(currentPage.name);
    }
  }, [pathname]);

  return (
    <aside className="flex flex-col w-64 bg-background-light dark:bg-background-dark border-r border-white/10 p-4 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 p-3 mb-6">
        <svg 
          fill="none" 
          height="32" 
          viewBox="0 0 32 32" 
          width="32" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" 
            fill="url(#paint0_linear_1_2)"
          />
          <path 
            d="M16.0002 19.5554C18.653 19.5554 20.778 17.4305 20.778 14.7777C20.778 12.1249 18.653 9.99991 16.0002 9.99991C13.3474 9.99991 11.2224 12.1249 11.2224 14.7777C11.2224 17.4305 13.3474 19.5554 16.0002 19.5554Z" 
            stroke="#101820" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2"
          />
          <path 
            d="M16 25.4444C21.6 25.4444 26.6667 22.2222 26.6667 18.6667V14.7778C26.6667 11.2222 21.6 8 16 8C10.4 8 5.33333 11.2222 5.33333 14.7778V18.6667C5.33333 22.2222 10.4 25.4444 16 25.4444Z" 
            stroke="#101820" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2"
          />
          <defs>
            <linearGradient 
              gradientUnits="userSpaceOnUse" 
              id="paint0_linear_1_2" 
              x1="0" 
              x2="32" 
              y1="0" 
              y2="32"
            >
              <stop stopColor="#FFD166" />
              <stop offset="1" stopColor="#00FFF0" />
            </linearGradient>
          </defs>
        </svg>
        <h1 className="font-display text-lg font-bold text-text-light dark:text-text-dark">
          AuracleMarket
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 flex-grow">
        {navigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              activeItem === item.name
                ? 'bg-primary/20 text-primary font-bold'
                : 'hover:bg-white/5 text-text-muted-dark hover:text-text-dark'
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <p className={`text-sm ${activeItem === item.name ? 'font-bold' : 'font-medium'}`}>
              {item.name}
            </p>
          </a>
        ))}
      </nav>

      {/* User Profile */}
      <div className="flex flex-col gap-3 border-t border-white/10 pt-4">
        {/* Wallet Status */}
        {isConnected ? (
          <div className="flex items-center gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-center w-8 h-8 bg-primary/20 rounded-full">
              <span className="material-symbols-outlined text-primary text-sm">account_balance_wallet</span>
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <p className="text-text-dark text-xs font-medium">Connected</p>
              <p className="text-primary text-xs font-mono truncate">
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ''}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3 bg-gray-500/10 border border-gray-500/20 rounded-lg">
            <div className="flex items-center justify-center w-8 h-8 bg-gray-500/20 rounded-full">
              <span className="material-symbols-outlined text-gray-400 text-sm">account_balance_wallet</span>
            </div>
            <div className="flex flex-col">
              <p className="text-gray-400 text-xs font-medium">Not Connected</p>
              <p className="text-text-muted-dark text-xs">Connect your wallet</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <div 
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuD4Cu_NX33ZRY1kYgcCAHNHgZGTLBAyenWTVFA_lM-2cxQi7KzjnuaEcPPcGxqGIjLm4S4zOoxi3E2Pm_6vB4zaeauIJdL29YkCVxsq5j7Os6gNb7WSGblVZjoS2rt_YLxY70HIVzz8Fz7ZHErfcJS9k7SEMssiXlyI41P_kZShA2fjcZz8SEGmNv-OM280O8ThXRsGZ4yu36Lw8ojCPsLX-a9ZHUH23NWYZTkYTl4nNPGlhL26hvV5zO-XNYUixY2sOT4u01zxlTg")`
            }}
          />
          <div className="flex flex-col">
            <h2 className="text-text-dark text-sm font-medium">John Doe</h2>
            <p className="text-text-muted-dark text-xs">Developer</p>
          </div>
        </div>
        <a 
          className="flex items-center gap-3 px-3 py-2 mt-2 rounded-lg hover:bg-white/5 text-text-muted-dark hover:text-text-dark transition-colors" 
          href="#"
        >
          <span className="material-symbols-outlined">logout</span>
          <p className="text-sm font-medium">Logout</p>
        </a>
      </div>
    </aside>
  );
}