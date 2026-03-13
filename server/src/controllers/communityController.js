import { env } from "../config/env.js";
import {
  createMusicianPost as createFakeMusicianPost,
  createRescueReport as createFakeRescueReport,
  listMusicianPosts,
  listRescueReports,
} from "../data/fakeDb.js";
import { MusicianPost } from "../models/MusicianPost.js";
import { RescueReport } from "../models/RescueReport.js";
import { toMusicianPost, toRescueReport } from "../utils/serializers.js";

export async function getRescueReports(_req, res) {
  if (env.useFakeDb) {
    return res.json(await listRescueReports());
  }

  const reports = await RescueReport.find().sort({ createdAt: -1 }).lean();
  return res.json(reports.map(toRescueReport));
}

export async function postRescueReport(req, res) {
  const { city, contactName, contactInfo, description } = req.body;
  if (!city || !contactName || !contactInfo || !description) {
    return res.status(400).json({ message: "city, contactName, contactInfo, and description are required" });
  }

  if (env.useFakeDb) {
    const report = await createFakeRescueReport(req.body);
    return res.status(201).json(report);
  }

  const report = await RescueReport.create(req.body);
  return res.status(201).json(toRescueReport(report));
}

export async function getMusicianPosts(_req, res) {
  if (env.useFakeDb) {
    return res.json(await listMusicianPosts());
  }

  const posts = await MusicianPost.find().sort({ createdAt: -1 }).lean();
  return res.json(posts.map(toMusicianPost));
}

export async function postMusicianPost(req, res) {
  const { stageName, style, caption, favoriteTrack } = req.body;
  if (!stageName || !style || !caption || !favoriteTrack) {
    return res.status(400).json({ message: "stageName, style, caption, and favoriteTrack are required" });
  }

  if (env.useFakeDb) {
    const post = await createFakeMusicianPost(req.body);
    return res.status(201).json(post);
  }

  const post = await MusicianPost.create(req.body);
  return res.status(201).json(toMusicianPost(post));
}
