
import { getSession } from '@/lib/auth';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { redirect } from 'next/navigation';
import ProfileEditClient from './ProfileEditClient';
import { SKILLS_LIST } from '@/lib/constants';

export default async function MyProfilePage() {
    const session = await getSession();
    if (!session) {
        redirect('/auth');
    }

    await connectDB();
    const user = await User.findById(session.userId);

    if (!user) {
        redirect('/auth');
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-2xl mx-auto p-6 md:p-12">
                <header className="mb-12">
                    <h1 className="text-4xl font-black italic mb-2 tracking-tight">PROFILE</h1>
                    <p className="text-gray-400">Manage your skills and preferences.</p>
                </header>

                <ProfileEditClient
                    initialUser={JSON.parse(JSON.stringify(user))}
                    skillsList={SKILLS_LIST}
                />
            </div>
        </div>
    );
}
