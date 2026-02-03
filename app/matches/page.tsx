
import connectDB from '@/lib/db';
import User from '@/models/User';
import Swipe from '@/models/Swipe';
import { getSession } from '@/lib/auth';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function MatchesPage() {
    await connectDB();
    const session = await getSession();
    if (!session) return <div>Please log in</div>;

    const currentUser = await User.findById(session.userId);
    if (!currentUser) return <div>User not found</div>;

    // Find users I liked
    const likes = await Swipe.find({ swiperId: session.userId, action: 'like' }).populate('targetId');

    return (
        <div className="min-h-screen bg-white p-6 pb-24">
            <h1 className="text-3xl font-bold mb-6">My matches</h1>

            {likes.length === 0 ? (
                <div className="text-gray-500 text-center mt-20">
                    No matches yet.
                    <br />
                    <Link href="/swipe" className="text-black underline mt-2 block">Go swipe</Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {likes.map((swipe: any) => {
                        const user = swipe.targetId;
                        if (!user) return null; // Deleted user

                        // Find matched skill: Their teach skills overlapping my learn skills
                        const matchedSkills = user.teachSkills.filter((s: string) => currentUser.learnSkills.includes(s));

                        return (
                            <Link href={`/profile/${user._id}`} key={user._id} className="block p-4 border rounded-xl hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-lg">{user.name}</h3>
                                        <p className="text-gray-500 text-sm">{matchedSkills.join(', ') || 'Skill Match'}</p>
                                    </div>
                                    {user.city && <div className="text-xs bg-gray-100 px-2 py-1 rounded">{user.city}</div>}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}

            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-around text-xs font-bold uppercase tracking-widest">
                <Link href="/swipe" className="text-gray-400 hover:text-black">Find</Link>
                <Link href="/matches" className="text-black">Matches</Link>
                <Link href="/me" className="text-gray-400 hover:text-black">Profile</Link>
            </nav>
        </div>
    );
}
