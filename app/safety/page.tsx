
import connectDB from '@/lib/db';
import { Block } from '@/models/Safety';
import { getSession } from '@/lib/auth';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function SafetyPage() {
    const session = await getSession();
    if (!session) return <div>Login required</div>;

    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
        console.error('Missing MongoDB connection string.');
        return <div>Database not configured</div>;
    }

    await connectDB();

    const blocks = await Block.find({ blockerId: session.userId }).populate('blockedId');

    return (
        <div className="min-h-screen bg-white p-6">
            <h1 className="text-2xl font-bold mb-6">Blocked Users</h1>

            {blocks.length === 0 ? (
                <p className="text-gray-500">No blocked users.</p>
            ) : (
                <div className="space-y-4">
                    {blocks.map((block: any) => (
                        <div key={block._id} className="flex justify-between items-center p-4 border rounded-xl">
                            <span className="font-bold">{block.blockedId.name}</span>
                            <span className="text-xs text-gray-400">Blocked</span>
                        </div>
                    ))}
                </div>
            )}

            <Link href="/me" className="block mt-8 text-black underline">Back to Profile</Link>
        </div>
    );
}
