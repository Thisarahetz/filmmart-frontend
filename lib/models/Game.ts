import mongoose, { Schema, type Document } from 'mongoose';

export interface IGame extends Document {
  title: string;
  category?: string;
  description?: string;
  img?: string;
  video?: string;
  legalStatus?: string;
  platform: string[];
  countriesBanned: string[];
  views: number;
  rating?: number;
}

const GameSchema = new Schema<IGame>(
  {
    title: { type: String, required: true, unique: true },
    category: String,
    description: String,
    img: String,
    video: String,
    legalStatus: String,
    platform: { type: [String], default: [] },
    countriesBanned: { type: [String], default: [] },
    views: { type: Number, default: 0, index: true },
    rating: { type: Number, min: 0, max: 10 },
  },
  { timestamps: true }
);

export default mongoose.models.Game || mongoose.model<IGame>('Game', GameSchema);
