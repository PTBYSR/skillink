
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISwipe extends Document {
    swiperId: mongoose.Types.ObjectId;
    targetId: mongoose.Types.ObjectId;
    action: 'like' | 'skip';
    createdAt: Date;
}

const SwipeSchema: Schema = new Schema({
    swiperId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, enum: ['like', 'skip'], required: true },
    createdAt: { type: Date, default: Date.now },
});

// Composite index to prevent duplicates and fast lookups
SwipeSchema.index({ swiperId: 1, targetId: 1 }, { unique: true });

const Swipe: Model<ISwipe> = mongoose.models.Swipe || mongoose.model<ISwipe>('Swipe', SwipeSchema);
export default Swipe;
