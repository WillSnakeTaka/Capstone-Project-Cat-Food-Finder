import {
  createProduct as createProductInDb,
  deleteProduct as deleteProductInDb,
  listProducts as listProductsInDb,
  listProductsBySeller,
  updateProduct as updateProductInDb,
} from "../data/fakeDb.js";

export async function listProducts(req, res) {
  const { category = "all", q = "", sort = "newest", minPrice, maxPrice } = req.query;
  const products = await listProductsInDb({ category, q, sort, minPrice, maxPrice });
  return res.json(products);
}

export async function listMyProducts(req, res) {
  return res.json(await listProductsBySeller(req.user.id));
}

export async function createProduct(req, res) {
  const { title, brand, price } = req.body;
  if (!title || !brand || price === undefined) {
    return res.status(400).json({ message: "title, brand, and price are required" });
  }

  const product = await createProductInDb({ ...req.body, seller: req.user.id });
  return res.status(201).json(product);
}

export async function updateProduct(req, res) {
  const updated = await updateProductInDb({ id: req.params.id, seller: req.user.id, updates: req.body });
  if (!updated) return res.status(404).json({ message: "Not found" });
  return res.json(updated);
}

export async function deleteProduct(req, res) {
  const deleted = await deleteProductInDb({ id: req.params.id, seller: req.user.id });
  if (!deleted) return res.status(404).json({ message: "Not found" });
  return res.status(204).send();
}
