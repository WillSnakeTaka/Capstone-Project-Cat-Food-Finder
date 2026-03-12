import { MusicianPost } from "../models/MusicianPost.js";
import { RescueReport } from "../models/RescueReport.js";
import { toMusicianPost, toRescueReport } from "../utils/serializers.js";

export async function getRescueReports(_req, res) {
  const reports = await RescueReport.find().sort({ createdAt: -1 }).lean();
  return res.json(reports.map(toRescueReport));
}

export async function postRescueReport(req, res) {
  const { city, contactName, contactInfo, description } = req.body;
  if (!city || !contactName || !contactInfo || !description) {
    return res.status(400).json({ message: "city, contactName, contactInfo, and description are required" });
  }

  const report = await RescueReport.create(req.body);
  return res.status(201).json(toRescueReport(report));
}

export async function getMusicianPosts(_req, res) {
  const posts = await MusicianPost.find().sort({ createdAt: -1 }).lean();
  return res.json(posts.map(toMusicianPost));
}

export async function postMusicianPost(req, res) {
  const { stageName, style, caption, favoriteTrack } = req.body;
  if (!stageName || !style || !caption || !favoriteTrack) {
    return res.status(400).json({ message: "stageName, style, caption, and favoriteTrack are required" });
  }

  const post = await MusicianPost.create(req.body);
  return res.status(201).json(toMusicianPost(post));
}
