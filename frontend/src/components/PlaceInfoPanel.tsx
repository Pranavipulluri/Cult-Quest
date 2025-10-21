import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { Calendar, Camera, ExternalLink, MapPin, Users, X } from 'lucide-react';
import { useState } from 'react';

interface PlaceInfo {
    id: number;
    name: string;
    description: string;
    history: string;
    established?: string;
    visitors?: string;
    images: string[];
    facts: string[];
    activities: string[];
    bestTime?: string;
}

interface PlaceInfoPanelProps {
    place: PlaceInfo;
    onClose: () => void;
}

const PlaceInfoPanel = ({ place, onClose }: PlaceInfoPanelProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'visit'>('overview');

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % place.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + place.images.length) % place.images.length);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 50 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden border-4 border-teal-400 shadow-2xl"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20" />
                        <div className="relative flex justify-between items-start">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                                    <MapPin className="w-8 h-8" />
                                    {place.name}
                                </h2>
                                <p className="text-teal-100 text-lg">{place.description}</p>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={onClose}
                                className="text-white hover:bg-white/20"
                            >
                                <X className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                        {/* Image Gallery */}
                        <div className="relative h-80 bg-black">
                            <motion.img
                                key={currentImageIndex}
                                src={place.images[currentImageIndex]}
                                alt={place.name}
                                className="w-full h-full object-cover"
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.3 }}
                            />
                            
                            {/* Image Navigation */}
                            {place.images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                                    >
                                        ←
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                                    >
                                        →
                                    </button>
                                    
                                    {/* Image Indicators */}
                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                                        {place.images.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentImageIndex(idx)}
                                                className={`w-3 h-3 rounded-full transition-all ${
                                                    idx === currentImageIndex 
                                                        ? 'bg-teal-400 w-8' 
                                                        : 'bg-white/50 hover:bg-white/80'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                            
                            {/* Photo Credit */}
                            <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                                <Camera className="w-3 h-3" />
                                {currentImageIndex + 1} / {place.images.length}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-4 p-6 bg-slate-800/50">
                            {place.established && (
                                <div className="text-center">
                                    <Calendar className="w-6 h-6 text-teal-400 mx-auto mb-2" />
                                    <div className="text-xs text-gray-400">Established</div>
                                    <div className="text-white font-semibold">{place.established}</div>
                                </div>
                            )}
                            {place.visitors && (
                                <div className="text-center">
                                    <Users className="w-6 h-6 text-teal-400 mx-auto mb-2" />
                                    <div className="text-xs text-gray-400">Annual Visitors</div>
                                    <div className="text-white font-semibold">{place.visitors}</div>
                                </div>
                            )}
                            {place.bestTime && (
                                <div className="text-center">
                                    <MapPin className="w-6 h-6 text-teal-400 mx-auto mb-2" />
                                    <div className="text-xs text-gray-400">Best Time</div>
                                    <div className="text-white font-semibold">{place.bestTime}</div>
                                </div>
                            )}
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-slate-700">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`flex-1 py-3 px-6 font-semibold transition-all ${
                                    activeTab === 'overview'
                                        ? 'text-teal-400 border-b-2 border-teal-400 bg-slate-800/50'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('history')}
                                className={`flex-1 py-3 px-6 font-semibold transition-all ${
                                    activeTab === 'history'
                                        ? 'text-teal-400 border-b-2 border-teal-400 bg-slate-800/50'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                History
                            </button>
                            <button
                                onClick={() => setActiveTab('visit')}
                                className={`flex-1 py-3 px-6 font-semibold transition-all ${
                                    activeTab === 'visit'
                                        ? 'text-teal-400 border-b-2 border-teal-400 bg-slate-800/50'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                Plan Visit
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            <AnimatePresence mode="wait">
                                {activeTab === 'overview' && (
                                    <motion.div
                                        key="overview"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                    >
                                        <h3 className="text-xl font-bold text-white mb-4">Interesting Facts</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                                            {place.facts.map((fact, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className="bg-gradient-to-r from-teal-900/30 to-purple-900/30 p-4 rounded-lg border border-teal-500/30"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="text-2xl">✨</div>
                                                        <p className="text-gray-300 text-sm">{fact}</p>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'history' && (
                                    <motion.div
                                        key="history"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                    >
                                        <h3 className="text-xl font-bold text-white mb-4">Historical Background</h3>
                                        <div className="bg-slate-800/50 p-6 rounded-lg border border-teal-500/30">
                                            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                                                {place.history}
                                            </p>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'visit' && (
                                    <motion.div
                                        key="visit"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                    >
                                        <h3 className="text-xl font-bold text-white mb-4">Things to Do</h3>
                                        <div className="space-y-3">
                                            {place.activities.map((activity, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className="bg-gradient-to-r from-orange-900/30 to-teal-900/30 p-4 rounded-lg border border-orange-500/30 flex items-center gap-3"
                                                >
                                                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                                                        {idx + 1}
                                                    </div>
                                                    <p className="text-gray-300">{activity}</p>
                                                </motion.div>
                                            ))}
                                        </div>

                                        <div className="mt-6 flex gap-3">
                                            <Button className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800">
                                                <MapPin className="w-4 h-4 mr-2" />
                                                Get Directions
                                            </Button>
                                            <Button variant="outline" className="flex-1 border-teal-500 text-teal-400 hover:bg-teal-500/10">
                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                Learn More
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PlaceInfoPanel;
