import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import { useState } from 'react';

interface AnimatedNPCDialogueProps {
    npcName: string;
    npcType: 'boatman' | 'chef' | 'merchant' | 'dancer';
    dialogue: string[];
    onClose: () => void;
    onActionButton?: {
        label: string;
        action: () => void;
    };
    location?: string;
    culturalNote?: string;
}

const AnimatedNPCDialogue = ({ 
    npcName, 
    npcType, 
    dialogue, 
    onClose, 
    onActionButton, 
    location, 
    culturalNote 
}: AnimatedNPCDialogueProps) => {
    const [currentDialogue, setCurrentDialogue] = useState(0);
    const [showCharacter, setShowCharacter] = useState(true);

    const nextDialogue = () => {
        if (currentDialogue < dialogue.length - 1) {
            setCurrentDialogue(currentDialogue + 1);
        } else {
            onClose();
        }
    };

    // Character animations based on type
    const getCharacterAnimation = () => {
        switch (npcType) {
            case 'boatman':
                return (
                    <motion.div
                        className="relative w-32 h-40"
                        animate={{
                            y: [0, -10, 0],
                            rotate: [0, 2, 0, -2, 0]
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 3,
                            ease: "easeInOut"
                        }}
                    >
                        {/* Boatman character */}
                        <div className="relative">
                            {/* Head */}
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-b from-orange-300 to-orange-400 rounded-full border-4 border-white shadow-lg">
                                {/* Eyes */}
                                <div className="absolute top-5 left-3 w-2 h-2 bg-black rounded-full" />
                                <div className="absolute top-5 right-3 w-2 h-2 bg-black rounded-full" />
                                {/* Smile */}
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-6 h-3 border-b-2 border-black rounded-b-full" />
                                {/* Mustache */}
                                <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-black rounded-full" />
                            </div>
                            {/* Turban */}
                            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-20 h-8 bg-gradient-to-r from-red-600 to-orange-600 rounded-t-full border-4 border-white" />
                            {/* Body */}
                            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-20 h-24 bg-gradient-to-b from-blue-600 to-blue-700 rounded-lg border-4 border-white">
                                {/* Buttons */}
                                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-400 rounded-full" />
                                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-400 rounded-full" />
                            </div>
                            {/* Arms with rowing motion */}
                            <motion.div
                                className="absolute top-20 -left-4 w-6 h-16 bg-blue-600 rounded-full origin-top"
                                animate={{ rotate: [0, -30, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            />
                            <motion.div
                                className="absolute top-20 -right-4 w-6 h-16 bg-blue-600 rounded-full origin-top"
                                animate={{ rotate: [0, 30, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            />
                            {/* Oar */}
                            <motion.div
                                className="absolute top-24 left-1/2 w-2 h-32 bg-amber-700 rounded"
                                animate={{ rotate: [0, -20, 0, 20, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            />
                        </div>
                    </motion.div>
                );
            
            case 'chef':
                return (
                    <motion.div
                        className="relative w-32 h-40"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        {/* Chef character */}
                        <div className="relative">
                            {/* Chef hat */}
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-20 h-12 bg-white rounded-t-full border-4 border-gray-200" />
                            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-white border-4 border-gray-200" />
                            {/* Head */}
                            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-b from-orange-200 to-orange-300 rounded-full border-4 border-white shadow-lg">
                                <div className="absolute top-5 left-3 w-2 h-2 bg-black rounded-full" />
                                <div className="absolute top-5 right-3 w-2 h-2 bg-black rounded-full" />
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-6 h-3 border-b-2 border-black rounded-b-full" />
                            </div>
                            {/* Body - saree */}
                            <div className="absolute top-26 left-1/2 transform -translate-x-1/2 w-24 h-28 bg-gradient-to-b from-pink-500 to-pink-600 rounded-lg border-4 border-white">
                                <div className="absolute bottom-0 left-0 right-0 h-8 bg-yellow-400 opacity-70" />
                            </div>
                            {/* Cooking spoon */}
                            <motion.div
                                className="absolute top-28 -right-6 w-3 h-20 bg-amber-700 rounded"
                                animate={{ rotate: [0, -20, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                            >
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gray-400 rounded-full border-2 border-gray-600" />
                            </motion.div>
                            {/* Steam effect */}
                            <motion.div
                                className="absolute top-20 left-1/2 transform -translate-x-1/2"
                                animate={{ y: [0, -20], opacity: [0.6, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            >
                                <div className="text-2xl">💨</div>
                            </motion.div>
                        </div>
                    </motion.div>
                );
            
            case 'merchant':
                return (
                    <motion.div
                        className="relative w-32 h-40"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        {/* Merchant character */}
                        <div className="relative">
                            {/* Turban */}
                            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-20 h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-t-full border-4 border-white" />
                            {/* Head */}
                            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-b from-orange-300 to-orange-400 rounded-full border-4 border-white shadow-lg">
                                <div className="absolute top-5 left-3 w-2 h-2 bg-black rounded-full" />
                                <div className="absolute top-5 right-3 w-2 h-2 bg-black rounded-full" />
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-6 h-3 border-b-2 border-black rounded-b-full" />
                                {/* Beard */}
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-6 bg-black rounded-b-full" />
                            </div>
                            {/* Body - traditional vest */}
                            <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-22 h-24 bg-gradient-to-b from-orange-600 to-orange-700 rounded-lg border-4 border-white">
                                <div className="absolute inset-2 border-2 border-yellow-400 rounded" />
                            </div>
                            {/* Spice bag */}
                            <motion.div
                                className="absolute top-28 -right-8 w-12 h-16 bg-amber-800 rounded-lg border-2 border-amber-900"
                                animate={{ rotate: [0, 5, 0, -5, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            >
                                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs">🌿</div>
                            </motion.div>
                            {/* Sparkles */}
                            <motion.div
                                className="absolute top-16 -left-4"
                                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 3 }}
                            >
                                <Sparkles className="w-6 h-6 text-yellow-400" />
                            </motion.div>
                        </div>
                    </motion.div>
                );
            
            case 'dancer':
                return (
                    <motion.div
                        className="relative w-32 h-40"
                        animate={{
                            rotate: [0, -5, 5, 0],
                            y: [0, -10, 0]
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 2,
                            ease: "easeInOut"
                        }}
                    >
                        {/* Dancer character */}
                        <div className="relative">
                            {/* Crown/headpiece */}
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-24 h-12 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-t-full border-4 border-white">
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full" />
                            </div>
                            {/* Head with makeup */}
                            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-b from-green-300 to-green-400 rounded-full border-4 border-white shadow-lg">
                                <div className="absolute top-4 left-2 w-3 h-3 bg-black rounded-full" />
                                <div className="absolute top-4 right-2 w-3 h-3 bg-black rounded-full" />
                                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-8 h-4 border-b-3 border-red-600 rounded-b-full" />
                                {/* Face paint */}
                                <div className="absolute top-2 left-0 w-2 h-8 bg-red-600" />
                                <div className="absolute top-2 right-0 w-2 h-8 bg-red-600" />
                            </div>
                            {/* Body - traditional costume */}
                            <div className="absolute top-22 left-1/2 transform -translate-x-1/2 w-28 h-28 bg-gradient-to-b from-purple-600 to-purple-700 rounded-lg border-4 border-white">
                                <div className="absolute inset-2 border-4 border-yellow-400 rounded" />
                                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-b from-transparent to-red-600" />
                            </div>
                            {/* Arms in dance pose */}
                            <motion.div
                                className="absolute top-24 -left-8 w-6 h-20 bg-green-400 rounded-full origin-top"
                                animate={{ rotate: [-30, -60, -30] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            />
                            <motion.div
                                className="absolute top-24 -right-8 w-6 h-20 bg-green-400 rounded-full origin-top"
                                animate={{ rotate: [30, 60, 30] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            />
                            {/* Musical notes */}
                            <motion.div
                                className="absolute -top-2 -right-8 text-2xl"
                                animate={{ y: [0, -20], opacity: [1, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                            >
                                🎵
                            </motion.div>
                        </div>
                    </motion.div>
                );
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, y: 50 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 max-w-4xl w-full border-4 border-teal-400 shadow-2xl"
                >
                    <div className="flex gap-6">
                        {/* Animated Character */}
                        <div className="flex-shrink-0">
                            <div className="bg-gradient-to-b from-teal-500/20 to-purple-500/20 rounded-xl p-4 border-2 border-teal-400/50">
                                {getCharacterAnimation()}
                            </div>
                            {location && (
                                <div className="mt-3 text-center">
                                    <div className="text-xs text-gray-400">📍 Location</div>
                                    <div className="text-sm text-teal-400 font-semibold">{location}</div>
                                </div>
                            )}
                        </div>

                        {/* Dialogue Content */}
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-400">
                                        {npcName}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                        <span className="text-xs text-gray-400">Speaking...</span>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
                                    <X className="h-5 w-5" />
                                </Button>
                            </div>

                            {/* Dialogue Box */}
                            <motion.div
                                key={currentDialogue}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-gradient-to-r from-slate-800 to-slate-700 p-5 rounded-xl mb-4 border-2 border-teal-500/30 shadow-lg"
                            >
                                <p className="text-white leading-relaxed text-lg">{dialogue[currentDialogue]}</p>
                                
                                {/* Typing indicator */}
                                <motion.div
                                    className="flex gap-1 mt-3"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <motion.div
                                        className="w-2 h-2 bg-teal-400 rounded-full"
                                        animate={{ scale: [1, 1.5, 1] }}
                                        transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                                    />
                                    <motion.div
                                        className="w-2 h-2 bg-teal-400 rounded-full"
                                        animate={{ scale: [1, 1.5, 1] }}
                                        transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                                    />
                                    <motion.div
                                        className="w-2 h-2 bg-teal-400 rounded-full"
                                        animate={{ scale: [1, 1.5, 1] }}
                                        transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                                    />
                                </motion.div>
                            </motion.div>

                            {/* Cultural Note */}
                            {culturalNote && currentDialogue === dialogue.length - 1 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-gradient-to-r from-orange-900/40 to-teal-900/40 border-2 border-teal-400/50 p-4 rounded-xl mb-4"
                                >
                                    <div className="flex items-start gap-2">
                                        <Sparkles className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-teal-300 text-sm font-semibold mb-1">💡 Cultural Insight</p>
                                            <p className="text-gray-300 text-sm">{culturalNote}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Controls */}
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400 text-sm">
                                        {currentDialogue + 1} / {dialogue.length}
                                    </span>
                                    <div className="flex gap-1">
                                        {Array.from({ length: dialogue.length }).map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`w-2 h-2 rounded-full ${
                                                    idx === currentDialogue ? 'bg-teal-400' : 'bg-gray-600'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {currentDialogue === dialogue.length - 1 && onActionButton && (
                                        <Button
                                            onClick={onActionButton.action}
                                            className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold"
                                        >
                                            <Gamepad className="w-4 h-4 mr-2" />
                                            {onActionButton.label}
                                        </Button>
                                    )}
                                    <Button 
                                        onClick={nextDialogue} 
                                        className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold"
                                    >
                                        {currentDialogue < dialogue.length - 1 ? 'Next →' : 'Close'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AnimatedNPCDialogue;
