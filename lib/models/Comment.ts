import mongoose, { Schema, type Document } from 'mongoose';

export interface IComment extends Document {
  contentType: 'movie' | 'game';
  contentId: string;
  userId: string;
  username: string;
  text: string;
  parentId: string | null;
  reactions: Map<string, string[]>;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    contentType: { type: String, enum: ['movie', 'game'], required: true },
    contentId: { type: String, required: true },
    userId: { type: String, required: true },
    username: { type: String, required: true },
    text: { type: String, required: true, maxlength: 1000 },
    parentId: { type: String, default: null },
    reactions: { type: Map, of: [String], default: {} },
  },
  { timestamps: true }
);

CommentSchema.index({ contentType: 1, contentId: 1, createdAt: -1 });

export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
