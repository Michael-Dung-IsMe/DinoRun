import React, { useState } from 'react';
import { User, View } from '@/types';
import { Button } from '@/components/Button';
import { User as UserIcon, Wallet, Settings, LogOut, Shield, ChevronRight, AlertCircle } from 'lucide-react';

interface ProfileProps {
  user: User;
  onLogout: () => void;
  onConnectWallet: () => void;
  onChangeView: (view: View) => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onLogout, onConnectWallet, onChangeView }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SETTINGS'>('OVERVIEW');

  return (
    <div className="w-full max-w-4xl mx-auto p-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Sidebar */}
        <div className="md:col-span-4 space-y-4">
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 text-center relative overflow-hidden">
            {!user.walletAddress && (
                <div className="absolute top-0 left-0 w-full bg-red-500/10 text-red-400 text-xs py-1 font-bold animate-pulse border-b border-red-500/20">
                    WALLET REQUIRED
                </div>
            )}
            
            <div className="w-24 h-24 bg-slate-700 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-sui-500 mt-4">
              <UserIcon className="w-12 h-12 text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-white">{user.username}</h2>
            <p className="text-sm text-slate-400 mb-6">{user.email}</p>
            
            {user.walletAddress ? (
              <div className="bg-sui-500/10 border border-sui-500/50 rounded-lg p-2 text-xs font-mono text-sui-300 break-all">
                {user.walletAddress}
              </div>
            ) : (
              <div className="space-y-2">
                 <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 flex items-start gap-2 text-left">
                    <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-500">
                        Bạn cần kết nối ví để lưu tiến trình và bắt đầu chơi game.
                    </p>
                 </div>
                 <Button variant="primary" fullWidth onClick={onConnectWallet} className="animate-bounce">
                    <Wallet className="w-4 h-4 mr-2" />
                    Kết nối Ví ngay
                 </Button>
              </div>
            )}
          </div>

          <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700">
            <button 
              onClick={() => setActiveTab('OVERVIEW')}
              className={`w-full text-left px-6 py-4 flex items-center justify-between transition-colors ${activeTab === 'OVERVIEW' ? 'bg-slate-700/50 text-sui-400 border-l-4 border-sui-500' : 'text-slate-400 hover:bg-slate-700/30'}`}
            >
              <div className="flex items-center gap-3">
                <UserIcon className="w-5 h-5" />
                <span className="font-semibold">Hồ sơ</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
            
            <button 
              onClick={() => setActiveTab('SETTINGS')}
              className={`w-full text-left px-6 py-4 flex items-center justify-between transition-colors ${activeTab === 'SETTINGS' ? 'bg-slate-700/50 text-sui-400 border-l-4 border-sui-500' : 'text-slate-400 hover:bg-slate-700/30'}`}
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5" />
                <span className="font-semibold">Cài đặt</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </button>
            
            <button 
              onClick={onLogout}
              className="w-full text-left px-6 py-4 flex items-center justify-between text-red-400 hover:bg-red-500/10 transition-colors border-t border-slate-700"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5" />
                <span className="font-semibold">Đăng xuất</span>
              </div>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-8">
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                  <p className="text-slate-400 text-sm mb-1">Điểm cao nhất</p>
                  <p className="text-3xl font-pixel text-white">{user.highScore}</p>
                </div>
                 <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                  <p className="text-slate-400 text-sm mb-1">Số lượt chạy</p>
                  <p className="text-3xl font-pixel text-white">42</p>
                </div>
              </div>

              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-6">Kho đồ</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="aspect-square bg-slate-900 rounded-lg border-2 border-sui-500 flex items-center justify-center relative">
                     <span className="text-xs text-sui-400 font-pixel">MẶC ĐỊNH</span>
                     <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="aspect-square bg-slate-900 rounded-lg border border-slate-700 flex items-center justify-center opacity-50">
                      <Shield className="w-8 h-8 text-slate-600" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'SETTINGS' && (
             <div className="bg-slate-800 rounded-xl border border-slate-700 p-8">
               <h3 className="text-xl font-bold text-white mb-6">Cài đặt game</h3>
               
               <div className="space-y-6">
                 <div className="flex items-center justify-between pb-6 border-b border-slate-700">
                   <div>
                     <p className="font-semibold text-white">Âm thanh & Hiệu ứng</p>
                     <p className="text-sm text-slate-400">Bật/tắt âm thanh trong game</p>
                   </div>
                   <div className="w-12 h-6 bg-sui-500 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                   </div>
                 </div>

                 <div className="flex items-center justify-between pb-6 border-b border-slate-700">
                   <div>
                     <p className="font-semibold text-white">Chế độ tương phản cao</p>
                     <p className="text-sm text-slate-400">Giúp nhìn rõ chướng ngại vật hơn</p>
                   </div>
                   <div className="w-12 h-6 bg-slate-600 rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                   </div>
                 </div>
                 
                 <div className="pt-2">
                    <p className="font-semibold text-white mb-2">Xóa tài khoản</p>
                    <p className="text-sm text-slate-400 mb-4">Xóa vĩnh viễn dữ liệu và tiến trình chơi.</p>
                    <Button variant="danger" size="sm">Xóa tài khoản</Button>
                 </div>
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};