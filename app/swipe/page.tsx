
'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { saveSwipe } from './actions';
import { X, Heart, MapPin } from 'lucide-react';

interface Candidate {
    _id: string;
    name: string;
    city?: string;
    teachSkills: string[];
    learnSkills: string[];
    imageUrl?: string;
}


export default function SwipePage() {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCandidates();
    }, []);

    async function fetchCandidates() {
        try {
            const res = await fetch('/api/swipe/candidates');
            const data = await res.json();
            if (data.candidates) {
                setCandidates(prev => [...prev, ...data.candidates]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const handleSwipe = async (direction: 'left' | 'right') => {
        if (candidates.length === 0) return;
        const current = candidates[0];

        // Optimistic UI update
        setCandidates(prev => prev.slice(1));

        await saveSwipe(current._id, direction === 'right' ? 'like' : 'skip');

        if (candidates.length < 3) {
            fetchCandidates();
        }
    };

    if (loading && candidates.length === 0) {
        return <div className="min-h-screen flex items-center justify-center">Loading profiles...</div>;
    }

    if (candidates.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-xl font-bold mb-2">No new people now.</h2>
                <p className="text-gray-500">Come back later.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 overflow-hidden flex flex-col items-center justify-center p-4">
            <div className="relative w-full max-w-sm aspect-[3/4]">
                <AnimatePresence>
                    {candidates.slice(0, 2).map((candidate, index) => {
                        const isFront = index === 0;
                        return (
                            <Card
                                key={candidate._id}
                                candidate={candidate}
                                isFront={isFront}
                                onSwipe={handleSwipe}
                            />
                        );
                    }).reverse()}
                    {/* Reverse so first in array is on top (last in DOM) */}
                </AnimatePresence>
            </div>

            <div className="flex gap-6 mt-8 z-10">
                <button
                    onClick={() => handleSwipe('left')}
                    className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:scale-110 transition-all border border-gray-100"
                >
                    <X size={28} strokeWidth={2.5} />
                </button>
                <button
                    onClick={() => handleSwipe('right')}
                    className="w-16 h-16 bg-black rounded-full shadow-lg flex items-center justify-center text-white hover:bg-gray-900 hover:scale-110 transition-all"
                >
                    <Heart size={28} strokeWidth={2.5} fill="white" />
                </button>
            </div>
        </div>
    );
}

function Card({ candidate, isFront, onSwipe }: { candidate: Candidate, isFront: boolean, onSwipe: (dir: 'left' | 'right') => void }) {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-10, 10]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
    // Stamp opacity and scale logic
    const likeOpacity = useTransform(x, [50, 150], [0, 1]);
    const nopeOpacity = useTransform(x, [-50, -150], [0, 1]);
    const stampScale = useTransform(x, [-150, 0, 150], [1.1, 1, 1.1]);

    const handleDragEnd = (e: any, info: any) => {

        if (!isFront) return;
        const offset = info.offset.x;
        const velocity = info.velocity.x;

        if (offset > 100 || velocity > 800) {
            onSwipe('right');
        } else if (offset < -100 || velocity < -800) {
            onSwipe('left');
        }
    };

    return (
        <motion.div
            style={{
                x: isFront ? x : 0,
                rotate: isFront ? rotate : 0,
                opacity: isFront ? 1 : 0.8,
                scale: isFront ? 1 : 0.95,
                zIndex: isFront ? 10 : 0
            }}
            drag={isFront ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: isFront ? 1 : 0.95, opacity: 1 }}
            exit={{ x: x.get() < 0 ? -300 : 300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-white rounded-3xl shadow-xl border border-gray-100 p-6 flex flex-col select-none cursor-grab active:cursor-grabbing"
        >
            {/* Action Stamps */}
            {isFront && (
                <>
                    <motion.div
                        style={{ opacity: likeOpacity, scale: stampScale }}
                        className="absolute top-10 left-6 z-20 border-4 border-green-500 text-green-500 font-black text-4xl px-4 py-1 rounded-xl -rotate-12 pointer-events-none tracking-widest italic"
                    >
                        LIKE
                    </motion.div>
                    <motion.div
                        style={{ opacity: nopeOpacity, scale: stampScale }}
                        className="absolute top-10 right-6 z-20 border-4 border-red-500 text-red-500 font-black text-4xl px-4 py-1 rounded-xl rotate-12 pointer-events-none tracking-widest italic"
                    >
                        NOPE
                    </motion.div>
                </>
            )}

            <div className="flex-1">

                <div className="flex justify-between items-start mb-2 gap-4">
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold tracking-tight">{candidate.name}</h2>
                        {candidate.city && (
                            <div className="flex items-center text-gray-400">
                                <MapPin size={16} className="mr-1" />
                                <span className="text-sm font-medium">{candidate.city}</span>
                            </div>
                        )}
                    </div>
                    {candidate.imageUrl && (
                        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-100 shrink-0">
                            <img src={candidate.imageUrl} alt={candidate.name} className="w-full h-full object-cover" />
                        </div>
                    )}
                </div>


                <div className="mb-6">
                    <h3 className="text-xs font-bold uppercase text-gray-400 mb-2">Teaches</h3>
                    <div className="flex flex-wrap gap-2">
                        {candidate.teachSkills.map(s => (
                            <span key={s} className="px-3 py-1 bg-black text-white text-sm font-medium rounded-lg">
                                {s}
                            </span>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-xs font-bold uppercase text-gray-400 mb-2">I Learn</h3>
                    <div className="flex flex-wrap gap-2">
                        {candidate.learnSkills?.map(s => (
                            <span key={s} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg">
                                {s}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <div className="text-sm text-gray-400 mt-4 border-t pt-4">
                Swipe right if you want to learn {candidate.teachSkills[0]} from {candidate.name}.
            </div>
        </motion.div>
    );
}
