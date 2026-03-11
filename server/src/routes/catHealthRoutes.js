import { Router } from "express";
import { getCatFacts, getCatImage } from "../controllers/catHealthController.js";

const router = Router();

router.get("/facts", getCatFacts);
router.get("/image", getCatImage);

export default router;
