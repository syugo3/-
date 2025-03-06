export type SEType = 'start' | 'correct' | 'wrong' | 'button' | 'gameover' | 'explosion';

export type BGMType = 'quiz';

export interface Question {
  id: number;
  question: string;
  answer: string;
  explanation: string;
}

export interface GameState {
  isStarted: boolean;
  currentQuestionIndex: number;
  attempts: number;
  score: number;
  isGameOver: boolean;
  timeLeft: number;
}