/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SONGS } from '../constants';

interface MusicPlayerProps {
  onPlayStateChange: (isPlaying: boolean) => void;
  currentSongIndex: number;
  setCurrentSongIndex: (index: number) => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  onPlayStateChange, 
  currentSongIndex,
  setCurrentSongIndex
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentSong = SONGS[currentSongIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      }
      setIsPlaying(!isPlaying);
      onPlayStateChange(!isPlaying);
    }
  };

  const handleSkip = (direction: 'next' | 'prev') => {
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentSongIndex + 1) % SONGS.length;
    } else {
      nextIndex = (currentSongIndex - 1 + SONGS.length) % SONGS.length;
    }
    setCurrentSongIndex(nextIndex);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentSong.url;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentSongIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    handleSkip('next');
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <footer className="glass h-24 mt-8 rounded-2xl flex items-center px-10 relative z-10">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <div className="flex items-center gap-8">
        <div className="flex gap-4">
          <button 
            onClick={() => handleSkip('prev')}
            className="w-10 h-10 flex items-center justify-center border border-white/10 rounded-full hover:bg-white/5 transition-colors text-white/60 hover:text-white"
          >
            <SkipBack size={14} fill="currentColor" />
          </button>
          <button 
            onClick={togglePlay}
            className="w-14 h-14 flex items-center justify-center bg-white text-black rounded-full shadow-[0_0_15px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
          </button>
          <button 
            onClick={() => handleSkip('next')}
            className="w-10 h-10 flex items-center justify-center border border-white/10 rounded-full hover:bg-white/5 transition-colors text-white/60 hover:text-white"
          >
            <SkipForward size={14} fill="currentColor" />
          </button>
        </div>
        
        <div className="flex flex-col min-w-[300px]">
          <span className="text-xs font-black neon-text-cyan uppercase truncate">
            NOW PLAYING: {currentSong.title}
          </span>
          <div className="flex items-center gap-3 mt-1">
            <span className="font-mono text-[10px] opacity-40 w-8">
              {formatTime(audioRef.current?.currentTime || 0)}
            </span>
            <div className="w-64 h-[2px] bg-white/10 relative">
              <div 
                className="absolute top-0 left-0 h-full bg-neon-cyan shadow-[0_0_8px_#00f3ff]" 
                style={{ width: `${progress}%` }}
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_5px_white]"
                style={{ left: `${progress}%` }}
              />
            </div>
            <span className="font-mono text-[10px] opacity-40 w-8">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="ml-auto flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="w-1/2 h-full bg-white/40"></div>
          </div>
          <Volume2 size={16} className="opacity-40" />
        </div>
        <div className="h-8 w-[1px] bg-white/10"></div>
        <div className="text-[10px] uppercase font-bold tracking-widest opacity-40 italic font-mono">
          Powered by Neuro-Engine
        </div>
      </div>
    </footer>
  );
};
