import React, { useState, useEffect } from 'react';
import { Question, GameState } from '../types/types';
import { questions } from '../data/questions';
import { useAudio } from '../hooks/useAudio';
import '../styles/QuizGame.css';

const QuizGame: React.FC = () => {
  const audio = useAudio();
  const [gameState, setGameState] = useState<GameState>({
    isStarted: false,
    currentQuestionIndex: 0,
    attempts: 0,
    score: 0,
    isGameOver: false,
    timeLeft: 30,
  });
  const [answer, setAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (gameState.isStarted && !gameState.isGameOver && !showExplanation) {
      timer = setInterval(() => {
        setGameState(prev => {
          if (prev.timeLeft <= 1) {
            clearInterval(timer);
            handleTimeUp();
            return { ...prev, timeLeft: 0 };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState.isStarted, gameState.currentQuestionIndex, showExplanation]);

  const handleTimeUp = () => {
    setFeedback('⏰ 時間切れ！');
    setStreak(0);
    setTimeout(() => {
      nextQuestion();
    }, 1500);
  };

  const startGame = async () => {
    try {
      await audio.playSE('start');
      await audio.playBGM('quiz');
      setGameState({ ...gameState, isStarted: true, timeLeft: 30 });
    } catch (error) {
      console.error('Failed to start game audio:', error);
      setGameState({ ...gameState, isStarted: true, timeLeft: 30 });
    }
  };

  const calculatePoints = () => {
    const basePoints = 100;
    const timeBonus = Math.floor(gameState.timeLeft * 3);
    const streakBonus = streak * 10;
    return basePoints + timeBonus + streakBonus;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentQuestion = questions[gameState.currentQuestionIndex];
    
    if (answer.toLowerCase() === currentQuestion.answer.toLowerCase()) {
      const points = calculatePoints();
      try {
        await audio.playSE('correct');
      } catch (error) {
        console.error('Failed to play correct sound:', error);
      }
      setFeedback(`⭕️ 正解！ +${points}ポイント！`);
      setStreak(prev => prev + 1);
      setShowExplanation(true);
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          score: prev.score + points,
          timeLeft: 30,
        }));
        nextQuestion();
      }, 2000);
    } else {
      try {
        await audio.playSE('wrong');
      } catch (error) {
        console.error('Failed to play wrong sound:', error);
      }
      const newAttempts = gameState.attempts + 1;
      setStreak(0);
      if (newAttempts >= 3) {
        setFeedback('❌ 3回不正解。次の問題へ進みます。');
        setShowExplanation(true);
        setTimeout(() => {
          nextQuestion();
        }, 2000);
      } else {
        setFeedback('❌ 不正解。もう一度試してください。');
        setGameState(prev => ({ ...prev, attempts: newAttempts }));
      }
    }
    setAnswer('');
  };

  const nextQuestion = () => {
    setShowExplanation(false);
    if (gameState.currentQuestionIndex < questions.length - 1) {
      setGameState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
        attempts: 0,
        timeLeft: 30,
      }));
      setFeedback('');
    } else {
      audio.playSE('gameover');
      setGameState(prev => ({ ...prev, isGameOver: true }));
    }
  };

  const progressPercentage = (gameState.currentQuestionIndex / questions.length) * 100;

  const renderAudioControls = () => (
    <div className="audio-controls">
      <button 
        className="audio-button"
        onClick={() => {
          audio.playSE('button');
          audio.toggleMute();
        }}
      >
        {audio.isMuted ? '🔇' : '🔊'}
      </button>
    </div>
  );

  if (!gameState.isStarted) {
    return (
      <div className="quiz-container start-screen">
        {renderAudioControls()}
        <h1 className="title-animation">プログラミングクイズ！</h1>
        <div className="game-intro">
          <p className="intro-text">🎮 楽しくプログラミングを学ぼう！</p>
          <div className="features">
            <p>🎯 制限時間: 30秒/問</p>
            <p>⭐️ 連続正解でボーナスポイント!</p>
            <p>🏆 タイムボーナスでより高得点!</p>
          </div>
          <button 
            className="start-button" 
            onClick={startGame}
          >
            ゲームスタート！
          </button>
        </div>
      </div>
    );
  }

  if (gameState.isGameOver) {
    return (
      <div className="quiz-container game-over">
        {renderAudioControls()}
        <h1>🎉 ゲームクリア！</h1>
        <div className="result-container">
          <p className="final-score">最終スコア: {gameState.score}点</p>
          <p className="max-streak">最高連続正解: {streak}回</p>
          <button className="restart-button" onClick={() => window.location.reload()}>
            もう一度チャレンジ！
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[gameState.currentQuestionIndex];

  return (
    <div className="quiz-container question-screen">
      {renderAudioControls()}
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progressPercentage}%` }}></div>
      </div>
      <div className="stats">
        <p className="question-number">問題 {gameState.currentQuestionIndex + 1}/{questions.length}</p>
        <p className="score">スコア: {gameState.score}</p>
        <p className="streak">連続正解: {streak}</p>
        <p className="timer">残り時間: {gameState.timeLeft}秒</p>
      </div>
      <div className="question-container">
        <h2>{currentQuestion.question}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="回答を入力してください"
            disabled={showExplanation}
          />
          <button type="submit" disabled={showExplanation}>回答する</button>
        </form>
        <p className="feedback">{feedback}</p>
        {showExplanation && (
          <div className="explanation">
            <p>💡 解説: {currentQuestion.explanation}</p>
          </div>
        )}
        <p className="attempts">残り回答回数: {3 - gameState.attempts}</p>
      </div>
    </div>
  );
};

export default QuizGame; 