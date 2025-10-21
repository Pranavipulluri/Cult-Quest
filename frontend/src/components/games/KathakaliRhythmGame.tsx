import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { gameService } from '@/services/gameService';
import { motion } from 'framer-motion';
import { Music, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface KathakaliRhythmGameProps {
  onClose: () => void;
  onComplete: (xpEarned: number) => void;
}

const moves = ['👆', '👇', '👈', '👉'];
const keyMap: { [key: string]: number } = {
  'ArrowUp': 0,
  'ArrowDown': 1,
  'ArrowLeft': 2,
  'ArrowRight': 3,
};

const KathakaliRhythmGame = ({ onClose, onComplete }: KathakaliRhythmGameProps) => {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'finished'>('ready');
  const [sequence, setSequence] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const { toast } = useToast();
  const { user, isDemoMode } = useAuth();

  useEffect(() => {
    if (gameState === 'playing') {
      generateSequence();
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            finishGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'playing') {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (keyMap[e.key] !== undefined) {
          handleMove(keyMap[e.key]);
        }
      };
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [gameState, currentIndex, sequence]);

  const generateSequence = () => {
    const newSequence = Array.from({ length: 20 }, () => Math.floor(Math.random() * 4));
    setSequence(newSequence);
    setCurrentIndex(0);
  };

  const handleMove = (moveIndex: number) => {
    if (moveIndex === sequence[currentIndex]) {
      const newCombo = combo + 1;
      const points = 10 + (newCombo * 2);
      setScore(score + points);
      setCombo(newCombo);
      setCurrentIndex(currentIndex + 1);

      if (currentIndex + 1 >= sequence.length) {
        generateSequence();
      }
    } else {
      setCombo(0);
      toast({
        title: "Missed!",
        description: "Combo broken",
        variant: "destructive",
      });
    }
  };

  const finishGame = async () => {
    setGameState('finished');
    const xpEarned = Math.floor(score / 2) + 20;

    if (!isDemoMode && user) {
      try {
        await gameService.awardXP('kathakali-rhythm', xpEarned, score);
        toast({
          title: "Performance Complete!",
          description: `Score: ${score}! Earned ${xpEarned} XP`,
        });
      } catch (error) {
        console.error('Error awarding XP:', error);
      }
    }

    onComplete(xpEarned);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 rounded-lg p-6 max-w-2xl w-full"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Music className="h-6 w-6 text-purple-500" />
              Kathakali Rhythm Dance
            </h2>
            <p className="text-gray-400 text-sm">Follow the traditional dance moves!</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {gameState === 'ready' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <div className="bg-slate-800 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">About Kathakali</h3>
              <p className="text-gray-300 mb-4">
                Kathakali is a classical Indian dance-drama known for its elaborate costumes and expressive gestures. 
                Follow the rhythm and match the moves!
              </p>
              <div className="grid grid-cols-4 gap-4 mt-6">
                <div className="bg-slate-700 p-4 rounded-lg">
                  <div className="text-4xl mb-2">👆</div>
                  <p className="text-white text-sm">↑ Up</p>
                </div>
                <div className="bg-slate-700 p-4 rounded-lg">
                  <div className="text-4xl mb-2">👇</div>
                  <p className="text-white text-sm">↓ Down</p>
                </div>
                <div className="bg-slate-700 p-4 rounded-lg">
                  <div className="text-4xl mb-2">👈</div>
                  <p className="text-white text-sm">← Left</p>
                </div>
                <div className="bg-slate-700 p-4 rounded-lg">
                  <div className="text-4xl mb-2">👉</div>
                  <p className="text-white text-sm">→ Right</p>
                </div>
              </div>
            </div>

            <Button onClick={() => setGameState('playing')} size="lg" className="bg-purple-600 hover:bg-purple-700">
              Start Dancing!
            </Button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <div>
            <div className="mb-6 bg-slate-800 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-semibold">Score: {score}</span>
                <span className="text-purple-400 font-semibold">Combo: x{combo}</span>
                <span className={`font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-white'}`}>
                  Time: {timeLeft}s
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all"
                  style={{ width: `${(timeLeft / 30) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-800 p-8 rounded-lg mb-6">
              <div className="flex justify-center gap-4 mb-8">
                {sequence.slice(currentIndex, currentIndex + 5).map((move, idx) => (
                  <motion.div
                    key={currentIndex + idx}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: idx === 0 ? 1.5 : 1, opacity: 1 }}
                    className={`text-6xl ${idx === 0 ? 'animate-pulse' : 'opacity-50'}`}
                  >
                    {moves[move]}
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-4 gap-4">
                {moves.map((move, idx) => (
                  <Button
                    key={idx}
                    onClick={() => handleMove(idx)}
                    className="h-20 text-4xl bg-slate-700 hover:bg-slate-600"
                  >
                    {move}
                  </Button>
                ))}
              </div>
            </div>

            <p className="text-center text-gray-400 text-sm">
              Use arrow keys or click the buttons to match the moves!
            </p>
          </div>
        )}

        {gameState === 'finished' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <Music className="h-24 w-24 mx-auto mb-4 text-purple-500" />
            <h3 className="text-3xl font-bold text-white mb-2">
              {score >= 300 ? 'Master Performer!' : score >= 200 ? 'Great Performance!' : 'Good Effort!'}
            </h3>
            <p className="text-xl text-gray-300 mb-4">
              Final Score: {score}
            </p>
            <p className="text-2xl text-purple-400 font-bold mb-6">
              +{Math.floor(score / 2) + 20} XP Earned!
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => {
                setGameState('playing');
                setScore(0);
                setCombo(0);
                setTimeLeft(30);
              }} className="bg-purple-600 hover:bg-purple-700">
                Dance Again
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

export default KathakaliRhythmGame;
