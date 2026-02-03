
'use server';

import connectDB from '@/lib/db';
import User from '@/models/User';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function updateProfile(formData: FormData) {
    try {
        const session = await getSession();
        if (!session) return { error: 'Unauthorized' };

        const learnSkills = formData.getAll('learnSkills') as string[];
        const teachSkills = formData.getAll('teachSkills') as string[];
        const city = formData.get('city') as string;
        const preferOnline = formData.get('preferOnline') === 'on';
        const preferInPerson = formData.get('preferInPerson') === 'on';

        // Final safety check on total skills
        if (learnSkills.length + teachSkills.length > 4) {
            return { error: 'Maximum 4 skills total allowed' };
        }

        await connectDB();
        await User.findByIdAndUpdate(session.userId, {
            learnSkills,
            teachSkills,
            city,
            preferOnline,
            preferInPerson
        });

        revalidatePath('/profile');
        revalidatePath('/swipe');

        return { success: true };
    } catch (e: any) {
        console.error(e);
        return { error: 'Failed to update profile' };
    }
}
