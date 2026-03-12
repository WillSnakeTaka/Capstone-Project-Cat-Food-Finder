import mongoose from "mongoose";

const musicianPostSchema = new mongoose.Schema(
  {
    stageName: { type: String, required: true, trim: true },
    style: { type: String, required: true, trim: true },
    caption: { type: String, required: true, trim: true },
    favoriteTrack: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const MusicianPost = mongoose.model("MusicianPost", musicianPostSchema);
