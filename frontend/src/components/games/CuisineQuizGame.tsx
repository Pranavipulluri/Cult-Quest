import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { gameService } from '@/services/gameService';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, Clock, X, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CuisineQuizGameProps {
  onClose: () => void;
  onComplete: (xpEarned: number) => void;
}

const quizQuestions = [
  {
    question: "What is the main ingredient in Kerala's famous 'Puttu'?",
    options: ["Rice flour", "Wheat flour", "Corn flour", "Ragi flour"],
    correct: 0,
    info: "Puttu is a traditional breakfast dish made from rice flour and coconut, steamed in cylindrical shapes."
  },
  {
    question: "Which spice is Kerala known as the 'Land of'?",
    options: ["Turmeric", "Cardamom", "Spices", "Pepper"],
    correct: 2,
    info: "Kerala is called 'God's Own Country' and 'Land of Spices' due to its rich spice trade history."
  },
  {
    question: "What is 'Sadya' served on?",
    options: ["Plate", "Banana leaf", "Steel plate", "Wooden plate"],
    correct: 1,
    info: "Sadya is a traditional vegetarian feast served on banana leaves during festivals like Onam."
  },
  {
    question: "Which fish is most popular in Kerala cuisine?",
    options: ["Salmon", "Tuna", "Pearl spot (Karimeen)", "Mackerel"],
    correct: 2,
    info: "Pearl spot (Karimeen) is considered the most prized fish in Kerala, often prepared with special masalas."
  },
  {
    question: "What is the main ingredient in 'Appam'?",
    options: ["Wheat", "Rice", "Corn", "Millet"],
    correct: 1,
    info: "Appam is a fermented rice pancake with soft center and crispy edges, often served with stew."
  },
  {
    question: "Which coconut product is essential in Kerala cooking?",
    options: ["Coconut oil", "Coconut milk", "Coconut water", "All of the above"],
    correct: 3,
    info: "Coconut in all its forms is integral to Kerala cuisine - oil for cooking, milk for curries, and water for drinking."
  },
  {
    question: "What is 'Payasam'?",
    options: ["A curry", "A dessert", "A bread", "A pickle"],
    correct: 1,
    info: "Payasam is a sweet dessert made with milk, sugar, and ingredients like rice, vermicelli, or lentils."
  },
  {
    question: "Which festival is Sadya traditionally associated with?",
    options: ["Diwali", "Onam", "Christmas", "Vishu"],
    correct: 1,
    info: "Onam Sadya is the grand feast served during Kerala's harvest festival Onam, featuring 26+ dishes."
  }
];

const CuisineQuizGame = ({ onClose, onComplete }: CuisineQuizGameProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameState, setGameState] = useState<'playing' | 'finished'>('playing');
  const { toast } = useToast();
  const { user, isDemoMode } = useAuth();

  useEffect(() => {
    if (gameState !== 'playing' || selectedAnswer !== null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswer(-1); // Time's up
          return 15;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, selectedAnswer, gameState]);

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);

    const isCorrect = answerIndex === quizQuestions[currentQuestion].correct;
    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setTimeLeft(15);
      } else {
        finishGame(isCorrect ? score + 1 : score);
      }
    }, 3000);
  };

  const finishGame = async (finalScore: number) => {
    setGameState('finished');
    const xpEarned = finalScore * 10 + 20; // 10 XP per correct + 20 base

    if (!isDemoMode && user) {
      try {
        await gameService.awardXP('cuisine-quiz', xpEarned, finalScore);
        toast({
          title: "Quiz Complete!",
          description: `You scored ${finalScore}/${quizQuestions.length}! Earned ${xpEarned} XP`,
        });
      } catch (error) {
        console.error('Error awarding XP:', error);
      }
    }

    onComplete(xpEarned);
  };

  const currentQ = quizQuestions[currentQuestion];

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 rounded-lg p-6 max-w-2xl w-full"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">🍛 Kerala Cuisine Quiz</h2>
            <p className="text-gray-400 text-sm">Test your knowledge of Kerala's food culture</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {gameState === 'playing' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="bg-slate-800 px-4 py-2 rounded-lg">
                <span className="text-white font-semibold">
                  Question {currentQuestion + 1}/{quizQuestions.length}
                </span>
              </div>
              <div className="bg-slate-800 px-4 py-2 rounded-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-teal-400" />
                <span className={`font-bold ${timeLeft <= 5 ? 'text-red-500' : 'text-white'}`}>
                  {timeLeft}s
                </span>
              </div>
              <div className="bg-slate-800 px-4 py-2 rounded-lg">
                <span className="text-teal-400 font-semibold">Score: {score}</span>
              </div>
            </div>

            <div className="bg-slate-800 p-6 rounded-lg mb-6">
              <h3 className="text-xl text-white font-semibold mb-6">{currentQ.question}</h3>

              <div className="grid grid-cols-1 gap-3">
                {currentQ.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => selectedAnswer === null && handleAnswer(index)}
                    disabled={selectedAnswer !== null}
                    className={`p-4 rounded-lg text-left transition-all ${
                      selectedAnswer === null
                        ? 'bg-slate-700 hover:bg-slate-600 text-white'
                        : selectedAnswer === index
                        ? index === currentQ.correct
                          ? 'bg-green-600 text-white'
                          : 'bg-red-600 text-white'
                        : index === currentQ.correct
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-700 text-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option}</span>
                      {selectedAnswer !== null && (
                        <>
                          {index === currentQ.correct && (
                            <CheckCircle className="h-5 w-5 text-white" />
                          )}
                          {selectedAnswer === index && index !== currentQ.correct && (
                            <XCircle className="h-5 w-5 text-white" />
                          )}
                        </>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-slate-800 p-4 rounded-lg border-l-4 border-teal-500"
                >
                  <p className="text-white font-semibold mb-2">Did you know?</p>
                  <p className="text-gray-300 text-sm">{currentQ.info}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {gameState === 'finished' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="text-6xl mb-4">
              {score >= 7 ? '🏆' : score >= 5 ? '🎉' : score >= 3 ? '👍' : '📚'}
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">
              {score >= 7 ? 'Excellent!' : score >= 5 ? 'Great Job!' : score >= 3 ? 'Good Effort!' : 'Keep Learning!'}
            </h3>
            <p className="text-xl text-gray-300 mb-4">
              You scored {score} out of {quizQuestions.length}
            </p>
            <p className="text-2xl text-teal-400 font-bold mb-6">
              +{score * 10 + 20} XP Earned!
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => {
                setCurrentQuestion(0);
                setScore(0);
                setSelectedAnswer(null);
                setShowResult(false);
                setTimeLeft(15);
                setGameState('playing');
              }} className="bg-teal-600 hover:bg-teal-700">
                Play Again
              </Button>
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default CuisineQuizGame;
