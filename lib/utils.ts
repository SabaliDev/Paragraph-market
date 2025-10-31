// Utility functions for the application

// Safely convert BigInt to string for serialization
export function bigIntToString(value: unknown): string {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value);
  }
  return '0';
}

// Safely convert BigInt to number
export function bigIntToNumber(value: unknown): number {
  if (typeof value === 'bigint') {
    return Number(value);
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return Number(value);
  }
  return 0;
}

// Format address for display
export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Safe JSON stringify that handles BigInt
export function safeStringify(obj: any): string {
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'bigint') {
      return value.toString();
    }
    return value;
  });
}

// Parse JSON safely
export function safeParse(str: string): any {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}