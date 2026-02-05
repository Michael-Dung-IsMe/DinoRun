import React, { useMemo } from 'react';
import { User } from '@/types';
import { MOCK_LEADERBOARD } from '@/constants';
import { Trophy, Medal, Coins, Crown } from 'lucide-react';

interface LeaderboardProps {
  currentUser: User;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ currentUser }) => {
  const leaderboardData = useMemo(() => {
    const data = [
      ...MOCK_LEADERBOARD,
      ...(MOCK_LEADERBOARD.some(u => u.id === currentUser.id) 
          ? [] 
          : [{ id: currentUser.id, username: currentUser.username, score: currentUser.highScore }])
    ];
    return data.sort((a, b) => b.score - a.score);
  }, [currentUser]);

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0: return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-500'; // Top 1
      case 1: return 'bg-slate-300/20 border-slate-300/50 text-slate-300';     // Top 2
      case 2: return 'bg-amber-600/20 border-amber-600/50 text-amber-600';     // Top 3
      default: return 'bg-slate-800 border-slate-700 text-slate-400';
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="w-6 h-6 text-yellow-500 fill-current" />;
      case 1: return <Medal className="w-6 h-6 text-slate-300 fill-current" />;
      case 2: return <Medal className="w-6 h-6 text-amber-600 fill-current" />;
      default: return <span className="w-6 text-center font-bold font-mono text-slate-500">#{index + 1}</span>;
    }
  };

  const getReward = (index: number) => {
      if (index === 0) return 5000;
      if (index === 1) return 3000;
      if (index === 2) return 1000;
      return 0;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 animate-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-pixel text-sui-400 mb-2 uppercase flex items-center justify-center gap-3">
            <Trophy className="w-8 h-8" />
            Leaderboard
            <Trophy className="w-8 h-8" />
        </h2>
        <p className="text-slate-400">Đua top hàng tuần để nhận phần thưởng giá trị!</p>
      </div>

      {/* Rewards Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-sui-900/30 to-slate-900 border border-sui-500/30 rounded-2xl p-6 mb-8 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-sui-400 to-yellow-500"></div>
         <div className="flex flex-col md:flex-row items-center justify-around gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
                <Crown className="w-8 h-8 text-yellow-500" />
                <div className="font-bold text-yellow-500">TOP 1</div>
                <div className="bg-slate-800 px-3 py-1 rounded-full border border-yellow-500/30 flex items-center gap-1 text-sm">
                    <Coins className="w-3 h-3 text-yellow-400" /> 5000 DC
                </div>
            </div>
            <div className="flex flex-col items-center gap-2">
                <Medal className="w-8 h-8 text-slate-300" />
                <div className="font-bold text-slate-300">TOP 2</div>
                <div className="bg-slate-800 px-3 py-1 rounded-full border border-slate-300/30 flex items-center gap-1 text-sm">
                    <Coins className="w-3 h-3 text-yellow-400" /> 3000 DC
                </div>
            </div>
            <div className="flex flex-col items-center gap-2">
                <Medal className="w-8 h-8 text-amber-600" />
                <div className="font-bold text-amber-600">TOP 3</div>
                <div className="bg-slate-800 px-3 py-1 rounded-full border border-amber-600/30 flex items-center gap-1 text-sm">
                    <Coins className="w-3 h-3 text-yellow-400" /> 1000 DC
                </div>
            </div>
         </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-slate-900/50 backdrop-blur rounded-2xl border border-slate-700 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-700 text-slate-400 font-bold text-sm uppercase tracking-wider">
            <div className="col-span-2 text-center">Hạng</div>
            <div className="col-span-6">Người chơi</div>
            <div className="col-span-4 text-right">Điểm số</div>
        </div>
        
        <div className="divide-y divide-slate-700/50">
            {leaderboardData.map((player, index) => {
                const isCurrentUser = player.id === currentUser.id;
                const reward = getReward(index);

                return (
                    <div 
                        key={player.id} 
                        className={`
                            grid grid-cols-12 gap-4 p-4 items-center transition-colors
                            ${isCurrentUser ? 'bg-sui-500/10 hover:bg-sui-500/20 border-l-4 border-sui-500' : 'hover:bg-slate-800/50'}
                        `}
                    >
                        <div className="col-span-2 flex justify-center">
                            {getRankIcon(index)}
                        </div>
                        <div className="col-span-6 flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600 text-xs font-bold text-slate-300">
                                {player.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className={`font-bold ${isCurrentUser ? 'text-sui-400' : 'text-slate-200'}`}>
                                    {player.username} {isCurrentUser && '(Bạn)'}
                                </div>
                                {reward > 0 && (
                                    <div className="text-[10px] text-yellow-500 flex items-center gap-1">
                                        + {reward} Coins
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-span-4 text-right">
                            <span className="font-pixel text-lg text-white tracking-widest">
                                {player.score.toLocaleString()}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};