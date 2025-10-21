import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { gameService } from '@/services/gameService';
import { motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SpiceMatchGameProps {
  onClose: () => void;
  onComplete: (xpEarned: number) => void;
}

const spices = [
  { id: 1, name: 'Cardamom', emoji: '🌿', color: '#10b981' },
  { id: 2, name: 'Pepper', emoji: '⚫', color: '#1f2937' },
  { id: 3, name: 'Cinnamon', emoji: '🟤', color: '#92400e' },
  { id: 4, name: 'Clove', emoji: '🌰', color: '#78350f' },
  { id: 5, name: 'Turmeric', emoji: '🟡', color: '#eab308' },
  { id: 6, name: 'Ginger', emoji: '🫚', color: '#f59e0b' },
];

const SpiceMatchGame = ({ onClose, onComplete }: SpiceMatchGameProps) => {
  const [cards, setCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'finished'>('ready');
  const { toast } = useToast();
  const { user, isDemoMode } = useAuth();

  const initializeGame = () => {
    const gameCards = [...spices, ...spices]
      .map((spice, index) => ({ ...spice, uniqueId: index }))
      .sort(() => Math.random() - 0.5);
    setCards(gameCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  useEffect(() => {
    if (gameState === 'playing') {
      initializeGame();
    }
  }, [gameState]);

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped;
      if (cards[first].id === cards[second].id) {
        setMatched([...matched, cards[first].id]);
        setFlipped([]);
        
        if (matched.length + 1 === spices.length) {
          finishGame();
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
      setMoves(moves + 1);
    }
  }, [flipped]);

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(cards[index].id)) {
      return;
    }
    setFlipped([...flipped, index]);
  };

  const finishGame = async () => {
    setGameState('finished');
    const xpEarned = Math.max(100 - moves * 2, 30);

    if (!isDemoMode && user) {
      try {
        await gameService.awardXP('spice-match', xpEarned, moves);
        toast({
          title: "Game Complete!",
          description: `Completed in ${moves} moves! Earned ${xpEarned} XP`,
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
        className="bg-slate-900 rounded-lg p-6 max-w-3xl w-full"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-yellow-500" />
              Spice Memory Match
            </h2>
            <p className="text-gray-400 text-sm">Match Kerala's famous spices!</p>
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
              <h3 className="text-xl font-semibold text-white mb-4">How to Play</h3>
              <p className="text-gray-300 mb-4">
                Match pairs of spices by flipping cards. Complete the game in fewer moves to earn more XP!
              </p>
              <div className="grid grid-cols-3 gap-4 mt-6">
                {spices.map((spice) => (
                  <div key={spice.id} className="bg-slate-700 p-3 rounded-lg">
                    <div className="text-3xl mb-2">{spice.emoji}</div>
                    <p className="text-white text-sm">{spice.name}</p>
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={() => setGameState('playing')} size="lg" className="bg-teal-600 hover:bg-teal-700">
              Start Game
            </Button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <div>
            <div className="mb-4 bg-slate-800 p-3 rounded-lg flex justify-between items-center">
              <span className="text-white font-semibold">Moves: {moves}</span>
              <span className="text-teal-400">Matched: {matched.length}/{spices.length}</span>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {cards.map((card, index) => (
                <motion.button
                  key={card.uniqueId}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCardClick(index)}
                  className={`aspect-square rounded-lg p-4 text-4xl font-bold transition-all ${
                    flipped.includes(index) || matched.includes(card.id)
                      ? 'bg-slate-700'
                      : 'bg-gradient-to-br from-teal-600 to-teal-800'
                  }`}
                >
                  {(flipped.includes(index) || matched.includes(card.id)) ? card.emoji : '?'}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {gameState === 'finished' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <Sparkles className="h-24 w-24 mx-auto mb-4 text-yellow-500" />
            <h3 className="text-3xl font-bold text-white mb-2">Perfect Match!</h3>
            <p className="text-xl text-gray-300 mb-4">
              Completed in {moves} moves
            </p>
            <p className="text-2xl text-teal-400 font-bold mb-6">
              +{Math.max(100 - moves * 2, 30)} XP Earned!
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => setGameState('playing')} className="bg-teal-600 hover:bg-teal-700">
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

export default SpiceMatchGame;
