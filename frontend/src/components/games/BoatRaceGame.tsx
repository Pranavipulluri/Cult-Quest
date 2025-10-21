import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { gameService } from '@/services/gameService';
import { motion } from 'framer-motion';
import { Trophy, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface BoatRaceGameProps {
  onClose: () => void;
  onComplete: (xpEarned: number) => void;
}

const BoatRaceGame = ({ onClose, onComplete }: BoatRaceGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'finished'>('ready');
  const [position, setPosition] = useState(4);
  const [raceProgress, setRaceProgress] = useState(0);
  const { toast } = useToast();
  const { user, isDemoMode } = useAuth();
  
  const [boats, setBoats] = useState([
    { id: 1, name: 'Player', y: 50, speed: 0, color: '#ff6600', isPlayer: true },
    { id: 2, name: 'Competitor 1', y: 150, speed: 2, color: '#14b8a6' },
    { id: 3, name: 'Competitor 2', y: 250, speed: 1.8, color: '#3b82f6' },
    { id: 4, name: 'Competitor 3', y: 350, speed: 2.2, color: '#8b5cf6' }
  ]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let playerX = 50;
    const finishLine = canvas.width - 100;

    const gameLoop = () => {
      // Clear canvas
      ctx.fillStyle = '#0ea5e9';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw water waves
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;
      for (let i = 0; i < canvas.height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        for (let x = 0; x < canvas.width; x += 20) {
          ctx.lineTo(x, i + Math.sin((x + Date.now() / 100) / 20) * 5);
        }
        ctx.stroke();
      }

      // Draw finish line
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(finishLine, 0, 10, canvas.height);
      ctx.fillStyle = '#000';
      ctx.font = '20px Arial';
      ctx.fillText('FINISH', finishLine - 60, 30);

      // Update and draw boats
      const updatedBoats = boats.map((boat, index) => {
        let newX = index === 0 ? playerX : boat.y + boat.speed;
        
        // AI boats random speed variation
        if (!boat.isPlayer) {
          newX += Math.random() * 0.5 - 0.25;
        }

        // Draw boat
        ctx.fillStyle = boat.color;
        ctx.beginPath();
        ctx.ellipse(newX, 100 + index * 100, 40, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw boat details
        ctx.fillStyle = '#fff';
        ctx.fillRect(newX - 10, 100 + index * 100 - 5, 20, 10);
        
        // Draw name
        ctx.fillStyle = '#000';
        ctx.font = '12px Arial';
        ctx.fillText(boat.name, newX - 30, 80 + index * 100);

        return { ...boat, y: newX };
      });

      setBoats(updatedBoats);

      // Check if player finished
      if (playerX >= finishLine) {
        const playerPosition = updatedBoats
          .sort((a, b) => b.y - a.y)
          .findIndex(b => b.isPlayer) + 1;
        
        setPosition(playerPosition);
        setGameState('finished');
        handleGameComplete(playerPosition);
        return;
      }

      // Update progress
      setRaceProgress(Math.floor((playerX / finishLine) * 100));

      animationId = requestAnimationFrame(gameLoop);
    };

    // Handle keyboard input
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        playerX += 3;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    gameLoop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameState, boats]);

  const handleGameComplete = async (finalPosition: number) => {
    const xpRewards = [100, 75, 50, 25];
    const xpEarned = xpRewards[finalPosition - 1] || 10;

    if (!isDemoMode && user) {
      try {
        await gameService.awardXP('boat-race', xpEarned, finalPosition);
        toast({
          title: "Race Complete!",
          description: `You finished in position ${finalPosition}! Earned ${xpEarned} XP`,
        });
      } catch (error) {
        console.error('Error awarding XP:', error);
      }
    }

    onComplete(xpEarned);
  };

  const startRace = () => {
    setGameState('playing');
    toast({
      title: "Race Started!",
      description: "Press SPACE or → to paddle faster!",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 rounded-lg p-6 max-w-4xl w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              🚣 Vallam Kali - Kerala Boat Race
            </h2>
            <p className="text-gray-400 text-sm">Traditional snake boat racing</p>
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
              <h3 className="text-xl font-semibold text-white mb-4">About Vallam Kali</h3>
              <p className="text-gray-300 mb-4">
                Vallam Kali is a traditional boat race in Kerala, held during the festival of Onam. 
                Snake boats (Chundan Vallam) with over 100 rowers compete in the backwaters.
              </p>
              <p className="text-teal-400 font-semibold">
                Press SPACE or → arrow repeatedly to paddle faster!
              </p>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-800 p-4 rounded-lg">
                <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-white font-bold">1st Place</p>
                <p className="text-teal-400">100 XP</p>
              </div>
              <div className="bg-slate-800 p-4 rounded-lg">
                <Trophy className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-white font-bold">2nd Place</p>
                <p className="text-teal-400">75 XP</p>
              </div>
              <div className="bg-slate-800 p-4 rounded-lg">
                <Trophy className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="text-white font-bold">3rd Place</p>
                <p className="text-teal-400">50 XP</p>
              </div>
              <div className="bg-slate-800 p-4 rounded-lg">
                <Trophy className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                <p className="text-white font-bold">4th Place</p>
                <p className="text-teal-400">25 XP</p>
              </div>
            </div>

            <Button onClick={startRace} size="lg" className="bg-orange-600 hover:bg-orange-700">
              Start Race!
            </Button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <div>
            <div className="mb-4 bg-slate-800 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white font-semibold">Progress: {raceProgress}%</span>
                <span className="text-teal-400">Keep pressing SPACE or →</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-4">
                <div
                  className="bg-teal-500 h-4 rounded-full transition-all"
                  style={{ width: `${raceProgress}%` }}
                />
              </div>
            </div>

            <canvas
              ref={canvasRef}
              width={800}
              height={450}
              className="w-full border-4 border-teal-500 rounded-lg"
            />
          </div>
        )}

        {gameState === 'finished' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <Trophy className={`h-24 w-24 mx-auto mb-4 ${
              position === 1 ? 'text-yellow-500' :
              position === 2 ? 'text-gray-400' :
              position === 3 ? 'text-orange-600' :
              'text-slate-600'
            }`} />
            <h3 className="text-3xl font-bold text-white mb-2">
              {position === 1 ? '🎉 Victory!' :
               position === 2 ? '👏 Great Job!' :
               position === 3 ? '💪 Well Done!' :
               '🚣 Good Effort!'}
            </h3>
            <p className="text-xl text-gray-300 mb-4">
              You finished in position {position}!
            </p>
            <p className="text-2xl text-teal-400 font-bold mb-6">
              +{[100, 75, 50, 25][position - 1]} XP Earned!
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => {
                setGameState('ready');
                setRaceProgress(0);
                setBoats([
                  { id: 1, name: 'Player', y: 50, speed: 0, color: '#ff6600', isPlayer: true },
                  { id: 2, name: 'Competitor 1', y: 150, speed: 2, color: '#14b8a6' },
                  { id: 3, name: 'Competitor 2', y: 250, speed: 1.8, color: '#3b82f6' },
                  { id: 4, name: 'Competitor 3', y: 350, speed: 2.2, color: '#8b5cf6' }
                ]);
              }} className="bg-teal-600 hover:bg-teal-700">
                Race Again
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

export default BoatRaceGame;
