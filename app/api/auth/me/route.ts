
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getSession } from '@/lib/auth';

export async function GET() {
    try {
        await connectDB();
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ user: null }, { status: 401 });
        }

        const user = await User.findById(session.userId).select('-passwordHash');
        if (!user) {
            return NextResponse.json({ user: null }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
