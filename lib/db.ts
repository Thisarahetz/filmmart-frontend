import mongoose from 'mongoose';

interface Cache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

/* Use a global to persist the connection across HMR in development */
declare global {
  var _mongooseCache: Cache | undefined;
}

const cached: Cache = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cached;

export async function connectDB(): Promise<typeof mongoose> {
  const MONGO_URL = process.env.MONGO_URL;
  if (!MONGO_URL) throw new Error('MONGO_URL environment variable is not set');

  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URL, { bufferCommands: false });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
