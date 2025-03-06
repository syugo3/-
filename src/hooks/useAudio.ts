import { useState, useCallback } from 'react';

type AudioType = 'se' | 'bgm';
type SEType = 'start' | 'correct' | 'wrong' | 'button' | 'gameover';
type BGMType = 'quiz' | 'result' | 'title';

export const useAudio = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [currentBGM, setCurrentBGM] = useState<HTMLAudioElement | null>(null);

  const getAudioPath = (type: AudioType, name: string) => {
    return `/sounds/${type}/${name}.mp3`;
  };

  const playSE = async (name: SEType) => {
    if (isMuted) return;
    try {
      const audio = new Audio(getAudioPath('se', name));
      await audio.play();
    } catch (error) {
      console.error('Failed to play SE:', error);
    }
  };

  const playBGM = async (name: BGMType) => {
    if (isMuted) return;
    try {
      if (currentBGM) {
        currentBGM.pause();
        currentBGM.currentTime = 0;
      }
      const audio = new Audio(getAudioPath('bgm', name));
      audio.loop = true;
      await audio.play();
      setCurrentBGM(audio);
    } catch (error) {
      console.error('Failed to play BGM:', error);
    }
  };

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      if (!prev && currentBGM) {
        currentBGM.pause();
      } else if (prev && currentBGM) {
        currentBGM.play().catch(console.error);
      }
      return !prev;
    });
  }, [currentBGM]);

  return {
    playSE,
    playBGM,
    toggleMute,
    isMuted
  };
}; 