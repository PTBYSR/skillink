
'use server';

import connectDB from '@/lib/db';
import Message from '@/models/Message';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function sendMessage(receiverId: string, content: string) {
    const session = await getSession();
    if (!session) return { error: 'Not authenticated' };

    if (!content || content.trim().length === 0) {
        return { error: 'Message cannot be empty' };
    }

    try {
        await connectDB();
        const newMessage = await Message.create({
            senderId: session.userId,
            receiverId,
            content: content.trim()
        });

        // revalidatePath(`/profile/${receiverId}`);
        return { success: true, message: JSON.parse(JSON.stringify(newMessage)) };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to send message' };
    }
}

export async function getMessages(otherUserId: string) {
    const session = await getSession();
    if (!session) return { error: 'Not authenticated' };

    try {
        await connectDB();
        const messages = await Message.find({
            $or: [
                { senderId: session.userId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: session.userId }
            ]
        }).sort({ createdAt: 1 });

        return { success: true, messages: JSON.parse(JSON.stringify(messages)) };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to fetch messages' };
    }
}
