import mongoose, { Schema, type Document } from 'mongoose';

export interface IList extends Document {
  title: string;
  type?: string;
  genre?: string;
  content: string[];
}

const ListSchema = new Schema<IList>(
  {
    title: { type: String, required: true, unique: true },
    type: String,
    genre: String,
    content: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.List || mongoose.model<IList>('List', ListSchema);
