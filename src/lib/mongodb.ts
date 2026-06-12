import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://mongo:27017/scrumboard';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalWithMongoose = global as typeof global & { mongooseCache?: MongooseCache };

let cached = globalWithMongoose.mongooseCache;

if (!cached) {
  cached = globalWithMongoose.mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached!.conn) return cached!.conn;

  if (!cached!.promise) {
    cached!.promise = mongoose.connect(MONGODB_URI);
  }

  cached!.conn = await cached!.promise;
  return cached!.conn;
}
