
'use server';

import connectDB from '@/lib/db';
import Swipe from '@/models/Swipe';
import { getSession } from '@/lib/auth';
import { z } from 'zod';

const swipeSchema = z.object({
    targetId: z.string(),
    action: z.enum(['like', 'skip']),
});

export async function saveSwipe(targetId: string, action: 'like' | 'skip') {
    try {
        const session = await getSession();
        if (!session) return { error: 'Unauthorized' };

        swipeSchema.parse({ targetId, action });

        await connectDB();

        // Check if already swiped
        const existing = await Swipe.findOne({ swiperId: session.userId, targetId });
        if (existing) return { success: true }; // Idempotent

        await Swipe.create({
            swiperId: session.userId,
            targetId,
            action
        });

        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: 'Failed' };
    }
}
