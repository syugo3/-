import { useEffect, useRef, useState } from 'react';

type AudioType = 'bgm' | 'se';
type BGMKey = 'title' | 'quiz' | 'result';
type SEKey = 'correct' | 'wrong' | 'button' | 'start' | 'gameover';

interface AudioManager {
  playBGM: (key: BGMKey) => Promise<void>;
  stopBGM: () => void;
  playSE: (key: SEKey) => Promise<void>;
  setVolume: (type: AudioType, volume: number) => void;
  isMuted: boolean;
  toggleMute: () => void;
}

export const useAudio = (): AudioManager => {
  const [isMuted, setIsMuted] = useState(false);
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const seVolume = useRef<number>(0.5);
  const bgmVolume = useRef<number>(0.3);
  const [isInitialized, setIsInitialized] = useState(false);

  const bgmPaths: Record<BGMKey, string> = {
    title: '/sounds/bgm/title.mp3',
    quiz: '/sounds/bgm/quiz.mp3',
    result: '/sounds/bgm/result.mp3'
  };

  const sePaths: Record<SEKey, string> = {
    correct: '/sounds/se/correct.mp3',
    wrong: '/sounds/se/wrong.mp3',
    button: '/sounds/se/button.mp3',
    start: '/sounds/se/start.mp3',
    gameover: '/sounds/se/gameover.mp3'
  };

  const initializeAudio = async () => {
    if (isInitialized) return;
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      setIsInitialized(true);
      console.log('Audio context initialized');
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  };

  const preloadAudio = async (path: string): Promise<HTMLAudioElement> => {
    return new Promise((resolve, reject) => {
      const audio = new Audio(path);
      audio.addEventListener('canplaythrough', () => resolve(audio), { once: true });
      audio.addEventListener('error', (e) => {
        console.error('Audio loading error:', path, e);
        reject(e);
      });
      audio.load();
    });
  };

  const playBGM = async (key: BGMKey): Promise<void> => {
    console.log('Attempting to play BGM:', key);
    if (isMuted) return;

    try {
      if (!isInitialized) {
        await initializeAudio();
      }

      if (bgmRef.current) {
        bgmRef.current.pause();
      }

      const audio = await preloadAudio(bgmPaths[key]);
      audio.loop = true;
      audio.volume = bgmVolume.current;
      await audio.play();
      bgmRef.current = audio;
      
      console.log('BGM started playing:', key);
    } catch (error) {
      console.error('BGM playback failed:', error);
      throw error;
    }
  };

  const stopBGM = () => {
    if (bgmRef.current) {
      bgmRef.current.pause();
      bgmRef.current = null;
    }
  };

  const playSE = async (key: SEKey): Promise<void> => {
    console.log('Attempting to play SE:', key);
    if (isMuted) return;

    try {
      if (!isInitialized) {
        await initializeAudio();
      }

      const audio = await preloadAudio(sePaths[key]);
      audio.volume = seVolume.current;
      await audio.play();
      console.log('SE played successfully:', key);
    } catch (error) {
      console.error('SE playback failed:', error);
      throw error;
    }
  };

  const setVolume = (type: AudioType, volume: number) => {
    if (type === 'bgm') {
      bgmVolume.current = volume;
      if (bgmRef.current) {
        bgmRef.current.volume = volume;
      }
    } else {
      seVolume.current = volume;
    }
  };

  const toggleMute = () => {
    setIsMuted(prev => {
      console.log('Toggling mute:', !prev);
      if (!prev && bgmRef.current) {
        bgmRef.current.pause();
      } else if (prev && bgmRef.current) {
        bgmRef.current.play().catch(error => {
          console.error('Resume playback failed:', error);
        });
      }
      return !prev;
    });
  };

  useEffect(() => {
    initializeAudio();
    return () => {
      if (bgmRef.current) {
        bgmRef.current.pause();
      }
    };
  }, []);

  return {
    playBGM,
    stopBGM,
    playSE,
    setVolume,
    isMuted,
    toggleMute
  };
}; 