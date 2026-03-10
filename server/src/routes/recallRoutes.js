import { Router } from "express";
import { findRecalls } from "../controllers/recallController.js";

const router = Router();

router.get("/", findRecalls);

export default router;
