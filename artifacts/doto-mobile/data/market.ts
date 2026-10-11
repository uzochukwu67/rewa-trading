export interface Market {
  symbol: string;
  name: string;
  price: number;
  change: number;
  category: 'Crypto' | 'Forex' | 'Commodity' | 'Index';
  badge: string;
}

export const MARKET_DATA: Market[] = [
  { symbol: 'BTCUSD', name: 'Bitcoin', price: 64205.29, change: 2.45, category: 'Crypto', badge: '₿' },
  { symbol: 'XAUUSD', name: 'Gold OTC', price: 2394.65, change: 0.83, category: 'Commodity', badge: 'Au' },
  { symbol: 'USOIL', name: 'Oil Crude', price: 78.42, change: -0.62, category: 'Commodity', badge: 'O' },
  { symbol: 'USTEC', name: 'US Tech 100', price: 18344.7, change: 1.28, category: 'Index', badge: 'N' },
  { symbol: 'ETHUSD', name: 'Ethereum', price: 3450.18, change: 3.16, category: 'Crypto', badge: '◆' },
  { symbol: 'EURUSD', name: 'EUR / USD', price: 1.08426, change: -0.15, category: 'Forex', badge: '€' },
];

export function marketPrice(symbol: string): number {
  return MARKET_DATA.find((item) => item.symbol === symbol)?.price ?? MARKET_DATA[0].price;
}

export function money(value: number, currency = 'USD'): string {
  if (currency === 'NGN') {
    return `₦${value.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
