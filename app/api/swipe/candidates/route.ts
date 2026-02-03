
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Swipe from '@/models/Swipe';
import { Block } from '@/models/Safety';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();
        const session = await getSession();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const currentUser = await User.findById(session.userId);
        if (!currentUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        // Get IDs of users already swiped
        const swipedDocs = await Swipe.find({ swiperId: currentUser._id }).select('targetId');
        const swipedIds = swipedDocs.map(s => s.targetId);

        // Get IDs of users blocked or blocking
        const blockedDocs = await Block.find({
            $or: [{ blockerId: currentUser._id }, { blockedId: currentUser._id }]
        });
        // For blocking, we exclude anyone involved in a block relationship
        const blockedIds = blockedDocs.map(b =>
            b.blockerId.toString() === currentUser._id.toString() ? b.blockedId : b.blockerId
        );

        const excludeIds = [currentUser._id, ...swipedIds, ...blockedIds];

        // Build Query
        const query: any = {
            _id: { $nin: excludeIds },
            // They must teach something I learn
            teachSkills: { $in: currentUser.learnSkills }
        };

        // Location filter
        if (currentUser.preferInPerson && currentUser.city) {
            // If I prefer in-person, show ppl in my city who also prefer in-person OR don't care?
            // User rule: "If I want in-person only: filter by same city"
            // Interpretation: If I ONLY want in-person, I should only see people in my city.
            // But the flag is `preferInPerson`. The user might checks BOTH.
            // Let's assume if preferInPerson is TRUE, we prioritize or enforce city.
            // The prompt says: "If I want in-person only: filter by same city".
            // If `preferInPerson` is true AND `preferOnline` is false.

            if (!currentUser.preferOnline) {
                query.city = currentUser.city;
            }
        }

        // Optimization: limit 10
        const candidates = await User.find(query)
            .select('name city teachSkills learnSkills preferOnline preferInPerson imageUrl')
            .limit(10);


        return NextResponse.json({ candidates });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
