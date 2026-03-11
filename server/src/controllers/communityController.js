import {
  createMusicianPost,
  createRescueReport,
  listMusicianPosts,
  listRescueReports,
} from "../data/fakeDb.js";

export async function getRescueReports(_req, res) {
  return res.json(await listRescueReports());
}

export async function postRescueReport(req, res) {
  const { city, contactName, contactInfo, description } = req.body;
  if (!city || !contactName || !contactInfo || !description) {
    return res.status(400).json({ message: "city, contactName, contactInfo, and description are required" });
  }

  return res.status(201).json(await createRescueReport(req.body));
}

export async function getMusicianPosts(_req, res) {
  return res.json(await listMusicianPosts());
}

export async function postMusicianPost(req, res) {
  const { stageName, style, caption, favoriteTrack } = req.body;
  if (!stageName || !style || !caption || !favoriteTrack) {
    return res.status(400).json({ message: "stageName, style, caption, and favoriteTrack are required" });
  }

  return res.status(201).json(await createMusicianPost(req.body));
}
