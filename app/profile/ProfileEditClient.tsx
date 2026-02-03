
'use client';

import { useState } from 'react';
import { updateProfile } from './actions';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, Save, MapPin, Globe } from 'lucide-react';

interface ProfileEditClientProps {
    initialUser: any;
    skillsList: string[];
}

export default function ProfileEditClient({ initialUser, skillsList }: ProfileEditClientProps) {
    const [selectedLearn, setSelectedLearn] = useState<string[]>(initialUser.learnSkills || []);
    const [selectedTeach, setSelectedTeach] = useState<string[]>(initialUser.teachSkills || []);
    const [city, setCity] = useState(initialUser.city || '');
    const [preferOnline, setPreferOnline] = useState(initialUser.preferOnline || false);
    const [preferInPerson, setPreferInPerson] = useState(initialUser.preferInPerson || false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const totalSelected = selectedLearn.length + selectedTeach.length;
    const MAX_TOTAL_SKILLS = 4;

    const toggleSkill = (type: 'learn' | 'teach', skill: string) => {
        const list = type === 'learn' ? selectedLearn : selectedTeach;
        const setList = type === 'learn' ? setSelectedLearn : setSelectedTeach;

        if (list.includes(skill)) {
            setList(list.filter(s => s !== skill));
        } else {
            if (totalSelected >= MAX_TOTAL_SKILLS) {
                setMessage({ type: 'error', text: `You can only choose a total of ${MAX_TOTAL_SKILLS} skills.` });
                setTimeout(() => setMessage(null), 3000);
                return;
            }
            setList([...list, skill]);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage(null);

        const formData = new FormData();
        selectedLearn.forEach(s => formData.append('learnSkills', s));
        selectedTeach.forEach(s => formData.append('teachSkills', s));
        formData.append('city', city);
        formData.append('preferOnline', preferOnline ? 'on' : 'off');
        formData.append('preferInPerson', preferInPerson ? 'on' : 'off');

        const result = await updateProfile(formData);

        if (result?.error) {
            setMessage({ type: 'error', text: result.error });
        } else {
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        }
        setIsSaving(false);
        setTimeout(() => setMessage(null), 3000);
    };

    return (
        <div className="space-y-12 pb-24">
            {/* Limit Banner */}
            <div className={`p-4 rounded-2xl flex items-center gap-3 border transition-colors ${totalSelected === MAX_TOTAL_SKILLS ? 'bg-black text-white border-black' : 'bg-gray-50 border-gray-100'}`}>
                <AlertCircle size={20} />
                <p className="font-medium">
                    Skills: {totalSelected} / {MAX_TOTAL_SKILLS} total
                </p>
            </div>

            {/* Teaching Section */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">What I Teach</h2>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{selectedTeach.length} selected</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {skillsList.map(skill => (
                        <button
                            key={`teach-${skill}`}
                            onClick={() => toggleSkill('teach', skill)}
                            disabled={!selectedTeach.includes(skill) && totalSelected >= MAX_TOTAL_SKILLS}
                            className={`px-4 py-2 rounded-xl border text-sm transition-all duration-200 ${selectedTeach.includes(skill)
                                    ? 'bg-black text-white border-black'
                                    : 'bg-white text-black border-gray-200 hover:border-black disabled:opacity-30 disabled:border-gray-100 disabled:hover:border-gray-100'
                                }`}
                        >
                            {skill}
                        </button>
                    ))}
                </div>
            </section>

            {/* Learning Section */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">What I Learn</h2>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{selectedLearn.length} selected</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {skillsList.map(skill => (
                        <button
                            key={`learn-${skill}`}
                            onClick={() => toggleSkill('learn', skill)}
                            disabled={!selectedLearn.includes(skill) && totalSelected >= MAX_TOTAL_SKILLS}
                            className={`px-4 py-2 rounded-xl border text-sm transition-all duration-200 ${selectedLearn.includes(skill)
                                    ? 'bg-black text-white border-black'
                                    : 'bg-white text-black border-gray-200 hover:border-black disabled:opacity-30 disabled:border-gray-100 disabled:hover:border-gray-100'
                                }`}
                        >
                            {skill}
                        </button>
                    ))}
                </div>
            </section>

            {/* Preferences */}
            <section className="space-y-6 pt-6 border-t">
                <h2 className="text-xl font-bold">Preferences</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={() => setPreferOnline(!preferOnline)}
                        className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${preferOnline ? 'bg-black text-white border-black' : 'bg-white border-gray-100 hover:border-black'}`}
                    >
                        <Globe size={20} />
                        <span className="font-bold">Online Meetings</span>
                    </button>

                    <button
                        onClick={() => setPreferInPerson(!preferInPerson)}
                        className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${preferInPerson ? 'bg-black text-white border-black' : 'bg-white border-gray-100 hover:border-black'}`}
                    >
                        <MapPin size={20} />
                        <span className="font-bold">In-Person</span>
                    </button>
                </div>

                <AnimatePresence>
                    {preferInPerson && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <label className="block text-xs font-black uppercase text-gray-400 mb-2">My City</label>
                            <input
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:border-black outline-none transition-all font-medium"
                                placeholder="e.g. London"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* Save Button */}
            <div className="fixed bottom-0 left-20 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pointer-events-none">
                <div className="max-w-2xl mx-auto flex flex-col items-center pointer-events-auto">
                    <AnimatePresence>
                        {message && (
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 20, opacity: 0 }}
                                className={`mb-4 px-6 py-3 rounded-full text-white font-bold text-sm shadow-xl ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
                            >
                                {message.text}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full py-4 bg-black text-white rounded-2xl font-black italic tracking-widest text-lg shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {isSaving ? 'SAVING...' : (
                            <>
                                <Save size={20} />
                                SAVE CHANGES
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
