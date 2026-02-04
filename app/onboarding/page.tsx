
'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom'; // Note: In Next 14 this might be react-dom/client or just useActionState in newer React
import { completeOnboarding } from './actions';
import { SKILLS_LIST } from '@/lib/constants';
import { motion } from 'framer-motion';

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [state, formAction] = useFormState(completeOnboarding, null);

    // Local state for validation/UX before submit
    const [selectedLearn, setSelectedLearn] = useState<string[]>([]);
    const [selectedTeach, setSelectedTeach] = useState<string[]>([]);
    const [showCity, setShowCity] = useState(false);

    // We'll wrap the server action to prevent submit if steps aren't done?
    // Actually, we can just use a hidden form or construct FormData manually, 
    // but standard form submission is easiest to integrate with Server Actions.
    // We'll build a single form that shows different parts.

    const MAX_LEARN_SKILLS = 2;
    const MAX_TEACH_SKILLS = 2;

    const toggleSkill = (type: 'learn' | 'teach', skill: string) => {
        const list = type === 'learn' ? selectedLearn : selectedTeach;
        const setList = type === 'learn' ? setSelectedLearn : setSelectedTeach;

        if (list.includes(skill)) {
            setList(list.filter((s: string) => s !== skill));
        } else {
            const limit = type === 'learn' ? MAX_LEARN_SKILLS : MAX_TEACH_SKILLS;
            if (list.length >= limit) return;
            setList([...list, skill]);
        }
    };


    return (
        <div className="min-h-screen bg-white text-black p-6 flex flex-col max-w-md mx-auto">
            <div className="flex-1 flex flex-col justify-center">

                {/* Progress */}
                <div className="flex gap-2 mb-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-black' : 'bg-gray-200'}`} />
                    ))}
                </div>

                <form action={formAction} className="flex flex-col h-full">
                    {/* Hidden Inputs for final submit */}
                    {selectedLearn.map(s => <input key={'l' + s} type="hidden" name="learnSkills" value={s} />)}
                    {selectedTeach.map(s => <input key={'t' + s} type="hidden" name="teachSkills" value={s} />)}

                    {step === 1 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <h1 className="text-3xl font-bold mb-2 italic tracking-tighter">WHAT DO YOU WANT TO LEARN?</h1>
                            <p className="text-gray-500 mb-6">Pick up to {MAX_LEARN_SKILLS} skills you want to master.</p>

                            <div className="flex flex-wrap gap-2 max-h-[60vh] overflow-y-auto pb-4">
                                {SKILLS_LIST.map(skill => (
                                    <button
                                        key={skill}
                                        type="button"
                                        onClick={() => toggleSkill('learn', skill)}
                                        disabled={!selectedLearn.includes(skill) && selectedLearn.length >= MAX_LEARN_SKILLS}
                                        className={`px-4 py-2 rounded-full border text-sm transition-colors ${selectedLearn.includes(skill)
                                            ? 'bg-black text-white border-black'
                                            : 'bg-white text-black border-gray-300 hover:border-gray-800'
                                            } ${!selectedLearn.includes(skill) && selectedLearn.length >= MAX_LEARN_SKILLS ? 'opacity-20 cursor-not-allowed' : ''}`}
                                    >
                                        {skill}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <h1 className="text-3xl font-bold mb-2 italic tracking-tighter">WHAT CAN YOU TEACH?</h1>
                            <p className="text-gray-500 mb-6">Pick up to {MAX_TEACH_SKILLS} skills you can teach.</p>

                            <div className="flex flex-wrap gap-2 max-h-[60vh] overflow-y-auto pb-4">
                                {SKILLS_LIST.map(skill => (
                                    <button
                                        key={skill}
                                        type="button"
                                        onClick={() => toggleSkill('teach', skill)}
                                        disabled={!selectedTeach.includes(skill) && selectedTeach.length >= MAX_TEACH_SKILLS}
                                        className={`px-4 py-2 rounded-full border text-sm transition-colors ${selectedTeach.includes(skill)
                                            ? 'bg-black text-white border-black'
                                            : 'bg-white text-black border-gray-300 hover-border-gray-800'
                                            } ${!selectedTeach.includes(skill) && selectedTeach.length >= MAX_TEACH_SKILLS ? 'opacity-20 cursor-not-allowed' : ''}`}
                                    >
                                        {skill}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}


                    {step === 3 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <h1 className="text-3xl font-bold mb-2">How do you want to meet?</h1>
                            <p className="text-gray-500 mb-6">Select your preferences.</p>

                            <div className="space-y-4">
                                <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50">
                                    <input type="checkbox" name="preferOnline" className="w-5 h-5 accent-black" />
                                    <span className="font-medium">Online (Video call)</span>
                                </label>

                                <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="checkbox"
                                        name="preferInPerson"
                                        className="w-5 h-5 accent-black"
                                        onChange={(e) => setShowCity(e.target.checked)}
                                    />
                                    <span className="font-medium">In-person</span>
                                </label>

                                {showCity && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
                                        <label className="block text-xs font-semibold uppercase text-gray-400 mb-1 mt-4">Your City</label>
                                        <input
                                            name="city"
                                            required={showCity}
                                            className="w-full p-3 bg-gray-50 rounded-lg border border-transparent focus:border-black outline-none"
                                            placeholder="e.g. New York"
                                        />
                                    </motion.div>
                                )}
                            </div>

                            {state?.error && (
                                <p className="text-red-500 mt-4 text-center">{state.error}</p>
                            )}
                        </motion.div>
                    )}

                    <div className="mt-auto pt-6 flex gap-3">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={() => setStep(s => Math.max(1, s - 1))}
                                className="w-full py-4 border border-black text-black font-bold rounded-xl active:scale-95 transition-transform"
                            >
                                Back
                            </button>
                        )}

                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={() => setStep(s => s + 1)}
                                disabled={(step === 1 && selectedLearn.length < MAX_LEARN_SKILLS) || (step === 2 && selectedTeach.length < MAX_TEACH_SKILLS)}
                                className="w-full py-4 bg-black text-white font-bold rounded-xl active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100"
                            >
                                Next
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="w-full py-4 bg-black text-white font-bold rounded-xl active:scale-95 transition-transform"
                            >
                                Finish
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
