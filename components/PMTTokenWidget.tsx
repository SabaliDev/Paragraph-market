'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useTokenOperations, formatTokenAmount } from '../hooks/useContracts';

export default function PMTTokenWidget() {
  const { address } = useAccount();
  const { balance, allowance, approve, mint, isPending } = useTokenOperations();
  const [mintAmount, setMintAmount] = useState('100');
  const [approveAmount, setApproveAmount] = useState('1000');

  const handleMintTokens = async () => {
    if (!address) return;
    try {
      await mint(address, mintAmount);
    } catch (error) {
      console.error('Error minting tokens:', error);
    }
  };

  const handleApproveTokens = async () => {
    try {
      await approve(approveAmount);
    } catch (error) {
      console.error('Error approving tokens:', error);
    }
  };

  if (!address) {
    return (
      <div className="bg-surface-dark/50 border border-white/10 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-text-dark mb-2">PMT Token Management</h3>
        <p className="text-text-muted-dark text-sm">Connect your wallet to manage PMT tokens</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-dark/50 border border-white/10 rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="material-symbols-outlined text-primary">token</span>
        <h3 className="text-lg font-semibold text-text-dark">PMT Token Management</h3>
      </div>

      {/* Token Balance */}
      <div className="bg-background-dark/50 rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-text-muted-dark">PMT Balance:</span>
          <span className="text-sm font-medium text-text-dark">
            {balance ? formatTokenAmount(balance) : '0'} PMT
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-text-muted-dark">Approved for betting:</span>
          <span className="text-sm font-medium text-text-dark">
            {allowance ? formatTokenAmount(allowance) : '0'} PMT
          </span>
        </div>
      </div>

      {/* Mint Tokens */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-dark">Get Test PMT Tokens</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={mintAmount}
            onChange={(e) => setMintAmount(e.target.value)}
            placeholder="Amount to mint"
            className="flex-1 px-3 py-2 bg-background-dark border border-white/10 rounded-lg text-text-dark text-sm focus:border-primary/50 focus:outline-none"
          />
          <button
            onClick={handleMintTokens}
            disabled={isPending || !mintAmount}
            className="px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg text-sm font-medium hover:bg-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? 'Minting...' : 'Mint PMT'}
          </button>
        </div>
        <p className="text-xs text-text-muted-dark">
          Mint test PMT tokens to your wallet for betting
        </p>
      </div>

      {/* Approve Tokens */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-dark">Approve Tokens for Betting</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={approveAmount}
            onChange={(e) => setApproveAmount(e.target.value)}
            placeholder="Amount to approve"
            className="flex-1 px-3 py-2 bg-background-dark border border-white/10 rounded-lg text-text-dark text-sm focus:border-primary/50 focus:outline-none"
          />
          <button
            onClick={handleApproveTokens}
            disabled={isPending || !approveAmount}
            className="px-4 py-2 bg-secondary/20 text-secondary border border-secondary/30 rounded-lg text-sm font-medium hover:bg-secondary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? 'Approving...' : 'Approve'}
          </button>
        </div>
        <p className="text-xs text-text-muted-dark">
          Approve PMT tokens to allow the prediction market contract to use them for betting
        </p>
      </div>

      {/* Status Info */}
      {isPending && (
        <div className="flex items-center gap-2 text-sm text-primary">
          <span className="material-symbols-outlined animate-spin">progress_activity</span>
          Transaction in progress...
        </div>
      )}
    </div>
  );
}