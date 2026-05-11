"use client";

import { useEffect, useRef, useState } from 'react';
import { FISH_DATABASE } from './fishData';
import { spawnFish, drawFish, isBigCreature, BIG_CREATURE_TYPES } from './fish_logic';
import { useLocale } from '@/hooks/useLocale';

let audioCtx: AudioContext | null = null;
let bgmGain: GainNode | null = null;
let bgmActive = false;

// Cleanly tear down all audio so leaving the route doesn't keep the BGM
// (ocean noise + ambient piano + delay tail) playing across the rest of
// the site. Closing the AudioContext immediately silences every node
// scheduled inside it; the `bgmActive` flag breaks the playAmbientNote
// self-scheduling chain.
const stopAllAudio = () => {
    bgmActive = false;
    bgmGain = null;
    const ctx = audioCtx;
    audioCtx = null;
    if (ctx) {
        try { ctx.close(); } catch { /* ignore */ }
    }
};

const startBGM = () => {
    if (!audioCtx) return;
    if (bgmActive) return;
    bgmActive = true;
    
    bgmGain = audioCtx.createGain();
    bgmGain.gain.value = 0.2;
    
    // Create an echo/delay network for that spacious Minecraft/C418 reverb feel
    const delayNode = audioCtx.createDelay();
    delayNode.delayTime.value = 0.6; // 600ms delay
    
    const feedbackGain = audioCtx.createGain();
    feedbackGain.gain.value = 0.35; // 35% feedback
    
    const delayFilter = audioCtx.createBiquadFilter();
    delayFilter.type = 'lowpass';
    delayFilter.frequency.value = 1000; // soften the echoes
    
    bgmGain.connect(audioCtx.destination); // Direct sound
    bgmGain.connect(delayNode); // Into delay
    delayNode.connect(delayFilter);
    delayFilter.connect(feedbackGain);
    feedbackGain.connect(delayNode);
    delayFilter.connect(audioCtx.destination); // Echo sound to output

    const createOceanWaves = () => {
        if (!bgmActive || !audioCtx) return;
        const bufferSize = audioCtx.sampleRate * 2; 
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 300; 

        const lfo = audioCtx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.15; 

        const lfoGain = audioCtx.createGain();
        lfoGain.gain.value = 200; 

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        const waveGain = audioCtx.createGain();
        waveGain.gain.value = 0.20;

        const ampLfo = audioCtx.createOscillator();
        ampLfo.type = 'sine';
        ampLfo.frequency.value = 0.15;
        
        const ampLfoGain = audioCtx.createGain();
        ampLfoGain.gain.value = 0.10;
        ampLfo.connect(ampLfoGain);
        ampLfoGain.connect(waveGain.gain);

        noise.connect(filter);
        filter.connect(waveGain);
        waveGain.connect(bgmGain!);

        noise.start();
        lfo.start();
        ampLfo.start();
    };

    createOceanWaves();

    const playAmbientNote = () => {
        if (!bgmActive || !audioCtx) return;
        
        // Minecraft style ambient: C418 piano vibe (Sweden / Dry Hands)
        // Focus on D major / F# minor pentatonic for that warm nostalgic feel
        const scale = [293.66, 329.63, 369.99, 440.00, 493.88, 587.33, 659.25, 739.99]; // D4, E4, F#4, A4, B4, D5, E5, F#5
        
        const osc = audioCtx.createOscillator();
        const noteGain = audioCtx.createGain();
        osc.connect(noteGain);
        noteGain.connect(bgmGain!);

        // Mix of sine and triangle for a lo-fi electric piano sound
        osc.type = Math.random() > 0.5 ? 'triangle' : 'sine';
        const freq = scale[Math.floor(Math.random() * scale.length)];
        
        const now = audioCtx.currentTime;
        osc.frequency.setValueAtTime(freq, now);
        
        // Piano envelope: moderate attack, exponential decay and release
        noteGain.gain.setValueAtTime(0, now);
        noteGain.gain.linearRampToValueAtTime(0.04, now + 0.1);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + 4);
        
        osc.start(now);
        osc.stop(now + 4);
        
        // Occasionally play a low pad/bass note (every 3rd or 4th note)
        if (Math.random() > 0.8) {
            const bassOsc = audioCtx.createOscillator();
            const bassGain = audioCtx.createGain();
            bassOsc.connect(bassGain);
            bassGain.connect(bgmGain!);
            
            bassOsc.type = 'triangle';
            // Play a root or 5th an octave lower
            const bassFreq = scale[Math.floor(Math.random() * 3)] / 2; 
            bassOsc.frequency.setValueAtTime(bassFreq, now);
            
            bassGain.gain.setValueAtTime(0, now);
            bassGain.gain.linearRampToValueAtTime(0.02, now + 1);
            bassGain.gain.exponentialRampToValueAtTime(0.001, now + 7);
            
            bassOsc.start(now);
            bassOsc.stop(now + 7);
        }
        
        // Slower, sparse placement of notes (5s to 12s between notes)
        setTimeout(playAmbientNote, Math.random() * 7000 + 5000);
    };

    playAmbientNote();
};

const playSound = (type: string) => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
    if (!bgmActive) startBGM();
    
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        const now = audioCtx.currentTime;
        
        if (type === 'perfect') {
            // Very soft, warm healing chime
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, now); // C5
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.08, now + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
            
            // Add a harmony note
            const osc2 = audioCtx.createOscillator();
            const gain2 = audioCtx.createGain();
            osc2.connect(gain2);
            gain2.connect(audioCtx.destination);
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(659.25, now); // E5
            gain2.gain.setValueAtTime(0, now);
            gain2.gain.linearRampToValueAtTime(0.06, now + 0.15);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
            osc2.start(now);
            osc2.stop(now + 1.8);

            osc.start(now);
            osc.stop(now + 2.0);
        } else if (type === 'good') {
            // Gentle warm single tone
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, now); // A4
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.08, now + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
            osc.start(now);
            osc.stop(now + 1.5);
        } else if (type === 'miss') {
            // Barely audible, comforting low hum
            osc.type = 'sine';
            osc.frequency.setValueAtTime(120, now);
            osc.frequency.linearRampToValueAtTime(100, now + 0.5);
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.04, now + 0.2);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
            osc.start(now);
            osc.stop(now + 0.8);
        } else if (type === 'escape') {
            // Dispersing bubbles
            osc.type = 'sine';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.linearRampToValueAtTime(200, now + 0.2);
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.03, now + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
            osc.start(now);
            osc.stop(now + 0.5);
        } else if (type === 'buy') {
            // Warm healing pluck
            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, now); // A4
            osc.frequency.exponentialRampToValueAtTime(554.37, now + 0.15); // C#5
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
            osc.start(now);
            osc.stop(now + 0.8);
        } else if (type === 'error') {
            // Soft muted error
            osc.type = 'sine';
            osc.frequency.setValueAtTime(150, now);
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        } else if (type === 'shop_open') {
            // Gentle gliss upwards
            osc.type = 'sine';
            osc.frequency.setValueAtTime(329.63, now); // E4
            osc.frequency.exponentialRampToValueAtTime(440, now + 0.3); // A4
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.08, now + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
            osc.start(now);
            osc.stop(now + 0.6);
        } else if (type === 'catch') {
            // Soft chime (replaces the harsh arpeggio)
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, now); // C5
            osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
            
            // Add a secondary oscillator for a richer chime
            const osc2 = audioCtx.createOscillator();
            const gain2 = audioCtx.createGain();
            osc2.connect(gain2);
            gain2.connect(audioCtx.destination);
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(783.99, now); // G5
            osc2.frequency.exponentialRampToValueAtTime(1046.50, now + 0.15); // C6
            gain2.gain.setValueAtTime(0, now);
            gain2.gain.linearRampToValueAtTime(0.08, now + 0.05);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
            osc2.start(now);
            osc2.stop(now + 1.2);

            osc.start(now);
            osc.stop(now + 1.5);
        } else if (type === 'boat') {
            // Even softer water paddle
            osc.type = 'sine';
            osc.frequency.setValueAtTime(80, now);
            osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.03, now + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        } else if (type === 'hooked') {
            // Soft bobber splash
            osc.type = 'sine';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(500, now + 0.2);
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            osc.start(now);
            osc.stop(now + 0.4);
        }
    } catch (e) {
        // ignore errors
    }
};

type AquaInput =
  | { kind: 'down'; key: 'left' | 'right' | 'space' }
  | { kind: 'up'; key: 'left' | 'right' | 'space' }
  | { kind: 'tap'; key: 'space' | 'shop' | 'enc' | 'shop1' | 'shop2' | 'shop3' };
const sendInput = (detail: AquaInput) => {
  try {
    window.dispatchEvent(new CustomEvent<AquaInput>('aqua-fishing:input', { detail }));
  } catch { /* ignore */ }
};

export default function AquaFishingGame() {
  const { locale, t } = useLocale();
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showEncyclopedia, setShowEncyclopedia] = useState(false);
  const [caughtData, setCaughtData] = useState<Record<string, number>>({});
  const [selectedFish, setSelectedFish] = useState<string | null>(null);
  const [isTouch, setIsTouch] = useState(false);
  const isTouchRef = useRef(false);
  const [shopVisible, setShopVisible] = useState(false);
  const localeRef = useRef(locale);
  useEffect(() => { localeRef.current = locale; }, [locale]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const coarsePointer = window.matchMedia('(hover: none) and (pointer: coarse)');
    const compactViewport = window.matchMedia('(max-width: 820px), (max-height: 520px)');
    const update = () => {
      const next =
        coarsePointer.matches ||
        compactViewport.matches ||
        navigator.maxTouchPoints > 0 ||
        'ontouchstart' in window;
      isTouchRef.current = next;
      setIsTouch(next);
    };
    update();
    coarsePointer.addEventListener?.('change', update);
    compactViewport.addEventListener?.('change', update);
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      coarsePointer.removeEventListener?.('change', update);
      compactViewport.removeEventListener?.('change', update);
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const root = rootRef.current;
    if (!root) return;

    const applyViewport = () => {
      const visualViewport = window.visualViewport;
      const width = Math.round(visualViewport?.width ?? window.innerWidth);
      const height = Math.round(visualViewport?.height ?? window.innerHeight);
      root.style.setProperty('--aqua-vw', `${width}px`);
      root.style.setProperty('--aqua-vh', `${height}px`);
    };

    const preventDocumentGesture = (event: Event) => event.preventDefault();
    const previousOverscroll = document.documentElement.style.overscrollBehavior;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overscrollBehavior = 'none';
    document.body.style.overflow = 'hidden';
    applyViewport();

    window.visualViewport?.addEventListener('resize', applyViewport);
    window.visualViewport?.addEventListener('scroll', applyViewport);
    window.addEventListener('resize', applyViewport);
    window.addEventListener('orientationchange', applyViewport);
    root.addEventListener('touchmove', preventDocumentGesture, { passive: false });
    root.addEventListener('gesturestart', preventDocumentGesture);
    root.addEventListener('gesturechange', preventDocumentGesture);
    root.addEventListener('gestureend', preventDocumentGesture);

    return () => {
      window.visualViewport?.removeEventListener('resize', applyViewport);
      window.visualViewport?.removeEventListener('scroll', applyViewport);
      window.removeEventListener('resize', applyViewport);
      window.removeEventListener('orientationchange', applyViewport);
      root.removeEventListener('touchmove', preventDocumentGesture);
      root.removeEventListener('gesturestart', preventDocumentGesture);
      root.removeEventListener('gesturechange', preventDocumentGesture);
      root.removeEventListener('gestureend', preventDocumentGesture);
      document.documentElement.style.overscrollBehavior = previousOverscroll;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, []);

  // Canvas-side i18n helper. The game loop closure uses localeRef so it
  // reflects locale changes without re-running the effect.
  const tr = (en: string, ko: string) => (localeRef.current === 'ko' ? ko : en);
  const trRef = useRef(tr);
  trRef.current = tr;
  const getFishName = (key: string) => {
    const fish = FISH_DATABASE[key];
    if (!fish) return key;
    return locale === 'en' ? fish.nameEn : fish.name;
  };
  const getFishDesc = (key: string) => {
    const fish = FISH_DATABASE[key];
    if (!fish) return '';
    return locale === 'en' ? fish.descEn : fish.desc;
  };

  useEffect(() => {
    const handleToggleEnc = () => setShowEncyclopedia(s => !s);
    const handleUpdateEnc = (e: any) => setCaughtData(e.detail);
    window.addEventListener('toggle-enc', handleToggleEnc);
    window.addEventListener('update-enc', handleUpdateEnc);
    return () => {
       window.removeEventListener('toggle-enc', handleToggleEnc);
       window.removeEventListener('update-enc', handleUpdateEnc);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Cached gradients — recreated only on resize, not per frame
    let cachedSkyGrad: CanvasGradient | null = null;
    let cachedSeaGrad: CanvasGradient | null = null;

    let resizeFrame = 0;
    const resize = () => {
      const wrap = canvas.parentElement;
      const visualViewport = window.visualViewport;
      const width = Math.max(1, Math.floor(wrap?.clientWidth || visualViewport?.width || window.innerWidth));
      const height = Math.max(1, Math.floor(wrap?.clientHeight || visualViewport?.height || window.innerHeight));
      if (canvas.width === width && canvas.height === height) return;
      canvas.width = width;
      canvas.height = height;
      cachedSkyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      cachedSkyGrad.addColorStop(0, '#38bdf8');
      cachedSkyGrad.addColorStop(1, '#bae6fd');
      cachedSeaGrad = ctx.createLinearGradient(0, 0, 0, 3000);
      cachedSeaGrad.addColorStop(0, '#1e3a8a');
      cachedSeaGrad.addColorStop(1, '#020617');
    };
    const queueResize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(resize);
    };
    window.addEventListener('resize', queueResize);
    window.addEventListener('orientationchange', queueResize);
    window.visualViewport?.addEventListener('resize', queueResize);
    window.visualViewport?.addEventListener('scroll', queueResize);
    resize();

    let time = 0;
    
    let camX = 0;
    let camY = 0;
    let zoom = 1.0;
    let screenShake = 0;
    let combo = 0;
    let shopOpen = false;

    // Weather & Environment
    let weather: 'clear' | 'rain' | 'storm' = 'clear';
    let weatherTimer = 40 + Math.random() * 40;
    let lastWeatherChangeX = 0;
    let weatherIntensity = 0; // Smooth 0 to 1
    let targetWeatherIntensity = 0;
    
    // Distant Islands for scenery
    const islands = Array.from({length: 6}).map((_, i) => ({
       xOffset: i * 800 - 1000,
       width: 300 + Math.random() * 400,
       height: 100 + Math.random() * 150,
       color: `hsl(210, 20%, ${Math.random() * 10 + 30}%)`
    }));

    // Raindrops
    const raindrops = Array.from({length: 200}).map(() => ({
       x: Math.random() * window.innerWidth * 1.5,
       y: Math.random() * window.innerHeight * 1.5,
       length: Math.random() * 20 + 10,
       speedY: Math.random() * 600 + 400,
    }));

    // Add boat stats to be read from UI
    const getStats = () => {
      const stored = localStorage.getItem('fishing_stats');
      let data = { rod: 0, speed: 0, drop: 0, depth: 0, sonar: 0, coins: 0, caught: {} as Record<string, number> };
      if (stored) {
         try {
             const parsed = JSON.parse(stored);
             data = { ...data, ...parsed };
             if (data.rod === undefined) data.rod = data.speed || 0;
             if (data.sonar === undefined) data.sonar = 0;
             if (!data.caught) data.caught = {};
         } catch(e) {}
      }
      return data;
    };

    let boatStats = getStats();
    window.dispatchEvent(new CustomEvent('update-enc', { detail: boatStats.caught }));
    
    const saveStats = () => {
        localStorage.setItem('fishing_stats', JSON.stringify(boatStats));
        window.dispatchEvent(new CustomEvent('update-enc', { detail: boatStats.caught }));
    };

    const keys = { A: false, D: false, Space: false, spaceTaps: 0 };

    const attemptUpgrade = (type: 'rod' | 'speed' | 'drop' | 'depth' | 'sonar') => {
        const cost = 50 + boatStats[type] * 50;
        if (boatStats.coins >= cost && boatStats[type] < 5) {
            boatStats.coins -= cost;
            boatStats[type]++;
            saveStats();
            playSound('buy');
        } else {
            playSound('error');
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyB' || e.key === 'b' || e.key === 'B') {
          shopOpen = !shopOpen;
          playSound('shop_open');
      }
      if (e.code === 'KeyE' || e.key === 'e' || e.key === 'E') {
          window.dispatchEvent(new CustomEvent('toggle-enc'));
          playSound('shop_open');
      }
      if (e.code === 'KeyW' || e.key === 'w' || e.key === 'W') {
          // Force spawn a blue whale nearby for testing
          const def = FISH_DATABASE['blue_whale'];
          if (def) {
              const speed = def.speedBase * 0.9;
              const y = 300; // Shallow enough to see with a small sonar upgrade
              fishes.push({
                  zone: 1, w: def.w, h: def.h, score: def.score, color: def.iconColor, speed, type: 'blue_whale', shape: def.shape,
                  y, baseY: y, baseX: boat.x + window.innerWidth * 0.2, // slightly to the right
                  x: 0, vx: 0, timeOffset: Math.random() * 100, amplitude: 50,
                  escapeSpeed: Math.max(speed * 2.5, 120), state: 'patrol', exclamationTimer: 0, noticeDist: def.noticeDist
              });
          }
      }
      if (shopOpen) {
          if (e.key === '1') attemptUpgrade('drop');
          if (e.key === '2') attemptUpgrade('depth');
          if (e.key === '3') attemptUpgrade('sonar');
      }

      if (e.code === 'KeyA' || e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') keys.A = true;
      if (e.code === 'KeyD' || e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') keys.D = true;
      if (e.code === 'Space') {
        if (!keys.Space) keys.spaceTaps++;
        keys.Space = true;
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'KeyA' || e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') keys.A = false;
      if (e.code === 'KeyD' || e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') keys.D = false;
      if (e.code === 'Space') keys.Space = false;
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp);

    const boat = {
      x: 0,
      y: 0,
      worldY: 0,
      vx: 0,
      rotation: 0,
    };

    const hook = {
      y: 0,
      vy: 0,
      fish: null as any,
      catchY: 0,
      tension: 0,
    };

    const rhythm = {
      active: false,
      cursor: 0,
      direction: 1,
      targetCenter: 0.5,
      targetWidth: 0.2,
      speed: 1.0,
      baseSpeed: 1.0,
      feedback: '',
      feedbackTimer: 0,
      feedbackColor: 'white',
      barFlash: 0,    // 0..1, decays over time, lights up the bar red on MISS
      graceTimer: 0,  // seconds remaining before passive tension starts ticking after a hook
    };

    const floatingTexts: any[] = [];
    const particles: any[] = [];

    const spawnParticles = (x: number, y: number, color: string, count: number, speedMulti: number = 1) => {
      for(let i=0; i<count; i++) {
         particles.push({
            x, y,
            vx: (Math.random() - 0.5) * 400 * speedMulti,
            vy: (Math.random() - 0.5) * 400 * speedMulti - 100,
            life: 1.0 + Math.random() * 0.5,
            color,
            size: Math.random() * 5 + 2
         });
      }
    };

    const fishes: any[] = [];
    for (let i=0; i<6; i++) fishes.push(spawnFish(1, boat.x, window.innerWidth));
    for (let i=0; i<6; i++) fishes.push(spawnFish(2, boat.x, window.innerWidth));
    for (let i=0; i<4; i++) fishes.push(spawnFish(3, boat.x, window.innerWidth));

    const spawnSchool = () => {
      const numFish = 5 + Math.floor(Math.random() * 8);
      const members = [];
      for(let i=0; i<numFish; i++) {
         members.push({
            offsetX: (Math.random() - 0.5) * 150,
            offsetY: (Math.random() - 0.5) * 80,
            phase: Math.random() * Math.PI * 2
         });
      }
      return {
         x: boat.x + (Math.random() > 0.5 ? 1 : -1) * (window.innerWidth + Math.random() * 800),
         y: 200 + Math.random() * 1500,
         vx: (Math.random() > 0.5 ? 1 : -1) * (40 + Math.random() * 40),
         members,
         color: `hsl(${Math.random() * 60 + 180}, 60%, 60%)`
      };
    };

    const schools: any[] = [];
    for(let i=0; i<6; i++) schools.push(spawnSchool());

    const spawnBubble = () => {
      return {
        x: boat.x + (Math.random() * window.innerWidth * 2 - window.innerWidth),
        y: Math.random() * 2000 + 500,
        size: Math.random() * 4 + 1,
        speed: Math.random() * 50 + 20,
        wobbleSpeed: Math.random() * 2 + 1,
        wobbleSize: Math.random() * 5 + 2,
        wobbleOffset: Math.random() * Math.PI * 2
      };
    };

    const bubbles: any[] = [];
    for (let i = 0; i < 150; i++) bubbles.push(spawnBubble());

    const spawnSnow = () => {
      return {
        x: boat.x + (Math.random() * window.innerWidth * 2 - window.innerWidth),
        y: Math.random() * 3000 + 100,
        size: Math.random() * 2 + 0.5,
        speedY: Math.random() * 10 + 5,
        speedX: (Math.random() - 0.5) * 15,
        phase: Math.random() * Math.PI * 2
      };
    };

    const marineSnow: any[] = [];
    for(let i=0; i<300; i++) marineSnow.push(spawnSnow());

    const sonars: {y: number, radius: number}[] = [];
    let sonarTimer = 0;
    let bigCreatureTimer = 0;
    const BIG_CREATURE_INTERVAL = 180;

    const getWave = (x: number, t: number) => {
      const w1 = Math.sin(x * 0.005 + t * 2) * 15;
      const w2 = Math.sin(x * 0.01 + t * 3) * 10;
      const w3 = Math.sin(x * 0.002 - t * 1) * 20;
      return (w1 + w2 + w3);
    };

    const escapeLine = () => {
      if (hook.fish) {
        screenShake = 8;
        combo = 0;
        hook.tension = 0;
        rhythm.active = false;
        rhythm.barFlash = 0;
        rhythm.graceTimer = 0;
        fishes.push(spawnFish(hook.fish.zone, boat.x, window.innerWidth));
        hook.fish = null;
        floatingTexts.push({ text: trRef.current("Fish Escaped!", "물고기 도망!"), x: boat.x, y: boat.worldY + hook.y, lifetime: 1.5, color: '#ef4444' });
        spawnParticles(boat.x, boat.worldY + hook.y, '#ef4444', 15, 1.0);
        playSound('escape');
      }
    };

    let lastTime = performance.now();
    let lastBoatSoundTime = 0;
    let animationFrameId: number;

    const gameLoop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;
      time += dt;

      // Weather Logic
      const distTraveled = Math.abs(boat.x - lastWeatherChangeX);
      weatherTimer -= dt;
      if (weatherTimer <= 0 || distTraveled > 3000) {
          lastWeatherChangeX = boat.x;
          const choices: ('clear'|'rain'|'storm')[] = ['clear', 'rain', 'storm'];
          const newWeather = choices[Math.floor(Math.random() * choices.length)];
          if (newWeather !== weather) {
              const weatherKo: Record<string, string> = { clear: '맑음', rain: '비', storm: '폭풍' };
              const weatherLabel = trRef.current(`WEATHER: ${newWeather.toUpperCase()}`, `날씨: ${weatherKo[newWeather]}`);
              floatingTexts.push({ text: weatherLabel, x: boat.x, y: boat.worldY - 80, lifetime: 3.0, color: '#f8fafc' });
          }
          weather = newWeather;
          targetWeatherIntensity = weather === 'clear' ? 0 : weather === 'rain' ? 0.6 : 1.0;
          weatherTimer = 40 + Math.random() * 40;
      }
      weatherIntensity += (targetWeatherIntensity - weatherIntensity) * dt * 0.2;

      // Big creature guarantee: ensure whale/shark appears at least every 3 minutes
      bigCreatureTimer += dt;
      const hasBigCreature = fishes.some(f => isBigCreature(f.type)) || (hook.fish && isBigCreature(hook.fish.type));
      if (hasBigCreature) {
        bigCreatureTimer = 0;
      } else if (bigCreatureTimer >= BIG_CREATURE_INTERVAL) {
        const forced = BIG_CREATURE_TYPES[Math.floor(Math.random() * BIG_CREATURE_TYPES.length)];
        fishes.push(spawnFish(3, boat.x, window.innerWidth, forced));
        bigCreatureTimer = 0;
      }

      // Sonar Logic
      sonarTimer -= dt;
      if (sonarTimer <= 0) {
          sonars.push({ y: boat.worldY + 20, radius: 0 });
          sonarTimer = 3.0; // send ping every 3 seconds
      }
      for (let i = sonars.length - 1; i >= 0; i--) {
          sonars[i].radius += 400 * dt; // slower sonar wave speed
          if (sonars[i].radius > 2000) {
              sonars.splice(i, 1);
          }
      }

      // Surface Current (affects boat drift slowly based on wind)
      const windSpeed = weatherIntensity * 80;

      // Boat Logic
      let moving = false;
      if (keys.A) { boat.vx = -300; moving = true; }
      if (keys.D) { boat.vx = 300; moving = true; }

      if (moving && time - lastBoatSoundTime > 0.4) {
          playSound('boat');
          lastBoatSoundTime = time;
      }

      if (!moving) {
        boat.vx *= 0.85;
        if (Math.abs(boat.vx) < 5) boat.vx = 0;
      }

      boat.x += (boat.vx + windSpeed) * dt;

      const waveIntensity = 1 + weatherIntensity * 1.5;
      const getWaveCurrent = (x: number, t: number) => {
          return getWave(x, t) * waveIntensity;
      };

      const waveY = getWaveCurrent(boat.x, time);
      boat.worldY = waveY;

      const delta = 2;
      const y1 = getWaveCurrent(boat.x - delta, time);
      const y2 = getWaveCurrent(boat.x + delta, time);
      boat.rotation = Math.atan2(y2 - y1, 2 * delta);

      const taps = keys.spaceTaps;
      keys.spaceTaps = 0;

      // Rhythm Hook Logic
      if (hook.fish) {
         // Advance cursor with reflective bounce so high speeds don't stick at edges
         rhythm.cursor += rhythm.direction * rhythm.speed * dt;
         while (rhythm.cursor > 1 || rhythm.cursor < 0) {
             if (rhythm.cursor > 1) {
                 rhythm.cursor = 2 - rhythm.cursor;
                 rhythm.direction = -1;
             } else if (rhythm.cursor < 0) {
                 rhythm.cursor = -rhythm.cursor;
                 rhythm.direction = 1;
             }
         }

         if (taps > 0) {
             const dist = Math.abs(rhythm.cursor - rhythm.targetCenter);
             const half = rhythm.targetWidth / 2;
             const hr_p = FISH_DATABASE[hook.fish.type] ? (FISH_DATABASE[hook.fish.type].rarity) : 'Common';
             const perfectHalf = half * (['Mythic', 'Legendary', 'Epic'].includes(hr_p) ? 1/3 : 1/2);

             if (dist <= half) {
                 const isPerfect = dist <= perfectHalf;
                 if (isPerfect) {
                     hook.y -= (hook.catchY * 0.25 + 60);
                     hook.tension -= 50;
                     combo++;
                     rhythm.feedback = `${trRef.current('PERFECT!', '완벽!')} ${combo > 1 ? `x${combo}` : ''}`;
                     rhythm.feedbackColor = '#22c55e';
                     spawnParticles(boat.x, boat.worldY + hook.y, '#22c55e', 10, 0.5);
                     playSound('perfect');
                 } else {
                     hook.y -= (hook.catchY * 0.15 + 35);
                     hook.tension -= 25;
                     // GOOD preserves combo (only MISS resets it)
                     rhythm.feedback = trRef.current('GOOD', '굿');
                     rhythm.feedbackColor = '#eab308';
                     playSound('good');
                 }
                 // Pick a new target on the bar, fully visible (no off-bar clipping)
                 const minC = half + 0.02;
                 const maxC = 1 - half - 0.02;
                 rhythm.targetCenter = minC + Math.random() * Math.max(0, maxC - minC);
                 // Slight speed variation, but always clamped near baseSpeed
                 rhythm.speed = rhythm.baseSpeed * (0.85 + Math.random() * 0.3);
             } else {
                 hook.y += hook.fish.escapeSpeed * 0.2;
                 hook.tension += 15;
                 combo = 0;
                 rhythm.feedback = trRef.current('MISS!', '실패!');
                 rhythm.feedbackColor = '#ef4444';
                 rhythm.speed = rhythm.baseSpeed * (0.9 + Math.random() * 0.2);
                 rhythm.barFlash = 1.0;
                 screenShake = 8;
                 playSound('miss');
             }
             rhythm.feedbackTimer = 1.0;
         }

         // Fish fights back! Tension increases passively over time
         const hookFishInfo = FISH_DATABASE[hook.fish.type];
         const hr = hookFishInfo ? hookFishInfo.rarity : 'Common';
         
         let passiveTensionRate = 5;
         if (hr === 'Mythic') passiveTensionRate = 35;
         else if (hr === 'Legendary') passiveTensionRate = 25;
         else if (hr === 'Epic') passiveTensionRate = 18;
         else if (hr === 'Rare') passiveTensionRate = 12;
         else if (hr === 'Uncommon') passiveTensionRate = 8;
         else passiveTensionRate = 5;

         // Grace period: right after a hook, give the player a moment to find the bar
         if (rhythm.graceTimer > 0) {
             rhythm.graceTimer -= dt;
             passiveTensionRate = 0;
         }

         hook.tension += passiveTensionRate * dt;
         if (hook.tension < 0) hook.tension = 0;

         // Passively escape slowly
         hook.y += hook.fish.escapeSpeed * 0.15 * dt;

         if (hook.tension >= 100 || hook.y > hook.catchY + 350) {
             escapeLine();
         } else if (hook.y <= 0) {
            screenShake = 5;
            hook.y = 0;
            hook.vy = 0;
            hook.tension = 0;
            rhythm.active = false;
            
            if (hook.fish.type === 'jellyfish' || hook.fish.type === 'jellyfish_deep') {
                boatStats.coins -= 3;
                if (boatStats.coins < 0) boatStats.coins = 0;
                if (!boatStats.caught[hook.fish.type]) boatStats.caught[hook.fish.type] = 0;
                boatStats.caught[hook.fish.type]++;
                saveStats();
                floatingTexts.push({ text: `-3`, x: boat.x, y: boat.worldY - 50, lifetime: 2.5, color: '#ef4444' });
                spawnParticles(boat.x, boat.worldY - 20, '#ef4444', 30, 2.0);
                playSound('miss');
            } else {
                let mult = 1 + combo * 0.1;
                let finalScore = Math.floor(hook.fish.score * mult);
                boatStats.coins += finalScore;
                if (!boatStats.caught[hook.fish.type]) boatStats.caught[hook.fish.type] = 0;
                boatStats.caught[hook.fish.type]++;
                saveStats();
                const comboSuffix = combo > 1 ? trRef.current(` (Combo x${combo})`, ` (콤보 x${combo})`) : '';
                floatingTexts.push({ text: `+${finalScore}${comboSuffix}`, x: boat.x, y: boat.worldY - 50, lifetime: 2.5, color: '#eab308' });
                spawnParticles(boat.x, boat.worldY - 20, '#eab308', 30, 2.0);
                playSound('catch');
            }

            fishes.push(spawnFish(hook.fish.zone, boat.x, window.innerWidth));
            hook.fish = null;
         }
      } else {
        const maxDepth = 250 + boatStats.depth * 300;
        if (keys.Space) {
          hook.vy += (400 + boatStats.drop * 100) * dt; // gravity
          const maxSpeed = 600 + boatStats.drop * 150;
          if (hook.vy > maxSpeed) hook.vy = maxSpeed;
          hook.y += hook.vy * dt;
          if (hook.y > maxDepth) {
              hook.y = maxDepth;
              hook.vy = 0;
          }
        } else {
          if (hook.y > 0) {
            const reelSpeed = (600 + boatStats.drop * 100) * 0.6;
            hook.y -= reelSpeed * dt;
            if (hook.y <= 0) {
              hook.y = 0;
              hook.vy = 0;
            }
          } else {
            hook.y = 0;
            hook.vy = 0;
          }
        }
      }

      // Fish Logic
      const coneHalfAngle = (15 + (boatStats.sonar || 0) * 10) * Math.PI / 180;
      for (let i = fishes.length - 1; i >= 0; i--) {
        const f = fishes[i];
        
        // Decay revealed amount
        f.revealedAmount = Math.max(0, (f.revealedAmount || 0) - dt * 0.2); // 5 second visibility
        for (const s of sonars) {
           const dx = f.x - boat.x;
           const dy = f.y - s.y;
           const distSq = dx*dx + dy*dy;
           const dist = Math.sqrt(distSq);
           const angle = Math.atan2(dy, dx); 
           const angleDiff = Math.abs(angle - Math.PI / 2); // math.PI/2 is directly downwards

           if (Math.abs(dist - s.radius) < 60 && angleDiff <= coneHalfAngle) {
              f.revealedAmount = 1.0;
           }
        }

        if (hook.fish !== f) {
          const hookWorldX = boat.x;
          const hookWorldY = boat.worldY + hook.y;
          const dx = f.x - hookWorldX;
          const dy = f.y - hookWorldY;
          const distSq = dx * dx + dy * dy;

          const currentNoticeDist = f.noticeDist * 2.5 * (1 - weatherIntensity * 0.4);

          if (!hook.fish && hook.y > 0 && distSq < currentNoticeDist * currentNoticeDist) {
              if (f.state === 'patrol') {
                  f.state = 'chasing';
                  f.hasShownExclamation = false;
              }
              const closeDist = f.w * 1.5;
              if (f.state === 'chasing' && !f.hasShownExclamation && distSq < closeDist * closeDist) {
                  f.exclamationTimer = 1.0;
                  f.hasShownExclamation = true;
              }
          } else {
              if (f.state === 'chasing') {
                  f.state = 'patrol';
                  f.baseX = f.x;
                  f.timeOffset = -time;
              }
          }

          if (f.state === 'chasing') {
              const dist = Math.sqrt(distSq);
              const moveSpeed = f.speed * (['shark', 'whale'].includes(f.shape) ? 3.0 : 2.0);
              f.x -= (dx / dist) * moveSpeed * dt;
              f.y -= (dy / dist) * moveSpeed * dt;
              f.vx = dx < 0 ? 1 : -1;
              f.baseX = f.x;
              f.baseY = f.y;
          } else {
              // React to Boat (Fleeing)
              const boatDx = f.x - boat.x;
              const boatDy = f.y - boat.worldY;
              const boatDistSq = boatDx * boatDx + boatDy * boatDy;
              if (boatDistSq < 400 * 400) {
                  const bd = Math.sqrt(boatDistSq);
                  f.baseX += (boatDx / bd) * 80 * dt;
                  f.baseY += Math.abs(boatDy / bd) * 40 * dt; // Dive away
              } else {
                  // Schooling
                  let cgX = 0, cgY = 0, count = 0;
                  for (let j = 0; j < fishes.length; j++) {
                      if (i !== j && fishes[j].type === f.type && fishes[j].state === 'patrol') {
                          const f2 = fishes[j];
                          const d2 = (f.x - f2.x) * (f.x - f2.x) + (f.y - f2.y) * (f.y - f2.y);
                          if (d2 < 300 * 300) {
                              cgX += f2.x;
                              cgY += f2.y;
                              count++;
                          }
                      }
                  }
                  if (count > 0) {
                      cgX /= count;
                      cgY /= count;
                      f.baseX += (cgX - f.x) * dt * 0.4;
                      f.baseY += (cgY - f.y) * dt * 0.4;
                  }
              }

              // Zone clamp
              const minZ = f.zone === 1 ? 50 : f.zone === 2 ? 250 : 550;
              const maxZ = f.zone === 1 ? 250 : f.zone === 2 ? 550 : 1550;
              f.baseY = Math.max(minZ, Math.min(f.baseY, maxZ));

              const targetX = f.baseX + Math.sin((time + f.timeOffset) * (f.speed / 100)) * f.amplitude;
              f.x += (targetX - f.x) * Math.min(1, dt * 1.5);
              f.y += (f.baseY - f.y) * Math.min(1, dt * 0.5);
              f.vx = Math.cos((time + f.timeOffset) * (f.speed / 100)); // direction
          }
          
          if (f.exclamationTimer > 0) f.exclamationTimer -= dt;
          
          const visibleW = Math.max(canvas.width * 2.5, (canvas.width / zoom) * 1.5);
          if (Math.abs(f.baseX - boat.x) > visibleW) {
            f.baseX = boat.x + (f.baseX > boat.x ? -visibleW : visibleW) + (Math.random() * 300 - 150);
            if (f.zone === 1) f.baseY = Math.random() * 200 + 50;
            else if (f.zone === 2) f.baseY = Math.random() * 300 + 250;
            else f.baseY = Math.random() * 1000 + 550;
          }

          if (!hook.fish && hook.y > 0) {
            if (distSq < (f.w / 2 + 5) * (f.w / 2 + 5)) {
              if (f.type === 'jellyfish' || f.type === 'jellyfish_deep') {
                  boatStats.coins -= 3;
                  if (boatStats.coins < 0) boatStats.coins = 0;
                  saveStats();
                  screenShake = 5;
                  floatingTexts.push({ text: "-3", x: boat.x, y: boat.worldY + hook.y, lifetime: 2.0, color: '#ef4444' });
                  spawnParticles(boat.x, boat.worldY + hook.y, '#ef4444', 20, 1.0);
                  playSound('error');
                  fishes[i] = spawnFish(f.zone, boat.x, window.innerWidth); // instantly replace
              } else {
                  const fishInfo = FISH_DATABASE[f.type];
                  const rarity = fishInfo ? fishInfo.rarity : 'Common';

                  hook.fish = f;
                  playSound('hooked');
                  hook.catchY = hook.y;
                  hook.tension = 0;
                  rhythm.active = true;
                  rhythm.cursor = 0;
                  rhythm.direction = 1;

                  if (rarity === 'Mythic') {
                      rhythm.baseSpeed = 1.4;
                      rhythm.targetWidth = 0.18;
                  } else if (rarity === 'Legendary') {
                      rhythm.baseSpeed = 1.2;
                      rhythm.targetWidth = 0.22;
                  } else if (rarity === 'Epic') {
                      rhythm.baseSpeed = 1.0;
                      rhythm.targetWidth = 0.26;
                  } else if (rarity === 'Rare') {
                      rhythm.baseSpeed = 0.8;
                      rhythm.targetWidth = 0.32;
                  } else if (rarity === 'Uncommon') {
                      rhythm.baseSpeed = 0.6;
                      rhythm.targetWidth = 0.42;
                  } else { // Common
                      rhythm.baseSpeed = 0.45;
                      rhythm.targetWidth = 0.55;
                  }
                  // Place target safely inside the bar (never clipped off-screen)
                  {
                      const half = rhythm.targetWidth / 2;
                      const minC = half + 0.02;
                      const maxC = 1 - half - 0.02;
                      rhythm.targetCenter = minC + Math.random() * Math.max(0, maxC - minC);
                  }
                  rhythm.speed = rhythm.baseSpeed;
                  rhythm.barFlash = 0;
                  rhythm.graceTimer = 0.6;

                  rhythm.feedback = trRef.current('HOOKED!', '걸렸다!');
                  rhythm.feedbackColor = '#3b82f6';
                  rhythm.feedbackTimer = 1.0;
                  fishes.splice(i, 1);
              }
            }
          }
        }
      }

      // Bubbles Logic
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const b = bubbles[i];
        b.y -= b.speed * dt;
        if (b.y < -100) {
          bubbles[i] = spawnBubble();
          bubbles[i].y = Math.max(1000, camY + canvas.height / (2 * zoom) + Math.random() * 500);
        }
        
        const visibleW = Math.max(canvas.width * 1.5, (canvas.width / zoom) * 1.2);
        if (Math.abs(b.x - boat.x) > visibleW) {
          b.x = boat.x + (b.x > boat.x ? -visibleW : visibleW) + (Math.random() * 200 - 100);
        }
      }

      // Schools Logic
      const visibleW = Math.max(canvas.width * 2, (canvas.width / zoom) * 1.5);
      for (let i = schools.length - 1; i >= 0; i--) {
         const s = schools[i];
         s.x += s.vx * dt;
         if (Math.abs(s.x - boat.x) > visibleW + 500) {
            schools[i] = spawnSchool();
         }
      }

      // Marine Snow Logic
      for (let i = marineSnow.length - 1; i >= 0; i--) {
         const s = marineSnow[i];
         s.y += s.speedY * dt;
         s.x += s.speedX * dt + Math.sin(time * 0.5 + s.phase) * 10 * dt;
         if (s.y > 4000) {
            s.y = camY - canvas.height / zoom;
         }
         // Wrap horizontally
         if (Math.abs(s.x - boat.x) > visibleW) {
            s.x = boat.x + (s.x > boat.x ? -visibleW : visibleW) + (Math.random() * 200 - 100);
         }
      }

      // Floating Texts
      for (let i = floatingTexts.length - 1; i >= 0; i--) {
        floatingTexts[i].lifetime -= dt;
        floatingTexts[i].y -= 20 * dt;
        if (floatingTexts[i].lifetime <= 0) floatingTexts.splice(i, 1);
      }

      // Particles Logic
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= dt;
        p.vy += 300 * dt; // gravity
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.life <= 0) particles.splice(i, 1);
      }

      // Camera
      const targetZoom = hook.y > 300 ? 0.8 : 1.0;
      let boundedZoom = Math.max(0.4, targetZoom);
      zoom += (boundedZoom - zoom) * dt * 2.5;

      camX += (boat.x - camX) * dt * 5;
      const targetCamY = boat.worldY + hook.y;
      camY += (targetCamY - camY) * dt * 3.5;

      if (screenShake > 0) {
        screenShake -= 40 * dt;
        if (screenShake < 0) screenShake = 0;
      }

      // Rendering
      ctx.fillStyle = cachedSkyGrad ?? '#38bdf8';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (weatherIntensity > 0) {
          ctx.fillStyle = `rgba(30, 41, 59, ${Math.min(weatherIntensity * 0.8, 0.95)})`; // Storm darken
          ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Draw Sun
      ctx.globalAlpha = Math.max(0, 1 - weatherIntensity * 2);
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(canvas.width * 0.8, canvas.height * 0.2, 50, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;

      // Cloud Parallax
      const c = Math.floor(255 - weatherIntensity * 100);
      ctx.fillStyle = `rgba(${c}, ${c}, ${c}, 0.8)`;
      for(let i=0; i<5; i++) {
         const cloudX = ((boat.x * -0.1 + i * 400 + time * (10 + weatherIntensity * 50)) % (canvas.width * 2)) - canvas.width * 0.5;
         const cloudY = 50 + (i % 2) * 50;
         ctx.beginPath();
         ctx.arc(cloudX, cloudY, 40, Math.PI, 0);
         ctx.arc(cloudX + 40, cloudY - 10, 50, Math.PI, 0);
         ctx.arc(cloudX + 80, cloudY, 40, Math.PI, 0);
         ctx.fill();
      }

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(zoom, zoom);
      
      const sX = (Math.random() - 0.5) * screenShake * 2;
      const sY = (Math.random() - 0.5) * screenShake * 2;
      ctx.translate(-camX + sX, -camY + sY);

      // Scenery: Distant Islands
      for (const island of islands) {
          // Parallax for islands (slower than foreground)
          const parallaxX = island.xOffset + boat.x * 0.8; 
          ctx.fillStyle = island.color;
          ctx.beginPath();
          ctx.moveTo(parallaxX, 0);
          ctx.quadraticCurveTo(parallaxX + island.width / 2, -island.height, parallaxX + island.width, 0);
          ctx.fill();
          
          if (parallaxX < boat.x - 2000) {
              island.xOffset += 4000;
          } else if (parallaxX > boat.x + 2000) {
              island.xOffset -= 4000;
          }
      }

      if (weatherIntensity > 0) {
          ctx.fillStyle = `rgba(30, 41, 59, ${weatherIntensity * 0.4})`;
          ctx.fillRect(camX - canvas.width/zoom, -500, canvas.width/zoom * 2, 500); // fog out islands over distance
      }

      ctx.fillStyle = cachedSeaGrad ?? '#1e3a8a';

      const seaLeft = camX - canvas.width / (2 * zoom) - 200;
      const seaRight = camX + canvas.width / (2 * zoom) + 200;

      ctx.beginPath();
      ctx.moveTo(seaLeft, 0);
      for (let x = seaLeft; x <= seaRight; x += 50) {
        ctx.lineTo(x, getWave(x, time));
      }
      ctx.lineTo(seaRight, 0);
      ctx.lineTo(seaRight, 4000);
      ctx.lineTo(seaLeft, 4000);
      ctx.closePath();
      ctx.fill();

      // Draw Underwater Background Decor (Seabed, Rocks, Kelp)
      ctx.save();
      const floorY = 2000;
      
      // We will generate positions deterministically based on x chunk
      const startSeg = Math.floor(seaLeft / 200);
      const endSeg = Math.floor(seaRight / 200);
      
      for (let s = startSeg; s <= endSeg; s++) {
         const chunkX = s * 200;
         const seed1 = Math.abs(s * 1111);
         const seed2 = Math.abs(s * 2222);
         
         // 1. Draw some background rocks/silhouettes near the floor
         const numRocks = (seed1 % 3);
         for (let r=0; r<numRocks; r++) {
             const rs = seed1 + r*123;
             const rx = chunkX + (rs % 200);
             const rWidth = 100 + (rs % 150);
             const rHeight = 80 + (rs % 200);
             ctx.fillStyle = '#0f172a'; // very dark rock
             ctx.beginPath();
             ctx.ellipse(rx, floorY, rWidth, rHeight, 0, Math.PI, 0);
             ctx.fill();
             
             // A few corals
             const numCorals = rs % 3;
             for (let c=0; c<numCorals; c++) {
                 const cx = rx + ((rs + c*10) % rWidth) - rWidth/2;
                 const cy = floorY - rHeight * 0.7;
                 ctx.strokeStyle = (c%2===0) ? '#831843' : '#701a75';
                 ctx.lineWidth = 12 + (rs%5);
                 ctx.lineCap = 'round';
                 ctx.beginPath();
                 ctx.moveTo(cx, cy);
                 ctx.quadraticCurveTo(cx - 20, cy - 30, cx + 10, cy - 60);
                 ctx.stroke();
             }
         }

         // 2. Draw Giant Kelp
         const numKelp = (seed2 % 4);
         for (let k=0; k<numKelp; k++) {
            const ks = seed2 + k * 888;
            const kx = chunkX + (ks % 200);
            const kHeight = 800 + (ks % 1000); // 800 to 1800 height
            const numSegs = 25;
            const segLen = kHeight / numSegs;
            const swayOffset = ((ks % 100) / 100) * Math.PI * 2;
            
            // Draw Main Stalk
            ctx.beginPath();
            ctx.moveTo(kx, floorY);
            for (let i=1; i<=numSegs; i++) {
                const segY = floorY - i * segLen;
                const swayAmt = Math.sin(time * 0.5 + swayOffset + segY * 0.005) * 40 * (i/numSegs);
                ctx.lineTo(kx + swayAmt, segY);
            }
            ctx.strokeStyle = '#064e3b'; // dark green
            ctx.lineWidth = 6 + (ks%4);
            ctx.stroke();
            
            // Draw Leaves
            ctx.fillStyle = '#065f46';
            ctx.beginPath();
            for (let i=2; i<=numSegs; i++) {
                const segY = floorY - i * segLen;
                const swayAmt = Math.sin(time * 0.5 + swayOffset + segY * 0.005) * 40 * (i/numSegs);
                const leafX = kx + swayAmt;
                
                const dir = (i%2===0) ? 1 : -1;
                const leafSway = Math.sin(time * 1.2 + segY * 0.01) * 10 * dir;
                ctx.moveTo(leafX, segY);
                ctx.quadraticCurveTo(leafX + 20*dir, segY - 10 + leafSway, leafX + 35*dir + leafSway, segY);
                ctx.quadraticCurveTo(leafX + 20*dir, segY + 10 + leafSway, leafX, segY);
            }
            ctx.fill();
         }

         // 3. Floating Seaweed/Kelp in mid-water
         const numFloating = seed1 % 4;
         for (let f=0; f < numFloating; f++) {
             const fs = seed1 + f * 555;
             const fx = chunkX + (fs % 200);
             const fy = 100 + (fs % 1800); // spread across 100 to 1900 depth
             const fHeight = 60 + (fs % 150);
             const sOffset = (fs % 100) / 100 * Math.PI * 2;
             
             ctx.strokeStyle = `rgba(6, 95, 70, ${Math.max(0.1, 0.4 - fy/4000)})`; // fade out deep down
             ctx.lineWidth = 4 + (fs%2);
             ctx.beginPath();
             ctx.moveTo(fx, fy);
             let currX = fx;
             for (let i=1; i<=8; i++) {
                 const segY = fy - (fHeight/8) * i;
                 currX += Math.sin(time*0.7 + sOffset + segY*0.01) * 4;
                 ctx.lineTo(currX, segY);
             }
             ctx.stroke();
         }
      }
      ctx.restore();

      // Light shafts & Caustics
      ctx.save();
      const shaftSpacing = 250;
      const visibleHalfWidth = canvas.width / (2 * zoom) + shaftSpacing * 2;

      // Top surface caustics (horizontal shimmering) — iterate on a stable
      // world-aligned X grid so vertices don't shift as the camera moves.
      if (camY < 800) {
          const causticStep = 100;
          const causticStart = Math.floor((camX - visibleHalfWidth) / causticStep) * causticStep;
          const causticEnd = camX + visibleHalfWidth;
          ctx.globalCompositeOperation = 'screen';
          for(let i=0; i<3; i++) {
              ctx.fillStyle = `rgba(255, 255, 255, ${0.05 + Math.sin(time*1.5 + i)*0.02})`;
              ctx.beginPath();
              ctx.moveTo(causticStart, 0);
              for(let x=causticStart; x <= causticEnd; x+=causticStep) {
                  ctx.lineTo(x, 100 + i*50 + Math.sin(x*0.01 + time + i)*40);
              }
              ctx.lineTo(causticEnd, 0);
              ctx.fill();
          }
      }

      // Light shafts: identify each shaft by its STABLE world-grid index so
      // sin-based per-shaft offsets don't jump as the camera crosses a 250px
      // boundary. Previously `i` was a relative loop index that shifted by 1
      // every time camX crossed a grid line, causing visible flicker/snap.
      ctx.globalCompositeOperation = 'screen';
      const shaftStartIdx = Math.floor((camX - visibleHalfWidth) / shaftSpacing);
      const shaftEndIdx = Math.ceil((camX + visibleHalfWidth) / shaftSpacing);
      for (let idx = shaftStartIdx; idx <= shaftEndIdx; idx++) {
        const baseX = idx * shaftSpacing;
        const shaftX = baseX + Math.sin(time * 0.2 + idx * 1.5) * 200;
        const shaftWidth = 100 + Math.sin(time * 0.4 + idx) * 80;
        const shaftAngleOffset = 300 + Math.sin(time * 0.1 + idx) * 200;

        const shaftGrad = ctx.createLinearGradient(shaftX, 0, shaftX + shaftAngleOffset, 2500);
        shaftGrad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
        shaftGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
        shaftGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = shaftGrad;
        ctx.beginPath();
        ctx.moveTo(shaftX, 0);
        ctx.lineTo(shaftX + shaftWidth, 0);
        ctx.lineTo(shaftX + shaftWidth + shaftAngleOffset, 2500);
        ctx.lineTo(shaftX + shaftAngleOffset, 2500);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // Bubbles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      for (const b of bubbles) {
        const bx = b.x + Math.sin(time * b.wobbleSpeed + b.wobbleOffset) * b.wobbleSize;
        ctx.fillRect(bx - b.size, b.y - b.size, b.size * 2, b.size * 2);
      }

      // Marine Snow
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      const snowCamY = canvas.height / zoom;
      const snowCamX = canvas.width / zoom;
      for (const m of marineSnow) {
         if (Math.abs(m.y - camY) < snowCamY && Math.abs(m.x - camX) < snowCamX) {
             ctx.fillRect(m.x - m.size, m.y - m.size, m.size * 2, m.size * 2);
         }
      }

      // Sonar rings (Oceanic Synthwave style)
      const uiConeHalfAngle = (15 + (boatStats.sonar || 0) * 10) * Math.PI / 180;
      for (const s of sonars) {
          const maxRadius = 2000;
          const alphaFade = Math.max(0, 1.0 - s.radius / maxRadius);
          
          if (alphaFade > 0 && s.radius > 0) {
              const grad = ctx.createRadialGradient(boat.x, s.y, 0, boat.x, s.y, s.radius);
              grad.addColorStop(0, `rgba(56, 189, 248, 0)`);       
              grad.addColorStop(0.8, `rgba(56, 189, 248, ${0.05 * alphaFade})`);
              grad.addColorStop(0.95, `rgba(125, 211, 252, ${0.15 * alphaFade})`);   
              grad.addColorStop(1, `rgba(224, 242, 254, ${0.4 * alphaFade})`);   
              
              ctx.beginPath();
              ctx.moveTo(boat.x, s.y);
              ctx.arc(boat.x, s.y, s.radius, Math.PI / 2 - uiConeHalfAngle, Math.PI / 2 + uiConeHalfAngle);
              ctx.closePath();
              ctx.fillStyle = grad;
              ctx.fill();

              // Outline of the scanning edge
              ctx.beginPath();
              ctx.arc(boat.x, s.y, s.radius, Math.PI / 2 - uiConeHalfAngle, Math.PI / 2 + uiConeHalfAngle);
              ctx.strokeStyle = `rgba(186, 230, 253, ${0.8 * alphaFade})`;
              ctx.lineWidth = 2;
              ctx.stroke();
              
              // Internal echo wave
              if (s.radius > 150) {
                  ctx.beginPath();
                  ctx.arc(boat.x, s.y, s.radius - 120, Math.PI / 2 - uiConeHalfAngle, Math.PI / 2 + uiConeHalfAngle);
                  ctx.strokeStyle = `rgba(56, 189, 248, ${0.4 * alphaFade})`;
                  ctx.lineWidth = 1;
                  ctx.stroke();
              }

              // Side lines expanding
              ctx.beginPath();
              ctx.moveTo(boat.x, s.y);
              ctx.lineTo(boat.x + Math.cos(Math.PI / 2 - uiConeHalfAngle) * s.radius, s.y + Math.sin(Math.PI / 2 - uiConeHalfAngle) * s.radius);
              ctx.moveTo(boat.x, s.y);
              ctx.lineTo(boat.x + Math.cos(Math.PI / 2 + uiConeHalfAngle) * s.radius, s.y + Math.sin(Math.PI / 2 + uiConeHalfAngle) * s.radius);
              ctx.strokeStyle = `rgba(56, 189, 248, ${0.3 * alphaFade})`;
              ctx.lineWidth = 1;
              ctx.stroke();
          }
      }

      // Schools of ambient fish
      for (const s of schools) {
         ctx.save();
         ctx.globalAlpha = 0.6;
         ctx.translate(s.x, s.y);
         ctx.scale(s.vx > 0 ? -1 : 1, 1);
         
         ctx.fillStyle = s.color;
         
         ctx.beginPath();
         for(const fm of s.members) {
            const sx = fm.offsetX + Math.sin(time * 0.5 + fm.phase) * 20;
            const sy = fm.offsetY + Math.cos(time * 0.7 + fm.phase) * 10;
            ctx.moveTo(sx + 8, sy);
            ctx.ellipse(sx, sy, 8, 4, 0, 0, Math.PI * 2);
         }
         ctx.fill();
         
         ctx.beginPath();
         for(const fm of s.members) {
            const sx = fm.offsetX + Math.sin(time * 0.5 + fm.phase) * 20;
            const sy = fm.offsetY + Math.cos(time * 0.7 + fm.phase) * 10;
            const tailWobble = Math.sin(time * 15 + fm.phase) * 3;
            ctx.moveTo(sx + 8, sy); 
            ctx.lineTo(sx + 14, sy - 4 + tailWobble);
            ctx.lineTo(sx + 14, sy + 4 + tailWobble);
         }
         ctx.fill();
         
         ctx.restore();
      }

      for (const f of fishes) {
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.scale(f.vx > 0 ? -1 : 1, 1);
        drawFish(ctx, f, time, 0, false, f.revealedAmount || 0);
        ctx.restore();
        
        // Draw exclamation mark
        if (f.exclamationTimer > 0) {
            ctx.save();
            ctx.translate(f.x, f.y - f.h / 2 - 20);
            
            // Pop effect
            const scale = Math.min(1, (1.0 - f.exclamationTimer) * 5);
            ctx.scale(scale, scale);
            
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-8, -10);
            ctx.lineTo(-8, -25);
            ctx.lineTo(8, -25);
            ctx.lineTo(8, -10);
            ctx.fill();
            
            ctx.fillStyle = 'white';
            ctx.font = 'bold 16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('!', 0, -12);
            ctx.restore();
        }
      }

      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2 / zoom;
      ctx.beginPath();
      ctx.moveTo(boat.x, boat.worldY);
      
      let hookWorldY = boat.worldY + hook.y;
      if (hook.fish && hook.vy < 0) {
        ctx.lineTo(boat.x, hookWorldY);
      } else {
        let slack = (hook.vy > 0) ? hook.vy * 0.05 : 0; 
        let windCurve = weatherIntensity * 80 * Math.min(1, hook.y / 200);
        ctx.quadraticCurveTo(boat.x + slack + windCurve, boat.worldY + hook.y / 2, boat.x, hookWorldY);
      }
      ctx.stroke();

      ctx.save();
      ctx.translate(boat.x, hookWorldY);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3 / zoom;
      ctx.beginPath();
      ctx.arc(0, 8, 5, 0, Math.PI);
      ctx.moveTo(-5, 8);
      ctx.lineTo(-5, -2);
      ctx.stroke();
      
      if (!hook.fish) {
         ctx.fillStyle = 'rgba(250, 204, 21, 0.8)';
         ctx.beginPath();
         ctx.arc(0, 10, 4, 0, Math.PI * 2);
         ctx.fill();
         ctx.shadowColor = '#facc15';
         ctx.shadowBlur = 10;
         ctx.beginPath();
         ctx.arc(0, 10, 2, 0, Math.PI * 2);
         ctx.fill();
         ctx.shadowBlur = 0;
      }

      if (hook.fish) {
        const hf = hook.fish;
        
        const dangerLevel1 = hook.tension / 100;
        const dangerLevel2 = Math.max(0, hook.y - hook.catchY) / 350;
        const dangerLevel = Math.max(dangerLevel1, dangerLevel2);

        if (dangerLevel > 0) {
            // Highlight escape downward path
            ctx.strokeStyle = `rgba(239, 68, 68, ${dangerLevel * 0.5})`; // red
            ctx.lineWidth = (4 + dangerLevel * 6) / zoom;
            ctx.setLineDash([10, 10]);
            ctx.beginPath();
            ctx.moveTo(0, 15);
            ctx.lineTo(0, (hook.catchY + 350) - hook.y + 15);
            ctx.stroke();
            ctx.setLineDash([]);
            
            // Random frantic particles
            if (Math.random() < dangerLevel * 0.8) {
                spawnParticles(
                    boat.x + (Math.random()-0.5)*15, 
                    hookWorldY + 15 + (Math.random()-0.5)*15, 
                    '#ef4444', 1, 0.3 + dangerLevel * 0.2
                );
            }
        }

        ctx.translate(0, 15);
        ctx.rotate(-Math.PI / 2);
        
        drawFish(ctx, hf, time, dangerLevel, true, 1.0);
      }
      ctx.restore();

      ctx.save();
      ctx.translate(boat.x, boat.worldY);
      ctx.rotate(boat.rotation);

      // Fisherman
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(-10, -20, 6, 0, Math.PI * 2); // Head
      ctx.fill();
      ctx.fillRect(-14, -15, 8, 15); // Body
      
      // Fisherman hat
      ctx.fillStyle = '#fcd34d'; 
      ctx.beginPath();
      ctx.ellipse(-10, -25, 10, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-10, -25, 6, Math.PI, 0);
      ctx.fill();

      // Boat Hull
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.moveTo(-45, -5); ctx.lineTo(40, -5); ctx.lineTo(25, 18); ctx.lineTo(-30, 18);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#92400e';
      ctx.fillRect(-35, 0, 65, 3);
      
      // Mast
      ctx.fillStyle = '#78350f';
      ctx.fillRect(8, -60, 4, 55);
      
      // Flag
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(12, -55); 
      ctx.lineTo(35 + Math.sin(time * 5) * 5, -45); 
      ctx.lineTo(12, -35);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();

      for (const ft of floatingTexts) {
        ctx.save();
        ctx.translate(ft.x, ft.y);
        ctx.scale(1/zoom, 1/zoom);
        ctx.globalAlpha = Math.max(0, ft.lifetime);
        ctx.fillStyle = ft.color || 'white';
        ctx.font = 'bold 32px sans-serif';
        ctx.textAlign = 'center';
        ctx.strokeStyle = 'rgba(0,0,0,0.8)';
        ctx.lineWidth = 4;
        ctx.strokeText(ft.text, 0, 0);
        ctx.fillText(ft.text, 0, 0);
        ctx.restore();
      }

      // Draw Particles
      for (const p of particles) {
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size, p.y - p.size, p.size * 2, p.size * 2);
      }
      ctx.globalAlpha = 1.0;

      ctx.restore();

      // Screen space rain
      if (weatherIntensity > 0) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${weatherIntensity * 0.4})`;
          ctx.lineWidth = 1 + weatherIntensity;
          ctx.lineCap = 'round';
          const windTilt = weatherIntensity * 200; // x momentum
          
          const depthFade = Math.max(0, 1 - (camY / 800));
          
          if (depthFade > 0) {
              ctx.globalAlpha = depthFade;
              ctx.beginPath();
              for (let i = 0; i < raindrops.length; i++) {
                  const r = raindrops[i];
                  r.y += r.speedY * dt;
                  r.x += windTilt * dt;
                  
                  if (r.y > canvas.height + Math.random() * 200) {
                      r.y = -100;
                      r.x = Math.random() * canvas.width * 1.5 - canvas.width * 0.25;
                  }
                  ctx.moveTo(r.x, r.y);
                  ctx.lineTo(r.x - windTilt * 0.05, r.y - r.length);
              }
              ctx.stroke();
          } else {
              for (let i = 0; i < raindrops.length; i++) {
                  const r = raindrops[i];
                  r.y += r.speedY * dt;
                  r.x += windTilt * dt;
                  if (r.y > canvas.height + Math.random() * 200) {
                      r.y = -100;
                      r.x = Math.random() * canvas.width * 1.5 - canvas.width * 0.25;
                  }
              }
          }
          ctx.globalAlpha = 1.0;
      }

      const mobileMode = isTouchRef.current || canvas.width < 760 || canvas.height < 520;
      const safeTop = mobileMode ? Math.max(12, canvas.height < 520 ? 8 : 20) : 20;
      const safeSide = mobileMode ? 12 : 20;

      // HUD Score & Combo
      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      ctx.beginPath();
      const coinBoxWidth = mobileMode ? 160 : 220;
      const coinBoxHeight = combo > 0 ? (mobileMode ? 66 : 80) : (mobileMode ? 42 : 50);
      ctx.roundRect(canvas.width - coinBoxWidth - safeSide, safeTop, coinBoxWidth, coinBoxHeight, 10);
      ctx.fill();

      ctx.fillStyle = '#facc15';
      ctx.font = mobileMode ? 'bold 17px sans-serif' : 'bold 24px sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${trRef.current('COINS', '코인')}: ${boatStats.coins}`, canvas.width - safeSide - 14, safeTop + (mobileMode ? 22 : 25));
      
      if (combo > 0) {
         ctx.fillStyle = '#facc15';
         ctx.font = mobileMode ? 'bold 14px sans-serif' : 'bold 18px sans-serif';
         ctx.fillText(`${trRef.current('COMBO', '콤보')} x${combo}`, canvas.width - safeSide - 14, safeTop + (mobileMode ? 50 : 55));
      }

      // HUD Controls
      if (!mobileMode) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.5)';
      ctx.beginPath(); 
      ctx.roundRect(20, 20, 280, 200, 10); 
      ctx.fill();
      
      ctx.fillStyle = '#38bdf8';
      ctx.textAlign = 'left';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText(trRef.current("CONTROLS", "조작법"), 40, 45);

      ctx.fillStyle = '#f8fafc';
      ctx.font = '15px sans-serif';
      ctx.fillText(trRef.current("A / D  -  Move Boat", "A / D  -  배 이동"), 40, 75);
      ctx.fillText(trRef.current("SPACE (Hold)  -  Drop Line", "스페이스(꾹)  -  줄 내리기"), 40, 100);
      ctx.fillText(trRef.current("SPACE (Tap)  -  Catch Fish", "스페이스(탭)  -  낚아채기"), 40, 125);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText(trRef.current("B  -  Open Shop", "B  -  상점 열기"), 40, 155);

      ctx.fillStyle = '#22c55e';
      ctx.fillText(trRef.current("E  -  Encyclopedia", "E  -  도감"), 40, 185);
      }

      if (shopOpen) {
          const shopWidth = Math.min(500, canvas.width - safeSide * 2);
          const shopHeight = Math.min(400, canvas.height - safeTop * 2 - (mobileMode ? 108 : 0));
          const shopLeft = canvas.width / 2 - shopWidth / 2;
          const shopTop = Math.max(safeTop + 56, canvas.height / 2 - shopHeight / 2);
          const shopCenterX = canvas.width / 2;
          ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
          ctx.beginPath();
          ctx.roundRect(shopLeft, shopTop, shopWidth, shopHeight, 20);
          ctx.fill();

          ctx.textAlign = 'center';
          ctx.fillStyle = '#facc15';
          ctx.font = mobileMode ? 'bold 22px sans-serif' : 'bold 32px sans-serif';
          ctx.fillText(trRef.current("UPGRADE SHOP", "업그레이드 상점"), shopCenterX, shopTop + 60);

          ctx.font = mobileMode ? '15px sans-serif' : '20px sans-serif';
          ctx.fillStyle = '#f8fafc';

          const getCost = (level: number) => level < 5 ? 50 + level * 50 : trRef.current('MAX', '최대');
          const costLabel = trRef.current('Cost', '비용');

          ctx.textAlign = 'left';
          const labelX = shopLeft + (mobileMode ? 24 : 70);
          const costX = shopLeft + shopWidth - (mobileMode ? 112 : 190);
          const firstRowY = shopTop + (mobileMode ? 126 : 170);
          const rowGap = mobileMode ? 54 : 70;
          ctx.fillText(trRef.current(`1: Drop Speed (Lv ${boatStats.drop}/5)`, `1: 하강 속도 (Lv ${boatStats.drop}/5)`), labelX, firstRowY);
          ctx.fillText(`${costLabel}: ${getCost(boatStats.drop)}`, costX, firstRowY);

          ctx.fillText(trRef.current(`2: Max Depth (Lv ${boatStats.depth}/5)`, `2: 최대 수심 (Lv ${boatStats.depth}/5)`), labelX, firstRowY + rowGap);
          ctx.fillText(`${costLabel}: ${getCost(boatStats.depth)}`, costX, firstRowY + rowGap);

          ctx.fillText(trRef.current(`3: Sonar Cone (Lv ${boatStats.sonar}/5)`, `3: 소나 (Lv ${boatStats.sonar}/5)`), labelX, firstRowY + rowGap * 2);
          ctx.fillText(`${costLabel}: ${getCost(boatStats.sonar)}`, costX, firstRowY + rowGap * 2);

          ctx.textAlign = 'center';
          ctx.fillStyle = '#94a3b8';
          ctx.font = mobileMode ? '12px sans-serif' : '16px sans-serif';
          ctx.fillText(
            mobileMode
              ? trRef.current("Tap the buttons above to buy.", "위 버튼으로 구매하세요.")
              : trRef.current("Press corresponding number to buy. Press B to close.", "숫자 키로 구매 · B 키로 닫기"),
            shopCenterX,
            shopTop + shopHeight - 28
          );
      }

      if (rhythm.active && hook.fish) {
         const barWidth = 240;
         const barHeight = 28;
         const barX = Math.round(canvas.width / 2 - barWidth / 2);
         const barY = Math.round(canvas.height / 2 - 80);

         // Rhythm Bar UI Background
         ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
         ctx.fillRect(barX - 4, barY - 4, barWidth + 8, barHeight + 8);
         ctx.fillStyle = 'rgba(51, 65, 85, 0.8)';
         ctx.fillRect(barX, barY, barWidth, barHeight);

         // Target Zone — pixel-aligned to keep green centered inside yellow on any width
         const targetPixelX = Math.round(barX + (rhythm.targetCenter - rhythm.targetWidth / 2) * barWidth);
         const targetPixelW = Math.round(rhythm.targetWidth * barWidth);

         // Good Zone (yellow)
         ctx.fillStyle = 'rgba(234, 179, 8, 0.7)';
         ctx.fillRect(targetPixelX, barY, targetPixelW, barHeight);

         // Perfect Zone (green) — mirrors judging math: perfectHalf = half * (hard ? 1/3 : 1/2)
         const hr_p = hook.fish && FISH_DATABASE[hook.fish.type] ? FISH_DATABASE[hook.fish.type].rarity : 'Common';
         const perfectFraction = ['Mythic', 'Legendary', 'Epic'].includes(hr_p) ? 1/3 : 1/2;
         const perfectPixelW = Math.round(targetPixelW * perfectFraction);
         const perfectPixelX = Math.round(targetPixelX + targetPixelW / 2 - perfectPixelW / 2);
         ctx.fillStyle = 'rgba(34, 197, 94, 0.9)';
         ctx.fillRect(perfectPixelX, barY, perfectPixelW, barHeight);

         // Center tick — exact PERFECT center, so player can aim precisely
         const centerPixelX = Math.round(barX + rhythm.targetCenter * barWidth);
         ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
         ctx.fillRect(centerPixelX, barY + 2, 1, barHeight - 4);

         // MISS bar flash overlay
         if (rhythm.barFlash > 0) {
             ctx.fillStyle = `rgba(239, 68, 68, ${Math.min(0.6, rhythm.barFlash * 0.6)})`;
             ctx.fillRect(barX, barY, barWidth, barHeight);
             rhythm.barFlash = Math.max(0, rhythm.barFlash - dt * 2);
         }

         // Cursor — 2px wide so the visible edge equals the judgment point
         const cursorX = Math.round(barX + rhythm.cursor * barWidth);
         ctx.fillStyle = '#f8fafc';
         ctx.fillRect(cursorX - 1, barY - 8, 2, barHeight + 16);

         // Text above rhythm bar
         ctx.fillStyle = '#f8fafc';
         ctx.font = 'bold 20px sans-serif';
         ctx.textAlign = 'center';
         ctx.fillText(trRef.current("TAP ON GREEN!", "초록색에 맞춰 탭!"), canvas.width / 2, barY - 20);

         // Feedback Text
         if (rhythm.feedbackTimer > 0) {
             rhythm.feedbackTimer -= dt;
             ctx.fillStyle = rhythm.feedbackColor;
             ctx.font = `bold ${28 + rhythm.feedbackTimer * 10}px sans-serif`;
             ctx.fillText(rhythm.feedback, canvas.width / 2, barY - 60);
         }
         
         // Tension Bar
         const tensionRatio = Math.min(1, Math.max(0, hook.tension / 100));
         ctx.fillStyle = '#1e293b';
         ctx.fillRect(canvas.width / 2 - 120, canvas.height / 2 + 130, 240, 20);
         
         let tensionColor = '#22c55e';
         if (tensionRatio > 0.6) tensionColor = '#eab308';
         if (tensionRatio > 0.85) tensionColor = '#ef4444';
         
         ctx.fillStyle = tensionColor;
         ctx.fillRect(canvas.width / 2 - 120, canvas.height / 2 + 130, 240 * tensionRatio, 20);
         
         ctx.fillStyle = 'white';
         ctx.font = 'bold 14px sans-serif';
         ctx.fillText(trRef.current("TENSION", "줄 장력"), canvas.width / 2, canvas.height / 2 + 165);
         
         // Depth indicator
         ctx.fillStyle = '#94a3b8';
         ctx.font = 'bold 14px sans-serif';
         ctx.fillText(`${trRef.current('Depth', '수심')}: ${Math.floor(hook.y)}m`, canvas.width / 2, canvas.height / 2 + 190);
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    // Bridge between on-screen mobile buttons and the keyboard-based input
    // model. The buttons dispatch `aqua-fishing:input` events instead of
    // synthetic keyboard events, so they cannot leak to the rest of the page.
    type AquaInput =
      | { kind: 'down'; key: 'left' | 'right' | 'space' }
      | { kind: 'up'; key: 'left' | 'right' | 'space' }
      | { kind: 'tap'; key: 'space' | 'shop' | 'enc' | 'shop1' | 'shop2' | 'shop3' };
    const handleAquaInput = (e: Event) => {
      const detail = (e as CustomEvent<AquaInput>).detail;
      if (!detail) return;
      if (detail.kind === 'down') {
        if (detail.key === 'left') keys.A = true;
        else if (detail.key === 'right') keys.D = true;
        else if (detail.key === 'space') {
          if (!keys.Space) keys.spaceTaps++;
          keys.Space = true;
        }
      } else if (detail.kind === 'up') {
        if (detail.key === 'left') keys.A = false;
        else if (detail.key === 'right') keys.D = false;
        else if (detail.key === 'space') keys.Space = false;
      } else if (detail.kind === 'tap') {
        if (detail.key === 'space') {
          keys.spaceTaps++;
        } else if (detail.key === 'shop') {
          shopOpen = !shopOpen;
          playSound('shop_open');
        } else if (detail.key === 'enc') {
          window.dispatchEvent(new CustomEvent('toggle-enc'));
          playSound('shop_open');
        } else if (shopOpen) {
          if (detail.key === 'shop1') attemptUpgrade('drop');
          else if (detail.key === 'shop2') attemptUpgrade('depth');
          else if (detail.key === 'shop3') attemptUpgrade('sonar');
        }
      }
    };
    window.addEventListener('aqua-fishing:input', handleAquaInput);

    return () => {
      cancelAnimationFrame(resizeFrame);
      window.removeEventListener('resize', queueResize);
      window.removeEventListener('orientationchange', queueResize);
      window.visualViewport?.removeEventListener('resize', queueResize);
      window.visualViewport?.removeEventListener('scroll', queueResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('aqua-fishing:input', handleAquaInput);
      cancelAnimationFrame(animationFrameId);
      stopAllAudio();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="aqua-game-root w-full overflow-hidden bg-black flex items-center justify-center relative"
      data-touch={isTouch ? "true" : "false"}
      style={{
        width: "100vw",
        height: "var(--aqua-vh, 100dvh)",
        minHeight: "var(--aqua-vh, 100dvh)",
        maxHeight: "var(--aqua-vh, 100dvh)",
        touchAction: "none",
        overscrollBehavior: "none",
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        style={{
          touchAction: "none",
          WebkitTapHighlightColor: "transparent",
        }}
      />

      {isTouch && !showEncyclopedia && (
        <MobileControls
          t={t}
          shopVisible={shopVisible}
          onToggleShop={() => {
            setShopVisible((v) => !v);
            sendInput({ kind: "tap", key: "shop" });
          }}
          onToggleEnc={() => sendInput({ kind: "tap", key: "enc" })}
        />
      )}
      
      {showEncyclopedia && (
         <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-2 sm:p-6 z-50" style={{ paddingTop: "max(8px, env(safe-area-inset-top, 0px))", paddingBottom: "max(8px, env(safe-area-inset-bottom, 0px))" }}>
           <div className="bg-red-600 border-[4px] sm:border-[6px] border-slate-900 w-full max-w-6xl h-full sm:h-[90dvh] rounded-2xl sm:rounded-[2rem] flex flex-col md:flex-row shadow-[0_0_50px_rgba(220,38,38,0.4)] relative overflow-hidden">
               
               {/* Device Top Bar Decor */}
               <div className="absolute top-0 left-0 w-full h-12 bg-red-700 border-b-4 border-slate-900 flex items-center px-6 gap-4 z-10 md:hidden">
                    <div className="w-6 h-6 rounded-full bg-blue-400 border-2 border-white shadow-[0_0_10px_rgba(96,165,250,0.8)]"></div>
                    <div className="w-3 h-3 rounded-full bg-red-400 border border-slate-900"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400 border border-slate-900"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400 border border-slate-900"></div>
                    <div className="flex-1"></div>
                    <button onClick={() => { setShowEncyclopedia(false); setSelectedFish(null); }} className="text-white font-black text-2xl drop-shadow-md">✕</button>
               </div>

               {/* Left Panel: Selected Fish Details */}
               <div className="w-full md:w-5/12 h-[40vh] md:h-full bg-red-600 p-4 pt-16 md:pt-4 flex flex-col relative border-b-4 md:border-b-0 md:border-r-4 border-slate-900">
                    {/* Desktop Lights */}
                    <div className="hidden md:flex items-center gap-3 mb-4 px-2">
                        <div className="w-12 h-12 rounded-full bg-blue-400 border-4 border-white shadow-[0_0_15px_rgba(96,165,250,0.8)]"></div>
                        <div className="w-4 h-4 rounded-full bg-red-400 border-2 border-slate-900"></div>
                        <div className="w-4 h-4 rounded-full bg-yellow-400 border-2 border-slate-900"></div>
                        <div className="w-4 h-4 rounded-full bg-green-400 border-2 border-slate-900"></div>
                    </div>

                    <div className="flex-1 bg-slate-50 border-[6px] border-slate-800 rounded-xl rounded-bl-[3rem] p-4 flex flex-col relative shadow-inner overflow-hidden">
                        {selectedFish ? (
                            <div className="flex flex-col h-full animate-fade-in relative z-10 w-full">
                                {/* Title bar: Name + Number */}
                                <div className="flex items-end justify-between mb-3 border-b-4 border-slate-300 pb-2 w-full">
                                    <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tighter leading-none mix-blend-color-burn break-words flex-1 ${caughtData[selectedFish] ? 'text-slate-800' : 'text-slate-400'}`}>
                                        {caughtData[selectedFish] ? getFishName(selectedFish) : '???'}
                                    </h2>
                                    <div className="text-xl sm:text-2xl font-black text-slate-400 mb-1 shrink-0 ml-2">
                                        {`#${String(Object.keys(FISH_DATABASE).indexOf(selectedFish) + 1).padStart(3, '0')}`}
                                    </div>
                                </div>

                                {/* Image area */}
                                <div className="w-full aspect-[4/3] shrink-0 bg-slate-900 border-[6px] border-slate-700 rounded-lg overflow-hidden relative mb-4 shadow-md flex items-center justify-center p-2 box-border">
                                    <div className="w-full h-full relative overflow-hidden rounded bg-black flex items-center justify-center">
                                        <img 
                                            src={FISH_DATABASE[selectedFish].imageUrl} 
                                            alt={getFishName(selectedFish)} 
                                            className={`w-full h-full object-cover transition-all ${caughtData[selectedFish] ? 'opacity-90' : 'opacity-40 contrast-0 brightness-0'}`} 
                                        />
                                        {!caughtData[selectedFish] && <div className="absolute text-5xl font-black text-slate-700/80">?</div>}
                                        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none"></div>
                                        <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] pointer-events-none"></div>
                                    </div>
                                </div>
                                
                                {/* Stats pills */}
                                <div className="flex flex-wrap gap-2 mb-4 justify-center shrink-0">
                                   <span className="px-3 py-1 rounded-md text-sm font-bold bg-slate-200 text-slate-800 border-2 border-slate-300 shadow-sm">
                                       {t('희귀도', 'Rarity')}: {FISH_DATABASE[selectedFish].rarity}
                                   </span>
                                   <span className="px-3 py-1 rounded-md text-sm font-bold bg-amber-100 text-amber-800 border-2 border-amber-300 shadow-sm">
                                       {t('점수', 'Score')}: {FISH_DATABASE[selectedFish].score}
                                   </span>
                                   <span className="px-3 py-1 rounded-md text-sm font-bold bg-blue-100 text-blue-800 border-2 border-blue-300 shadow-sm">
                                       {t('잡은 수', 'Caught')}: {caughtData[selectedFish] || 0}
                                   </span>
                                </div>

                                {/* Text Box (Retro Green LCD) */}
                                <div className="flex-1 bg-[#88c070] border-[6px] border-[#346856] rounded-xl p-4 overflow-y-auto shadow-[inset_0_0_20px_rgba(0,0,0,0.4)] relative">
                                    <p className="text-[#081820] font-mono text-sm sm:text-base leading-relaxed font-bold uppercase tracking-wide">
                                        {caughtData[selectedFish] ? getFishDesc(selectedFish) : t('미발견 어종입니다. 계속 낚시해서 정체를 밝혀보세요!', 'Unknown species. Keep fishing to discover its secrets!')}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-70">
                                <div className="text-6xl mb-4">🐠</div>
                                <div className="font-bold text-xl uppercase tracking-widest text-center">{t('물고기를', 'Select')}<br/>{t('선택하세요', 'a Fish')}</div>
                            </div>
                        )}
                    </div>
               </div>

               {/* Right Panel: Grid List */}
               <div className="w-full md:w-7/12 h-[50vh] md:h-full bg-red-600 p-4 md:p-6 flex flex-col relative">
                    <button onClick={() => { setShowEncyclopedia(false); setSelectedFish(null); }} className="hidden md:absolute md:flex top-6 right-6 w-10 h-10 bg-slate-900 text-white rounded-full items-center justify-center font-black text-xl border-2 border-slate-700 hover:bg-slate-800 hover:scale-110 transition-all z-20 shadow-md">✕</button>

                    <div className="flex justify-between items-center mb-4 text-white text-lg font-bold font-mono bg-slate-900/50 p-3 rounded-lg border-2 border-slate-900">
                        <span className="text-red-200">{t('총 도감 수집:', 'TOTAL CAUGHT:')}</span>
                        <span>{Object.entries(FISH_DATABASE).filter(([key]) => (caughtData[key] || 0) > 0).length} / {Object.keys(FISH_DATABASE).length}</span>
                    </div>

                    <div className="flex-1 overflow-y-auto bg-slate-800 border-[6px] border-slate-900 rounded-xl p-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 shadow-inner">
                        {Object.entries(FISH_DATABASE).map(([key, data], index) => {
                            const isCaught = (caughtData[key] || 0) > 0;
                            const isSelected = selectedFish === key;
                            
                            const getCardStyle = (rarity: string) => {
                                switch(rarity) {
                                    case 'Uncommon': return 'bg-green-800 border-green-600 hover:bg-green-700';
                                    case 'Rare': return 'bg-blue-800 border-blue-600 hover:bg-blue-700';
                                    case 'Epic': return 'bg-purple-800 border-purple-600 hover:bg-purple-700';
                                    case 'Legendary': return 'bg-amber-600 border-amber-400 hover:bg-amber-500 text-white shadow-[inset_0_0_10px_rgba(251,191,36,0.2)]';
                                    case 'Mythic': return 'bg-red-700 border-red-500 hover:bg-red-600 shadow-[inset_0_0_15px_rgba(248,113,113,0.3)]';
                                    case 'Common':
                                    default: return 'bg-slate-700 border-slate-600 hover:bg-slate-600';
                                }
                            }
                            
                            return (
                                <button 
                                    key={key}
                                    onClick={() => setSelectedFish(key)}
                                    className={`relative aspect-[3/4] rounded-lg border-4 transition-all overflow-hidden flex flex-col items-center justify-center p-2 gap-2
                                        ${isCaught ? 
                                            (isSelected ? 'bg-white border-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.8)] scale-105 z-10 !bg-blue-600' : getCardStyle(data.rarity)) 
                                            : (isSelected ? 'bg-slate-700 border-blue-500 scale-105 z-10 opacity-100' : 'bg-slate-900 border-slate-950 opacity-80 hover:bg-slate-800')}`}
                                >
                                    <div className="absolute top-1 left-1 text-[10px] font-mono font-bold text-slate-400 bg-black/40 px-1 rounded z-10">
                                        #{String(index + 1).padStart(3, '0')}
                                    </div>
                                    
                                    <div className={`w-16 h-16 rounded-full border-2 border-slate-900 overflow-hidden shrink-0 shadow-inner flex items-center justify-center relative
                                        ${isCaught ? 'bg-slate-800' : 'bg-slate-950'}
                                    `}>
                                        <img 
                                            src={data.imageUrl} 
                                            alt={locale === 'en' ? data.nameEn : data.name} 
                                            className={`w-full h-full object-cover transition-all ${isCaught ? '' : 'opacity-40 contrast-0 brightness-0'}`} 
                                        />
                                        {!isCaught && <span className="absolute text-slate-600 text-xl font-black drop-shadow-md">?</span>}
                                    </div>
                                    
                                    <div className="text-center w-full">
                                        <div className={`text-xs font-bold leading-tight truncate px-1
                                            ${isCaught ? 'text-white' : 'text-slate-500'}
                                        `}>
                                            {isCaught ? (locale === 'en' ? data.nameEn : data.name) : '???'}
                                        </div>
                                    </div>

                                    {isCaught && (caughtData[key] || 0) > 0 && (
                                        <div className="absolute bottom-1 right-1 text-[10px] font-bold text-blue-300 bg-blue-900/80 px-1 rounded z-10">
                                            x{caughtData[key]}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
               </div>
           </div>
         </div>
      )}
    </div>
  );
}

/* ─────────────── Mobile on-screen controls ───────────────
   Replaces keyboard input (A/D steer · Space reel · B shop · E encyclopedia)
   with touch buttons. Each button dispatches `aqua-fishing:input` events that
   the game loop's effect listens for and translates into the same `keys`
   state mutations the keyboard handler does. */
function AquaHoldButton({
  label,
  onDown,
  onUp,
  ariaLabel,
  style,
}: {
  label: React.ReactNode;
  onDown: () => void;
  onUp: () => void;
  ariaLabel: string;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onPointerDown={(e) => {
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        onDown();
      }}
      onPointerUp={(e) => {
        e.preventDefault();
        onUp();
      }}
      onPointerCancel={(e) => {
        e.preventDefault();
        onUp();
      }}
      onPointerLeave={(e) => {
        if (e.buttons === 0) onUp();
      }}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        width: 64,
        height: 64,
        minWidth: 64,
        minHeight: 64,
        borderRadius: 999,
        border: "2px solid rgba(255,255,255,0.35)",
        background: "rgba(15,23,42,0.55)",
        backdropFilter: "blur(8px)",
        color: "white",
        fontSize: 26,
        fontWeight: 800,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        WebkitTapHighlightColor: "transparent",
        touchAction: "none",
        cursor: "pointer",
        ...style,
      }}
    >
      {label}
    </button>
  );
}

function AquaChipButton({
  onClick,
  children,
  style,
}: {
  onClick: () => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      onPointerDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        minHeight: 44,
        minWidth: 44,
        padding: "9px 14px",
        borderRadius: 999,
        border: "1px solid rgba(255,255,255,0.3)",
        background: "rgba(15,23,42,0.55)",
        backdropFilter: "blur(8px)",
        color: "white",
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: "0.05em",
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTapHighlightColor: "transparent",
        touchAction: "none",
        cursor: "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function MobileControls({
  t,
  shopVisible,
  onToggleShop,
  onToggleEnc,
}: {
  t: (ko: string, en: string) => string;
  shopVisible: boolean;
  onToggleShop: () => void;
  onToggleEnc: () => void;
}) {
  useEffect(() => {
    const releaseAll = () => {
      sendInput({ kind: "up", key: "left" });
      sendInput({ kind: "up", key: "right" });
      sendInput({ kind: "up", key: "space" });
    };
    window.addEventListener("pointerup", releaseAll);
    window.addEventListener("pointercancel", releaseAll);
    window.addEventListener("blur", releaseAll);
    document.addEventListener("visibilitychange", releaseAll);
    return () => {
      releaseAll();
      window.removeEventListener("pointerup", releaseAll);
      window.removeEventListener("pointercancel", releaseAll);
      window.removeEventListener("blur", releaseAll);
      document.removeEventListener("visibilitychange", releaseAll);
    };
  }, []);
  return (
    <>
      {/* Top-right chips: shop · encyclopedia */}
      <div
        style={{
          position: "absolute",
          top: "max(12px, calc(env(safe-area-inset-top, 0px) + 8px))",
          right: "max(12px, env(safe-area-inset-right, 0px))",
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          justifyContent: "flex-end",
          zIndex: 40,
          pointerEvents: "auto",
        }}
      >
        <AquaChipButton onClick={onToggleShop}>
          {t("상점", "Shop")}
        </AquaChipButton>
        <AquaChipButton onClick={onToggleEnc}>
          {t("도감", "Dex")}
        </AquaChipButton>
      </div>

      {/* Shop upgrade chips — only visible while shop is open */}
      {shopVisible && (
        <div
          style={{
            position: "absolute",
            top: "max(64px, calc(env(safe-area-inset-top, 0px) + 64px))",
            right: "max(12px, env(safe-area-inset-right, 0px))",
            display: "flex",
            flexDirection: "column",
            gap: 6,
            zIndex: 40,
            pointerEvents: "auto",
          }}
        >
          <AquaChipButton onClick={() => sendInput({ kind: "tap", key: "shop1" })}>
            1 · {t("드롭", "Drop")}
          </AquaChipButton>
          <AquaChipButton onClick={() => sendInput({ kind: "tap", key: "shop2" })}>
            2 · {t("수심", "Depth")}
          </AquaChipButton>
          <AquaChipButton onClick={() => sendInput({ kind: "tap", key: "shop3" })}>
            3 · {t("소나", "Sonar")}
          </AquaChipButton>
        </div>
      )}

      {/* Bottom: steering pad on left, reel button on right */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: "max(16px, env(safe-area-inset-bottom, 0px))",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          padding: "0 max(16px, env(safe-area-inset-right, 0px)) 0 max(16px, env(safe-area-inset-left, 0px))",
          zIndex: 40,
          pointerEvents: "none",
        }}
      >
        <div style={{ display: "flex", gap: 12, pointerEvents: "auto" }}>
          <AquaHoldButton
            ariaLabel={t("왼쪽", "Left")}
            label="◀"
            onDown={() => sendInput({ kind: "down", key: "left" })}
            onUp={() => sendInput({ kind: "up", key: "left" })}
          />
          <AquaHoldButton
            ariaLabel={t("오른쪽", "Right")}
            label="▶"
            onDown={() => sendInput({ kind: "down", key: "right" })}
            onUp={() => sendInput({ kind: "up", key: "right" })}
          />
        </div>
        <div style={{ pointerEvents: "auto" }}>
          <AquaHoldButton
            ariaLabel={t("낚시", "Reel")}
            label={<span style={{ fontSize: 22 }}>🎣</span>}
            onDown={() => sendInput({ kind: "down", key: "space" })}
            onUp={() => sendInput({ kind: "up", key: "space" })}
            style={{
              width: 84,
              height: 84,
              background: "rgba(220,38,38,0.85)",
              border: "2px solid rgba(255,255,255,0.55)",
              boxShadow: "0 8px 24px rgba(220,38,38,0.4)",
            }}
          />
        </div>
      </div>
    </>
  );
}
