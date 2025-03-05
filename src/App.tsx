import { useState } from 'react'
import './App.css'

interface Question {
  id: number;
  question: string;
  answer: string;
}

const questions: Question[] = [
  {
    id: 1,
    question: "JavaScriptで変数を宣言するキーワードは？",
    answer: "let"
  },
  {
    id: 2,
    question: "配列の長さを取得するプロパティは？",
    answer: "length"
  }
];

function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const handleStart = () => {
    setIsStarted(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (answer.toLowerCase() === questions[currentQuestion].answer.toLowerCase()) {
      setIsCorrect(true);
      setScore(score + 1);
      setTimeout(() => {
        nextQuestion();
      }, 1000);
    } else {
      setIsCorrect(false);
      setAttempts(attempts + 1);
      
      if (attempts >= 2) {
        setTimeout(() => {
          nextQuestion();
        }, 1000);
      }
    }
    setAnswer('');
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAttempts(0);
      setIsCorrect(null);
    } else {
      setIsStarted(false);
    }
  };

  return (
    <div className="quiz-container">
      {!isStarted ? (
        <div className="start-screen">
          <h1>プログラミングクイズ</h1>
          {currentQuestion === 0 ? (
            <button onClick={handleStart}>スタート</button>
          ) : (
            <div>
              <h2>クイズ終了！</h2>
              <p>スコア: {score}/{questions.length}</p>
              <button onClick={() => window.location.reload()}>もう一度プレイ</button>
            </div>
          )}
        </div>
      ) : (
        <div className="question-screen">
          <h2>問題 {currentQuestion + 1}/{questions.length}</h2>
          <p>{questions[currentQuestion].question}</p>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="回答を入力してください"
            />
            <button type="submit">回答する</button>
          </form>
          {isCorrect !== null && (
            <div className="result">
              {isCorrect ? '⭕️ 正解！' : '❌ 不正解'}
              {!isCorrect && <p>残り回答回数: {3 - attempts}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App