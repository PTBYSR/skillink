
'use server';

import { z } from 'zod';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const onboardingSchema = z.object({
    learnSkills: z.array(z.string()).min(1, "Pick at least 1 skill to learn"),
    teachSkills: z.array(z.string()).min(1, "Pick at least 1 skill to teach"),
    preferOnline: z.boolean(),
    preferInPerson: z.boolean(),
    city: z.string().optional(),
});

export async function completeOnboarding(prevState: any, formData: FormData) {
    try {
        const session = await getSession();
        if (!session) return { error: 'Unauthorized' };

        const learnSkills = formData.getAll('learnSkills') as string[];
        const teachSkills = formData.getAll('teachSkills') as string[];
        const preferOnline = formData.get('preferOnline') === 'on';
        const preferInPerson = formData.get('preferInPerson') === 'on';
        const city = formData.get('city') as string;

        const validated = onboardingSchema.parse({
            learnSkills,
            teachSkills,
            preferOnline,
            preferInPerson,
            city
        });

        if (validated.preferInPerson && !validated.city) {
            return { error: 'City is required for in-person' };
        }

        await connectDB();
        await User.findByIdAndUpdate(session.userId, {
            learnSkills: validated.learnSkills,
            teachSkills: validated.teachSkills,
            preferOnline: validated.preferOnline,
            preferInPerson: validated.preferInPerson,
            city: validated.city
        });

    } catch (e: any) {
        if (e instanceof z.ZodError) {
            return { error: e.issues[0].message };
        }
        return { error: 'Failed to save profile' };
    }

    redirect('/swipe');
}
