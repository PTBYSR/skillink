
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function GET() {
    try {
        if (process.env.NODE_ENV === 'production') {
            return NextResponse.json({ error: 'Not allowed in production' });
        }

        await connectDB();
        await User.deleteMany({}); // clear users (optional, but good for reset)

        const passwordHash = await bcrypt.hash('password123', 10);

        const demoProfiles = [
            {
                name: 'Ava Chen',
                email: 'ava@skillink.com',
                teachSkills: ['Web Development', 'Graphic Design'],
                learnSkills: ['Public Speaking', 'Financial Planning'],
                preferOnline: true,
                preferInPerson: false,
                city: 'San Francisco',
            },
            {
                name: 'Mateo Lopez',
                email: 'mateo@skillink.com',
                teachSkills: ['Foreign Languages', 'Public Speaking'],
                learnSkills: ['Digital Marketing', 'Web Development'],
                preferOnline: false,
                preferInPerson: true,
                city: 'Berlin',
            },
            {
                name: 'Priya Patel',
                email: 'priya@skillink.com',
                teachSkills: ['Data Analysis'],
                learnSkills: ['Yoga & Wellness', 'Culinary Arts'],
                preferOnline: true,
                preferInPerson: true,
                city: 'London',
            },
            {
                name: "Liam O'Connor",
                email: 'liam@skillink.com',
                teachSkills: ['Digital Marketing', 'Public Speaking'],
                learnSkills: ['Data Analysis', 'Financial Planning'],
                preferOnline: false,
                preferInPerson: true,
                city: 'New York',
            },
            {
                name: 'Sofia Rossi',
                email: 'sofia@skillink.com',
                teachSkills: ['Culinary Arts', 'Foreign Languages'],
                learnSkills: ['Graphic Design'],
                preferOnline: true,
                preferInPerson: false,
                city: 'Rome',
            },
            {
                name: 'Hiro Tanaka',
                email: 'hiro@skillink.com',
                teachSkills: ['Photography'],
                learnSkills: ['Web Development', 'Digital Marketing'],
                preferOnline: true,
                preferInPerson: true,
                city: 'Tokyo',
            },
            {
                name: 'Amara Ndlovu',
                email: 'amara@skillink.com',
                teachSkills: ['Yoga & Wellness'],
                learnSkills: ['Financial Planning', 'Public Speaking'],
                preferOnline: false,
                preferInPerson: true,
                city: 'Cape Town',
            },
            {
                name: 'Ethan Brooks',
                email: 'ethan@skillink.com',
                teachSkills: ['Financial Planning', 'Data Analysis'],
                learnSkills: ['Graphic Design', 'Digital Marketing'],
                preferOnline: true,
                preferInPerson: false,
                city: 'Chicago',
            },
            {
                name: 'Lucia Garcia',
                email: 'lucia@skillink.com',
                teachSkills: ['Graphic Design', 'Photography'],
                learnSkills: ['Culinary Arts', 'Foreign Languages'],
                preferOnline: true,
                preferInPerson: true,
                city: 'Madrid',
            },
            {
                name: 'Noah Kim',
                email: 'noah@skillink.com',
                teachSkills: ['Web Development'],
                learnSkills: ['Data Analysis', 'Public Speaking'],
                preferOnline: false,
                preferInPerson: true,
                city: 'Seoul',
            },
        ];

        const demoUsers = demoProfiles.map((profile) => ({
            ...profile,
            passwordHash,
        }));

        await User.insertMany(demoUsers);

        return NextResponse.json({ success: true, count: demoUsers.length });


    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed' });
    }
}
