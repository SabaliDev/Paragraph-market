'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function ConnectWallet() {
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

                  <button
                    onClick={openAccountModal}
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
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}