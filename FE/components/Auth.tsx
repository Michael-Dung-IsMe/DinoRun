import React, { useState } from 'react';
// import { Button } from './Button'; // Removed unused import
import { User } from '@/types';
import { MOCK_USER } from '@/constants';
import { Loader2, ShieldCheck } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handleZkLogin = (provider: 'Google' | 'Facebook') => {
    setIsLoading(true);
    setStatus(`Connecting to ${provider}...`);

    // Simulate OAuth Delay
    setTimeout(() => {
      setStatus('Verifying JWT...');
      
      // Simulate Salt Fetching & ZK Proof Generation
      setTimeout(() => {
        setStatus('Generating Zero-Knowledge Proof...');
        
        // Simulate Address Derivation
        setTimeout(() => {
           // Giả lập đăng nhập thành công nhưng CHƯA có walletAddress
           // User sẽ phải connect ví thủ công ở bước sau
           
           const zkUser: User = {
             ...MOCK_USER,
             id: `zk_${provider.toLowerCase()}_${Date.now()}`,
             username: `${provider}Runner`,
             email: `user@${provider.toLowerCase()}.com`,
             walletAddress: undefined, // Đặt là undefined để bắt buộc kết nối ví sau đó
           };

           setIsLoading(false);
           onLogin(zkUser);
        }, 1500); // Giảm thời gian chờ một chút cho nhanh
      }, 1000);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-slate-900">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
         <div className="absolute top-10 left-10 w-32 h-32 bg-sui-500 rounded-full blur-3xl"></div>
         <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-2xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-pixel text-sui-400 mb-2">DINO RUN</h1>
          <p className="text-slate-400">Web3 Endless Runner on Sui</p>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4 animate-in fade-in">
              <div className="relative">
                <div className="absolute inset-0 bg-sui-500/20 blur-xl rounded-full"></div>
                <Loader2 className="w-12 h-12 text-sui-400 animate-spin relative z-10" />
              </div>
              <p className="text-sui-300 font-mono text-sm animate-pulse">{status}</p>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <button
                  onClick={() => handleZkLogin('Google')}
                  className="w-full bg-white text-slate-900 hover:bg-slate-100 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-lg shadow-white/5 group"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.05H2.18C.94 9.53.94 12.47 2.18 14.95l3.66-2.84z" />
                    <path fill="#EA4335" d="M12 4.63c1.61 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.19 14.97 0 12 0 7.7 0 3.99 2.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign in with Google
                </button>

                <button
                  onClick={() => handleZkLogin('Facebook')}
                  className="w-full bg-[#1877F2] text-white hover:bg-[#1864cc] font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-lg shadow-[#1877F2]/20"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.971.956-2.971 3.594v.376h3.842l-.608 3.669h-3.235v7.98h-4.943z"/>
                  </svg>
                  Sign in with Facebook
                </button>
              </div>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-800 px-2 text-slate-500">Powered by Sui zkLogin</span>
                </div>
              </div>

              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50 flex items-start gap-3">
                 <ShieldCheck className="w-5 h-5 text-sui-400 shrink-0 mt-0.5" />
                 <p className="text-xs text-slate-400 leading-relaxed">
                   Login seamlessly with your Web2 accounts.
                 </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};