export interface Market {
  id: string;
  question: string;
  category: string;
  description?: string;
  optionA: string;
  optionB: string;
  optionAOdds: number;
  optionBOdds: number;
  totalPredictions: number;
  totalVolume: string;
  endTime: string;
  resolutionTime: string;
  status: 'active' | 'resolved' | 'cancelled';
  creator: string;
  createdAt: string;
}

export interface EmbedConfig {
  theme: 'light' | 'dark';
  showDescription: boolean;
  showOdds: boolean;
  showVolume: boolean;
  showCreator: boolean;
  width: string;
  height: string;
  borderRadius: string;
}

export interface ShareOptions {
  url: string;
  image: string;
  iframe: string;
  title: string;
  description: string;
}

export const DEFAULT_EMBED_CONFIG: EmbedConfig = {
  theme: 'dark',
  showDescription: true,
  showOdds: true,
  showVolume: true,
  showCreator: true,
  width: '400px',
  height: 'auto',
  borderRadius: '12px'
};

export const EMBED_SIZES = [
  { name: 'Small', width: '320px', height: '200px' },
  { name: 'Medium', width: '400px', height: '250px' },
  { name: 'Large', width: '500px', height: '300px' },
  { name: 'Full Width', width: '100%', height: 'auto' }
];

export const IMAGE_TEMPLATES = [
  { name: 'Default', id: 'default' },
  { name: 'Minimal', id: 'minimal' },
  { name: 'Bold', id: 'bold' },
  { name: 'Gradient', id: 'gradient' }
];