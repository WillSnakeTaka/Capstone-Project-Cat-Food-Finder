import { MusicianPost, RescueReport } from "../types";
import { apiFetch } from "./http";

export function listRescueReports() {
  return apiFetch<RescueReport[]>("/community/rescue-reports");
}

export function createRescueReport(payload: Omit<RescueReport, "id" | "createdAt">) {
  return apiFetch<RescueReport>("/community/rescue-reports", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function listMusicianPosts() {
  return apiFetch<MusicianPost[]>("/community/musician-posts");
}

export function createMusicianPost(payload: Omit<MusicianPost, "id" | "createdAt">) {
  return apiFetch<MusicianPost>("/community/musician-posts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
