import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  listMyProducts,
  listProducts,
  updateProduct,
} from "../controllers/productController.js";
import { requireAuth, requireSeller } from "../middleware/auth.js";

const router = Router();

router.get("/", listProducts);
router.get("/mine", requireAuth, requireSeller, listMyProducts);
router.get("/:id", getProductById);
router.post("/", requireAuth, requireSeller, createProduct);
router.put("/:id", requireAuth, requireSeller, updateProduct);
router.delete("/:id", requireAuth, requireSeller, deleteProduct);

export default router;
