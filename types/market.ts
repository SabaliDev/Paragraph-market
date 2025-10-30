export interface CreateMarketForm {
  question: string;
  category: string;
  description: string;
  optionA: string;
  optionB: string;
  endDate: string;
  endTime: string;
  resolutionDelay: number; // in hours
  minBetAmount: string;
}

export interface MarketFormErrors {
  question?: string;
  category?: string;
  description?: string;
  optionA?: string;
  optionB?: string;
  endDate?: string;
  endTime?: string;
  resolutionDelay?: string;
  minBetAmount?: string;
}

export const MARKET_CATEGORIES = [
  'Crypto',
  'Sports',
  'Politics',
  'Technology',
  'Entertainment',
  'Business',
  'Science',
  'Weather',
  'Gaming',
  'Other'
] as const;

export type MarketCategory = typeof MARKET_CATEGORIES[number];