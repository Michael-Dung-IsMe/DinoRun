import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Auth } from '@/components/Auth';
import { Game } from '@/components/Game';
import { Leaderboard } from '@/components/Leaderboard';
import { Profile } from '@/components/Profile';
import { View, User, ShopItem } from '@/types';
import { MOCK_USER } from '@/constants';

function App() {
  const [currentView, setCurrentView] = useState<View>(View.AUTH);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('dino_user_data');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      } catch (e) {
        console.error("Failed to load save data");
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('dino_user_data', JSON.stringify(user));
    }
  }, [user]);

  // Điều hướng có kiểm tra ví
  const handleViewChange = (view: View) => {
    // Nếu muốn vào trang HOME (Chơi game) mà chưa kết nối ví -> Chặn và báo lỗi
    if (view === View.HOME && (!user?.walletAddress)) {
        alert("Vui lòng kết nối ví trong mục Profile để bắt đầu chơi!");
        setCurrentView(View.PROFILE);
        return;
    }
    setCurrentView(view);
  };

  const handleLogin = (userData: User) => {
    const startingUser = user && user.id === userData.id ? user : {
       ...userData,
       equippedSkin: userData.equippedSkin || MOCK_USER.equippedSkin,
       equippedBackground: userData.equippedBackground || MOCK_USER.equippedBackground,
       inventory: userData.inventory || MOCK_USER.inventory
    };
    
    setUser(startingUser);

    // LOGIC MỚI: Kiểm tra ví ngay sau khi login
    if (startingUser.walletAddress) {
        setCurrentView(View.HOME);
    } else {
        // Nếu chưa có ví, chuyển sang Profile để kết nối
        alert("Đăng nhập thành công! Vui lòng kết nối ví để tiếp tục.");
        setCurrentView(View.PROFILE);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('dino_user_data');
    setCurrentView(View.AUTH);
  };

  const handleConnectWallet = () => {
    if (user) {
      // Giả lập kết nối ví thành công
      const mockAddress = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('').substring(0, 64);
      const updatedUser = { ...user, walletAddress: mockAddress };
      
      setUser(updatedUser);
      alert('Kết nối ví thành công! Bạn có thể bắt đầu chơi.');
      setCurrentView(View.HOME); // Chuyển ngay sang màn hình chơi game
    }
  };

  const handleGameOver = (score: number) => {
    if (user && score > user.highScore) {
      setUser({ ...user, highScore: score });
    }
  };

  const renderContent = () => {
    if (!user) return <Auth onLogin={handleLogin} />;

    switch (currentView) {
      case View.HOME:
        return (
          <div 
            className="flex-1 flex items-center justify-center p-4 transition-all duration-700"
            style={{ background: user.equippedBackground }}
          >
            <Game 
              onGameOver={handleGameOver} 
              userSkin={user.equippedSkin} 
            />
          </div>
        );
      case View.LEADERBOARD:
        return <Leaderboard currentUser={user} />;
      case View.PROFILE:
        return (
          <div className="flex-1 bg-slate-900">
             <Profile user={user} onLogout={handleLogout} onConnectWallet={handleConnectWallet} onChangeView={handleViewChange} />
          </div>
        );
      default:
        return <div className="p-10 text-center">Page Not Found</div>;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      onChangeView={handleViewChange} 
      user={user || undefined}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;