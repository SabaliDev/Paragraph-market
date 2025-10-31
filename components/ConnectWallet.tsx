'use client';

import { useState, useRef, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function ConnectWallet() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-secondary text-background-dark text-sm font-bold shadow-lg shadow-secondary/20 hover:brightness-110 transition-all"
                  >
                    <span className="material-symbols-outlined">wallet</span>
                    <span className="truncate">Connect Wallet</span>
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-red-600 text-white text-sm font-bold shadow-lg hover:brightness-110 transition-all"
                  >
                    Wrong network
                  </button>
                );
              }

              return (
                <div className="flex gap-2">
                  <button
                    onClick={openChainModal}
                    className="flex items-center gap-2 rounded-lg h-10 px-3 bg-surface-dark/50 dark:bg-surface-dark border border-white/10 text-text-dark hover:bg-white/5 transition-colors"
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 20,
                          height: 20,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 20, height: 20 }}
                          />
                        )}
                      </div>
                    )}
                    <span className="text-sm font-medium">{chain.name}</span>
                  </button>

                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      type="button"
                      className="flex items-center gap-2 rounded-lg h-10 px-3 bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">account_balance_wallet</span>
                      <span className="text-sm font-medium">
                        {account.displayName}
                      </span>
                      <span className="text-xs opacity-70">
                        {account.displayBalance ? ` (${account.displayBalance})` : ''}
                      </span>
                      <span className="material-symbols-outlined text-sm">
                        {isDropdownOpen ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute right-0 top-12 w-64 bg-surface-dark border border-white/10 rounded-lg shadow-lg z-50">
                        <div className="p-3 border-b border-white/10">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                            <span className="text-sm font-medium text-text-dark">Connected Wallet</span>
                          </div>
                          <div className="text-xs text-text-muted-dark">
                            {account.address}
                          </div>
                          {account.displayBalance && (
                            <div className="text-xs text-text-muted-dark mt-1">
                              Balance: {account.displayBalance}
                            </div>
                          )}
                        </div>
                        
                        <div className="p-2">
                          <button
                            onClick={() => {
                              openAccountModal();
                              setIsDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-dark hover:bg-white/5 rounded-lg transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">settings</span>
                            Account Settings
                          </button>
                          
                          <button
                            onClick={() => {
                              openAccountModal();
                              setIsDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm">logout</span>
                            Disconnect Wallet
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}