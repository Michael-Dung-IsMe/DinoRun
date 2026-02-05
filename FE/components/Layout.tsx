import React from 'react';
import { View, User } from '@/types';
import { Home, Trophy, User as UserIcon } from 'lucide-react'; // Changed ShoppingBag to Trophy

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  onChangeView: (view: View) => void;
  user?: User;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onChangeView, user }) => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col text-slate-100 font-sans">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => onChangeView(View.HOME)}
          >
            <div className="w-8 h-8 bg-sui-500 rounded flex items-center justify-center transform group-hover:rotate-12 transition-transform">
              <span className="font-pixel text-lg">D</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              SUI<span className="text-sui-400">RUNNER</span>
            </h1>
          </div>

          {user && (
            <nav className="flex items-center gap-1 sm:gap-4">
              <NavButton 
                active={currentView === View.HOME} 
                onClick={() => onChangeView(View.HOME)} 
                icon={<Home size={18} />}
                label="Chơi ngay"
              />
              <NavButton 
                active={currentView === View.LEADERBOARD} 
                onClick={() => onChangeView(View.LEADERBOARD)} 
                icon={<Trophy size={18} />}
                label="BXH"
              />
              <NavButton 
                active={currentView === View.PROFILE} 
                onClick={() => onChangeView(View.PROFILE)} 
                icon={<UserIcon size={18} />}
                label="Hồ sơ"
              />
              
              <div className="hidden md:flex ml-4 items-center gap-3 pl-4 border-l border-slate-700">
                <div className="text-right">
                  <p className="text-xs text-slate-400">Số dư</p>
                  <p className="text-sm font-mono font-bold text-sui-400">{user.balanceSUI} SUI</p>
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">
        {children}
      </main>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-3 py-2 rounded-lg transition-all
      ${active 
        ? 'bg-slate-800 text-sui-400 ring-1 ring-slate-700' 
        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
      }
    `}
  >
    {icon}
    <span className="hidden sm:inline font-medium text-sm">{label}</span>
  </button>
);