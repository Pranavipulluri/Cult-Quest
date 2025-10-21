import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, X, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import BoatRaceGame from "./games/BoatRaceGame";
import CuisineQuizGame from "./games/CuisineQuizGame";
import KathakaliRhythmGame from "./games/KathakaliRhythmGame";
import SpiceMatchGame from "./games/SpiceMatchGame";
import NPCDialogue from "./NPCDialogue";

const MAP_WIDTH = 1200;
const MAP_HEIGHT = 800;

// Isometric buildings/landmarks
const buildings = [
  {
    id: 1,
    name: "Fort Kochi",
    x: 300,
    y: 200,
    width: 120,
    height: 100,
    color: "#f59e0b",
    icon: "🏛️",
    type: "landmark",
    description: "Historic port city with Chinese fishing nets",
    facts: ["Founded in 1503", "UNESCO World Heritage Site candidate"]
  },
  {
    id: 2,
    name: "Tea Garden",
    x: 600,
    y: 150,
    width: 100,
    height: 80,
    color: "#10b981",
    icon: "🍵",
    type: "landmark",
    description: "Munnar's famous tea plantations",
    facts: ["1,600m above sea level", "Produces finest tea"]
  },
  {
    id: 3,
    name: "Spice Market",
    x: 800,
    y: 300,
    width: 110,
    height: 90,
    color: "#8b5cf6",
    icon: "🌿",
    type: "landmark",
    description: "Historic spice trading center",
    facts: ["400+ years old", "Spices exported worldwide"]
  },
  {
    id: 4,
    name: "Backwater House",
    x: 400,
    y: 450,
    width: 100,
    height: 85,
    color: "#14b8a6",
    icon: "🚣",
    type: "landmark",
    description: "Traditional Kerala houseboat station",
    facts: ["900km of waterways", "Houseboat tourism hub"]
  },
  {
    id: 5,
    name: "Temple",
    x: 700,
    y: 500,
    width: 90,
    height: 110,
    color: "#f97316",
    icon: "🛕",
    type: "landmark",
    description: "Ancient Kerala temple",
    facts: ["Traditional architecture", "Cultural center"]
  }
];

// NPCs with positions
const npcs = [
  {
    id: 1,
    name: "Ravi the Boatman",
    x: 420,
    y: 480,
    color: "#0ea5e9",
    dialogue: [
      "Namaste! Welcome to the backwaters of Kerala!",
      "I am Ravi, fourth generation boatman.",
      "These snake boats can be 100 feet long with 100 rowers!",
      "Would you like to try racing? I'll teach you!"
    ],
    gameType: "boat-race",
    location: "Alleppey Backwaters"
  },
  {
    id: 2,
    name: "Lakshmi the Chef",
    x: 320,
    y: 230,
    color: "#ec4899",
    dialogue: [
      "Vanakkam! Welcome to my kitchen!",
      "Kerala cuisine is all about balance and flavor.",
      "A proper Onam Sadya has 26 dishes!",
      "Want to test your knowledge?"
    ],
    gameType: "cuisine-quiz",
    location: "Traditional Kitchen"
  },
  {
    id: 3,
    name: "Merchant Kumar",
    x: 820,
    y: 330,
    color: "#f59e0b",
    dialogue: [
      "Welcome! See the finest spices in Kerala!",
      "My family has been trading for 200 years.",
      "Black pepper - we call it 'black gold'!",
      "Care to try spice trading?"
    ],
    gameType: "spice-match",
    location: "Mattancherry Market"
  },
  {
    id: 4,
    name: "Dancer Meera",
    x: 720,
    y: 530,
    color: "#a855f7",
    dialogue: [
      "Namaste! I am Meera, Kathakali dancer.",
      "Kathakali means 'story-play'.",
      "My training started at age 7!",
      "Would you like to learn some moves?"
    ],
    gameType: "kathakali-rhythm",
    location: "Kerala Kalamandalam"
  }
];

const KeralaItineraryIsometric = () => {
  const [playerPosition, setPlayerPosition] = useState({ x: 300, y: 300 });
  const [activeBuilding, setActiveBuilding] = useState<typeof buildings[0] | null>(null);
  const [activeNPC, setActiveNPC] = useState<typeof npcs[0] | null>(null);
  const [playingGame, setPlayingGame] = useState(false);
  const [currentGameType, setCurrentGameType] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-center camera on player
  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      setCameraOffset({
        x: containerWidth / 2 - playerPosition.x,
        y: containerHeight / 2 - playerPosition.y
      });
    }
  }, [playerPosition]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (playingGame) return;

      const moveStep = 8;
      let newX = playerPosition.x;
      let newY = playerPosition.y;

      switch (e.key) {
        case "ArrowUp":
        case "w":
          newY -= moveStep;
          break;
        case "ArrowDown":
        case "s":
          newY += moveStep;
          break;
        case "ArrowLeft":
        case "a":
          newX -= moveStep;
          break;
        case "ArrowRight":
        case "d":
          newX += moveStep;
          break;
      }

      // Boundaries
      newX = Math.max(50, Math.min(MAP_WIDTH - 50, newX));
      newY = Math.max(50, Math.min(MAP_HEIGHT - 50, newY));

      setPlayerPosition({ x: newX, y: newY });
      checkInteractions(newX, newY);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playerPosition, playingGame]);

  const checkInteractions = (x: number, y: number) => {
    // Check NPCs
    const foundNPC = npcs.find(npc =>
      Math.abs(npc.x - x) < 60 && Math.abs(npc.y - y) < 60
    );
    if (foundNPC && !activeNPC) {
      setActiveNPC(foundNPC);
    }

    // Check buildings
    const foundBuilding = buildings.find(building =>
      x >= building.x && x <= building.x + building.width &&
      y >= building.y && y <= building.y + building.height
    );
    if (foundBuilding && !activeBuilding) {
      setActiveBuilding(foundBuilding);
      toast.success(`Discovered: ${foundBuilding.name}`);
    }
  };

  const startGame = (gameType: string) => {
    setCurrentGameType(gameType);
    setPlayingGame(true);
  };

  const endGame = (xpEarned?: number) => {
    setPlayingGame(false);
    setCurrentGameType(null);
    if (xpEarned) {
      toast.success(`Earned ${xpEarned} XP!`);
    }
  };

  return (
    <div className="bg-gradient-to-b from-sky-400 to-sky-200 p-4 rounded-lg w-full h-full overflow-hidden relative">
      {/* Breadcrumb */}
      <div className="mb-2 flex items-center text-sm text-slate-700">
        <span className="hover:text-teal-600 cursor-pointer">World</span>
        <span className="mx-2">›</span>
        <span className="hover:text-teal-600 cursor-pointer">Asia</span>
        <span className="mx-2">›</span>
        <span className="hover:text-teal-600 cursor-pointer">India</span>
        <span className="mx-2">›</span>
        <span className="text-teal-600 font-semibold">Kerala</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span>🌴</span> Kerala Township
            </h2>
            <p className="text-xs text-slate-600">Explore God's Own Country</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="text-xs">
            <Zap className="h-3 w-3 mr-1" /> Quick Travel
          </Button>
        </div>
      </div>

      {/* Instructions */}
      {showInstructions && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm p-3 rounded-lg mb-3 border-2 border-teal-400"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                <span>🎮</span> How to Play
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                <div>⌨️ Use <strong>Arrow Keys</strong> or <strong>WASD</strong> to move</div>
                <div>🏛️ Walk to <strong>buildings</strong> to discover them</div>
                <div>👥 Approach <strong>NPCs</strong> to chat and play games</div>
                <div>🎯 Earn <strong>XP</strong> by completing activities</div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowInstructions(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Game View */}
      <div
        ref={containerRef}
        className="relative bg-gradient-to-br from-green-200 via-green-300 to-green-400 rounded-lg overflow-hidden border-4 border-white shadow-2xl"
        style={{ height: "calc(100vh - 280px)", minHeight: "500px" }}
      >
        {/* World Container */}
        <div
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${cameraOffset.x}px, ${cameraOffset.y}px)`,
            width: MAP_WIDTH,
            height: MAP_HEIGHT
          }}
        >
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-20">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={`grid-h-${i}`} className="absolute w-full h-px bg-green-600" style={{ top: `${i * 5}%` }} />
            ))}
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={`grid-v-${i}`} className="absolute h-full w-px bg-green-600" style={{ left: `${i * 5}%` }} />
            ))}
          </div>

          {/* Roads - Township style */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
            <defs>
              <pattern id="road-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect width="20" height="20" fill="#6b7280" />
                <line x1="10" y1="0" x2="10" y2="20" stroke="#9ca3af" strokeWidth="1" strokeDasharray="5,5" />
              </pattern>
            </defs>
            {/* Main roads */}
            <path d="M 0 300 L 1200 300" stroke="url(#road-pattern)" strokeWidth="40" />
            <path d="M 300 0 L 300 800" stroke="url(#road-pattern)" strokeWidth="40" />
            <path d="M 700 0 L 700 800" stroke="url(#road-pattern)" strokeWidth="40" />
            <path d="M 0 500 L 1200 500" stroke="url(#road-pattern)" strokeWidth="40" />
          </svg>

          {/* Buildings */}
          {buildings.map((building) => (
            <motion.div
              key={building.id}
              className="absolute cursor-pointer"
              style={{
                left: building.x,
                top: building.y,
                zIndex: 10
              }}
              whileHover={{ scale: 1.05, y: -5 }}
              animate={{
                y: [0, -3, 0]
              }}
              transition={{
                y: { repeat: Infinity, duration: 3, ease: "easeInOut" }
              }}
              onClick={() => setActiveBuilding(building)}
            >
              {/* Building shadow */}
              <div
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-black/20 rounded-full blur-md"
                style={{ width: building.width * 0.8, height: 20 }}
              />
              
              {/* Building structure - isometric */}
              <div className="relative">
                {/* Front face */}
                <div
                  className="rounded-lg border-4 border-white shadow-xl relative overflow-hidden"
                  style={{
                    width: building.width,
                    height: building.height,
                    background: `linear-gradient(135deg, ${building.color} 0%, ${building.color}dd 100%)`
                  }}
                >
                  {/* Windows */}
                  <div className="absolute inset-4 grid grid-cols-3 gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="bg-yellow-200 rounded border border-yellow-400"
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                      />
                    ))}
                  </div>
                  
                  {/* Icon */}
                  <div className="absolute top-2 right-2 text-3xl">{building.icon}</div>
                </div>
                
                {/* Roof */}
                <div
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 border-4 border-white"
                  style={{
                    width: building.width + 20,
                    height: 20,
                    background: `linear-gradient(to bottom, ${building.color}ee, ${building.color})`
                  }}
                />
                
                {/* Name label */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-white px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-lg border-2 border-teal-400">
                  {building.name}
                </div>
              </div>
            </motion.div>
          ))}

          {/* NPCs */}
          {npcs.map((npc) => (
            <motion.div
              key={npc.id}
              className="absolute cursor-pointer"
              style={{
                left: npc.x - 20,
                top: npc.y - 40,
                zIndex: 15
              }}
              animate={{
                y: [0, -5, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut"
              }}
              whileHover={{ scale: 1.2 }}
              onClick={() => setActiveNPC(npc)}
            >
              {/* NPC Character */}
              <div className="relative">
                {/* Shadow */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-black/30 rounded-full blur-sm" />
                
                {/* Body */}
                <div className="relative flex flex-col items-center">
                  <div
                    className="w-10 h-10 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-xl"
                    style={{ backgroundColor: npc.color }}
                  >
                    👤
                  </div>
                  <div
                    className="w-8 h-12 rounded-lg border-2 border-white mt-1"
                    style={{ backgroundColor: npc.color }}
                  />
                  {/* Speech bubble indicator */}
                  <motion.div
                    className="absolute -top-6 -right-6 bg-white rounded-full p-1 border-2 border-teal-400 shadow-lg"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    💬
                  </motion.div>
                </div>
                
                {/* Name */}
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-white px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-800 shadow border border-teal-400">
                  {npc.name.split(' ')[0]}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Player Character - Township style */}
          <motion.div
            className="absolute"
            style={{
              left: playerPosition.x - 25,
              top: playerPosition.y - 50,
              zIndex: 20
            }}
            animate={{
              y: [0, -3, 0]
            }}
            transition={{
              repeat: Infinity,
              duration: 0.5
            }}
          >
            {/* Shadow */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-3 bg-black/30 rounded-full blur-sm" />
            
            {/* Character */}
            <div className="relative flex flex-col items-center">
              {/* Head */}
              <div className="w-12 h-12 bg-gradient-to-b from-orange-200 to-orange-300 rounded-full border-4 border-white shadow-lg relative">
                {/* Eyes */}
                <div className="absolute top-3 left-2 w-2 h-2 bg-black rounded-full" />
                <div className="absolute top-3 right-2 w-2 h-2 bg-black rounded-full" />
                {/* Smile */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-2 border-b-2 border-black rounded-b-full" />
              </div>
              
              {/* Hair */}
              <div className="absolute -top-2 left-0 right-0 flex justify-center">
                <div className="w-14 h-6 bg-gradient-to-b from-purple-900 to-purple-700 rounded-t-full" />
              </div>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-purple-900 rounded-full" />
              
              {/* Body */}
              <div className="w-10 h-14 bg-gradient-to-b from-teal-400 to-teal-500 rounded-lg border-4 border-white mt-1 relative shadow-lg">
                <div className="absolute bottom-0 left-0 right-0 h-3 bg-yellow-400 opacity-60" />
              </div>
              
              {/* Legs */}
              <div className="flex gap-1 mt-1">
                <motion.div
                  className="w-3 h-5 bg-orange-300 rounded border-2 border-white"
                  animate={{ rotate: [0, 10, 0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6 }}
                />
                <motion.div
                  className="w-3 h-5 bg-orange-300 rounded border-2 border-white"
                  animate={{ rotate: [0, -10, 0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 0.6 }}
                />
              </div>
              
              {/* Name tag */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg border-2 border-white">
                You
              </div>
            </div>
          </motion.div>

          {/* Decorative elements */}
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={`tree-${i}`}
              className="absolute"
              style={{
                left: Math.random() * MAP_WIDTH,
                top: Math.random() * MAP_HEIGHT,
                zIndex: 5
              }}
              animate={{
                rotate: [0, 5, 0, -5, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 3 + Math.random() * 2,
                ease: "easeInOut"
              }}
            >
              <div className="text-4xl">🌴</div>
            </motion.div>
          ))}
        </div>

        {/* Mini-map */}
        <div className="absolute top-4 right-4 w-32 h-24 bg-white/90 rounded-lg border-2 border-teal-400 p-2 shadow-lg" style={{ zIndex: 30 }}>
          <div className="text-[8px] font-bold text-slate-700 mb-1">Mini Map</div>
          <div className="relative w-full h-full bg-green-200 rounded">
            {/* Player dot */}
            <div
              className="absolute w-2 h-2 bg-red-500 rounded-full"
              style={{
                left: `${(playerPosition.x / MAP_WIDTH) * 100}%`,
                top: `${(playerPosition.y / MAP_HEIGHT) * 100}%`
              }}
            />
            {/* Building dots */}
            {buildings.map(b => (
              <div
                key={`mini-${b.id}`}
                className="absolute w-1.5 h-1.5 bg-yellow-600 rounded-sm"
                style={{
                  left: `${(b.x / MAP_WIDTH) * 100}%`,
                  top: `${(b.y / MAP_HEIGHT) * 100}%`
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Building Info Panel */}
      <AnimatePresence>
        {activeBuilding && !playingGame && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-4 right-4 bg-white rounded-lg p-4 shadow-2xl border-2 border-teal-400"
            style={{ zIndex: 40 }}
          >
            <div className="flex items-start gap-3">
              <div className="text-4xl">{activeBuilding.icon}</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-800">{activeBuilding.name}</h3>
                <p className="text-sm text-slate-600 mb-2">{activeBuilding.description}</p>
                {activeBuilding.facts && (
                  <div className="bg-teal-50 rounded p-2 text-xs text-slate-700">
                    {activeBuilding.facts.map((fact, idx) => (
                      <div key={idx}>• {fact}</div>
                    ))}
                  </div>
                )}
              </div>
              <Button size="sm" variant="ghost" onClick={() => setActiveBuilding(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NPC Dialogue */}
      {activeNPC && !playingGame && (
        <NPCDialogue
          npcName={activeNPC.name}
          npcAvatar={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeNPC.name}`}
          dialogue={activeNPC.dialogue}
          location={activeNPC.location}
          onClose={() => setActiveNPC(null)}
          onActionButton={activeNPC.gameType ? {
            label: `Play Game`,
            action: () => {
              setActiveNPC(null);
              startGame(activeNPC.gameType!);
            }
          } : undefined}
        />
      )}

      {/* Games */}
      {playingGame && currentGameType === 'boat-race' && (
        <BoatRaceGame onClose={() => endGame()} onComplete={(xp) => endGame(xp)} />
      )}
      {playingGame && currentGameType === 'cuisine-quiz' && (
        <CuisineQuizGame onClose={() => endGame()} onComplete={(xp) => endGame(xp)} />
      )}
      {playingGame && currentGameType === 'spice-match' && (
        <SpiceMatchGame onClose={() => endGame()} onComplete={(xp) => endGame(xp)} />
      )}
      {playingGame && currentGameType === 'kathakali-rhythm' && (
        <KathakaliRhythmGame onClose={() => endGame()} onComplete={(xp) => endGame(xp)} />
      )}
    </div>
  );
};

export default KeralaItineraryIsometric;
