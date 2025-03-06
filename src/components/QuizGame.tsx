import React, { useState, useEffect } from 'react';
import { GameState } from '../types/types';
import { questions } from '../data/questions';
import { useAudio } from '../hooks/useAudio';
import styles from './QuizGame.module.css';

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
  const [feedback, setFeedback] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [showMeteor, setShowMeteor] = useState<boolean>(false);
  const [showExplosion, setShowExplosion] = useState<boolean>(false);
  const [showRetryOptions, setShowRetryOptions] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState<boolean>(false);

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
    handleFailure();
  };

  const handleFailure = async () => {
    setShowMeteor(true);
    // 音声再生を一時的にコメントアウト
    // await audio.playSE('explosion');
    
    setTimeout(() => {
      setShowMeteor(false);
      setShowExplosion(true);
      
      setTimeout(() => {
        setShowExplosion(false);
        setShowRetryOptions(true);
      }, 500);
    }, 2000);
  };

  const retryFromCurrent = () => {
    setShowRetryOptions(false);
    setGameState(prev => ({
      ...prev,
      attempts: 0,
      timeLeft: 30,
    }));
    setSelectedAnswer('');
    setFeedback('');
    setShowExplanation(false);
  };

  const retryFromStart = () => {
    setShowRetryOptions(false);
    setGameState({
      isStarted: true,
      currentQuestionIndex: 0,
      attempts: 0,
      score: 0,
      isGameOver: false,
      timeLeft: 30,
    });
    setStreak(0);
    setSelectedAnswer('');
    setFeedback('');
    setShowExplanation(false);
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

  const handleOptionSelect = (selectedOption: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(selectedOption);
    setIsAnswered(true);
    
    const isCorrect = selectedOption === questions[gameState.currentQuestionIndex].answer;
    
    if (isCorrect) {
      audio.playSE('correct').catch(console.error);
      setFeedback('');
      setStreak(prev => prev + 1);
      setShowExplanation(true);
      setGameState(prev => ({
        ...prev,
        score: prev.score + calculatePoints(),
      }));
    } else {
      audio.playSE('wrong').catch(console.error);
      const newAttempts = gameState.attempts + 1;
      setStreak(0);
      if (newAttempts >= 3) {
        setFeedback('❌ 3回不正解。隕石が落ちてきます！');
        handleFailure();
      } else {
        setFeedback(`❌ 不正解。残り${3 - newAttempts}回！`);
        setGameState(prev => ({ ...prev, attempts: newAttempts }));
      }
    }
  };

  const nextQuestion = () => {
    setShowExplanation(false);
    setSelectedAnswer('');
    setIsAnswered(false);
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
    <div className={styles.audioControls}>
      <button 
        className={styles.audioButton}
        onClick={() => {
          audio.playSE('button');
          audio.toggleMute();
        }}
      >
        {audio.isMuted ? '🔇' : '🔊'}
      </button>
    </div>
  );

  const getOptionText = (question: string, option: string): string => {
    const lines = question.split('\n');
    for (const line of lines) {
      if (line.startsWith(option + ')')) {
        return line.trim();
      }
    }
    return option;
  };

  if (!gameState.isStarted) {
    return (
      <div className={`${styles.quizContainer} ${styles.startScreen}`}>
        {renderAudioControls()}
        <h1 className={styles.titleAnimation}>プログラミングクイズ！</h1>
        <div className={styles.gameIntro}>
          <p className={styles.introText}>🎮 楽しくプログラミングを学ぼう！</p>
          <div className={styles.features}>
            <p>🎯 制限時間: 30秒/問</p>
            <p>⭐️ 連続正解でボーナスポイント!</p>
            <p>🏆 タイムボーナスでより高得点!</p>
          </div>
          <button 
            className={styles.startButton}
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
      <div className={`${styles.quizContainer} ${styles.gameOver}`}>
        {renderAudioControls()}
        <h1>🎉 ゲームクリア！</h1>
        <div className={styles.resultContainer}>
          <p className={styles.finalScore}>最終スコア: {gameState.score}点</p>
          <p className={styles.maxStreak}>最高連続正解: {streak}回</p>
          <button className={styles.restartButton} onClick={() => window.location.reload()}>
            もう一度チャレンジ！
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[gameState.currentQuestionIndex];

  return (
    <div className={styles.quizContainer}>
      {showMeteor && (
        <div className={styles.meteorContainer}>
          <div className={styles.meteor} />
        </div>
      )}
      {showExplosion && <div className={styles.explosion} />}
      {showRetryOptions && (
        <>
          <div className={styles.failureMessage}>失敗...</div>
          <div className={styles.retryOptions}>
            <button className={styles.retryButton} onClick={retryFromCurrent}>
              この問題からやり直す
            </button>
            <button className={styles.retryButton} onClick={retryFromStart}>
              最初からやり直す
            </button>
          </div>
        </>
      )}
      
      {!showRetryOptions && (
        <>
          <div className={`${styles.quizContainer} ${styles.questionScreen}`}>
            {renderAudioControls()}
            <div className={styles.progressBar}>
              <div className={styles.progress} style={{ width: `${progressPercentage}%` }}></div>
            </div>
            <div className={styles.stats}>
              <p>問題 {gameState.currentQuestionIndex + 1}/{questions.length}</p>
              <p>スコア: {gameState.score}</p>
              <p>連続正解: {streak}</p>
              <p>残り時間: {gameState.timeLeft}秒</p>
            </div>
            <div className={styles.questionContainer}>
              <h2>{currentQuestion.question.split('\n')[0]}</h2>
              <div className={styles.optionsContainer}>
                {['A', 'B', 'C', 'D'].map((option) => (
                  <button
                    key={option}
                    className={`${styles.optionButton} ${
                      showExplanation && option === currentQuestion.answer ? styles.correct : ''
                    }`}
                    onClick={() => handleOptionSelect(option)}
                    disabled={showExplanation}
                  >
                    {getOptionText(currentQuestion.question, option)}
                  </button>
                ))}
              </div>
              <p className={`${styles.feedback} ${feedback.includes('正解') ? styles.correct : feedback.includes('不正解') ? styles.wrong : ''}`}>
                {feedback}
              </p>
              {showExplanation && (
                <div className={styles.explanationScreen}>
                  <p className={styles.pointsText}>ポイント＋{calculatePoints()}</p>
                  <p className={styles.correctAnswer}>正解：{currentQuestion.answer}</p>
                  <div className={styles.explanationContent}>
                    <p className={styles.explanationLabel}>解説：</p>
                    <p className={styles.explanationText}>{currentQuestion.explanation}</p>
                  </div>
                  <button 
                    className={styles.nextButton}
                    onClick={nextQuestion}
                  >
                    次の問題に進む
                  </button>
                </div>
              )}
              <p className={styles.attempts}>残り回答回数: {3 - gameState.attempts}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default QuizGame; 