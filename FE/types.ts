export enum View {
  HOME = 'HOME',
  LEADERBOARD = 'LEADERBOARD', // Changed from SHOP
  PROFILE = 'PROFILE',
  AUTH = 'AUTH',
  SETTINGS = 'SETTINGS',
}

export interface User {
  id: string;
  username: string;
  email: string;
  balanceSUI: number;
  balanceDinoCoin: number;
  walletAddress?: string;
  highScore: number;
  equippedSkin: string;      
  equippedBackground: string; 
  inventory: string[];       
}

export interface ShopItem {
  id: string;
  name: string;
  type: 'SKIN' | 'BACKGROUND' | 'CURRENCY';
  price: number;
  currency: 'SUI' | 'DINO';
  image: string;      
  value: string;      
  description: string;
}

export enum GameState {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  GAME_OVER = 'GAME_OVER',
}