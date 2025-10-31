'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useAccount } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { 
  CONTRACT_ADDRESSES, 
  PREDICTION_MARKET_ABI, 
  MOCK_ERC20_ABI, 
  type Market, 
  type UserShares, 
  type CreatorStats,
  MarketOutcome 
} from '../lib/contracts';

// Hook for reading contract data
export function usePredictionMarketRead() {
  const { address } = useAccount();

  // Get market count
  const { data: marketCount } = useReadContract({
    address: CONTRACT_ADDRESSES.PREDICTION_MARKET,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'marketCount',
  });

  // Get market info by ID
  const getMarketInfo = (marketId: number) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.PREDICTION_MARKET,
      abi: PREDICTION_MARKET_ABI,
      functionName: 'getMarketInfo',
      args: [BigInt(marketId)],
    });
  };

  // Get market odds
  const getMarketOdds = (marketId: number) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.PREDICTION_MARKET,
      abi: PREDICTION_MARKET_ABI,
      functionName: 'getMarketOdds',
      args: [BigInt(marketId)],
    });
  };

  // Get user shares
  const getUserShares = (marketId: number) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.PREDICTION_MARKET,
      abi: PREDICTION_MARKET_ABI,
      functionName: 'getUserShares',
      args: [BigInt(marketId), address || '0x0'],
      enabled: !!address,
    });
  };

  // Get creator stats
  const getCreatorStats = (creatorAddress: string) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.PREDICTION_MARKET,
      abi: PREDICTION_MARKET_ABI,
      functionName: 'getCreatorStats',
      args: [creatorAddress as `0x${string}`],
      enabled: !!creatorAddress,
    });
  };

  // Get creator markets
  const getCreatorMarkets = (creatorAddress: string) => {
    return useReadContract({
      address: CONTRACT_ADDRESSES.PREDICTION_MARKET,
      abi: PREDICTION_MARKET_ABI,
      functionName: 'getCreatorMarkets',
      args: [creatorAddress as `0x${string}`],
      enabled: !!creatorAddress,
    });
  };

  // Get min bet amount
  const { data: minBetAmount } = useReadContract({
    address: CONTRACT_ADDRESSES.PREDICTION_MARKET,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'minBetAmount',
  });

  // Get all markets (by iterating through market IDs)
  const getAllMarkets = () => {
    // This would need to be implemented differently in a real app
    // For now, we'll just return the market count and let components handle fetching individual markets
    return { marketCount };
  };

  return {
    marketCount,
    minBetAmount,
    getMarketInfo,
    getMarketOdds,
    getUserShares,
    getCreatorStats,
    getCreatorMarkets,
    getAllMarkets,
  };
}

// Hook for writing to contracts
export function usePredictionMarketWrite() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();

  // Wait for transaction confirmation
  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed 
  } = useWaitForTransactionReceipt({ 
    hash 
  });

  // Create market
  const createMarket = async (
    question: string,
    category: string,
    duration: number, // in seconds
    resolutionDelay: number, // in seconds
    optionA: string,
    optionB: string
  ) => {
    return writeContract({
      address: CONTRACT_ADDRESSES.PREDICTION_MARKET,
      abi: PREDICTION_MARKET_ABI,
      functionName: 'createMarket',
      args: [
        question,
        category,
        BigInt(duration),
        BigInt(resolutionDelay),
        optionA,
        optionB,
      ],
    });
  };

  // Buy shares
  const buyShares = async (
    marketId: number,
    isOptionA: boolean,
    amount: string // in BNB
  ) => {
    return writeContract({
      address: CONTRACT_ADDRESSES.PREDICTION_MARKET,
      abi: PREDICTION_MARKET_ABI,
      functionName: 'buyShares',
      args: [
        BigInt(marketId),
        isOptionA,
        parseEther(amount),
      ],
    });
  };

  // Claim winnings
  const claimWinnings = async (marketId: number) => {
    return writeContract({
      address: CONTRACT_ADDRESSES.PREDICTION_MARKET,
      abi: PREDICTION_MARKET_ABI,
      functionName: 'claimWinnings',
      args: [BigInt(marketId)],
    });
  };

  // Resolve market (creator only)
  const resolveMarket = async (marketId: number, outcome: MarketOutcome) => {
    return writeContract({
      address: CONTRACT_ADDRESSES.PREDICTION_MARKET,
      abi: PREDICTION_MARKET_ABI,
      functionName: 'resolveMarket',
      args: [BigInt(marketId), outcome],
    });
  };

  // Cancel market (creator only)
  const cancelMarket = async (marketId: number) => {
    return writeContract({
      address: CONTRACT_ADDRESSES.PREDICTION_MARKET,
      abi: PREDICTION_MARKET_ABI,
      functionName: 'cancelMarket',
      args: [BigInt(marketId)],
    });
  };

  // Withdraw creator fees
  const withdrawCreatorFees = async () => {
    return writeContract({
      address: CONTRACT_ADDRESSES.PREDICTION_MARKET,
      abi: PREDICTION_MARKET_ABI,
      functionName: 'withdrawCreatorFees',
    });
  };

  return {
    createMarket,
    buyShares,
    claimWinnings,
    resolveMarket,
    cancelMarket,
    withdrawCreatorFees,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}

// Hook for ERC20 token operations
export function useTokenOperations() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();

  // Get token balance
  const { data: balance } = useReadContract({
    address: CONTRACT_ADDRESSES.MOCK_ERC20,
    abi: MOCK_ERC20_ABI,
    functionName: 'balanceOf',
    args: [address || '0x0'],
    enabled: !!address,
  });

  // Get allowance for prediction market
  const { data: allowance } = useReadContract({
    address: CONTRACT_ADDRESSES.MOCK_ERC20,
    abi: MOCK_ERC20_ABI,
    functionName: 'allowance',
    args: [address || '0x0', CONTRACT_ADDRESSES.PREDICTION_MARKET],
    enabled: !!address,
  });

  // Approve tokens for prediction market
  const approve = async (amount: string) => {
    return writeContract({
      address: CONTRACT_ADDRESSES.MOCK_ERC20,
      abi: MOCK_ERC20_ABI,
      functionName: 'approve',
      args: [CONTRACT_ADDRESSES.PREDICTION_MARKET, parseEther(amount)],
    });
  };

  // Mint tokens (for testing)
  const mint = async (to: string, amount: string) => {
    return writeContract({
      address: CONTRACT_ADDRESSES.MOCK_ERC20,
      abi: MOCK_ERC20_ABI,
      functionName: 'mint',
      args: [to as `0x${string}`, parseEther(amount)],
    });
  };

  return {
    balance,
    allowance,
    approve,
    mint,
    hash,
    isPending,
  };
}

// Utility functions
export const formatTokenAmount = (amount: bigint | undefined) => {
  if (!amount) return '0';
  return formatEther(amount);
};

export const parseTokenAmount = (amount: string) => {
  return parseEther(amount);
};

// Calculate odds percentage
export const calculateOddsPercentage = (optionAmount: bigint, totalAmount: bigint) => {
  if (totalAmount === 0n) return 50; // Default to 50% if no bets
  return Number((optionAmount * 100n) / totalAmount);
};