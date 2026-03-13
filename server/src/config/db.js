import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDb() {
  if (!env.mongoUri) {
    throw new Error("MONGODB_URI is required");
  }

  await mongoose.connect(env.mongoUri, {
    dbName: env.mongoDbName,
    serverSelectionTimeoutMS: 5000,
  });
}
