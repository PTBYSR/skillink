
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlock extends Document {
    blockerId: mongoose.Types.ObjectId;
    blockedId: mongoose.Types.ObjectId;
    createdAt: Date;
}

const BlockSchema: Schema = new Schema({
    blockerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    blockedId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
});

BlockSchema.index({ blockerId: 1, blockedId: 1 }, { unique: true });

export const Block: Model<IBlock> = mongoose.models.Block || mongoose.model<IBlock>('Block', BlockSchema);

export interface IReport extends Document {
    reporterId: mongoose.Types.ObjectId;
    reportedId: mongoose.Types.ObjectId;
    reason: string;
    details?: string;
    createdAt: Date;
}

const ReportSchema: Schema = new Schema({
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reportedId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    details: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export const Report: Model<IReport> = mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema);
