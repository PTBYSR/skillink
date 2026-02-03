
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash: string;
    city?: string;
    preferOnline: boolean;
    preferInPerson: boolean;
    learnSkills: string[];
    teachSkills: string[];
    imageUrl?: string;
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    city: { type: String },
    preferOnline: { type: Boolean, default: false },
    preferInPerson: { type: Boolean, default: false },
    learnSkills: { type: [String], default: [] },
    teachSkills: { type: [String], default: [] },
    imageUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
});


// Prevent overwrite on hot reload
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
