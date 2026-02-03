
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const json = await res.json();

            if (!res.ok) {
                throw new Error(json.error || 'Something went wrong');
            }

            // Redirect
            if (isLogin) {
                router.push('/swipe');
            } else {
                router.push('/onboarding');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 max-w-md mx-auto">
            <h1 className="text-4xl font-bold mb-2 tracking-tight">SkillLink</h1>
            <p className="text-gray-500 mb-8">Learn skills by swapping skills.</p>

            <div className="w-full bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex mb-6 border-b border-gray-100 pb-2">
                    <button
                        onClick={() => { setIsLogin(true); setError(''); }}
                        className={`flex-1 pb-2 text-sm font-medium ${isLogin ? 'text-black border-b-2 border-black' : 'text-gray-400'}`}
                    >
                        Log in
                    </button>
                    <button
                        onClick={() => { setIsLogin(false); setError(''); }}
                        className={`flex-1 pb-2 text-sm font-medium ${!isLogin ? 'text-black border-b-2 border-black' : 'text-gray-400'}`}
                    >
                        Sign up
                    </button>
                </div>

                <AnimatePresence mode='wait'>
                    <motion.form
                        key={isLogin ? 'login' : 'signup'}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        onSubmit={handleSubmit}
                        className="space-y-4"
                    >
                        {!isLogin && (
                            <div>
                                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Name</label>
                                <input name="name" required className="w-full p-3 bg-gray-50 rounded-lg border border-transparent focus:border-black focus:bg-white transition-colors outline-none" placeholder="Your name" />
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Email</label>
                            <input name="email" type="email" required className="w-full p-3 bg-gray-50 rounded-lg border border-transparent focus:border-black focus:bg-white transition-colors outline-none" placeholder="hello@example.com" />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Password</label>
                            <input name="password" type="password" required minLength={6} className="w-full p-3 bg-gray-50 rounded-lg border border-transparent focus:border-black focus:bg-white transition-colors outline-none" placeholder="••••••" />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <button
                            disabled={loading}
                            className="w-full py-4 bg-black text-white font-bold rounded-xl active:scale-95 transition-transform disabled:opacity-50"
                        >
                            {loading ? 'Please wait...' : (isLogin ? 'Continue' : 'Create Account')}
                        </button>
                    </motion.form>
                </AnimatePresence>
            </div>
        </div>
    );
}
