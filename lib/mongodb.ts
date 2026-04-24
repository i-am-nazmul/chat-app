import "server-only";
import mongoose from "mongoose";

const mongoUri = process.env.MONGO_URI ?? process.env.MONGODB_URI;

const globalForMongoose = globalThis as typeof globalThis & {
  mongooseConnectionPromise?: Promise<typeof mongoose>;
};

export async function connectToDatabase() {
  if (!mongoUri) {
    throw new Error("Missing MONGO_URI environment variable.");
  }

  if (!globalForMongoose.mongooseConnectionPromise) {
    globalForMongoose.mongooseConnectionPromise = mongoose.connect(mongoUri);
  }

  return globalForMongoose.mongooseConnectionPromise;
}