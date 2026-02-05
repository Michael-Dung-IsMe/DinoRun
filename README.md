# 🦖 SUI DinoRun - Web3 Endless Runner

**Một tựa game Play-to-Earn Endless Runner xây dựng trên hệ sinh thái SUI Blockchain.**

![Sui Network](https://img.shields.io/badge/Sui-Testnet-blue)
![Move Language](https://img.shields.io/badge/Language-Move-green)
![React](https://img.shields.io/badge/Frontend-React_Vite-61DAFB)
![License](https://img.shields.io/badge/License-MIT-yellow)

[Tính Năng](#-tính-năng-nổi-bật) • [Kiến Trúc](#-kiến-trúc-hệ-thống) • [Contracts](#-smart-contracts) • [Cài Đặt](#-hướng-dẫn-cài-đặt) • [Roadmap](#-roadmap)

---

## 📖 Giới thiệu

SUI DinoRun là dự án tham gia **SUI Campus Hackathon - PTIT**. Lấy cảm hứng từ tựa game T-Rex Runner huyền thoại của Chrome, chúng tôi đã nâng cấp nó trở thành một ứng dụng Web3 phi tập trung (dApp).

Dự án minh chứng cho khả năng xử lý giao dịch tốc độ cao và độ trễ thấp của Sui Network, cho phép trải nghiệm chơi game mượt mà mà vẫn đảm bảo tính sở hữu thực sự của người chơi đối với tài sản trong game.

---

## 🚀 Tính năng nổi bật

### 🎮 Gameplay (Frontend)

- **Endless Runner**: Cơ chế chạy vô tận, tốc độ tăng dần, né tránh xương rồng
- **Pixel Art Style**: Đồ họa retro 8-bit hoài cổ với hiệu ứng hình ảnh hiện đại
- **User System**: Profile người chơi tích hợp hiển thị số dư SUI và Token thưởng
- **Mock Wallet & zkLogin**: Tích hợp mô phỏng đăng nhập qua Google/Facebook (zkLogin) và kết nối ví Sui

### ⛓️ Blockchain (Sui Move)

- **Play-to-Earn (P2E)**: Mint token $GAME dựa trên thành tích người chơi
- **On-chain Leaderboard**: Bảng xếp hạng minh bạch, lưu trữ trực tiếp trên chuỗi
- **Automated Rewards**:
  - Reset bảng xếp hạng mỗi 7 ngày
  - Tự động phân phối thưởng cho Top 3 (5000, 3000, 1000 $GAME)
- **Fair Play (Anti-Cheat)**:
  - Rate Limit: Cooldown 30s giữa các lần submit điểm
  - Validation: Yêu cầu điểm tối thiểu và giới hạn claim thưởng mỗi 24h

---

## 🏗 Kiến trúc hệ thống
```
Người chơi
    ↓
Frontend (React/Vite)
    ↓
Sui Wallet / zkLogin
    ↓
Smart Contracts (Sui Move)
    ↓
Game Core Module
    ↓
On-chain Leaderboard
    ↓
$GAME Token
    ↓
Wallet
```

---

## 📜 Smart Contracts

### Cấu trúc Modules

| Module | Chức năng chính |
|--------|-----------------|
| `game_coin` | Quản lý token $GAME (Name, Symbol, Decimals). Chức năng mint token cho Treasury |
| `account_manager` | Tạo PlayerProfile (SBT - Soulbound Token) gắn định danh người chơi với ví |
| `game_leaderboard` | Lưu trữ Vector Top 10. Xử lý logic sort điểm, reset chu kỳ và trigger trả thưởng |
| `game_core` | Quản lý trạng thái Global (Pause/Unpause), check cooldown submit điểm |
| `game_score` | Lưu trữ best_score cá nhân và last_claim_timestamp để chống spam claim |
| `reward_manager` | Logic kiểm tra điều kiện nhận thưởng (Score > Threshold && Time > 24h) |

---

## 🛠 Công nghệ sử dụng

| Lĩnh vực | Công nghệ |
|----------|-----------|
| **Frontend** | React 19, Vite, TypeScript, Tailwind CSS, Lucide React |
| **Game Engine** | HTML5 Canvas API, Custom Physics Loop |
| **Blockchain** | Sui Move (Smart Contracts) |
| **Tools** | Sui CLI, Node.js, Visual Studio Code |

---

## ⚙️ Hướng dẫn cài đặt

### 1. Yêu cầu tiên quyết

- **Node.js**: v18 trở lên
- **Sui CLI**: Đã cài đặt và cấu hình mạng Testnet
- **Sui Wallet**: Extension trình duyệt

### 2. Triển khai Smart Contract
```bash
cd game_reward

# 1. Build contract
sui move build

# 2. Deploy lên Testnet (Cần có SUI trong ví để trả gas)
sui client publish --gas-budget 100000000 --skip-dependency-verification

# 3. Lưu lại Package ID và các Object ID quan trọng từ output
```

### 3. Chạy Frontend
```bash
cd fe

# 1. Cài đặt dependencies
npm install

# 2. Cấu hình biến môi trường
# Tạo file .env và điền Package ID vừa deploy
# VITE_SUI_PACKAGE_ID=0x...

# 3. Chạy local server
npm run dev
```

Truy cập `http://localhost:3000` để trải nghiệm.

---

## 🤝 Đội ngũ phát triển

Dự án được thực hiện bởi team **Sui DinoRun** cho cuộc thi **SUI Campus Hackathon - PTIT**.

- **Phạm Mạnh Dũng**
- **Hoàng Tiến Đạt**
- **Nguyễn Thành Tâm**

---

## 📄 License

Dự án này được cấp phép theo [MIT License](LICENSE).

---

**Powered by Sui Network** 💧
