/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { SONGS } from './constants';

export default function App() {
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [currentSongIndex, setCurrentSongIndex] = useState(1); // Default to Midnight Pulse

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f0f0f0] font-sans relative overflow-hidden flex flex-col p-8 selection:bg-neon-cyan/30">
      {/* Header */}
      <header className="flex justify-between items-end mb-8 relative z-10">
        <div className="flex flex-col">
          <span className="text-[10px] tracking-[0.4em] uppercase opacity-50 mb-2">Hybrid Entertainment System</span>
          <h1 className="text-6xl font-black italic tracking-tighter leading-none">
            SYNTH<span className="neon-text-cyan">SNAKE</span>.OS
          </h1>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase opacity-50">Session Time Remaining</span>
            <span className={`font-mono text-2xl transition-colors ${timeLeft < 10 ? 'neon-text-magenta animate-pulse' : 'neon-text-cyan'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <div className="w-12 h-12 rounded-full neon-border-cyan flex items-center justify-center">
            <div className={`w-2 h-2 bg-[#00f3ff] rounded-full ${isPlaying ? 'animate-pulse' : ''}`}></div>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="flex-1 grid grid-cols-12 gap-8 items-start relative z-10 overflow-hidden">
        {/* Left Sidebar: Audio Library & Score */}
        <aside className="col-span-3 h-full flex flex-col gap-6">
          <div className="glass p-6 rounded-2xl flex-1 overflow-y-auto">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-6 border-b border-white/10 pb-2">Audio Library</h2>
            <div className="space-y-4">
              {SONGS.map((song, index) => (
                <div 
                  key={song.id}
                  onClick={() => setCurrentSongIndex(index)}
                  className={`flex items-center gap-4 group cursor-pointer transition-all ${currentSongIndex === index ? 'border-l-2 border-neon-cyan pl-4' : 'hover:pl-2'}`}
                >
                  <div className={`w-10 h-10 rounded flex items-center justify-center font-mono text-xs ${currentSongIndex === index ? 'bg-neon-cyan/20 text-neon-cyan' : 'bg-white/5 opacity-40'}`}>
                    {(index + 1).toString().padStart(2, '0')}
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-sm font-bold transition-colors ${currentSongIndex === index ? 'neon-text-cyan' : 'group-hover:neon-text-cyan'}`}>
                      {song.title.toUpperCase()}
                    </span>
                    <span className="text-[10px] opacity-40 uppercase">{song.artist.replace(' ', '_')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] uppercase opacity-50 tracking-tighter">Score</span>
              <span className="font-mono text-2xl">{score.toLocaleString()}</span>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
              <motion.div 
                className="bg-neon-magenta h-full shadow-[0_0_8px_#ff00ff]"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((score / 1000) * 100, 100)}%` }}
              />
            </div>
          </div>
        </aside>

        {/* Center: Snake Game */}
        <section className="col-span-6 h-full flex flex-col items-center justify-center relative">
          <div className="absolute -left-12 h-full flex flex-col justify-center gap-4">
            <div className="vertical-text text-[10px] tracking-[0.5em] uppercase opacity-20">GRID_X_COORDINATE_SYSTEM</div>
          </div>
          
          <div className="relative p-1 neon-border-magenta bg-black relative grid-pattern overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-white/5"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-[1px] bg-white/5"></div>
            
            <SnakeGame 
              onScoreChange={setScore} 
              onTimeUpdate={setTimeLeft}
              onGameOver={() => setIsPlaying(false)}
              isPaused={!isPlaying} 
            />
          </div>

          <div className="mt-6 flex gap-4">
            <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
              <kbd className="font-mono text-[10px] px-2 py-0.5 bg-white/10 rounded">W</kbd>
              <kbd className="font-mono text-[10px] px-2 py-0.5 bg-white/10 rounded">A</kbd>
              <kbd className="font-mono text-[10px] px-2 py-0.5 bg-white/10 rounded">S</kbd>
              <kbd className="font-mono text-[10px] px-2 py-0.5 bg-white/10 rounded">D</kbd>
              <span className="text-[10px] uppercase opacity-50 ml-2">Navigation</span>
            </div>
          </div>
        </section>

        {/* Right Sidebar: Rankings & Visualizer */}
        <aside className="col-span-3 h-full flex flex-col gap-6">
          <div className="glass p-6 rounded-2xl">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Global Ranking</h2>
            <div className="space-y-4 font-mono">
              <div className="flex justify-between items-center text-xs">
                <span className="opacity-40">01. PLAYER_X</span>
                <span className="text-neon-cyan">42,900</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="opacity-40">02. NEON_GHOST</span>
                <span className="text-neon-cyan">38,120</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="opacity-40">03. VOID_WALKER</span>
                <span className="text-neon-cyan">31,550</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 relative glass rounded-2xl overflow-hidden p-6">
            <div className="absolute inset-0 bg-gradient-to-t from-neon-cyan/10 to-transparent"></div>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Visualizer</h2>
            <div className="flex items-end justify-between h-40 gap-1">
              {[40, 70, 90, 60, 80, 45, 30, 65].map((h, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-neon-cyan shadow-[0_0_5px_#00f3ff]"
                  animate={{ height: isPlaying ? `${Math.random() * 60 + 30}%` : `${h}%` }}
                  transition={{ duration: 0.2, repeat: Infinity, repeatType: "reverse" }}
                />
              ))}
            </div>
          </div>
        </aside>
      </main>

      {/* Footer: Music Controls */}
      <MusicPlayer 
        onPlayStateChange={setIsPlaying} 
        currentSongIndex={currentSongIndex}
        setCurrentSongIndex={setCurrentSongIndex}
      />
    </div>
  );
}
