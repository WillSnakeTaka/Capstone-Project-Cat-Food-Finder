import { Router } from "express";
import {
  getMusicianPosts,
  getRescueReports,
  postMusicianPost,
  postRescueReport,
} from "../controllers/communityController.js";

const router = Router();

router.get("/rescue-reports", getRescueReports);
router.post("/rescue-reports", postRescueReport);
router.get("/musician-posts", getMusicianPosts);
router.post("/musician-posts", postMusicianPost);

export default router;
