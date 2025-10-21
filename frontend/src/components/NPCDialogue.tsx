import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';

interface NPCDialogueProps {
    npcName: string;
    npcAvatar: string;
    dialogue: string[];
    onClose: () => void;
    onActionButton?: {
        label: string;
        action: () => void;
    };
    location?: string;
    culturalNote?: string;
}

const NPCDialogue = ({ npcName, npcAvatar, dialogue, onClose, onActionButton, location, culturalNote }: NPCDialogueProps) => {
    const [currentDialogue, setCurrentDialogue] = useState(0);

    const nextDialogue = () => {
        if (currentDialogue < dialogue.length - 1) {
            setCurrentDialogue(currentDialogue + 1);
        } else {
            onClose();
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-40 flex items-end justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-slate-900 border-2 border-teal-500 rounded-lg p-6 max-w-2xl w-full mb-4"
                >
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-teal-400">
                                <img src={npcAvatar} alt={npcName} className="w-full h-full object-cover" />
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="text-xl font-bold text-teal-400">{npcName}</h3>
                                    {location && (
                                        <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                                            <span>📍</span> {location}
                                        </p>
                                    )}
                                </div>
                                <Button variant="ghost" size="sm" onClick={onClose}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            <motion.div
                                key={currentDialogue}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-slate-800 p-4 rounded-lg mb-4"
                            >
                                <p className="text-white leading-relaxed">{dialogue[currentDialogue]}</p>
                            </motion.div>

                            {culturalNote && currentDialogue === dialogue.length - 1 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-gradient-to-r from-orange-900/30 to-teal-900/30 border border-teal-500/30 p-3 rounded-lg mb-4"
                                >
                                    <p className="text-teal-300 text-sm font-semibold mb-1">💡 Cultural Insight</p>
                                    <p className="text-gray-300 text-sm">{culturalNote}</p>
                                </motion.div>
                            )}

                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">
                                    {currentDialogue + 1} / {dialogue.length}
                                </span>

                                <div className="flex gap-2">
                                    {currentDialogue === dialogue.length - 1 && onActionButton && (
                                        <Button
                                            onClick={onActionButton.action}
                                            className="bg-orange-600 hover:bg-orange-700"
                                        >
                                            {onActionButton.label}
                                        </Button>
                                    )}
                                    <Button onClick={nextDialogue} className="bg-teal-600 hover:bg-teal-700">
                                        {currentDialogue < dialogue.length - 1 ? 'Next' : 'Close'}
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

export default NPCDialogue;
