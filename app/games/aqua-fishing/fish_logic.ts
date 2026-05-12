import { FISH_DATABASE } from './fishData';
import type { FishShape } from './fishData';

const RARITY_WEIGHT: Record<string, number> = {
  common: 50,
  uncommon: 25,
  rare: 12,
  epic: 6,
  legendary: 2,
  mythic: 0.5,
};

export const BIG_CREATURE_SHAPES = new Set(['whale', 'shark']);
export const isBigCreature = (type: string) => {
  const def = FISH_DATABASE[type];
  return !!def && BIG_CREATURE_SHAPES.has(def.shape);
};
export const BIG_CREATURE_TYPES = Object.keys(FISH_DATABASE).filter(k => BIG_CREATURE_SHAPES.has(FISH_DATABASE[k].shape));

export type FishInstance = {
  zone: number;
  w: number;
  h: number;
  score: number;
  color: string;
  speed: number;
  type: string;
  shape: FishShape;
  y: number;
  baseY: number;
  baseX: number;
  x: number;
  vx: number;
  timeOffset: number;
  amplitude: number;
  escapeSpeed: number;
  state: string;
  exclamationTimer: number;
  hasShownExclamation: boolean;
  noticeDist: number;
  revealedAmount?: number;
};

export const spawnFish = (zone: number, boatX: number, windowInnerWidth: number, forcedType?: string) => {
      let type: string;
      if (forcedType && FISH_DATABASE[forcedType]) {
        type = forcedType;
        zone = FISH_DATABASE[forcedType].zone[0];
      } else {
        const possibleFishes = Object.keys(FISH_DATABASE).filter(k => FISH_DATABASE[k].zone.includes(zone));
        const weights = possibleFishes.map(k => RARITY_WEIGHT[FISH_DATABASE[k].rarity.toLowerCase()] ?? 1);
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let pick = Math.random() * totalWeight;
        type = possibleFishes[0] || 'rockfish';
        for (let i = 0; i < possibleFishes.length; i++) {
          pick -= weights[i];
          if (pick <= 0) { type = possibleFishes[i]; break; }
        }
      }
      const def = FISH_DATABASE[type] || Object.values(FISH_DATABASE)[0];
      
      let y;
      if (zone === 1) y = Math.random() * 200 + 50;
      else if (zone === 2) y = Math.random() * 300 + 250;
      else y = Math.random() * 1000 + 550;

      const speed = def.speedBase * (0.8 + Math.random() * 0.4);
      
      return {
        zone, w: def.w, h: def.h, score: def.score, color: def.iconColor, speed, type, shape: def.shape,
        y, baseY: y, baseX: boatX + (Math.random() * windowInnerWidth * 5 - windowInnerWidth * 2.5),
        x: 0, vx: 0,
        timeOffset: Math.random() * 100,
        amplitude: Math.random() * 150 + 50,
        escapeSpeed: Math.max(speed * 2.5, 120),
        state: 'patrol',
        exclamationTimer: 0,
        hasShownExclamation: false,
        noticeDist: def.noticeDist
      };
    };

export const drawFish = (ctx: CanvasRenderingContext2D, f: FishInstance, time: number, dangerLevel: number = 0, isHooked: boolean = false, revealedAmount: number = 0) => {
      if (!isHooked && revealedAmount <= 0.01) return;

      const t = time * (f.speed / 50) + f.timeOffset;
      const wobbleSpeed = 10 + dangerLevel * 40;
      const tailWobble = Math.sin(t * wobbleSpeed) * (4 + dangerLevel * 6);

      const drawSpecificPatterns = (ctx: CanvasRenderingContext2D, f: FishInstance, w: number, h: number) => {
          ctx.save();
          ctx.clip(); // clip to main body
          
          if (['mackerel', 'japanese_spanish_mackerel', 'horse_mackerel'].includes(f.type)) {
             ctx.strokeStyle = '#020617'; ctx.lineWidth = 2; ctx.globalAlpha = 0.6;
             ctx.beginPath();
             for(let i= -w/3; i < w/3; i+=6) { ctx.moveTo(i, -h/2); ctx.lineTo(i-4, -h/4); ctx.lineTo(i, 0); }
             ctx.stroke();
             if (f.type === 'horse_mackerel') {
               ctx.strokeStyle = '#fef08a'; ctx.beginPath(); ctx.moveTo(-w/2, 0); ctx.lineTo(w/2, 0); ctx.stroke();
             }
          }
          if (f.type === 'stone_porgy') {
             ctx.fillStyle = '#0f172a';
             for(let i= -w/3; i < w/2; i+=12) ctx.fillRect(i, -h, 6, h*2);
          }
          if (['spotted_sea_bass', 'mandarin_fish', 'korean_rockfish', 'giant_korean_rockfish', 'longtooth_grouper', 'giant_grouper'].includes(f.type)) {
             ctx.fillStyle = f.type === 'mandarin_fish' ? '#713f12' : '#020617';
             ctx.globalAlpha = 0.5;
             const randSeed = f.w + f.h; 
             for (let i=0; i<15; i++) {
                ctx.beginPath(); ctx.arc(-w/2 + ((randSeed * i * 17) % w), -h/2 + ((randSeed * i * 23) % h), 2 + (i%3), 0, Math.PI*2); ctx.fill();
             }
          }
          if (['yellowtail_amberjack', 'japanese_amberjack', 'greater_amberjack', 'yellowfin_tuna', 'tuna_jigging'].includes(f.type)) {
             ctx.strokeStyle = '#facc15'; ctx.lineWidth = Math.max(2, w/15); ctx.globalAlpha = 0.7;
             ctx.beginPath(); ctx.moveTo(-w/2, -h/4); ctx.lineTo(w/2, 0); ctx.stroke();
             if (f.type === 'yellowfin_tuna') {
                ctx.fillStyle = '#facc15';
                ctx.beginPath(); ctx.moveTo(w/8, -h/2); ctx.lineTo(w/6, -100); ctx.lineTo(w/4, -h/2); ctx.fill(); 
                ctx.beginPath(); ctx.moveTo(w/8, h/2); ctx.lineTo(w/6, 100); ctx.lineTo(w/4, h/2); ctx.fill();
             }
          }
          if (f.type === 'red_sea_bream') {
             ctx.fillStyle = '#38bdf8'; ctx.globalAlpha = 0.8;
             for (let i=0; i<8; i++) { ctx.beginPath(); ctx.arc(-w/3 + i*6, -h/4 + (i%2)*5, 1.5, 0, Math.PI*2); ctx.fill(); }
          }
          if (['flounder', 'olive_flounder', 'olive_flounder_jigging', 'flathead'].includes(f.type)) {
             ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.3;
             for (let i=0; i<20; i++) { ctx.beginPath(); ctx.arc(-w/2 + (i*11)%w, -h/2 + (i*7)%h, 1.5 + i%2, 0, Math.PI*2); ctx.fill(); }
             ctx.fillStyle = '#000000'; ctx.globalAlpha = 0.4;
             for (let i=0; i<15; i++) { ctx.beginPath(); ctx.arc(-w/2 + (i*13)%w, -h/2 + (i*17)%h, 2, 0, Math.PI*2); ctx.fill(); }
          }
          if (f.type === 'killer_whale') {
              ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 1.0;
              ctx.beginPath(); ctx.ellipse(-w/3, -h/8, w/12, h/10, Math.PI/6, 0, Math.PI*2); ctx.fill(); // Eye patch
              ctx.beginPath(); ctx.ellipse(0, h/3, w/2.2, h/4, 0, 0, Math.PI*2); ctx.fill(); // Belly
              ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.ellipse(w/10, -h/6, w/10, h/10, 0, 0, Math.PI*2); ctx.fill(); // Saddle
          } else if (f.type === 'whale_shark') {
              ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.7;
              for (let i=0; i<40; i++) {
                 ctx.beginPath(); ctx.arc(-w/2 + ((i * 37) % w), -h/3 + ((i * 29) % (h/1.5)), 1.5 + (i%2)*1.5, 0, Math.PI*2); ctx.fill();
              }
          }
          ctx.globalAlpha = 0.2; ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.ellipse(0, -h/4, w/2.5, h/4, 0, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = '#000000'; ctx.beginPath(); ctx.ellipse(0, h/4, w/3, h/4, 0, 0, Math.PI*2); ctx.fill();
          ctx.restore();
      };

      ctx.save();
      
      if (!isHooked) {
          ctx.globalAlpha = revealedAmount * 0.4;
      }

      if (dangerLevel > 0) {
        const squash = 1 - Math.sin(t * 50) * 0.1 * dangerLevel;
        const stretch = 1 + Math.sin(t * 50) * 0.1 * dangerLevel;
        ctx.scale(stretch, squash);
      }

      ctx.fillStyle = f.color;
      
      if (f.shape === 'porgy') {
        // Deep body
        ctx.beginPath();
        ctx.ellipse(0, 0, f.w / 2, f.h / 1.8, 0, 0, Math.PI * 2);
        ctx.fill();
        drawSpecificPatterns(ctx, f, f.w, f.h);
        // Tail
        ctx.beginPath(); ctx.moveTo(f.w/2 - 5, 0); ctx.lineTo(f.w/2 + f.h/1.5, -f.h/2 + tailWobble); ctx.lineTo(f.w/2 + f.h/1.5, f.h/2 + tailWobble); ctx.fill();
        // Dorsal fin (spiky)
        ctx.beginPath(); ctx.moveTo(-f.w/4, -f.h/2);
        for(let i=-f.w/4; i<f.w/3; i+=8) { ctx.lineTo(i+4, -f.h/2 - 8); ctx.lineTo(i+8, -f.h/2); }
        ctx.fill();
      } else if (f.shape === 'torpedo') {
        // Sleek
        ctx.beginPath();
        ctx.moveTo(f.w / 2, 0); ctx.quadraticCurveTo(0, -f.h / 1.5, -f.w / 2, 0); ctx.quadraticCurveTo(0, f.h / 1.5, f.w / 2, 0);
        ctx.fill();
        drawSpecificPatterns(ctx, f, f.w, f.h);
        // Deep forked tail
        ctx.beginPath(); ctx.moveTo(f.w/2 - 10, 0); ctx.lineTo(f.w/2 + 15, -f.h/1.2 + tailWobble); ctx.lineTo(f.w/2 + 5, tailWobble); ctx.lineTo(f.w/2 + 15, f.h/1.2 + tailWobble); ctx.fill();
      } else if (f.shape === 'flatfish') {
        // Flat oval
        ctx.beginPath(); ctx.ellipse(0, 0, f.w/2, f.h/2, 0, 0, Math.PI * 2); ctx.fill();
        drawSpecificPatterns(ctx, f, f.w, f.h);
        // Continuous fins
        ctx.beginPath(); ctx.moveTo(-f.w/3, -f.h/2); ctx.quadraticCurveTo(0, -f.h/1.2, f.w/3, -f.h/2); ctx.fill();
        ctx.beginPath(); ctx.moveTo(-f.w/3, f.h/2); ctx.quadraticCurveTo(0, f.h/1.2, f.w/3, f.h/2); ctx.fill();
        // Tail
        ctx.beginPath(); ctx.moveTo(f.w/2 - 5, 0); ctx.lineTo(f.w/2 + 10, -f.h/3 + tailWobble); ctx.lineTo(f.w/2 + 10, f.h/3 + tailWobble); ctx.fill();
      } else if (f.shape === 'long') {
        // Eel/hairtail shape
        const segments = 15;
        const segLen = f.w / segments;
        ctx.lineWidth = f.h;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = f.color;
        
        ctx.beginPath();
        for(let i=0; i<=segments; i++) {
          const x = -f.w/2 + i*segLen;
          const yOffset = Math.sin(t * 15 - i * 0.5) * f.h/2;
          if (i===0) ctx.moveTo(x, yOffset);
          else ctx.lineTo(x, yOffset);
        }
        ctx.stroke();
        
        ctx.fillStyle = '#0f172a';
        ctx.beginPath(); ctx.arc(-f.w/2 + 4, Math.sin(t*15)*f.h/2 - 2, 2, 0, Math.PI*2); ctx.fill();
        ctx.restore();
        return; // skip default eye drawing
      } else if (f.shape === 'squid') {
        const pulse = Math.sin(t * 8) * 2;
        ctx.beginPath(); ctx.ellipse(-f.w/6, 0, f.w/3, f.h/2.5 + pulse, 0, 0, Math.PI*2); ctx.fill(); // Mantle
        drawSpecificPatterns(ctx, f, f.w * 0.6, f.h);
        ctx.beginPath(); ctx.moveTo(-f.w/2 - 10, 0); ctx.lineTo(-f.w/6, -f.h/2.5 - pulse); ctx.lineTo(-f.w/6, f.h/2.5 + pulse); ctx.fill(); // Fins
        // Tentacles
        ctx.strokeStyle = f.color; ctx.lineWidth = 3;
        for(let i=-2; i<=2; i++) {
          ctx.beginPath(); ctx.moveTo(f.w/6, i*3); 
          ctx.quadraticCurveTo(f.w/3, i*8 + pulse*2, f.w/2, i*5 + Math.sin(t*10 + i)*5); ctx.stroke();
        }
      } else if (f.shape === 'ray') {
        const flap = Math.sin(t * 5);
        ctx.beginPath(); ctx.moveTo(f.w/4, 0); ctx.quadraticCurveTo(0, -f.h*(0.8+flap), -f.w/4, 0); ctx.quadraticCurveTo(0, f.h*(0.8+flap), f.w/4, 0); ctx.fill(); // Wings
        ctx.beginPath(); ctx.ellipse(-f.w/8, 0, f.w/6, f.h/6, 0, 0, Math.PI*2); ctx.fill(); // Body
        drawSpecificPatterns(ctx, f, f.w/3, f.h/3);
        ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(f.w/4, 0); ctx.quadraticCurveTo(f.w*0.8, flap*10, f.w, -flap*15); ctx.stroke(); // Tail
      } else if (f.shape === 'shark') {
        // Pectoral fin (background)
        ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.moveTo(-f.w/10, 0); ctx.lineTo(f.w/10, f.h/1.5); ctx.lineTo(f.w/4, 0); ctx.fill();
        ctx.fillStyle = f.color;
        
        if (f.type === 'hammerhead_shark') {
          // Body
          ctx.beginPath(); ctx.moveTo(f.w/2, 0); ctx.quadraticCurveTo(0, -f.h*0.4, -f.w*0.45, -f.h/8); ctx.lineTo(-f.w*0.45, f.h/8); ctx.quadraticCurveTo(0, f.h*0.3, f.w/2, 0); ctx.fill();
          // Hammer head
          ctx.beginPath(); ctx.moveTo(-f.w*0.4, -f.h*0.5); ctx.lineTo(-f.w/2, -f.h*0.5); ctx.lineTo(-f.w/2, f.h*0.5); ctx.lineTo(-f.w*0.4, f.h*0.5); ctx.fill(); 
          drawSpecificPatterns(ctx, f, f.w, f.h);
        } else if (f.type === 'whale_shark') {
          // Whale shark body (chunkier)
          ctx.beginPath(); ctx.moveTo(f.w/2, 0); ctx.quadraticCurveTo(0, -f.h*0.6, -f.w/2.2, -f.h/6); ctx.quadraticCurveTo(-f.w/2, 0, -f.w/2.2, f.h/6); ctx.quadraticCurveTo(0, f.h*0.5, f.w/2, 0); ctx.fill();
          ctx.beginPath(); ctx.moveTo(-f.w/2.2, -f.h/6); ctx.lineTo(-f.w/1.8, 0); ctx.lineTo(-f.w/2.2, f.h/6); ctx.fill(); // Blunt mouth
          drawSpecificPatterns(ctx, f, f.w, f.h);
        } else {
          // Great white or generic shark
          ctx.beginPath(); ctx.moveTo(f.w/2, 0); ctx.quadraticCurveTo(0, -f.h/2.2, -f.w/2, -f.h/8); ctx.quadraticCurveTo(-f.w/2.5, f.h*0.4, f.w/2, 0); ctx.fill();
          // White underbelly
          ctx.fillStyle = '#f8fafc'; ctx.globalAlpha = 0.8;
          ctx.beginPath(); ctx.moveTo(f.w/2, 0); ctx.quadraticCurveTo(0, f.h*0.35, -f.w/2.5, f.h*0.1); ctx.quadraticCurveTo(0, f.h*0.1, f.w/2, 0); ctx.fill();
          ctx.fillStyle = f.color; ctx.globalAlpha = 1.0;
          drawSpecificPatterns(ctx, f, f.w, f.h);
        }
        
        // Dorsal fin
        ctx.beginPath(); ctx.moveTo(0, -f.h/2.5); ctx.quadraticCurveTo(-f.h, -f.h*1.2, -f.h*0.8, -f.h*1.5); ctx.lineTo(-f.h*0.2, -f.h/2.3); ctx.fill();
        
        // Pectoral fin (foreground)
        ctx.fillStyle = (f.type === 'great_white_shark') ? '#94a3b8' : f.color;
        ctx.beginPath(); ctx.moveTo(-f.w/6, f.h/5); ctx.quadraticCurveTo(-f.w/10, f.h, f.w/10, f.h*1.2); ctx.lineTo(f.w/6, f.h/4); ctx.fill();
        ctx.fillStyle = f.color;
        
        // Tail
        ctx.beginPath(); ctx.moveTo(f.w/2-10, 0); ctx.quadraticCurveTo(f.w/2+20, -f.h/1.2 + tailWobble, f.w/2+35, -f.h/1.1 + tailWobble); ctx.lineTo(f.w/2+10, tailWobble); ctx.lineTo(f.w/2+25, f.h/1.5 + tailWobble); ctx.fill();
        
        // Gills
        ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 2; ctx.globalAlpha = 0.6;
        for (let i = 0; i < 4; i++) {
           ctx.beginPath(); ctx.moveTo(-f.w/4 + i*5, -f.h/6 + i*2); ctx.lineTo(-f.w/4 + i*5 + 2, f.h/6 + i*2); ctx.stroke();
        }
        ctx.globalAlpha = 1.0;
      } else if (f.shape === 'whale') {
        const pectoralWobble = Math.sin(t * 3) * 5;
        const flukeWobble = Math.sin(t * 2) * f.h/4; // the tail of whales moves up and down
        
        // Pectoral fin (background)
        ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.moveTo(-f.w/10, 0); ctx.lineTo(-f.w/16, f.h/1.8 + pectoralWobble); ctx.lineTo(f.w/10, f.h/4); ctx.fill(); 
        ctx.fillStyle = f.color;
        
        if (f.type === 'sperm_whale') {
           // Boxy head
           ctx.beginPath(); ctx.moveTo(f.w/2, 0); ctx.quadraticCurveTo(0, -f.h*0.6, -f.w*0.3, -f.h*0.4); ctx.lineTo(-f.w/2, -f.h*0.3); ctx.lineTo(-f.w/2, f.h*0.1); ctx.quadraticCurveTo(0, f.h*0.6, f.w/2, 0); ctx.fill();
           // White mouth line
           ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-f.w/2, f.h*0.1); ctx.lineTo(-f.w*0.2, f.h*0.2); ctx.stroke();
           drawSpecificPatterns(ctx, f, f.w, f.h);
        } else if (f.type === 'blue_whale') {
           // Streamlined body
           ctx.beginPath(); ctx.moveTo(f.w/2, 0); ctx.quadraticCurveTo(0, -f.h*0.45, -f.w/2, -f.h*0.15); ctx.quadraticCurveTo(0, f.h*0.5, f.w/2, 0); ctx.fill();
           
           // Underbelly grooves
           ctx.fillStyle = '#ebf8ff'; ctx.globalAlpha = 0.5;
           ctx.beginPath(); ctx.moveTo(f.w/6, f.h*0.1); ctx.quadraticCurveTo(0, f.h*0.4, -f.w/2, f.h*0.1); ctx.quadraticCurveTo(0, f.h*0.55, f.w/6, f.h*0.1); ctx.fill();
           ctx.globalAlpha = 1.0;
           
           ctx.strokeStyle = '#1e3a8a'; ctx.lineWidth = 1; ctx.globalAlpha = 0.4;
           for(let i=0; i<6; i++) {
              ctx.beginPath(); ctx.moveTo(-f.w/2 + i*5, f.h*0.1 + i*2); ctx.quadraticCurveTo(-f.w/8, f.h*0.4 - i*4, f.w/8 - i*5, f.h*0.2 - i*3); ctx.stroke();
           }
           ctx.globalAlpha = 1.0;
           
           drawSpecificPatterns(ctx, f, f.w, f.h);
        } else {
           // Killer whale or generic
           ctx.beginPath(); ctx.moveTo(f.w/2, 0); ctx.quadraticCurveTo(0, -f.h*0.65, -f.w/2, -f.h/8); ctx.quadraticCurveTo(0, f.h*0.7, f.w/2, 0); ctx.fill(); 
           drawSpecificPatterns(ctx, f, f.w, f.h);
        }
        
        // Fluke (tail)
        ctx.beginPath(); ctx.moveTo(f.w/2-f.w/10, 0); 
        ctx.quadraticCurveTo(f.w/2+f.w/16, -f.h*0.8 + flukeWobble, f.w/2+f.w/6, -f.h*0.9 + flukeWobble); 
        ctx.lineTo(f.w/2+f.w/12, flukeWobble); 
        ctx.lineTo(f.w/2+f.w/6, f.h*0.9 + flukeWobble); 
        ctx.quadraticCurveTo(f.w/2+f.w/16, f.h*0.8 + flukeWobble, f.w/2-f.w/10, 0); 
        ctx.fill();
        
        // Pectoral fin (foreground)
        ctx.fillStyle = f.type === 'blue_whale' ? '#93c5fd' : f.color;
        ctx.beginPath(); ctx.moveTo(-f.w/6, 0); ctx.quadraticCurveTo(-f.w/10, f.h/1.5 + pectoralWobble, -f.w/12, f.h*0.8 + pectoralWobble); ctx.quadraticCurveTo(0, f.h/2, f.w/10, f.h/4); ctx.fill();
        ctx.fillStyle = f.color;

        // Dorsal fin
        if (f.type === 'killer_whale' || f.type === 'sperm_whale' || f.type === 'blue_whale') {
          const dorsalH = f.type === 'killer_whale' ? -f.h*1.2 : (f.type === 'blue_whale' ? -f.h*0.5 : -f.h*0.7);
          const dorsalX = f.type === 'blue_whale' ? f.w/4 : 0; // Blue whale dorsal is far back
          const dorsalBaseY = f.type === 'killer_whale' ? -f.h*0.55 : -f.h*0.4;
          
          ctx.beginPath(); 
          ctx.moveTo(dorsalX, dorsalBaseY); 
          ctx.quadraticCurveTo(dorsalX-f.w/16, dorsalH*1.2, dorsalX-f.w/12, dorsalH); 
          ctx.quadraticCurveTo(dorsalX+f.w/16, dorsalBaseY-f.h*0.2, dorsalX+f.w/8, dorsalBaseY+f.h*0.1); 
          ctx.fill();
        }
      } else if (f.shape === 'sunfish') {
        const finWobble = Math.sin(t * 8) * 5;
        ctx.beginPath(); ctx.ellipse(0, 0, f.w/3, f.h/2, 0, 0, Math.PI*2); ctx.fill();
        drawSpecificPatterns(ctx, f, f.w*0.6, f.h);
        ctx.beginPath(); ctx.moveTo(-f.w/6, -f.h/2.2); ctx.lineTo(-20 + finWobble, -f.h*0.9); ctx.lineTo(f.w/6, -f.h/2.2); ctx.fill(); // Top fin
        ctx.beginPath(); ctx.moveTo(-f.w/6, f.h/2.2); ctx.lineTo(-20 - finWobble, f.h*0.9); ctx.lineTo(f.w/6, f.h/2.2); ctx.fill(); // Bottom fin
        ctx.fillStyle = '#64748b'; ctx.beginPath(); ctx.moveTo(f.w/3.5, -f.h/3); ctx.quadraticCurveTo(f.w/2, finWobble, f.w/3.5, f.h/3); ctx.fill(); // Clavus
      } else if (f.shape === 'marlin') {
        ctx.beginPath(); ctx.moveTo(f.w/2.5, 0); ctx.quadraticCurveTo(0, -f.h/2, -f.w/3, 0); ctx.quadraticCurveTo(0, f.h/2, f.w/2.5, 0); ctx.fill();
        drawSpecificPatterns(ctx, f, f.w, f.h);
        ctx.beginPath(); ctx.moveTo(-f.w/3, 0); ctx.lineTo(-f.w, -2); ctx.lineTo(-f.w/3, 2); ctx.fill(); // Bill (sword)
        ctx.beginPath(); ctx.moveTo(-f.w/4, -f.h/3); ctx.lineTo(-f.w/6, -f.h); ctx.lineTo(f.w/8, -f.h/2.5); ctx.fill(); // Dorsal sail
        ctx.beginPath(); ctx.moveTo(f.w/2.5 - 10, 0); ctx.lineTo(f.w/2.5 + 30, -f.h + tailWobble); ctx.lineTo(f.w/2.5 + 10, tailWobble); ctx.lineTo(f.w/2.5 + 30, f.h + tailWobble); ctx.fill();
      } else if (f.shape === 'grouper') {
        ctx.beginPath(); ctx.ellipse(0, 0, f.w/2, f.h/1.8, 0, 0, Math.PI*2); ctx.fill();
        drawSpecificPatterns(ctx, f, f.w, f.h);
        // Giant mouth
        ctx.fillStyle = '#1e293b'; ctx.beginPath(); ctx.moveTo(-f.w/2, 0); ctx.lineTo(-f.w/2.5, -f.h/6); ctx.lineTo(-f.w/2.5, f.h/6); ctx.fill();
        ctx.fillStyle = f.color; // Restore
        ctx.beginPath(); ctx.moveTo(f.w/2-10, 0); ctx.lineTo(f.w/2+15, -f.h/2 + tailWobble); ctx.lineTo(f.w/2+15, f.h/2 + tailWobble); ctx.fill(); // Tail
      } else if (f.shape === 'rockfish') {
        ctx.beginPath(); ctx.ellipse(0, 0, f.w/2, f.h/2, 0, 0, Math.PI*2); ctx.fill();
        drawSpecificPatterns(ctx, f, f.w, f.h);
        ctx.beginPath(); ctx.moveTo(-f.w/4, -f.h/2.5); for(let i=0; i<4; i++) { ctx.lineTo(-f.w/4 + i*10 + 5, -f.h/1.5); ctx.lineTo(-f.w/4 + i*10 + 10, -f.h/2.2); } ctx.fill(); // Spiky dorsal
        ctx.beginPath(); ctx.moveTo(f.w/2-5, 0); ctx.lineTo(f.w/2+12, -f.h/2 + tailWobble); ctx.lineTo(f.w/2+12, f.h/2 + tailWobble); ctx.fill();
        ctx.fillStyle = '#0f172a'; ctx.beginPath(); ctx.arc(-f.w/3.5, -f.h/6, f.h/8, 0, Math.PI*2); ctx.fill(); // Big eye
        ctx.restore(); return;
      } else if (f.shape === 'bass') {
        ctx.beginPath(); ctx.ellipse(0, 0, f.w/2, f.h/2.2, 0, 0, Math.PI*2); ctx.fill();
        drawSpecificPatterns(ctx, f, f.w, f.h);
        ctx.beginPath(); ctx.moveTo(f.w/2-10, 0); ctx.lineTo(f.w/2+15, -f.h/2 + tailWobble); ctx.lineTo(f.w/2+10, tailWobble); ctx.lineTo(f.w/2+15, f.h/2 + tailWobble); ctx.fill(); // Forked tail
      } else if (f.shape === 'jellyfish') {
        ctx.beginPath(); ctx.arc(0, -f.h/4, f.w/2, Math.PI, 0); ctx.fill(); // Bell
        ctx.strokeStyle = f.color; ctx.lineWidth = 2;
        for(let i=-f.w/2.5; i<=f.w/2.5; i+=5) {
          ctx.beginPath(); ctx.moveTo(i, -f.h/4);
          const drop = f.h/2 + Math.sin(t*10 + i)*5;
          ctx.quadraticCurveTo(i*1.5, drop/2, i + Math.sin(t*5+i)*3, drop); ctx.stroke();
        }
        ctx.restore(); return;
      } else {
        // generic
        ctx.beginPath(); ctx.ellipse(0, 0, f.w/2, f.h/2, 0, 0, Math.PI*2); ctx.fill();
        drawSpecificPatterns(ctx, f, f.w, f.h);
        ctx.beginPath(); ctx.moveTo(f.w/2-5, 0); ctx.lineTo(f.w/2+f.h/1.5, -f.h/2+tailWobble); ctx.lineTo(f.w/2+f.h/1.5, f.h/2+tailWobble); ctx.fill();
      }

      // Default Eye
      ctx.fillStyle = '#0f172a';
      if (['flounder', 'olive_flounder', 'olive_flounder_jigging'].includes(f.type)) {
        ctx.beginPath(); ctx.arc(-f.w / 4, -f.h / 5, Math.max(1.5, f.h / 12), 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(-f.w / 6, -f.h / 5, Math.max(1.5, f.h / 12), 0, Math.PI * 2); ctx.fill();
      } else if (f.shape !== 'sunfish') {
        ctx.beginPath(); ctx.arc(-f.w / 4, -f.h / 8, Math.max(1.5, f.h / 12), 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    };
