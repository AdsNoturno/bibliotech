import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBook extends Document {
    title: string;
    author: string;
    description?: string;
    fullText?: string | null;
    isPhysical: boolean;
    copyCount: number;
    shelfLocation?: string | null;
    isAvailable: boolean;
    coverImage?: string | null;
    user: mongoose.Types.ObjectId;
}

const BookSchema: Schema = new Schema({
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    description: { type: String },

    // digital
    fullText: { type: String, default: null },

    // físico
    isPhysical: { type: Boolean, required: true, default: false },
    copyCount: { type: Number, required: true, default: 0, min: 0 },
    shelfLocation: { type: String, default: null },

    // disponibilidade
    isAvailable: { type: Boolean, required: true, default: true },

    // capa
    coverImage: { type: String, default: null },

    // dono
user: { type: Schema.Types.ObjectId, ref: "User", required: false },
}, { timestamps: true });

export const Book: Model<IBook> = mongoose.model<IBook>("Book", BookSchema);
