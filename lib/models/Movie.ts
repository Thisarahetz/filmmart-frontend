import mongoose, { Schema, type Document } from 'mongoose';

export interface IMovie extends Document {
  title: string;
  desc?: string;
  img?: string;
  imgTitle?: string;
  imgSm?: string;
  trailer?: string;
  video?: string;
  year?: string;
  limit?: number;
  genre?: string;
  rating?: number;
  quality?: string;
  isSeries: boolean;
  tags: string[];
  country?: string;
  duration?: string;
  story?: string;
  style?: string;
  plot?: string;
  sourceUrl?: string;
}

const MovieSchema = new Schema<IMovie>(
  {
    title: { type: String, required: true, unique: true },
    desc: String,
    img: String,
    imgTitle: String,
    imgSm: String,
    trailer: String,
    video: String,
    year: String,
    limit: Number,
    genre: String,
    rating: { type: Number, min: 0, max: 10 },
    quality: String,
    isSeries: { type: Boolean, default: false },
    tags: { type: [String], default: [], index: true },
    views: { type: Number, default: 0, index: true },
    country: String,
    duration: String,
    story: String,
    style: String,
    plot: String,
    sourceUrl: String,
  },
  { timestamps: true }
);

export default mongoose.models.Movies || mongoose.model<IMovie>('Movies', MovieSchema);
