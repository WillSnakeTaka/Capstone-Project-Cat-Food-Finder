import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || "change-me",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  mongoUri: process.env.MONGODB_URI || "",
  mongoDbName: process.env.MONGODB_DB_NAME || "catcart",
};
