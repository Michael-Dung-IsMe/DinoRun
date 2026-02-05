import { ShopItem, User } from '@/types';

export const MOCK_USER: User = {
  id: 'u_123',
  username: 'SuiRunner99',
  email: 'runner@sui.io',
  balanceSUI: 1000, 
  balanceDinoCoin: 500,
  highScore: 0,
  equippedSkin: '#3898EC', 
  equippedBackground: 'linear-gradient(to bottom, #1e293b, #0f172a)', 
  inventory: ['default_skin', 'default_bg'],
  walletAddress: undefined, 
};

export const MOCK_LEADERBOARD = [
  { id: '1', username: 'SuiWhale 🐋', score: 15000 },
  { id: '2', username: 'DinoKing 🦖', score: 12500 },
  { id: '3', username: 'SpeedDemon ⚡', score: 10000 },
  { id: '4', username: 'CryptoNinja', score: 8500 },
  { id: '5', username: 'ToTheMoon 🚀', score: 7200 },
  { id: '6', username: 'PixelArtist', score: 6000 },
  { id: '7', username: 'BlockChain', score: 4500 },
];

export const GAME_SPEED_START = 5;
export const JUMP_FORCE = 12;
export const GRAVITY = 0.6;