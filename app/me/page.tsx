
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getSession } from '@/lib/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function MePage() {
    await connectDB();
    const session = await getSession();
    if (!session) return <div>Login required</div>;

    const user = await User.findById(session.userId);

    if (!user) {
        redirect('/auth');
    }

    return (
        <div className="min-h-screen bg-white p-6">
            <h1 className="text-3xl font-bold mb-6">My Profile</h1>

            <div className="mb-6">
                <p className="text-gray-500 text-xs uppercase font-bold">Name</p>
                <p className="text-xl">{user.name}</p>
            </div>

            <div className="mb-6">
                <p className="text-gray-500 text-xs uppercase font-bold">Email</p>
                <p className="text-xl">{user.email}</p>
            </div>

            <div className="mb-6">
                <p className="text-gray-500 text-xs uppercase font-bold">Learning</p>
                <p>{user.learnSkills.join(', ')}</p>
            </div>

            <div className="mb-8">
                <p className="text-gray-500 text-xs uppercase font-bold">Teaching</p>
                <p>{user.teachSkills.join(', ')}</p>
            </div>

            <Link href="/onboarding" className="block w-full text-center py-3 border border-black rounded-xl font-bold mb-4">
                Edit Skills
            </Link>

            <form action={async () => {
                'use server';
                // Logout
                const { cookies } = require('next/headers');
                const cookieStore = await cookies();
                cookieStore.delete('token');
                const { redirect } = require('next/navigation');
                redirect('/auth');
            }}>
                <button className="w-full py-3 bg-black text-white rounded-xl font-bold">
                    Log out
                </button>
            </form>

            <div className="mt-8 pt-8 border-t">
                <Link href="/safety" className="text-gray-400 text-sm">Blocked Users</Link>
            </div>

            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-around text-xs font-bold uppercase tracking-widest">
                <Link href="/swipe" className="text-gray-400 hover:text-black">Find</Link>
                <Link href="/matches" className="text-gray-400 hover:text-black">Matches</Link>
                <Link href="/me" className="text-black">Profile</Link>
            </nav>
        </div>
    );
}
