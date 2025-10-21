import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Gamepad, MapPin, User, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import BoatRaceGame from "./games/BoatRaceGame";
import CuisineQuizGame from "./games/CuisineQuizGame";
import KathakaliRhythmGame from "./games/KathakaliRhythmGame";
import SpiceMatchGame from "./games/SpiceMatchGame";
import NPCDialogue from "./NPCDialogue";

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 1000;
const CHARACTER_SIZE = 24;

const landmarks = [
  {
    id: 1,
    name: "Fort Kochi",
    x: 520,
    y: 420,
    description: "Historic port city with Chinese fishing nets, Dutch Palace, and colonial architecture. A blend of Portuguese, Dutch, and British influences.",
    image: "/lovable-uploads/ca2d6830-e22c-4607-b372-bf96d604334a.png",
    icon: "🏛️",
    facts: ["Founded in 1503", "UNESCO World Heritage Site candidate", "Famous for Chinese fishing nets"]
  },
  {
    id: 2,
    name: "Munnar Tea Gardens",
    x: 300,
    y: 150,
    description: "Rolling hills covered with lush tea plantations. The cool climate and scenic beauty make it a popular hill station.",
    image: "/lovable-uploads/9429424e-cfd6-422e-b4d8-94d66c62b618.png",
    icon: "🍵",
    facts: ["1,600m above sea level", "Produces finest tea in India", "Home to Neelakurinji flowers"]
  },
  {
    id: 3,
    name: "Paddy Fields",
    x: 700,
    y: 200,
    description: "Vast expanses of rice paddies that turn golden during harvest season. The backbone of Kerala's agriculture.",
    image: "/lovable-uploads/42770aa5-b929-4ed2-85e0-aa5a9b17ac5b.png",
    icon: "🌾",
    facts: ["Rice is staple food", "Two harvests per year", "Traditional farming methods"]
  },
  {
    id: 4,
    name: "Thrissur Pooram Ground",
    x: 400,
    y: 600,
    description: "The venue for Kerala's most spectacular temple festival featuring decorated elephants and traditional music.",
    image: "/lovable-uploads/91bf8199-59a4-4e3e-96c1-10cd41b289f1.png",
    icon: "🎭",
    facts: ["Started in 1798", "50+ elephants participate", "Fireworks display at dawn"]
  },
  {
    id: 5,
    name: "Alleppey Backwaters",
    x: 600,
    y: 700,
    description: "A network of lagoons, lakes, and canals. Experience traditional houseboat cruises through serene waters.",
    image: "/lovable-uploads/ca2d6830-e22c-4607-b372-bf96d604334a.png",
    icon: "🚣",
    facts: ["900km of waterways", "Houseboat tourism hub", "Vallam Kali boat races"]
  },
  {
    id: 6,
    name: "Spice Plantations",
    x: 200,
    y: 400,
    description: "Aromatic plantations growing cardamom, pepper, cinnamon, and cloves. The source of Kerala's 'black gold'.",
    image: "/lovable-uploads/42770aa5-b929-4ed2-85e0-aa5a9b17ac5b.png",
    icon: "🌿",
    facts: ["Pepper called 'black gold'", "Cardamom from Western Ghats", "Spice trade since 3000 BCE"]
  },
  {
    id: 7,
    name: "Mattancherry Market",
    x: 800,
    y: 500,
    description: "Historic spice market where traders have bought and sold spices for centuries. A sensory overload of colors and aromas.",
    image: "/lovable-uploads/91bf8199-59a4-4e3e-96c1-10cd41b289f1.png",
    icon: "🏪",
    facts: ["400+ years old", "Spices exported worldwide", "Jewish quarter nearby"]
  },
  {
    id: 8,
    name: "Kovalam Beach",
    x: 850,
    y: 750,
    description: "Crescent-shaped beach with golden sands and swaying palms. A perfect blend of relaxation and water sports.",
    image: "/lovable-uploads/ca2d6830-e22c-4607-b372-bf96d604334a.png",
    icon: "🏖️",
    facts: ["Three adjacent beaches", "Lighthouse viewpoint", "Ayurvedic resorts"]
  },
  {
    id: 9,
    name: "Periyar Wildlife Sanctuary",
    x: 150,
    y: 250,
    description: "Protected forest reserve home to elephants, tigers, and diverse wildlife. Boat safaris on Periyar Lake.",
    image: "/lovable-uploads/9429424e-cfd6-422e-b4d8-94d66c62b618.png",
    icon: "🐘",
    facts: ["777 sq km area", "Tiger reserve", "Bamboo rafting available"]
  }
];

const miniGames = [
  {
    id: 1,
    name: "Boat Race",
    x: 600,
    y: 700,
    description: "Experience the traditional Vallam Kali boat race!",
    type: "boat-race"
  },
  {
    id: 2,
    name: "Cuisine Quiz",
    x: 400,
    y: 600,
    description: "Test your knowledge of Kerala's delicious cuisine.",
    type: "cuisine-quiz"
  },
  {
    id: 3,
    name: "Spice Trading",
    x: 800,
    y: 500,
    description: "Trade spices in the historic Kerala marketplace.",
    type: "spice-trade"
  }
];

const npcs = [
  {
    id: 1,
    name: "Ravi the Boatman",
    x: 600,
    y: 650,
    avatar: "/lovable-uploads/d364c15d-f877-40f4-9df2-cad09b0ec8a2.png",
    dialogue: [
      "Namaste! Welcome to the backwaters of Kerala!",
      "I am Ravi, fourth generation boatman. My great-grandfather raced in the first Vallam Kali!",
      "These snake boats - Chundan Vallam - can be 100 feet long with 100 rowers!",
      "During Onam, the entire village comes together. The rhythm of the oars, the chanting... it's magical!",
      "The boats are made from anjili wood, blessed by priests before racing.",
      "Would you like to experience the thrill? I'll teach you the basics!"
    ],
    gameType: "boat-race",
    location: "Alleppey Backwaters",
    culturalNote: "Vallam Kali has been a tradition for over 400 years, originating from the Travancore era."
  },
  {
    id: 2,
    name: "Lakshmi the Chef",
    x: 400,
    y: 550,
    avatar: "/lovable-uploads/7ea599b5-bfde-462e-b7e7-454b0a50f062.png",
    dialogue: [
      "Vanakkam! I'm Lakshmi. Welcome to my kitchen!",
      "I learned cooking from my grandmother, who learned from hers. Our recipes are centuries old!",
      "Kerala cuisine is all about balance - coconut for richness, curry leaves for aroma, tamarind for tang.",
      "A proper Onam Sadya has 26 dishes, each served in a specific order on the banana leaf.",
      "We start with salt and banana chips, then rice with sambar, then the vegetables...",
      "The meal ends with payasam - our sweet dessert. Some say it's the taste of heaven!",
      "Want to test your knowledge? I have a quiz about our cuisine!"
    ],
    gameType: "cuisine-quiz",
    location: "Traditional Kerala Kitchen",
    culturalNote: "Sadya is served on banana leaves which are eco-friendly and add a subtle flavor to the food."
  },
  {
    id: 3,
    name: "Merchant Kumar",
    x: 800,
    y: 450,
    avatar: "/lovable-uploads/371255ec-eeef-4782-8d23-8b28ebdf92b8.png",
    dialogue: [
      "Welcome, welcome! Come see the finest spices in all of Kerala!",
      "My family has been in the spice trade for 200 years. We supplied to the British East India Company!",
      "You see this black pepper? We call it 'black gold'. Wars were fought over it!",
      "Cardamom from the Western Ghats, cinnamon from the forests, cloves from our plantations...",
      "The Portuguese came for pepper, the Dutch for cinnamon, the British for everything!",
      "Today, Kerala spices are exported worldwide. Our quality is unmatched!",
      "Care to try your hand at spice trading? It's not as easy as it looks!"
    ],
    gameType: "spice-match",
    location: "Mattancherry Spice Market",
    culturalNote: "Kerala's spice trade dates back to 3000 BCE, making it one of the oldest trading centers in the world."
  },
  {
    id: 4,
    name: "Dancer Meera",
    x: 300,
    y: 200,
    avatar: "/lovable-uploads/7ea599b5-bfde-462e-b7e7-454b0a50f062.png",
    dialogue: [
      "Namaste! I am Meera, Kathakali dancer and teacher.",
      "Kathakali means 'story-play'. We tell ancient epics through dance, music, and expressions.",
      "My training started at age 7. It takes 10 years to master the basics!",
      "See this makeup? It takes 3 hours to apply. Each color has meaning - green for heroes, red for villains.",
      "We use 24 basic mudras - hand gestures. Combined, they can express any word or emotion!",
      "The costume weighs 15 kilograms! But when the drums start, you forget everything.",
      "Would you like to learn some basic moves? Follow my rhythm!"
    ],
    gameType: "kathakali-rhythm",
    location: "Kerala Kalamandalam",
    culturalNote: "Kathakali is over 300 years old and is one of the eight classical dance forms of India."
  }
];

enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

const KeralaItinerary = () => {
  const [playerPosition, setPlayerPosition] = useState({ x: 500, y: 400 });
  const [playerDirection, setPlayerDirection] = useState(Direction.DOWN);
  const [activeLandmark, setActiveLandmark] = useState<typeof landmarks[0] | null>(null);
  const [activeGame, setActiveGame] = useState<typeof miniGames[0] | null>(null);
  const [activeNPC, setActiveNPC] = useState<typeof npcs[0] | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [playingGame, setPlayingGame] = useState(false);
  const [currentGameType, setCurrentGameType] = useState<string | null>(null);
  const [mapScale, setMapScale] = useState(1.0);
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    centerMapOnPlayer();
  }, []);

  const centerMapOnPlayer = useCallback(() => {
    if (!mapContainerRef.current) return;

    const containerWidth = mapContainerRef.current.clientWidth;
    const containerHeight = mapContainerRef.current.clientHeight;

    const centerX = (containerWidth / 2 - playerPosition.x * mapScale);
    const centerY = (containerHeight / 2 - playerPosition.y * mapScale);

    setMapPosition({ x: centerX, y: centerY });
  }, [playerPosition, mapScale]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (playingGame) return;

      const moveStep = 16;
      let newDirection = playerDirection;
      let newX = playerPosition.x;
      let newY = playerPosition.y;

      switch (e.key) {
        case "ArrowUp":
          newY -= moveStep;
          newDirection = Direction.UP;
          break;
        case "ArrowDown":
          newY += moveStep;
          newDirection = Direction.DOWN;
          break;
        case "ArrowLeft":
          newX -= moveStep;
          newDirection = Direction.LEFT;
          break;
        case "ArrowRight":
          newX += moveStep;
          newDirection = Direction.RIGHT;
          break;
      }

      if (newX < 0) newX = 0;
      if (newX > MAP_WIDTH) newX = MAP_WIDTH;
      if (newY < 0) newY = 0;
      if (newY > MAP_HEIGHT) newY = MAP_HEIGHT;

      setPlayerDirection(newDirection);
      setPlayerPosition({ x: newX, y: newY });

      // Auto-center camera on player
      if (mapContainerRef.current) {
        const containerWidth = mapContainerRef.current.clientWidth;
        const containerHeight = mapContainerRef.current.clientHeight;
        const centerX = (containerWidth / 2 - newX * mapScale);
        const centerY = (containerHeight / 2 - newY * mapScale);
        setMapPosition({ x: centerX, y: centerY });
      }

      checkLandmarksAndGames(newX, newY);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playerPosition, playerDirection, playingGame]);

  const checkLandmarksAndGames = (x: number, y: number) => {
    // Check NPCs first
    const foundNPC = npcs.find(npc =>
      Math.abs(npc.x - x) < 40 && Math.abs(npc.y - y) < 40
    );

    if (foundNPC) {
      setActiveNPC(foundNPC);
      setActiveLandmark(null);
      setActiveGame(null);
      return;
    }

    const foundLandmark = landmarks.find(landmark =>
      Math.abs(landmark.x - x) < 30 && Math.abs(landmark.y - y) < 30
    );

    if (foundLandmark) {
      setActiveLandmark(foundLandmark);
      setActiveGame(null);
      setActiveNPC(null);
      return;
    }

    const foundGame = miniGames.find(game =>
      Math.abs(game.x - x) < 30 && Math.abs(game.y - y) < 30
    );

    if (foundGame) {
      setActiveGame(foundGame);
      setActiveLandmark(null);
      setActiveNPC(null);
      return;
    }

    setActiveLandmark(null);
    setActiveGame(null);
    setActiveNPC(null);
  };

  const movePlayer = (dx: number, dy: number) => {
    const moveStep = 16;
    let newDirection = playerDirection;

    if (dx > 0) newDirection = Direction.RIGHT;
    else if (dx < 0) newDirection = Direction.LEFT;
    else if (dy > 0) newDirection = Direction.DOWN;
    else if (dy < 0) newDirection = Direction.UP;

    const newX = Math.max(0, Math.min(MAP_WIDTH, playerPosition.x + dx * moveStep));
    const newY = Math.max(0, Math.min(MAP_HEIGHT, playerPosition.y + dy * moveStep));

    setPlayerDirection(newDirection);
    setPlayerPosition({ x: newX, y: newY });

    checkLandmarksAndGames(newX, newY);
  };

  const handleZoom = (event: React.WheelEvent) => {
    event.preventDefault();
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
    setMapScale(prevScale => {
      const newScale = prevScale * zoomFactor;
      return Math.max(0.5, Math.min(2.0, newScale));
    });
  };

  const handleMapDragStart = (event: React.MouseEvent | React.TouchEvent) => {
    if (playingGame) return;

    setIsDragging(true);
    let clientX, clientY;

    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    setDragStart({
      x: clientX - mapPosition.x,
      y: clientY - mapPosition.y
    });
  };

  const handleMapDragMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;

    let clientX, clientY;

    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    setMapPosition({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    });
  };

  const handleMapDragEnd = () => {
    setIsDragging(false);
  };

  const navigateToLandmark = (landmark: typeof landmarks[0]) => {
    setPlayerPosition({
      x: landmark.x,
      y: landmark.y - 32
    });

    if (mapContainerRef.current) {
      const containerWidth = mapContainerRef.current.clientWidth;
      const containerHeight = mapContainerRef.current.clientHeight;

      setMapPosition({
        x: containerWidth / 2 - landmark.x * mapScale,
        y: containerHeight / 2 - landmark.y * mapScale
      });
    }

    setActiveLandmark(landmark);
    setActiveGame(null);
  };

  const startGame = (gameType: string) => {
    setCurrentGameType(gameType);
    setPlayingGame(true);
  };

  const endGame = (xpEarned?: number) => {
    setPlayingGame(false);
    setCurrentGameType(null);
    if (xpEarned) {
      toast.success(`Game completed! Earned ${xpEarned} XP`);
    }
  };

  const renderControls = () => (
    <div className="absolute bottom-4 right-4 grid grid-cols-3 gap-2 w-36 h-36">
      <div className="col-start-2">
        <Button
          onClick={() => movePlayer(0, -1)}
          className="w-12 h-12 bg-slate-700/70 hover:bg-slate-600/70 rounded-full p-0"
          disabled={playingGame}
        >
          ↑
        </Button>
      </div>
      <div className="col-start-1 row-start-2">
        <Button
          onClick={() => movePlayer(-1, 0)}
          className="w-12 h-12 bg-slate-700/70 hover:bg-slate-600/70 rounded-full p-0"
          disabled={playingGame}
        >
          ←
        </Button>
      </div>
      <div className="col-start-3 row-start-2">
        <Button
          onClick={() => movePlayer(1, 0)}
          className="w-12 h-12 bg-slate-700/70 hover:bg-slate-600/70 rounded-full p-0"
          disabled={playingGame}
        >
          →
        </Button>
      </div>
      <div className="col-start-2 row-start-3">
        <Button
          onClick={() => movePlayer(0, 1)}
          className="w-12 h-12 bg-slate-700/70 hover:bg-slate-600/70 rounded-full p-0"
          disabled={playingGame}
        >
          ↓
        </Button>
      </div>
    </div>
  );

  const renderMiniGame = () => {
    if (!activeGame) return null;

    if (activeGame.id === 1) {
      return (
        <motion.div
          className="p-4 bg-slate-800 rounded-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <h3 className="text-xl font-bold text-white mb-4">Village Quiz</h3>
          <p className="text-gray-300 mb-4">What is this village known for?</p>
          <div className="grid grid-cols-1 gap-2">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={endGame} className="w-full justify-start">A) Fishing</Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={endGame} className="w-full justify-start">B) Farming</Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={endGame} className="w-full justify-start">C) Trading</Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={endGame} className="w-full justify-start">D) Mining</Button>
            </motion.div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        className="p-4 bg-slate-800 rounded-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <h3 className="text-xl font-bold text-white mb-4">{activeGame.name}</h3>
        <p className="text-gray-300 mb-4">{activeGame.description}</p>
        <Button onClick={endGame} className="w-full">Complete Game</Button>
      </motion.div>
    );
  };

  return (
    <div className="bg-slate-900 p-4 rounded-lg w-full h-full overflow-hidden">
      {/* Breadcrumb Navigation */}
      <div className="mb-3 flex items-center text-sm text-gray-400">
        <span className="hover:text-teal-400 cursor-pointer">World</span>
        <span className="mx-2">›</span>
        <span className="hover:text-teal-400 cursor-pointer">Asia</span>
        <span className="mx-2">›</span>
        <span className="hover:text-teal-400 cursor-pointer">India</span>
        <span className="mx-2">›</span>
        <span className="text-teal-400 font-semibold">Kerala</span>
      </div>

      <div className="flex items-center mb-4">
        <Button variant="ghost" className="mr-2" onClick={() => window.history.back()}>
          <ArrowLeft className="h-5 w-5 text-white" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🌴</span>
            Kerala Explorer
          </h2>
          <p className="text-sm text-gray-400">Interactive Cultural Journey</p>
        </div>

        <div className="ml-auto flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMapScale(prev => Math.max(0.5, prev - 0.1))}
            className="w-8 h-8 p-0 rounded-full"
            title="Zoom Out"
          >
            -
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMapScale(prev => Math.min(2.0, prev + 0.1))}
            className="w-8 h-8 p-0 rounded-full"
            title="Zoom In"
          >
            +
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={centerMapOnPlayer}
            className="text-xs"
            title="Center on Character"
          >
            Center
          </Button>
        </div>
      </div>

      {showInstructions && (
        <motion.div
          className="bg-gradient-to-r from-teal-900/90 to-slate-800/90 backdrop-blur-sm p-5 rounded-lg mb-4 text-white border border-teal-500/30"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <span className="text-2xl">🌴</span>
                Welcome to Kerala - God's Own Country!
              </h3>
              <div className="space-y-2 text-sm text-gray-200">
                <p className="flex items-start gap-2">
                  <span className="text-teal-400">⌨️</span>
                  <span>Use <strong>arrow keys</strong> to move your character around the map</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-orange-400">👥</span>
                  <span>Click on <strong>NPCs</strong> (teal circles) to learn about Kerala's culture and traditions</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-yellow-400">📍</span>
                  <span>Visit <strong>landmarks</strong> (yellow markers) to discover famous Kerala locations</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="text-purple-400">🎮</span>
                  <span>Play <strong>mini-games</strong> to earn XP and learn through interactive experiences</span>
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInstructions(false)}
              className="text-gray-400 hover:text-white ml-4"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {playingGame ? (
          <motion.div
            key="game-mode"
            className="mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {renderMiniGame()}
          </motion.div>
        ) : (
          <motion.div
            key="map-mode"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            <div
              ref={mapContainerRef}
              className="relative bg-green-800 rounded-lg overflow-hidden shadow-xl border border-teal-900/50 h-[60vh]"
              onWheel={handleZoom}
              onMouseDown={handleMapDragStart}
              onMouseMove={handleMapDragMove}
              onMouseUp={handleMapDragEnd}
              onMouseLeave={handleMapDragEnd}
              onTouchStart={handleMapDragStart}
              onTouchMove={handleMapDragMove}
              onTouchEnd={handleMapDragEnd}
            >
              <div
                ref={mapRef}
                className="absolute origin-top-left transition-transform duration-200"
                style={{
                  transform: `scale(${mapScale})`,
                  left: `${mapPosition.x}px`,
                  top: `${mapPosition.y}px`,
                }}
              >
                <div className="relative">
                  <img
                    src="/lovable-uploads/1f104cbb-67b3-4754-a071-d0c178ce0177.png"
                    alt="Kerala Interactive Map"
                    className="w-[1000px] h-[1000px] object-cover pixel-art"
                    style={{ imageRendering: 'pixelated' }}
                  />

                  {/* Path overlay - connecting landmarks with glowing roads */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
                    <defs>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    {/* Main connecting path */}
                    <path
                      d="M 520 420 Q 560 500 600 650 M 600 650 Q 500 600 400 550 M 400 550 Q 600 500 800 450 M 800 450 Q 550 325 300 200 M 300 200 Q 500 200 700 200 M 700 200 Q 650 450 600 700 M 600 700 Q 700 600 800 500 M 800 500 Q 825 625 850 750 M 300 200 Q 225 225 150 250"
                      stroke="rgba(251, 191, 36, 0.3)"
                      strokeWidth="12"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 520 420 Q 560 500 600 650 M 600 650 Q 500 600 400 550 M 400 550 Q 600 500 800 450 M 800 450 Q 550 325 300 200 M 300 200 Q 500 200 700 200 M 700 200 Q 650 450 600 700 M 600 700 Q 700 600 800 500 M 800 500 Q 825 625 850 750 M 300 200 Q 225 225 150 250"
                      stroke="rgba(251, 191, 36, 0.6)"
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#glow)"
                    />
                  </svg>

                  {landmarks.map(landmark => (
                    <motion.div
                      key={`landmark-${landmark.id}`}
                      className="absolute cursor-pointer"
                      style={{
                        left: landmark.x - 12,
                        top: landmark.y - 12,
                        zIndex: 10
                      }}
                      whileHover={{ scale: 1.2 }}
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      onClick={() => navigateToLandmark(landmark)}
                    >
                      <div className="w-[24px] h-[24px] bg-red-500 rounded-full flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-slate-800/90 text-white text-xs py-1 px-2 rounded mb-1">
                        {landmark.name}
                      </div>
                    </motion.div>
                  ))}

                  {miniGames.map(game => (
                    <motion.div
                      key={`game-${game.id}`}
                      className="absolute cursor-pointer"
                      style={{
                        left: game.x - 12,
                        top: game.y - 12,
                        zIndex: 10
                      }}
                      whileHover={{ scale: 1.2 }}
                      animate={{
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      onClick={() => {
                        setPlayerPosition({ x: game.x, y: game.y });
                        setActiveGame(game);
                        setActiveLandmark(null);
                        setActiveNPC(null);
                      }}
                    >
                      <div className="w-[24px] h-[24px] bg-purple-500 rounded-lg flex items-center justify-center">
                        <Gamepad className="w-4 h-4 text-white" />
                      </div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-slate-800/90 text-white text-xs py-1 px-2 rounded mb-1">
                        {game.name}
                      </div>
                    </motion.div>
                  ))}

                  {npcs.map(npc => (
                    <motion.div
                      key={`npc-${npc.id}`}
                      className="absolute cursor-pointer"
                      style={{
                        left: npc.x - 16,
                        top: npc.y - 16,
                        zIndex: 10
                      }}
                      whileHover={{ scale: 1.2 }}
                      animate={{
                        y: [0, -5, 0],
                      }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      onClick={() => {
                        setPlayerPosition({ x: npc.x, y: npc.y + 40 });
                        setActiveNPC(npc);
                        setActiveLandmark(null);
                        setActiveGame(null);
                      }}
                    >
                      <div className="w-[32px] h-[32px] bg-teal-500 rounded-full flex items-center justify-center border-2 border-white">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-slate-800/90 text-white text-xs py-1 px-2 rounded mb-1">
                        {npc.name}
                      </div>
                    </motion.div>
                  ))}

                  <motion.div
                    className="absolute z-20"
                    style={{
                      left: playerPosition.x - CHARACTER_SIZE / 2,
                      top: playerPosition.y - CHARACTER_SIZE / 2,
                      width: CHARACTER_SIZE * 1.5,
                      height: CHARACTER_SIZE * 1.5
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {/* Cute Girl Character */}
                    <motion.div
                      className="relative"
                      animate={{ y: [0, -3, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6 }}
                    >
                      {/* Shadow */}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-black/20 rounded-full blur-sm" />

                      {/* Character Body */}
                      <div className="relative flex flex-col items-center">
                        {/* Head */}
                        <div className="relative">
                          <div className="w-7 h-7 bg-gradient-to-b from-orange-200 to-orange-300 rounded-full border-2 border-orange-400 relative">
                            {/* Eyes */}
                            <div className="absolute top-2 left-1.5 w-1.5 h-1.5 bg-black rounded-full" />
                            <div className="absolute top-2 right-1.5 w-1.5 h-1.5 bg-black rounded-full" />
                            {/* Smile */}
                            <div className="absolute bottom-1.5 left-1/2 transform -translate-x-1/2 w-3 h-1.5 border-b-2 border-black rounded-b-full" />
                          </div>
                          {/* Hair */}
                          <div className="absolute -top-1 left-0 right-0 flex justify-center">
                            <div className="w-8 h-4 bg-gradient-to-b from-purple-900 to-purple-700 rounded-t-full" />
                          </div>
                          {/* Hair bun */}
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-purple-900 rounded-full" />
                        </div>

                        {/* Body */}
                        <div className="w-6 h-8 bg-gradient-to-b from-teal-400 to-teal-500 rounded-lg border-2 border-teal-600 mt-0.5 relative">
                          {/* Traditional Kerala dress pattern */}
                          <div className="absolute bottom-0 left-0 right-0 h-2 bg-yellow-400 opacity-50" />
                        </div>

                        {/* Legs */}
                        <div className="flex gap-1 mt-0.5">
                          <motion.div
                            className="w-2 h-3 bg-orange-300 rounded-sm"
                            animate={{ rotate: [0, 10, 0, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6 }}
                          />
                          <motion.div
                            className="w-2 h-3 bg-orange-300 rounded-sm"
                            animate={{ rotate: [0, -10, 0, 10, 0] }}
                            transition={{ repeat: Infinity, duration: 0.6 }}
                          />
                        </div>
                      </div>

                      {/* Name tag */}
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-teal-600 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
                        Explorer
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>

              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-slate-900/30" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeLandmark && !playingGame && (
          <motion.div
            key={`landmark-${activeLandmark.id}`}
            className="mt-4 bg-slate-800/90 backdrop-blur-sm p-4 rounded-lg text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex flex-col md:flex-row items-start gap-4">
              {activeLandmark.image && (
                <motion.img
                  src={activeLandmark.image}
                  alt={activeLandmark.name}
                  className="w-full md:w-40 h-32 object-cover rounded-lg"
                  initial={{ scale: 0.95, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
              <div>
                <motion.h3
                  className="text-xl font-bold mb-1 flex items-center gap-2"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="text-2xl">{activeLandmark.icon || '📍'}</span>
                  {activeLandmark.name}
                </motion.h3>
                <motion.p
                  className="text-gray-300 mb-3"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {activeLandmark.description}
                </motion.p>
                {activeLandmark.facts && (
                  <motion.div
                    className="bg-slate-700/50 rounded-lg p-3 mt-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <p className="text-teal-400 text-sm font-semibold mb-2">Did you know?</p>
                    <ul className="text-gray-300 text-sm space-y-1">
                      {activeLandmark.facts.map((fact, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-teal-400">•</span>
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeGame && !playingGame && (
          <motion.div
            key={`game-${activeGame.id}`}
            className="mt-4 bg-slate-800/90 backdrop-blur-sm p-4 rounded-lg text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex items-start gap-3">
              <motion.div
                className="bg-purple-500 rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0"
                initial={{ rotate: -10, scale: 0.9 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Gamepad className="h-5 w-5 text-white" />
              </motion.div>
              <div>
                <motion.h3
                  className="text-xl font-bold mb-1"
                  initial={{ y: -5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {activeGame.name}
                </motion.h3>
                <motion.p
                  className="text-gray-300 mb-3"
                  initial={{ y: -5, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {activeGame.description}
                </motion.p>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button onClick={startGame} className="bg-purple-600 hover:bg-purple-700">
                    Start Game
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!playingGame && (
        <motion.div
          className="mt-4 bg-slate-800/80 p-3 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-white text-sm font-semibold mb-2 flex items-center">
            Quick Travel
          </h3>
          <div className="flex flex-wrap gap-2">
            {landmarks.map(landmark => (
              <Button
                key={landmark.id}
                size="sm"
                variant="outline"
                className="text-xs"
                onClick={() => navigateToLandmark(landmark)}
              >
                <MapPin className="h-3 w-3 mr-1" /> {landmark.name}
              </Button>
            ))}
          </div>
        </motion.div>
      )}

      {!playingGame && renderControls()}

      {/* NPC Dialogue */}
      {activeNPC && !playingGame && (
        <NPCDialogue
          npcName={activeNPC.name}
          npcAvatar={activeNPC.avatar}
          dialogue={activeNPC.dialogue}
          location={activeNPC.location}
          culturalNote={activeNPC.culturalNote}
          onClose={() => setActiveNPC(null)}
          onActionButton={activeNPC.gameType ? {
            label: `Play ${miniGames.find(g => g.type === activeNPC.gameType)?.name}`,
            action: () => {
              setActiveNPC(null);
              startGame(activeNPC.gameType!);
            }
          } : undefined}
        />
      )}

      {/* Games */}
      {playingGame && currentGameType === 'boat-race' && (
        <BoatRaceGame
          onClose={() => endGame()}
          onComplete={(xp) => endGame(xp)}
        />
      )}

      {playingGame && currentGameType === 'cuisine-quiz' && (
        <CuisineQuizGame
          onClose={() => endGame()}
          onComplete={(xp) => endGame(xp)}
        />
      )}

      {playingGame && currentGameType === 'spice-match' && (
        <SpiceMatchGame
          onClose={() => endGame()}
          onComplete={(xp) => endGame(xp)}
        />
      )}

      {playingGame && currentGameType === 'kathakali-rhythm' && (
        <KathakaliRhythmGame
          onClose={() => endGame()}
          onComplete={(xp) => endGame(xp)}
        />
      )}

      <style>{`
        .pixel-art {
          image-rendering: pixelated;
          image-rendering: -moz-crisp-edges;
          image-rendering: crisp-edges;
        }
      `}</style>
    </div>
  );
};

export default KeralaItinerary;
