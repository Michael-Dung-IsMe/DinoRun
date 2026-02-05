import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Button } from './Button';

interface GameProps {
  onGameOver: (score: number) => void;
  userSkin: string;
}

export const Game: React.FC<GameProps> = ({ onGameOver, userSkin }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [isDead, setIsDead] = useState(false);

  const ASSETS = {
    DINO_STILL: { x: 848, y: 2, w: 44, h: 47 },
    DINO_DEAD: { x: 1024, y: 2, w: 44, h: 47 },
    CACTUS: [
      { x: 228, y: 2, w: 17, h: 35 }, 
      { x: 332, y: 2, w: 25, h: 50 }, 
      { x: 431, y: 2, w: 50, h: 50 }  
    ],
    BIRD: { x: 134, y: 2, w: 46, h: 40 }
  };

  const spriteImg = useMemo(() => {
    const img = new Image();
    img.src = '/assets/offline-sprite-1x.png'; 
    return img;
  }, []);

  const gameState = useRef({
    dinoY: 0,
    dinoVelocity: 0,
    isJumping: false,
    obstacles: [] as any[],
    gameSpeed: 2.5,
    score: 0,
    nextSpawnGap: 0,
  });

  const requestRef = useRef<number>(0);

  const resetGame = useCallback(() => {
    gameState.current = {
      dinoY: 0,
      dinoVelocity: 0,
      isJumping: false,
      obstacles: [],
      gameSpeed: 2.5,
      score: 0,
      nextSpawnGap: 500, // Khoảng cách an toàn ban đầu rộng hơn
    };
    setScore(0);
    setIsDead(false);
    setIsPlaying(true);
  }, []);

  const jump = useCallback(() => {
    const state = gameState.current;
    if (!state.isJumping && isPlaying) {
      // Lực nhảy được tính toán để phù hợp với trọng lực thấp
      // Giúp Dino lướt đi xa hơn thay vì nhảy vọt lên quá cao
      state.dinoVelocity = -8.5; 
      state.isJumping = true;
    } else if (isDead || (!isPlaying && !isDead)) {
      resetGame();
    }
  }, [isPlaying, isDead, resetGame]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const state = gameState.current;
    const groundY = canvas.height - 50;

    // --- CẬP NHẬT VẬT LÝ RƠI CHẬM ---
    // Trọng lực cực thấp tạo cảm giác Dino bay lơ lửng
    const gravity = 0.32; 
    state.dinoVelocity += gravity; 
    state.dinoY += state.dinoVelocity;

    if (state.dinoY > groundY - 44) {
      state.dinoY = groundY - 44;
      state.dinoVelocity = 0;
      state.isJumping = false;
    }

    // --- QUẢN LÝ VẬT CẢN ---
    let gapToLast = canvas.width;
    if (state.obstacles.length > 0) {
      const last = state.obstacles[state.obstacles.length - 1];
      gapToLast = canvas.width - (last.x + last.w);
    }

    if (gapToLast > state.nextSpawnGap) {
      const isBird = state.score > 2000 && Math.random() > 0.9;
      if (isBird) {
        state.obstacles.push({
          type: 'BIRD',
          x: canvas.width,
          y: groundY - 70 - Math.random() * 30,
          w: 40, h: 30,
          sx: ASSETS.BIRD.x, sy: ASSETS.BIRD.y, sw: ASSETS.BIRD.w, sh: ASSETS.BIRD.h
        });
      } else {
        const cactus = ASSETS.CACTUS[Math.floor(Math.random() * ASSETS.CACTUS.length)];
        state.obstacles.push({
          type: 'CACTUS',
          x: canvas.width,
          y: groundY - cactus.h,
          w: cactus.w, h: cactus.h,
          sx: cactus.x, sy: cactus.y, sw: cactus.w, sh: cactus.h
        });
      }
      // Giãn cách vật cản hợp lý để người chơi kịp rơi xuống đất trước khi nhảy tiếp
      state.nextSpawnGap = 200 + (state.gameSpeed * 15) + Math.random() * 300;
    }

    // --- VA CHẠM (HITBOX AN TOÀN) ---
    let collision = false;
    state.obstacles.forEach(obs => {
      obs.x -= state.gameSpeed;
      
      // Hitbox Dino: Thu nhỏ chiều rộng và chiều cao phần dưới
      const dHB = { 
        x: 50 + 12, 
        y: state.dinoY + 5, 
        w: 20, 
        h: 30 
      };

      // Hitbox Vật cản: Thu nhỏ để "lướt" qua dễ hơn
      const oHB = { 
        x: obs.x + 8, 
        y: obs.y + 8, 
        w: obs.w - 16, 
        h: obs.h - 10 
      };

      if (dHB.x < oHB.x + oHB.w && dHB.x + dHB.w > oHB.x && dHB.y < oHB.y + oHB.h && dHB.y + dHB.h > oHB.y) {
        collision = true;
      }
    });
    state.obstacles = state.obstacles.filter(o => o.x + o.w > -50);

    // --- ĐIỂM & TĂNG TỐC ---
    state.score += 0.1;
    setScore(Math.floor(state.score));
    // Tăng tốc cực chậm để giữ cảm giác thư giãn
    state.gameSpeed = Math.min(2.5 + state.score / 3000, 10);

    // --- VẼ ---
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Mặt đất
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath(); 
    ctx.moveTo(0, groundY); 
    ctx.lineTo(canvas.width, groundY); 
    ctx.stroke();

    if (spriteImg.complete) {
      const d = isDead ? ASSETS.DINO_DEAD : ASSETS.DINO_STILL;
      ctx.drawImage(spriteImg, d.x, d.y, d.w, d.h, 50, state.dinoY, 44, 47);

      state.obstacles.forEach(obs => {
        ctx.drawImage(spriteImg, obs.sx, obs.sy, obs.sw, obs.sh, obs.x, obs.y, obs.w, obs.h);
      });
    }

    if (collision) {
      setIsPlaying(false);
      setIsDead(true);
      onGameOver(Math.floor(state.score));
    } else {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
  }, [onGameOver, spriteImg, isDead]);

  useEffect(() => {
    if (isPlaying && !isDead) requestRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying, isDead, gameLoop]);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current && canvasRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = 300;
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return (
    <div className="w-full flex flex-col items-center gap-4 select-none">
      <div className="text-2xl font-mono font-bold text-slate-500">
        SCORE: {score.toString().padStart(5, '0')}
      </div>
      <div 
        ref={containerRef} 
        className="w-full max-w-4xl h-[300px] bg-white border-b-2 border-slate-200 relative overflow-hidden" 
        onClick={jump}
      >
        <canvas ref={canvasRef} className="block w-full h-full" />
        
        {isDead && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-sm">
            <div className="mb-4 text-slate-800 font-bold">GAME OVER</div>
            <Button onClick={(e) => { e.stopPropagation(); resetGame(); }}>PLAY AGAIN</Button>
          </div>
        )}
        
        {!isPlaying && !isDead && (
          <div className="absolute inset-0 flex items-center justify-center cursor-pointer">
            <span className="text-slate-400 animate-pulse">TAP TO JUMP</span>
          </div>
        )}
      </div>
    </div>
  );
};