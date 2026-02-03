
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getSession } from '@/lib/auth';
import { Block, Report } from '@/models/Safety';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import Link from 'next/link';
import ChatBox from '@/components/ChatBox';
import { MessageSquare, ShieldAlert, MapPin, Globe, Users } from 'lucide-react';



async function blockUser(formData: FormData) {
    'use server';
    const session = await getSession();
    if (!session) return;
    const targetId = formData.get('targetId') as string;
    await connectDB();
    await Block.create({ blockerId: session.userId, blockedId: targetId });
    redirect('/swipe');
}

async function reportUser(formData: FormData) {
    'use server';
    const session = await getSession();
    if (!session) return;
    const targetId = formData.get('targetId') as string;
    const reason = formData.get('reason') as string;
    await connectDB();
    await Report.create({ reporterId: session.userId, reportedId: targetId, reason });
    // Also block? Usually yes but separate action for MVP simplicity or implicit
    await Block.create({ blockerId: session.userId, blockedId: targetId });
    redirect('/swipe');
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
    await connectDB();
    const session = await getSession();
    if (!session) return <div>Login required</div>;

    const { id } = await params;
    const user = await User.findById(id);

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-2xl font-bold mb-2">User not found</h1>
                <p className="text-gray-500 mb-6">The profile you are looking for does not exist or has been removed.</p>
                <Link href="/swipe" className="px-6 py-2 bg-black text-white rounded-full font-bold">Return to Feed</Link>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-white p-6 md:p-12 pb-24">
            <header className="mb-12">
                <div className="flex items-center gap-6 mb-4">
                    {user.imageUrl ? (
                        <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-gray-100 shadow-sm shrink-0">
                            <img src={user.imageUrl} alt={user.name} className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-24 h-24 rounded-3xl bg-gray-50 flex items-center justify-center border-2 border-gray-100 shrink-0">
                            <Users size={40} className="text-gray-300" />
                        </div>
                    )}
                    <div>
                        <h1 className="text-5xl font-black italic tracking-tighter mb-2">{user.name}</h1>
                        <div className="flex flex-wrap gap-4 items-center text-gray-400 font-medium text-sm">
                            {user.city && (
                                <div className="flex items-center gap-1.5">
                                    <MapPin size={16} />
                                    {user.city}
                                </div>
                            )}
                            {user.preferOnline && (
                                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-50 rounded-lg text-xs uppercase tracking-wider font-bold text-gray-500 border border-gray-100">
                                    <Globe size={14} />
                                    Online
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>


            <div className="grid md:grid-cols-2 gap-12">
                <div>
                    <div className="mb-12">
                        <h2 className="font-bold uppercase text-xs tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                            <Users size={14} />
                            Skills & Expertise
                        </h2>

                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-gray-800 mb-3">Teaches</h3>
                            <div className="flex flex-wrap gap-2">
                                {user.teachSkills.map((s: string) => (
                                    <span key={s} className="px-4 py-2 bg-black text-white rounded-xl text-sm font-medium shadow-sm">{s}</span>
                                ))}
                            </div>
                        </div>

                        <div className="mb-12">
                            <h3 className="text-sm font-bold text-gray-800 mb-3">Wants to Learn</h3>
                            <div className="flex flex-wrap gap-2">
                                {user.learnSkills.map((s: string) => (
                                    <span key={s} className="px-4 py-2 bg-gray-100 text-black rounded-xl text-sm font-medium border border-gray-100">{s}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="border-t pt-12 space-y-4">
                        <h2 className="font-bold uppercase text-xs tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                            <ShieldAlert size={14} />
                            Safety & Controls
                        </h2>

                        <form action={blockUser}>
                            <input type="hidden" name="targetId" value={user._id.toString()} />
                            <button className="w-full py-4 border border-gray-200 rounded-2xl font-bold text-sm hover:bg-red-50 hover:border-red-100 hover:text-red-500 transition-all duration-300">
                                Block {user.name}
                            </button>
                        </form>

                        <details className="w-full group">
                            <summary className="w-full py-4 text-center text-gray-400 font-bold text-sm cursor-pointer list-none group-open:text-red-500 transition-colors">Report User</summary>
                            <form action={reportUser} className="mt-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 italic transition-all">
                                <input type="hidden" name="targetId" value={user._id.toString()} />
                                <p className="mb-4 font-bold text-sm not-italic text-gray-800">Reason for reporting</p>
                                <div className="space-y-3 mb-6 not-italic">
                                    {['spam', 'rude', 'fake', 'other'].map(r => (
                                        <label key={r} className="flex items-center gap-3 cursor-pointer group/label">
                                            <input type="radio" name="reason" value={r} required className="w-4 h-4 accent-black" />
                                            <span className="capitalize text-sm group-hover/label:text-black transition-colors">{r}</span>
                                        </label>
                                    ))}
                                </div>
                                <button className="w-full py-3 bg-red-500 text-white rounded-xl font-bold text-sm shadow-md hover:bg-red-600 active:scale-95 transition-all">Send Report</button>
                            </form>
                        </details>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="font-bold uppercase text-xs tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                        <MessageSquare size={14} />
                        Conversation
                    </h2>
                    <ChatBox receiverId={user._id.toString()} currentUserId={session.userId} />
                </div>
            </div>
        </div>
    );
}

