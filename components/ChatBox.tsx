
'use client';

import { useState, useEffect, useRef } from 'react';
import { sendMessage, getMessages } from '@/app/profile/[id]/chatActions';
import { Send, Hash } from 'lucide-react';

interface Message {
    _id: string;
    senderId: string;
    receiverId: string;
    content: string;
    createdAt: string;
}

export default function ChatBox({ receiverId, currentUserId }: { receiverId: string, currentUserId: string }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000); // Poll every 3s for MVP
        return () => clearInterval(interval);
    }, [receiverId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    async function fetchMessages() {
        const res = await getMessages(receiverId);
        if (res.success) {
            setMessages(res.messages);
        }
        setLoading(false);
    }

    async function handleSend(e: React.FormEvent) {
        e.preventDefault();
        if (!input.trim()) return;

        const content = input;
        setInput('');

        const res = await sendMessage(receiverId, content);
        if (res.success) {
            setMessages(prev => [...prev, res.message]);
        }
    }

    return (
        <div className="flex flex-col h-[500px] border rounded-3xl overflow-hidden bg-gray-50 shadow-sm">
            <div className="p-4 border-b bg-white flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Direct Message</span>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
            >
                {loading && messages.length === 0 ? (
                    <div className="text-center text-gray-400 text-sm mt-4">Loading conversation...</div>
                ) : messages.length === 0 ? (
                    <div className="text-center text-gray-400 text-sm mt-4 italic">Start the conversation with a friendly hello!</div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.senderId === currentUserId;
                        return (
                            <div
                                key={msg._id}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${isMe
                                            ? 'bg-black text-white rounded-br-none'
                                            : 'bg-white text-black border border-gray-100 rounded-bl-none shadow-sm'
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <form onSubmit={handleSend} className="p-4 bg-white border-t flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-50 border-none rounded-2xl px-4 py-2 text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                />
                <button
                    type="submit"
                    disabled={!input.trim()}
                    className="p-2 bg-black text-white rounded-2xl disabled:opacity-50 hover:scale-105 active:scale-95 transition-all shadow-md"
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
}
