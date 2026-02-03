
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { SKILLS_LIST } from '@/lib/constants';

export async function GET() {
    try {
        if (process.env.NODE_ENV === 'production') {
            return NextResponse.json({ error: 'Not allowed in production' });
        }

        await connectDB();
        await User.deleteMany({}); // clear users (optional, but good for reset)

        const passwordHash = await bcrypt.hash('password123', 10);
        const cities = ['New York', 'London', 'Berlin', 'Tokyo', 'San Francisco'];

        const demoUsers = [];

        // Create 10 random users
        for (let i = 0; i < 10; i++) {
            const teachCount = Math.floor(Math.random() * 3) + 1; // 1-3 skills
            const teach = [];
            for (let j = 0; j < teachCount; j++) {
                teach.push(SKILLS_LIST[Math.floor(Math.random() * SKILLS_LIST.length)]);
            }

            const learnCount = Math.floor(Math.random() * 3) + 1;
            const learn = [];
            for (let j = 0; j < learnCount; j++) {
                learn.push(SKILLS_LIST[Math.floor(Math.random() * SKILLS_LIST.length)]);
            }

            const preferOnline = Math.random() > 0.3;
            const preferInPerson = Math.random() > 0.5;
            const city = preferInPerson ? cities[Math.floor(Math.random() * cities.length)] : undefined;

            demoUsers.push({
                name: `Demo User ${i + 1}`,
                email: `demo${i + 1}@skillink.com`,
                passwordHash,
                teachSkills: [...new Set(teach)],
                learnSkills: [...new Set(learn)],
                preferOnline,
                preferInPerson,
                city
            });
        }

        await User.insertMany(demoUsers);

        return NextResponse.json({ success: true, count: demoUsers.length });


    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed' });
    }
}
